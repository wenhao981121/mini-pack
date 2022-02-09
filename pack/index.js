const fs = require('fs')
const paser = require('@babel/parser')
const traverse = require('@babel/traverse').default;
const path = require('path');
const babel = require('@babel/core');

// const files = fs.readdirSync('./src')
// console.log(11111111111111,files);

// 获取某个文件的路径，依赖，代码
const getModuleInfo = file => {
    const content = fs.readFileSync(file, 'utf-8')
    // console.log(content);
    const ast = paser.parse(content, {
        sourceType: 'module'
    })
    // 这里将此文件里面所有import依赖收集起来
    const deps = {}
    traverse(ast, {
        ImportDeclaration({ node }) {
            //   console.log(11111,node);

            deps[node.source.value] = './' + path.join(path.dirname(file), node.source.value)
        }
    })
    // console.log(deps);
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })
    //console.log(code);
    return {
        file,
        code,
        deps
    }
}

// 递归获取某个文件所有依赖关系，并将所有文件放入数组中
const parseModules = file => {
    const temp = []
    const ob = {}
    const parseMod = file => {
        // 如果有相同的,就不在处理
        if (temp.some(n => n.file == file)) {
            return
        }
        const entry = getModuleInfo(file)
        temp.push(entry)
        Object.keys(entry.deps).forEach(n => {
            parseMod(entry.deps[n])
        })
    }
    parseMod(file)
    // 将数组转换成后续好处理的对象结构
    temp.forEach(n => {
        ob[n.file] = {
            code: n.code,
            deps: n.deps
        }
    })
    return ob
}

// 打包函数
const bundle = file => {
    const depsGraph = JSON.stringify(parseModules(file), null, 4)
    fs.writeFile('./file.json', depsGraph, err => { })
    return `(function (graph) {

        function require(file) {
            function absRequire(relpath) {
                return require(graph[file].deps[relpath])
            }
            var exports = {};
            (function (require, exports, code) {
                eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`
}
const content = bundle('./src/index.js')
fs.mkdirSync('./dist', { recursive: true })
fs.writeFileSync('./dist/bundle.js', content)

// console.log(res);
// fs.writeFile(path.resolve(__dirname, './file.js'), JSON.stringify(res, null, 4), {}, err => { })
// console.log(ast.program.body[0]);


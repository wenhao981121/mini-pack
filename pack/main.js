const fs = require('fs')
const paser = require('@babel/parser')
const traverse = require('@babel/traverse').default;
const path = require('path');
const babel = require('@babel/core');
class Pack {
    constructor(config) {
        this.config = config
        this.run()
    }
    initLoader(file) {
        let content = fs.readFileSync(file, 'utf-8')
        const rules = this.config?.module?.rules
        rules?.forEach(n => {
            const { test, use } = n
            if (test.test(file)) {
                use.forEach(n => {
                    const loader = require(n)
                    content = loader(content)
                })
            }
        })
        return content
    }
    // 获取某个文件的路径，依赖，代码
    getModuleInfo = file => {

        const content = this.initLoader(file)
        // console.log(content);
        const ast = paser.parse(content, {
            sourceType: 'module'
        })
        // 这里将此文件里面所有import依赖收集起来
        const deps = {}
        traverse(ast, {
            ImportDeclaration({ node }) {

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
    parseModules = file => {
        const temp = []
        const ob = {}
        const parseMod = file => {
            // 如果有相同的,就不在处理
            if (temp.some(n => n.file == file)) {
                return
            }
            const entry = this.getModuleInfo(file)
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
    bundle = file => {
        const depsGraph = JSON.stringify(this.parseModules(file), null, 4)
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
    run() {
        const content = this.bundle(this.config.entry)
        fs.mkdirSync(this.config.output.path, { recursive: true })
        fs.writeFileSync(path.join(this.config.output.path, this.config.output.filename), content)
    }
}
module.exports = Pack
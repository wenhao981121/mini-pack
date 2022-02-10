const path = require('path');
const Pack = require('./pack')
// const files = fs.readdirSync('./src')
// console.log(11111111111111,files);
let configPath = path.resolve(process.cwd(), './pack.config.js')
const idx = process.argv.indexOf('--config')

if (idx > -1 && process.argv[idx]) {
    configPath = path.resolve(process.cwd(), process.argv[idx + 1])
}

const config = require(configPath)

new Pack(config)

// console.log(res);
// fs.writeFile(path.resolve(__dirname, './file.js'), JSON.stringify(res, null, 4), {}, err => { })
// console.log(ast.program.body[0]);


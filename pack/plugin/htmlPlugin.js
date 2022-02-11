const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

class HtmlPlugin {
    constructor(config) {
        this.config = config

    }
    apply(pack) {
        pack.hooks.emit.tap('emit', () => {

            const template = fs.readFileSync(this.config.template, 'utf-8')
            const $ = cheerio.load(template)
            const script = $(`<script src="./${pack.config.output.filename}"></script>`)
            $('body').append(script)
            const htmlFile = $.html()

            const output = path.resolve(pack.config.output.path, './index.html')

            fs.writeFileSync(output, htmlFile, 'utf-8')

        })

    }
}
module.exports = HtmlPlugin
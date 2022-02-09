const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), './dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, 'loader/remove-console-loader.js'),
                    path.resolve(__dirname, 'loader/help-loader.js')
                ]
            }
        ]
    }
}

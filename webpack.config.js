const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('fs');

const plugins = () => {
    const allPlugins = [
        new MiniCssExtractPlugin({
            filename: 'styles/style.css'
        })
    ]
    //Adding plugin for each html page
    const pugFiles = fs.readdirSync('./src/pages/views')
    pugFiles.forEach(pugFile => {
        let pugFileName = pugFile.substring(0, pugFile.length - 4)
        allPlugins.push(
            new HtmlWebpackPlugin({
                template: `./src/pages/views/${pugFileName}.pug`,
                filename: `${pugFileName}.html`
            })
        )
    })
    return allPlugins
}

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node-modules/
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: plugins()
}
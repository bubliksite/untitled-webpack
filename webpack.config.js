const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinPlugin = require('imagemin-webpack')
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const filename = (folder, name, ext) => isDev ? `${folder}/${name}.${ext}` : `${folder}/${name}.[hash].${ext}`

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const plugins = () => {
    const allPlugins = [
        new MiniCssExtractPlugin({
            filename: filename('styles', 'style', 'css')
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/favicon/favicon.ico', to: '' }
            ],
        }),
        new ImageMinPlugin({
            imageminOptions: {
                plugins: [
                    ["jpegtran", { progressive: true }],
                    ["optipng", { optimizationLevel: 5 }]
                ]
            }
        })
    ]
    //Adding plugin for each html page
    const pugFiles = fs.readdirSync('./src/pages/views')
    pugFiles.forEach(pugFile => {
        let pugFileName = pugFile.substring(0, pugFile.length - 4)
        allPlugins.push(
            new HtmlWebpackPlugin({
                template: `./src/pages/views/${pugFileName}.pug`,
                filename: `${pugFileName}.html`,
                minify: {
                    collapseWhitespace: isProd
                }
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
    optimization: optimization(),
    devServer: {
        port: 2200,
        hot: isDev
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node-modules/
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    }
                ]
            }
        ]
    },
    devtool: isDev ? 'source-map' : '',
    plugins: plugins()
}
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const root = path.resolve(__dirname);
const dist = path.join(root, "dist");

module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    devtool: "source-map",
    entry: {
        app: path.join(root, "src", "app.ts")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: "ts-loader" },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                use: [{ loader: 'file?name=[name].[ext]' }],
            },
        ],
    },
    output: {
        path: dist,
        filename: "[name].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(root, "src", "index.ejs"),
            filename: path.join(dist, "index.html")
        }),
        new CopyWebpackPlugin([
            { from: "content", to: "files" }
        ]),
        new ExtractCssChunks(
            {
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].css",
                chunkFilename: "[id].css"
            }
        )
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                // sourceMap: true // set to true if you want JS source maps
            })
        ],
        // splitChunks: {chunks: 'all'}
    }
};

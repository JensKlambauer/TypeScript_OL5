const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
    devtool: "eval-source-map",
    entry: {
        app: path.join(root, "src", "app.ts"),
        // styles: path.join(root, "src", "app.css"),
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
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ],
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                use: [{ loader: "file-loader" }],
            },
        ],
    },
    output: {
        path: dist,
        filename: "[name].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(root, "src", "index.ejs"),
        }),
        new CopyWebpackPlugin([
            { from: "content",  to: "files" }
        ]),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        // compress: true,
        port: 9000
    }
};

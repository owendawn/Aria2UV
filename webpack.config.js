const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack=require('webpack');

module.exports = {
    // mode:'production',
    mode:'development',
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    entry: [
        path.resolve(__dirname, 'src/index.js'),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出的路径
        // filename: 'bundle.js',  // 打包后文件
        filename: 'js/[name]_[hash:8].js'  // 打包后文件
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                    }
                },
                exclude: /node_modules/
            },{
                test: /\.(scss)$/,
                loaders: ["style-loader", "css-loader", "sass-loader"],
                exclude: /node_modules/
            },
        ],

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.template.html'),
            inject: true,
            title:"Aria2UV"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        })
    ]
};
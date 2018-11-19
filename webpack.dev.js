const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack=require('webpack');

module.exports = {
    // mode:'production',
    mode:'development',
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    entry: {
        index:path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出的路径
        // filename: 'bundle.js',  // 打包后文件
        filename: 'app/[name]_[hash:8].js',  // 打包后文件
        chunkFilename: "app/js/[name].js",
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
                loaders: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"],
                exclude: /node_modules/
            },
        ],

    },
    externals: [{
        'react': 'React',
        'react-dom': 'ReactDOM',
        'redux': 'Redux',
        'react-redux': 'ReactRedux',
        'react-router-dom': 'ReactRouterDOM',
    }],
    optimization: {
        runtimeChunk: {
            name: "runtime"
        },
        //拆分公共包
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 5,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: false,
                vendors: false,
                components: {
                    test: /[\\/]components[\\/]/,
                    chunks: "initial",
                    name: "components",
                    minSize: 0,
                    priority: 11,
                    enforce: true,
                },
                containers: {
                    test: /[\\/]containers[\\/]/,
                    chunks: "initial",
                    name: "containers",
                    minSize: 0,
                    priority: 11,
                    enforce: true,
                },
                //第三方组件
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.template.html'),
            inject: true,
            title:"Aria2UV",
            chunks: ['index', 'runtime', 'vendor', 'containers',"components"]
        }),
        new webpack.ProvidePlugin({

        })
    ]
};
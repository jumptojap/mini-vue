const path = require('path');

module.exports = {
    entry: './src/index.js',           // 入口文件
    output: {
        filename: 'mini-vue.js',           // 输出文件名
        path: path.resolve(__dirname, 'dist'), // 输出路径必须是绝对路径
        publicPath: '/',
        clean: true,
        library: 'Vue',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    mode: 'development',               // 开发模式（也可改成 production）
    devtool: 'source-map',              // 方便调试源码
    devServer: {
        static: path.resolve(__dirname, 'public'),
        port: 8080,
        open: true, // 自动打开浏览器
    }
};
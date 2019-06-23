/*
 * @Description: 
 * @Version: 2.0
 * @Autor: kakachake
 * @Date: 2019-06-23 11:59:41
 * @LastEditors: kakachake
 * @LastEditTime: 2019-06-23 22:02:32
 */

var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin');
var Ex = require('extract-text-webpack-plugin');
//环境变量配置, dev / online
var WEBPACK_ENV     = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV)

//获取html-webpack参数方法
getHtmlConfig = function(name){
     return {
          filename: 'view/'+name+'.html',
          template: './src/view/'+name+'.html',
          inject: true,
          hash: true,
          chunks: ['common', name]
     }
}

//webpackconfig
var config = {
     // entry: __dirname + "/src/script/main.js", // 唯一入口文件
     //入口文件
     entry:{
          'common':['./src/page/common/index.js'],
          'index':['./src/page/index/index.js'],
          'login':['./src/page/login/index.js']
     },
     //输出配置
     output: {
          path: 'dist', // 打包后的文件存放的路径
          publicPath:'/dist/',
          filename: "js/[name].bundle.js", // 打包后输出文件的文件名    
     },
     module:{
          //css-loaders
          //loader:
          //webpack本身只能打包Javascript文件，对于其他资源例如 css，图片，或者其他的语法集比如jsx，是没有办法加载的。 这就需要对应的loader将资源转化，加载进来。
          loaders: [
               { test: /\.css$/, loader: Ex.extract('style-loader', 'css-loader','less-loader')  },
                          //处理html模板
               // {test:/\.html$/,loader:'html-loader'},
               //处理ejs模板
               {test:/\.ejs$/,loader:'ejs-loader'},
               {
                    test: /\.(png|jpg|gif|woff|svg|eot|ttf)$/,
                    loader  : 'url-loader?limit=100&name=resource/[name].[ext]'
               }
          ],
          rules:[
          ]
     },
     plugins:[
          //独立通用模块到js/base.js
          new webpack.optimize.CommonsChunkPlugin({
               name: 'common',
               // (公共 chunk(commnon chunk) 的名称)
             
               filename: 'js/base.js',
               // (公共chunk 的文件名)
             
               // minChunks: 3,
               // (模块必须被3个 入口chunk 共享)
             
               // chunks: ["pageA", "pageB"],
               // (只使用这些 入口chunk)
          }),
          //把css单独打包到文件里
          new Ex("css/[name].css"),
          //html模板处理
          new htmlWebpackPlugin(getHtmlConfig('index')),
          new htmlWebpackPlugin(getHtmlConfig('login'))
     ],
     externals:{
          'jquery':'window.jQuery'
     }
};

if('dev' === WEBPACK_ENV){
     config.entry.common.push('webpack-dev-server/client?http://localhost:8088/')
}

module.exports = config
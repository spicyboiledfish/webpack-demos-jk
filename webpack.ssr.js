'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); 

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugin = [];

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'));

    console.log('entryFiles', entryFiles);
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            // '/Users/wangrui/workspace/tech/webpack-demos-jk/src/index/index.js'
            const match = entryFile.match(/src\/(.*)\/index-server\.js/);
            const pageName = match && match[1];
            if (pageName) {
                entry[pageName] = entryFile;
                htmlWebpackPlugin.push(
                    new HtmlWebpackPlugin({
                        template: path.join(__dirname, `src/${pageName}/index.html`),
                        filename: `${pageName}.html`,
                        chunks: [pageName],
                        inject: true,
                        minify: {
                            html5: true,
                            collapseWhitespace: true,
                            preserveLineBreaks: false,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: false
                        }
                    }),
                );
            }
        })
    return {
        entry,
        htmlWebpackPlugin
    }
}

const { entry, htmlWebpackPlugin } = setMPA();

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-server.js',
        libraryTarget: 'umd'
    },
    mode:'none',
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                          ident: 'postcss',
                          sourceMap: true,
                          plugins: loader => [
                            require('autoprefixer')({ 
                                overrideBrowserslist: ['> 0.15% in CN'] 
                            }) // 添加前缀, 在中国浏览器占比大于0.15% 使用autoprefixer
                          ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    }                   
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                // use: 'file-loader',
                // options: {
                //     name: 'img/[name][hash:8].[ext]'
                // }
                use: [
                    {
                        loader: 'file-loader',
                        query: {
                            name: '[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `[name]_[contenthash:8].css`
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),  // scope hoisting
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //       {
        //         module: 'react',
        //         entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        //         global: 'React',
        //       },
        //       {
        //         module: 'react-dom',
        //         entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        //         global: 'ReactDOM',
        //       },
        //     ],
        // })
    ].concat(htmlWebpackPlugin),
    devtool: 'source-map', 
    // 'eval',（用eval包裹） 
    // 'source-map',（生成.map文件） 
    // 'inline-source-map' (内联打包体积变大)
    // 'cheap-source-map' (跟source-map差不多，只是少了列信息，包体积相对小一点)


    // optimization: {
    //     splitChunks: {
    //       cacheGroups: {
    //         vendors: {
    //           test: /(react|react-dom)/,
    //           name: 'vendors',
    //           chunks: 'all',
    //         }
    //       }
    //     }
    //   },


    // optimization: {
    //     splitChunks: {
    //       minSize: 0,
    //       cacheGroups: {
    //         commons: {
    //           name: 'commons',
    //           chunks: 'all',
    //           minChunks: 2
    //         }
    //       }
    //     }
    //   } 
}
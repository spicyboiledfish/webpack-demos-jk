'use strict';
const TerserPlugin = require('terser-webpack-plugin');
const Happypack = require('happypack');
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); 
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const smp = new SpeedMeasurePlugin();
const PATHS = {
    src: path.join(__dirname, 'src')
};
const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugin = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/index\.js/);
            const pageName = match && match[1];
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
        })
    return {
        entry,
        htmlWebpackPlugin
    }
}

const { entry, htmlWebpackPlugin } = setMPA();

module.exports = smp.wrap({
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode:'production',
    module: {
        rules: [
            {
                test: /.js$/,
                include: path.resolve('src'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 3
                        }
                    },
                    'cache-loader',
                    'babel-loader?cacheDirectory=true', 
                    'eslint-loader'
                ]
                // use: ['babel-loader', 'eslint-loader']
                // use: 'happypack/loader'
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

        // new webpack.optimize.ModuleConcatenationPlugin(),  // scope hoisting
        new FriendlyErrorsWebpackPlugin(),
        function() {
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                    console.log('build error');
                    process.exit(1);
                }
            })
        },
        // new BundleAnalyzerPlugin(),

        // new Happypack({
        //     // 3) re-add the loaders you replaced above in #1:
        //     loaders: [ 'babel-loader?cacheDirectory=true', 'eslint-loader' ]
        // }),
        new webpack.DllReferencePlugin({
            manifest: require('./build/library/library.json')
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        })

        // new HardSourceWebpackPlugin() 
        // 使用这个plugin本地报错：TypeError: Function.prototype.toString requires that 'this' be a Function
    ].concat(htmlWebpackPlugin),
    // devtool: 'source-map', 
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
    optimization: {
        minimizer: [
          new TerserPlugin({
            parallel: true,
            cache: true
          }),
        ],
    },
    resolve: {
        alias: {
            'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')          
        },
        extensions: ['.js'],
        mainFields: ['main']
    }
    // stats: 'errors-only'
});
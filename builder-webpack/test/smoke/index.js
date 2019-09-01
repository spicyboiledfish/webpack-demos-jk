const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha();

process.chdir(path.join(__dirname, 'template')); //进入到template目录

rimraf('./dist', () => {
    const prodConfig = require('../../lib/webpack.prod.js');
    webpack(prodConfig, (err, stats) => {
        if ( err ) {
            console.log(err);
            process.exit(2);
        }
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false
        }))

        console.log('Webpack build success, begin mocha test.');
        mocha.addFile(path.join(__dirname, 'css-js-test.js'));
        mocha.addFile(path.join(__dirname, 'html-test.js'));
        mocha.run();
    })
})

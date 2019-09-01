const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base');
    console.log(baseConfig);
    it('entry', () => {
        assert.equal(baseConfig.entry.index, '/Users/wangrui/workspace/tech/webpack-demos-jk/builder-webpack/test/smoke/template/src/index/index.js');
        assert.equal(baseConfig.entry.search, '/Users/wangrui/workspace/tech/webpack-demos-jk/builder-webpack/test/smoke/template/src/search/index.js');
    })
})
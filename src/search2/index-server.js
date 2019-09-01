// import React from 'react';
// import largeNumber from 'large-my';
// import logo from './img/logo.png';
// import { a } from './tree-shaking';
// import './search.less';

const React = require('react');
const largeNumber = require('large-my');
const logo = require('./img/logo.png');
const { a } = require('./tree-shaking');
require('./search.less');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Text: null,
    };
  }

  loadComponent() {
    console.log('import', import('./test.js'));
        import('./test.js').then((Text) => {
          console.log('Text', Text);
          this.setState({
            Text: Text.default,
          });
        });
  }

  render() {
    const { Text } = this.state;
    const funcA = a();
    const addResult = largeNumber('999', '1');
    return (
      <div className="search-text">
        { funcA }
        { addResult }
            搜素文字的内容xxx
        {
          Text ? <Text /> : null
        }
        <button
          styling="link"
          type="button"
          onClick={() => this.loadComponent()}
          onKeyPress={() => this.loadComponent()}
        >
          <img src={logo} alt="测试图片" />
        </button>
      </div>
    );
  }
}

module.exports = <Search />;

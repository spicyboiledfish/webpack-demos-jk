'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import logo from './img/logo.png';
import { a } from './tree-shaking';
import './search.less';

class Search extends React.Component {
    constructor(){
        super(...arguments);
        this.state = {
            Text: null
        }
    }
    loadComponent () {
        console.log('import',import('./test.js'));
        import('./test.js').then((Text) => {
            console.log('Text', Text);
            this.setState({
                Text: Text.default
            })
        })
    }

    render() {
        const { Text } = this.state;
        const funcA = a();
        return <div className="search-text">
                    { funcA }搜素文字的内容xxx
                    {
                        Text ? <Text /> : null
                    }
                    <img src={logo} onClick={ this.loadComponent.bind(this)} />
               </div>
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);
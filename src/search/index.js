'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import logo from './img/logo.png';
import { a } from './tree-shaking';
import './search.less';

class Search extends React.Component {
    render() {
        const funcA = a();
        return <div className="search-text">
                    { funcA } Search4
                    <img src={logo} />
               </div>
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);
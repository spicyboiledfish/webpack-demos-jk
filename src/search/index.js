'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import logo from './img/logo.png';
import './search.less';

class Search extends React.Component {
    render() {
        a = 1;
        return <div className="search-text">
                    Search4
                    <img src={logo} />
               </div>
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);
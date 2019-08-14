'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import logo from './img/logo.png';
import './css/search.less';

class Search extends React.Component {
    render() {
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
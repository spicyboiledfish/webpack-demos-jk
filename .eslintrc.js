module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "indent": ["error", 2],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        'jsx-a11y/no-noninteractive-element-interactions': [ 'error', { handlers: ['onClick','onMouseDown','onMouseUp','onKeyPress','onKeyDown','onKeyUp']}],
    }
}
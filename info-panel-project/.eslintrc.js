//config eslint
module.exports = {
    "extends": "eslint:recommended",
    "globals": {
        "jQuery": true,
        "$": true,
        "io": true
    },
    "env": {
        "browser": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "no-console": "warn"
    }
}

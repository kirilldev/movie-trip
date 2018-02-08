module.exports = {
    'env': {
        'commonjs': true,
        'es6': true
    },
    'extends': 'eslint:recommended',
    'rules': {
        'max-len': [
            'error',
            {
                'code': 100
            }
        ],
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'max-depth': [
            "error",
            4
        ]
    }
};
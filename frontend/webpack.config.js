/*eslint-env node*/
'use strict';

const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabelPluginNgAnnotate = require('babel-plugin-angularjs-annotate');

const DIST_DIR = path.resolve(__dirname, './dist');
const NODE_ENV = (process.env.NODE_ENV || 'dev').trim().toLowerCase();

const copyPluginPaths = [
    {
        from: 'node_modules/angular/angular.js',
        to: 'assets/angular.js'
    },
    {
        from: 'assets/img/marker/*.png',
        to: ''
    },
];

const commonEnvData = {
    targetDir: DIST_DIR,
    indexHTMLDir: 'index.html',
    copyPluginPaths: copyPluginPaths
};

const ENV_DATA = {
    'prod': Object.assign({}, commonEnvData),
    'dev': Object.assign({}, commonEnvData)
};

if (!ENV_DATA[NODE_ENV]) {
    throw new Error('Unknown NODE_ENV \'' + NODE_ENV + '\'');
} else {
    console.log('***** NODE_ENV=' + NODE_ENV + ' *****'); // eslint-disable-line no-console
}

const extractCSS = new ExtractTextPlugin({allChunks: true, filename: 'assets/bundle.css'});
const extractHTML = new ExtractTextPlugin({filename: ENV_DATA[NODE_ENV].indexHTMLDir});

const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CleanWebpackPlugin(['dist'], {
        root: __dirname,
        verbose: true,
    }),
    new webpack.NoErrorsPlugin(),
    extractCSS,
    extractHTML,
    new CopyWebpackPlugin(ENV_DATA[NODE_ENV].copyPluginPaths)
];

if (NODE_ENV !== 'dev') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true
    }));
}

const rules = [
    {
        test: /index\.html$/,
        loader: extractHTML.extract({
            use: [{
                loader: 'html-loader',
                options: {
                    interpolate: true,
                    minimize: false
                }
            }]
        })
    },
    {
        test: /\.js$/,
        exclude: /(node_modules|vendor)/,
        use: [
            {
                loader: 'babel-loader',
                query: {
                    presets: [require.resolve('babel-preset-es2015')],
                    plugins: [
                        [BabelPluginNgAnnotate, {'explicitOnly': true}]
                    ]
                }
            }
        ]

    },
    {
        test: /\.css|\.scss/,
        use: extractCSS.extract({
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [require('postcss-icss-values'), precss]
                    }
                }
            ]
        })
    },
    {
        test: /\.(png)$/,
        use: [{
            loader: 'url-loader',
            options: {
                name: '/assets/img/[name].[ext]',
                limit: '4096'
            }
        }]
    },
    {
        test: /\.tpl\.html$/,
        use: [{
            loader: 'raw-loader'
        }]
    }
];

module.exports = {
    entry: './entry.point.js',

    output: {
        path: ENV_DATA[NODE_ENV].targetDir,
        filename: 'assets/bundle.js'
    },

    resolve: {
        extensions: ['.js'],
        alias: {
            img: path.resolve(__dirname, 'assets/img'),
            css: path.resolve(__dirname, 'css'),
        }
    },

    devtool: NODE_ENV === 'dev' ? 'eval' : false,

    watch: NODE_ENV === 'dev',

    watchOptions: {
        aggregateTimeout: 200
    },

    module: {
        rules: rules
    },

    plugins: plugins,

    externals: {
        angular: 'angular'
    },

    devServer: {
        host: 'localhost',
        port: 8090
    }
};
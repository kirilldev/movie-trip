'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CompressionPlugin = require("compression-webpack-plugin");
// const WebpackOnBuildPlugin = require('on-build-webpack');
// const ConcatPlugin = require('webpack-concat-plugin');
//
// const precss = require('precss');
//
const PROJECT_PATH = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(PROJECT_PATH, './dist');
const NODE_ENV = (process.env.NODE_ENV || 'dev').trim().toLowerCase();


const copyPluginPaths = [
    {
        from: 'node_modules/angular/angular.js',
        to: 'assets/angular.js'
    },
    // {
    //     from: 'fonts/open-sans-condensed.woff.gz',
    //     to: 'assets/open-sans-condensed.woff.gz'
    // },
    // {
    //     from: 'img/*.png',
    //     to: 'assets'
    // },
    // {
    //     from: 'img/*.jpg',
    //     to: 'assets'
    // }
];

const ENV_DATA = {
    'prod': {
        targetDir: DIST_DIR,
        indexHTMLDir: 'index.html',
        copyPluginPaths: copyPluginPaths
    },
    'dev': {
        targetDir: DIST_DIR,
        indexHTMLDir: 'index.html',
        copyPluginPaths: copyPluginPaths
    }
};


if (!ENV_DATA[NODE_ENV]) {
    throw new Error("Unknown NODE_ENV '" + NODE_ENV + '\'');
} else {
    console.log('***** NODE_ENV=' + NODE_ENV + ' *****')
}

const extractCSS = new ExtractTextPlugin({allChunks: true, filename: 'assets/bundle.css'});
const extractHTML = new ExtractTextPlugin({filename: ENV_DATA[NODE_ENV].indexHTMLDir});

const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.DefinePlugin({
    //     PROPS: JSON.stringify(require('./js/props/'
    //         + (NODE_ENV === 'dev' ? 'dev.js' : 'prod.js')))
    // }),
    new CleanWebpackPlugin(['dist'], {
        root: PROJECT_PATH,
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
//
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
        exclude: /(node_modules|thirdparty)/,
        use: [
            {
                loader: 'babel-loader',
                query: {
                    presets: [require.resolve('babel-preset-es2015')],
                    plugins: [[require.resolve('babel-plugin-angularjs-annotate'), {'explicitOnly': true}]]
                }
            }
        ]

    },
    {
        test: /\.css|\.scss/,
        use: extractCSS.extract({
            use: [
                "css-loader",
                {
                    loader: "postcss-loader",
                    options: {
                        plugins: () => [precss]
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
    }
];
//     {
//         test: /partial([\\\/])[a-z-]+\.html$/,
//         loader: 'ngtemplate-loader!html-loader'
//     },
// },
// {
//     test: /\.(woff|mp3)$/,
//         use: [{
//     loader: 'file-loader',
//     options: {
//         name: '/assets/[name].[ext]'
//     }
// }]
// },
// ];

module.exports = {
    entry: './entry.point.js',

    output: {
        path: ENV_DATA[NODE_ENV].targetDir,
        filename: 'assets/bundle.js'
    },

    resolve: {
        extensions: ['.js']
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
        port: 8080
    }
};
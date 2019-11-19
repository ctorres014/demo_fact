const path = require('path');
const { NODE_ENV = 'production' } = process.env;
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './index.ts',
    mode: NODE_ENV,
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
                'ts-loader',
            ]
        }]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
}
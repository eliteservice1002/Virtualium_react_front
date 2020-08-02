const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin  =  require( 'copy-webpack-plugin' ); 
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const APP_DIR = path.resolve(__dirname, 'src'); 
const OUP_DIR = path.resolve(__dirname, 'src', 'public');
const STATIC_DIR = path.resolve(__dirname, 'src', 'static');
const HTML_DIR = path.resolve(__dirname, 'src', 'template', 'index.html');


module.exports = env => {
	const { PLATFORM, VERSION, DOTENV } = env;
	if (DOTENV === 'local') {
		require('dotenv').config({path: path.resolve(__dirname, '.env.local')});
	} else if (DOTENV === 'beta') {
		require('dotenv').config({path: path.resolve(__dirname, '.env.beta')});
	} else {
		require('dotenv').config();
	}

	return merge([
		{
			entry: APP_DIR,
			output: {
				path:OUP_DIR,
				publicPath: '/',
				filename: 'js/bundle.js',
				chunkFilename: 'js/[name].js',
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader'
						}
					},
					{
						test: /\.scss$/,
						exclude: /node_modules/,
						use: [
							PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
							'css-loader',
							'sass-loader'
						]
					},
					{
						test: /\.css$/i,
						exclude: /node_modules/,
						use: [
							{ loader: PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader' },
							{
								loader: 'css-loader',
								options: {
									importLoaders: 1,
									modules: {
										localIdentName: PLATFORM === 'production' ? 
																		'dev--[hash:base64:5]' : 
																		'[name]__[local]--[hash:base64:5]'
									}
								}
							},
							{ loader: 'postcss-loader' }
						]
					},
					{
						test: /\.(woff|woff2|eot|ttf|otf)$/,
						loader: "file-loader"
					}
				]
			},
			plugins: [
				new CopyWebpackPlugin([ { from: STATIC_DIR } ]),
				new HtmlWebpackPlugin({
					template: HTML_DIR,
					filename: './index.html',
					minify: PLATFORM === 'production' ? {
						collapseWhitespace: true,
						removeComments: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,
						useShortDoctype: true
					} : false
				}),
				new webpack.DefinePlugin({
					'process.env': JSON.stringify(process.env),
					'process.env.VERSION': JSON.stringify(env.VERSION),
					'process.env.PLATFORM': JSON.stringify(env.PLATFORM),
				})
			],
			devtool: 'source-map'
		}
	])
};
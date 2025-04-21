// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const {
    override,
    useBabelRc,
    // addWebpackModuleRule,
    // addWebpackPlugin,
    // addWebpackResolve,
} = require('customize-cra');
module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc()
    // addWebpackResolve({
    //     fallback: {
    //         net: require.resolve('net-browserify'),
    //         buffer: require.resolve('buffer'),
    //     },
    // })
    // addWebpackModuleRule({
    //     test: /\.m?js/,
    //     resolve: {
    //         fullySpecified: false,
    //     },
    // })
    // // addWebpackPlugin(new NodePolyfillPlugin())
);

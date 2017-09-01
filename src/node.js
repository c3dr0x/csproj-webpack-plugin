import CsprojWebpackPlugin from './index';

const plugin = new CsprojWebpackPlugin({
    csprojLocation: './Atlas.Web.csproj',
    assetsLocation: 'Atlas.SPA\\javascript\\'
});

const compiler = {

    callback() {
        console.log('main callback called');
    },

    plugin(eventName, pluginCallback) {
        console.log(`event subscride: ${eventName}`);

        const compilation = {
            assets: {
                'asset1': null,
                'asset2': null,
                'asset3': null
            }
        };

        pluginCallback(compilation, this.callback);
    }
};

plugin.apply(compiler)
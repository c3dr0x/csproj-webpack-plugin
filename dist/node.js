'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = new _index2.default({
    csprojLocation: './Atlas.Web.csproj',
    assetsLocation: 'Atlas.SPA\\javascript\\'
});

var compiler = {
    callback: function callback() {
        console.log('main callback called');
    },
    plugin: function plugin(eventName, pluginCallback) {
        console.log('event subscride: ' + eventName);

        var compilation = {
            assets: {
                'asset1': null,
                'asset2': null,
                'asset3': null
            }
        };

        pluginCallback(compilation, this.callback);
    }
};

plugin.apply(compiler);
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xml2js = require('xml2js');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Plugin to update .csproj with latest webpack built assets list
 */
var CsprojPlugin = function () {

    /**
     * Class constructor.
     * @param {object} options 
     */
    function CsprojPlugin(options) {
        _classCallCheck(this, CsprojPlugin);

        this.options = options;

        this.loadCsprojFile = this.loadCsprojFile.bind(this);
    }

    /** @inheritdoc */


    _createClass(CsprojPlugin, [{
        key: 'apply',
        value: function apply(compiler) {
            var options = this.options;


            compiler.plugin('emit', function (compilation, callback) {
                var assets = compilation.assets;


                (0, _xml2js.parseString)(loadCsprojFile(), function (csproj) {

                    callback();
                });
            });
        }
    }, {
        key: 'loadCsprojFile',
        value: function loadCsprojFile() {
            return _fs2.default.readFileSync(this.options.csprojLocation, { encoding: 'utf8' });
        }
    }]);

    return CsprojPlugin;
}();

exports.default = CsprojPlugin;
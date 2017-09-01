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
        this.testContentItemToBeAsset = this.testContentItemToBeAsset.bind(this);
    }

    /** @inheritdoc */


    _createClass(CsprojPlugin, [{
        key: 'apply',
        value: function apply(compiler) {
            var _this = this;

            var options = this.options;


            compiler.plugin('emit', function (compilation, callback) {
                var assets = compilation.assets;


                var csprojContent = _fs2.default.readFileSync(_this.options.csprojLocation, { encoding: 'utf8' });

                (0, _xml2js.parseString)(csprojContent, function (error, csproj) {
                    if (error) {
                        throw error;
                    }

                    // 1- Find the right ItemGroup containing the assets
                    var itemGroupIndex = csproj.Project.ItemGroup.findIndex(function (_ref) {
                        var Content = _ref.Content;

                        if (!Content) {
                            return false;
                        }

                        // If at least one element match we find the right ItemGroup
                        return Content.find(_this.testContentItemToBeAsset) !== undefined;
                    });

                    var contentList = csproj.Project.ItemGroup[itemGroupIndex].Content;

                    // 2- Clean all previous assets
                    var cleanedContentList = contentList.filter(function (contentItem) {
                        return !_this.testContentItemToBeAsset(contentItem);
                    });

                    // 3- Add all new assets
                    var assetsKeys = Object.keys(assets);
                    var newContentList = cleanedContentList.concat(assetsKeys.map(function (assetKey) {
                        return {
                            '$': {
                                'Include': _this.options.assetsLocation + assetKey
                            }
                        };
                    }));

                    // 4- Replace ItemGroup
                    csproj.Project.ItemGroup[itemGroupIndex].Content = newContentList;

                    // 5- Write new file
                    var builder = new _xml2js.Builder();
                    var xml = builder.buildObject(csproj);

                    _fs2.default.writeFileSync(_this.options.csprojLocation, xml, { encoding: 'utf8' });

                    callback();
                });
            });
        }
    }, {
        key: 'testContentItemToBeAsset',
        value: function testContentItemToBeAsset(contentItem) {
            return contentItem['$'] && contentItem['$'].Include.startsWith(this.options.assetsLocation);
        }
    }]);

    return CsprojPlugin;
}();

exports.default = CsprojPlugin;
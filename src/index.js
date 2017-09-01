import { parseString, Builder } from 'xml2js';
import fs from 'fs';

/**
 * Plugin to update .csproj with latest webpack built assets list
 */
class CsprojPlugin {

    /**
     * Class constructor.
     * @param {object} options 
     */
    constructor(options) {
        this.options = options;
        this.testContentItemToBeAsset = this.testContentItemToBeAsset.bind(this);
    }

    /** @inheritdoc */
    apply(compiler) {
        const { options } = this;

        compiler.plugin('emit', (compilation, callback) => {
            const { assets } = compilation;

            const csprojContent = fs.readFileSync(this.options.csprojLocation, { encoding: 'utf8' });

            parseString(csprojContent, (error, csproj) => {
                if (error) {
                    throw error;
                }

                // 1- Find the right ItemGroup containing the assets
                const itemGroupIndex = csproj.Project.ItemGroup.findIndex(({ Content }) => {
                    if (!Content) {
                        return false;
                    }

                    // If at least one element match we find the right ItemGroup
                    return Content.find(this.testContentItemToBeAsset) !== undefined;
                });

                const contentList = csproj.Project.ItemGroup[itemGroupIndex].Content;

                // 2- Clean all previous assets
                const cleanedContentList = contentList.filter(contentItem => !this.testContentItemToBeAsset(contentItem));

                // 3- Add all new assets
                const newContentList = cleanedContentList.concat(assets.map(asset => ({
                    '$': {
                        'Include': this.options.assetsLocation + asset
                    }
                })));

                // 4- Replace ItemGroup
                csproj.Project.ItemGroup[itemGroupIndex].Content = newContentList;

                // 5- Write new file
                const builder = new Builder();
                const xml = builder.buildObject(csproj);

                fs.writeFileSync(this.options.csprojLocation, xml, { encoding: 'utf8' });

                callback();
            });
        });
    }

    testContentItemToBeAsset(contentItem) {
        return contentItem['$'] && contentItem['$'].Include.startsWith(this.options.assetsLocation);
    }

}

export default CsprojPlugin;
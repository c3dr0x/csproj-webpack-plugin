import { parseString } from 'xml2js';
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

        this.loadCsprojFile = this.loadCsprojFile.bind(this);
    }

    /** @inheritdoc */
    apply(compiler) {
        const { options } = this;
        
        compiler.plugin('emit', (compilation, callback) => {
            const { assets } = compilation;

            parseString(loadCsprojFile(), csproj => {
                

                callback();
            });
        });
    }

    loadCsprojFile() {
        return fs.readFileSync(this.options.csprojLocation, { encoding: 'utf8' });
    }
}

export default CsprojPlugin;
const EOS = require('./defaults/eos')

class PluginRepositorySingleton {
    constructor(){
        this.plugins = [];
        this.loadPlugins();
    }
    
    loadPlugins(){
        this.plugins.push(new EOS());
    }

    plugin(name){
        return this.plugins.find(plugin => plugin.name === name);
    }
}

module.exports = new PluginRepositorySingleton()
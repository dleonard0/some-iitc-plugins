// ==UserScript==
// @author         dleonard0
// @name           IITC plugin: Population grid map
// @category       Map Tiles
// @version        1.0.1
// @description    Add the Australian regional population density tiles as an optional layer.
// @id             basemap-abspopulation
// @namespace      https://github.com/dleonard0/some-iitc-plugins
// @downloadURL    https://github.com/dleonard0/some-iitc-plugins/raw/master/basemap-abspopulation.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'release';
plugin_info.dateTimeVersion = '2020-11-19-171500';
plugin_info.pluginId = 'basemap-abspopulation';
//END PLUGIN AUTHORS NOTE


// use own namespace for plugin
window.plugin.mapTileabspopulation = {
  addLayer: function() {

    /*
     * TODO:
     * fetch descriptor from https://absstats.maps.arcgis.com/sharing/rest/content/items/2ad1771db9284e74b744325e77c5722c/data?f=json
     * then data.["operationalLayers"]["url"] will be an url of the form
     *     "https://tiles.arcgis.com/tiles/v8Kimc579yljmjSP/arcgis/rest/services/Population_Grid/MapServer"
     * and we append "/tile/{z}/{y}/{x}" to it.
     */

    var absOpt = {
      attribution: 'Source: Australian Bureau of Statistics',
      maxNativeZoom: 14,
      minNativeZoom: 4,
    };

    var layers = {
      /* https://www.abs.gov.au/statistics/people/population/regional-population/2018-19 */
      'https://tiles.arcgis.com/tiles/v8Kimc579yljmjSP/arcgis/rest/services/Population_Grid/MapServer/tile/{z}/{y}/{x}': 'Population grid 2019',
    };

    for(var url in layers) {
      var layer = new L.TileLayer(url, absOpt);
      layerChooser.addBaseLayer(layer, layers[url]);
    }
  },
};

var setup =  window.plugin.mapTileabspopulation.addLayer;

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


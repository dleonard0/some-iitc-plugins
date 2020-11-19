// ==UserScript==
// @author         dleonard0
// @name           IITC plugin: Population grid map
// @category       Map Tiles
// @version        1.0.2
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

window.plugin.mapTileabspopulation = {
  addLayer: function() {
    $.ajax({
      url: "https://absstats.maps.arcgis.com/sharing/rest/content/items/2ad1771db9284e74b744325e77c5722c/data?f=json",
      dataType: "json",
      success: function (data, textStatus, jqXHR) {
        var absOpt = {
          attribution: 'Source: Australian Bureau of Statistics',
          maxNativeZoom: 14,
          minNativeZoom: 4,
        };
        for (let l of data.operationalLayers) {
          let layer = new L.TileLayer(l.url + '/tile/{z}/{y}/{x}', absOpt);
          window.layerChooser.addBaseLayer(layer, "Population density 2019" /*l.title*/);
          break;
        }
      },
    })
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


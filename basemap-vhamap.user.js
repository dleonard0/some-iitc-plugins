// ==UserScript==
// @author         dleonard0
// @name           IITC plugin: Vodafone Australia coverage
// @category       Map Tiles
// @version        1.0.0
// @description    Add Vodafone Australian coverage as an optional layer.
// @id             basemap-vhamap
// @namespace      https://github.com/dleonard0/some-iitc-plugins
// @downloadURL    https://github.com/dleonard0/some-iitc-plugins/raw/master/basemap-vhamap.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'release';
plugin_info.dateTimeVersion = '2020-11-24-234500';
plugin_info.pluginId = 'basemap-vhamap';
//END PLUGIN AUTHORS NOTE

// This wraps the WMS viewer at
//   https://maps.vodafone.com.au/VHAMap/apps/public-vf

window.plugin.mapTilevhamap = {
  addLayer: function() {

    // Date logic from getPreviousFriday() function from:
    //   https://maps.vodafone.com.au/map/vha/VHAMapConfig.js?v=4
    // "from 2 days ago (allow two days to receive and process data)"
    var d = new Date();
        d.setDate(d.getDate() - 2);
        d.setDate(d.getDate() - ((d.getDay() + (7-5/*Friday*/))%7));
    let date = d.toISOString().substr(0,10)
    let layer = L.tileLayer.wms("https://maps.vodafone.com.au/wms/cache", {
      layers: encodeURI(JSON.stringify([
         { VISIBLE_NETWORKS: 'VODA',
           MODE: 'BYDATE',
           RENDER_AS: 'VOICE_INDOOR_OUTDOOR',
           FREQUENCIES: 'L1800,L2100,L850,L700,U2100,U900',
           COVERAGE_CONFIGS: 'BASE',
           DEVICE_CAP: 'VOLTE',
           STAT_SET: 'NO_STATS',
           STAT_COLUMN: '',
           DATETIMETO: date,
           name: 'VHA_COVERAGE_CLASS',
           theme: 'vha_grid',
           visibility: true },
         { name:'COVERAGE_CLIP_BOUNDARY',
           theme: 'vha_grid',
           visibility: true }])),
      styles:"vha_cov_tile",
      format:"image/gif",
      version:`VODA-BYDATE-VOICE_INDOOR_OUTDOOR-L1800,L2100,L850,L700,U2100,U900-BASE-VOLTE-NO_STATS-${date}-c`,
      renderset:"vha_grid",
      uppercase:true,
      attribution: 'Source: Vodafone',
      // maxNativeZoom: 14,
      // minNativeZoom: 4,
    });
    window.layerChooser.addBaseLayer(layer, "Vodafone")
  },
};

var setup = window.plugin.mapTilevhamap.addLayer;

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


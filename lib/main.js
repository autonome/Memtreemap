function getWindowDimensions() {
  let window = require('window-utils').activeBrowserWindow;
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function getURL(name) require('self').data.url(name)

// create panel on demand to ensure freshness
function createPanel() {
  let dim = getWindowDimensions();
  let panel = require("panel").Panel({
    height: dim.height * .9,
    width: dim.width * .9,
    contentURL: 'about:memory',
    contentScriptFile: [
      getURL('d3/d3.js'),
      getURL('d3/d3.layout.js'),
      getURL('memtreemap.js')]
  });
  panel.on('hide', function() {
    panel.destroy();
  });
  return panel;
}

// keyboard shortcut to load panel
require('hotkeys').Hotkey({
  combo: 'accel-shift-y',
  onPress: function() createPanel().show()
});

var widget = require('widget');
widget.Widget({
  id: 'about:memory:treemap',
  label: 'about:memory:treemap',
  contentURL: getURL('icon.png'),
  onClick: function() createPanel().show()
});

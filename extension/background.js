var pages = {}
var selectedTabId = null;

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  pages[sender.tab.id] = message;
  chrome.pageAction.show(sender.tab.id);

  chrome.tabs.query({active : true}, function(tabs){ 
    tabs.forEach(function(tab) {
      if (typeof pages[tab.id] !== 'undefined') {
        selectedTabId = tab.id;
        return;
      }
    });
  });


});

chrome.tabs.onActivated.addListener(function(activeInfo) {

  chrome.tabs.query({active : true}, function(tabs){ 
    tabs.forEach(function(tab) {
      if (typeof pages[tab.id] !== 'undefined') {
        selectedTabId = tab.id;
        return;
      }
    });
  });

});

getData = function() {
  return pages[selectedTabId];
}

setVenue = function(foursquare_venue_id) {
  pages[selectedTabId]['foursquare_venue_id'] = foursquare_venue_id;
}

removeVenue = function() {
  delete pages[selectedTabId]['foursquare_venue_id'];
}

reloadTab = function() {
  chrome.tabs.reload(selectedTabId);
}
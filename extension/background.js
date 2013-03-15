var pages = {}
var selectedTabId = null;

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    pages[sender.tab.id] = message;
    chrome.pageAction.show(sender.tab.id);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	selectedTabId = activeInfo.tabId;
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
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('flickr') > -1) {
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

var pages = {}
var selectedTabId = null;

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    pages[sender.tab.id] = message;
    console.log(pages);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	selectedTabId = activeInfo.tabId;
});

getData = function() {
	return pages[selectedTabId];
}

// chrome.tabs.getSelected(null, function(tab) {
//   updateAddress(tab.id);
// });
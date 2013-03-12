// <meta property="flickr_photos:location:latitude" content="37.762" />
// <meta property="flickr_photos:location:longitude" content="-122.410167" />

var metas = document.querySelectorAll("meta");

var latitude = null;
var longitude = null;

for (var i = 0; i < metas.length; i++) {

	var meta = metas[i];
	var property_name = meta.getAttribute('property');

	if (property_name == 'flickr_photos:location:latitude') {
		latitude = meta.getAttribute('content');
	}

	if (property_name == 'flickr_photos:location:longitude') {
		longitude = meta.getAttribute('content');
	}

}

chrome.extension.sendMessage({geo: {lat: latitude, lon: longitude}}, function(response) {
});
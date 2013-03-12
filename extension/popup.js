window.onload = function() {

	var data = chrome.extension.getBackgroundPage().getData();

	document.getElementById('location').innerHTML = data.geo.lat + ', ' + data.geo.lon;

	// $('#query').focus();

	// $('#query').fs_suggest({
	//     'client_id'     : 'UXC2FDAPKGIAR3ZUIAEJ3PKRTCFEIMAM5R3YQVZZNDZVTIMU',
	//     'client_secret' : '0QGUQPWPCC4NCL3HX4U23OR5AKAHZXFNFQY0QFSKTUK4UFKZ',
	//     'll' : data.geo.lat + ',' + data.geo.lon,
	//     'limit' : 10
	// });


	$("#query").foursquareAutocomplete({
	  'latitude': data.geo.lat,
	  'longitude': data.geo.lon,
		'client_id'     : 'UXC2FDAPKGIAR3ZUIAEJ3PKRTCFEIMAM5R3YQVZZNDZVTIMU',
		'client_secret' : '0QGUQPWPCC4NCL3HX4U23OR5AKAHZXFNFQY0QFSKTUK4UFKZ',
	  'minLength': 3,
	  'search': function (event, ui) {
	    // $("#venue-name").html(ui.item.name);
	    // $("#venue-id").val(ui.item.id);
	    // $("#venue-address").html(ui.item.address);
	    // $("#venue-cityLine").html(ui.item.cityLine);
	    // $("#venue-icon").attr("src", ui.item.photo);
	    return false;
	  },
	  'onError' : function (errorCode, errorType, errorDetail) {
	    // var message = "Foursquare Error: Code=" + errorCode + 
	    // ", errorType= " + errorType + 
	    // ", errorDetail= " + errorDetail;
	    // log(message);
	  }
	});	

	// document.getElementById('query').focus();

}
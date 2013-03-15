$(function() {

  var page_type = $('meta[property="og:type"]');
  if (page_type && page_type.attr('content') == 'flickr_photos:photo') {

    // Quick hack to determine if it's your photo
    var privacy_toggle = document.getElementById('edit-privacy-collapsed');
    if (!privacy_toggle) {
      return;
    }

    var metas = document.querySelectorAll("meta");

    var latitude = null;
    var longitude = null;

    var meta_latitude = $('meta[property="flickr_photos:location:latitude"]');
    var meta_longitude = $('meta[property="flickr_photos:location:longitude"]');

    if (meta_latitude) {
      latitude = meta_latitude.attr('content');
    }

    if (meta_longitude) {
      longitude = meta_longitude.attr('content');
    }

    if (!latitude) {
      return;   
    }

    var data = {geo: {lat: latitude, lon: longitude}}

    var api_key = null;
    var secret = null;

    $('script').each(function(index, el) {

      var re = /"api_key":"([0-9a-z]*)"/
      var content = $(el).html();
      var result = content.match(re);

      if (result && result.length >= 2) {
        api_key = result[1];
      }

      var re = /"secret":"([0-9a-z]*)"/
      var content = $(el).html();
      var result = content.match(re);

      if (result && result.length >= 2) {
        secret = result[1];
      }

    });

    if (api_key) {
      data['api_key'] = api_key;
    }

    if (secret) {
      data['secret'] = secret;
    }

    var magic_cookie_input = $('input[name="magic_cookie"]');

    if (magic_cookie_input) {
      data['auth_hash'] = magic_cookie_input.val();
    }

    var photo_input = $('input[name="photo"]');

    if (photo_input) {
      data['id'] = photo_input.val();
    }

    var foursquare_venue_id = null;

    $('a.f-machinetag-sprite-link').each(function(index, el) {

      var re = /foursquare.com\/venue\/([0-9a-z]*)/
      var result = el.href.match(re);
      if (result && result.length >= 2) {
        foursquare_venue_id = result[1];
      }

    });

    if (foursquare_venue_id) {
      data['foursquare_venue_id'] = foursquare_venue_id;
    }

    chrome.extension.sendMessage(data, function(response) {
    });

  }

});
$(function() {

  var data = chrome.extension.getBackgroundPage().getData();

  // Flickr iPhone app Foursquare creds found by sniffing traffic through mitmproxy (http://mitmproxy.org/)

  var foursquare_client_id = 'XKJHNPQ4CTCZDDY41HFOCC1ZUUZAHNIDAOERSSMRB5EFTF0O';
  var foursquare_client_secret = '2LKT2SEVCSYJIHLA5QNAUH5CE5SB05C4SM20OI0O1SXFFPEP';

  var venues = {}

  $('#query').typeahead({
    
    minLength: 1,
    
    source: function(query, process) {

      if ($('#query').val() == ' ') {

        var urlString = "https://api.foursquare.com/v2/venues/search?ll=" + data.geo.lat + "," + data.geo.lon + 
          "&client_id=" + foursquare_client_id + 
          "&client_secret=" + foursquare_client_secret;

        return $.get(urlString, {},
          function(json) {
            var venueNames = [];

            $.each(json.response.groups[0].items, function(index,value) {

              venues[value.id] = value;
              venueNames.push(value.name + '|' + value.id);

            });
            return process(venueNames);
          }
        );

      } else {

        var urlString = "https://api.foursquare.com/v2/venues/suggestcompletion?ll=" + data.geo.lat + "," + data.geo.lon + 
          "&client_id=" + foursquare_client_id + 
          "&client_secret=" + foursquare_client_secret;

        return $.get(urlString, {query: $('#query').val()},
          function(json) {
            var venueNames = [];

            $.each(json.response.minivenues, function(index,value) {

              venues[value.id] = value;
              venueNames.push(value.name + '|' + value.id);

            });
            return process(venueNames);
          }
        );

      }

    },

    highlighter: function(item) {
      
      var divider_index = item.lastIndexOf('|');
      var foursquare_venue_id = item.substr(divider_index + 1);

      var venue = venues[foursquare_venue_id];

      var category_icon = 'https://foursquare.com/img/categories/none.png';

      if (venue && venue.categories && venue.categories.length > 0 && venue.categories[0].icon) {
        category_icon = venue.categories[0].icon;
      }

      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      var name = venue.name.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })


      if (venue.location && venue.location.address) {
        return '<div class="venue-autocomplete-row"><img src="' + category_icon + '" /><span class="venue-name">' + name + '</span>' + '<span class="venue-address">' + venue.location.address + '</span></div>';
      } else {
        return '<div class="venue-autocomplete-row"><img src="' + category_icon + '" /><span class="venue-name">' + name + '</span></div>';
      }

    },

    updater: function(item) {

      var divider_index = item.lastIndexOf('|');
      var foursquare_venue_id = item.substr(divider_index + 1);

      var venue = venues[foursquare_venue_id];

      var category_icon = 'https://foursquare.com/img/categories/none.png';

      if (venue && venue.categories && venue.categories.length > 0 && venue.categories[0].icon) {
        category_icon = venue.categories[0].icon;
      }

      $('#venue').children('img').attr('src', category_icon);
      $('#venue').children('.venue-name').html(venue.name);
      if (venue.location && venue.location.address) {
        $('#venue').children('.venue-address').html(venue.location.address);
      }
      switchToVenue();

      $.get('http://www.flickr.com/services/rest/', {
        format: 'json',
        clientType: 'yui-3-flickrapi-module',
        method: 'flickr.photos.geo.getLocation',
        api_key: data.api_key,
        auth_hash: data.auth_hash,
        auth_token: null,
        secret: data.secret,
        photo_id: data.id,
        nojsoncallback: 1
      }, function(location_data, textStatus, jqXHR) {

        var woeid = location_data.photo.location.woeid;

        $.post('http://www.flickr.com/services/rest/', {
          format: 'json',
          clientType: 'yui-3-flickrapi-module',
          method: 'flickr.photos.geo.correctLocation',
          api_key: data.api_key,
          auth_hash: data.auth_hash,
          auth_token: null,
          secret: data.secret,
          photo_id: data.id,
          foursquare_id: foursquare_venue_id,
          woe_id: woeid,
          nojsoncallback: 1
        }, function() {
          chrome.extension.getBackgroundPage().setVenue(foursquare_venue_id);
          chrome.extension.getBackgroundPage().reloadTab();
        });

      }, 'json');
       
    }

  });

  $('#query').on('keyup', function(e) {

    switch(e.keyCode) {
      case 40: // down arrow
      case 38: // up arrow
      case 16: // shift
      case 17: // ctrl
      case 18: // alt
      case 9: // tab
      case 13: // enter
      case 27: // escape
        return;
        break;
    }

    if ($('#query').val() == '') {

      $('#query').val(' ');
      $('#query').trigger('keyup');
      $('#query').val('');

    }

  });

  $('#change-venue').click(function(e) {

    switchToQuery();
    e.preventDefault();

  });

  $('#remove-venue').click(function(e) {

    $.get('http://www.flickr.com/services/rest/', {
      format: 'json',
      clientType: 'yui-3-flickrapi-module',
      method: 'flickr.photos.geo.getLocation',
      api_key: data.api_key,
      auth_hash: data.auth_hash,
      auth_token: null,
      secret: data.secret,
      photo_id: data.id,
      nojsoncallback: 1
    }, function(location_data, textStatus, jqXHR) {

      var woeid = location_data.photo.location.woeid;

      $.post('http://www.flickr.com/services/rest/', {
        format: 'json',
        clientType: 'yui-3-flickrapi-module',
        method: 'flickr.photos.geo.correctLocation',
        api_key: data.api_key,
        auth_hash: data.auth_hash,
        auth_token: null,
        secret: data.secret,
        photo_id: data.id,
        woe_id: woeid,
        nojsoncallback: 1
      }, function() {

        chrome.extension.getBackgroundPage().removeVenue();
        chrome.extension.getBackgroundPage().reloadTab();
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.update(tab.id, { selected: true } )
        });

      });

    }, 'json');

    // switchToQuery();
    e.preventDefault();

  });

  function switchToQuery() {

    $('#venue').hide();
    $('body').css('height', '425px');
    $('#query').show();

    $('#query').val(' ');
    $('#query').trigger('keyup');
    $('#query').val('');

    $('#query').focus();

  }

  function switchToVenue() {

    $('#query').hide();
    $('body').css('height', '100px');
    $('#venue').show();

  }

  if (data.foursquare_venue_id) {

    var urlString = "https://api.foursquare.com/v2/venues/" + data.foursquare_venue_id + 
      "?client_id=" + foursquare_client_id + 
      "&client_secret=" + foursquare_client_secret;

    return $.get(urlString, {},
      function(json) {

        var venue = json.response.venue;

        var category_icon = 'https://foursquare.com/img/categories/none.png';

        if (venue && venue.categories && venue.categories.length > 0 && venue.categories[0].icon) {
          category_icon = venue.categories[0].icon;
        }

        $('#venue').children('img').attr('src', category_icon);
        $('#venue').children('.venue-name').html(venue.name);
        if (venue.location && venue.location.address) {
          $('#venue').children('.venue-address').html(venue.location.address);
        }

        switchToVenue();

      }
    );

  } else {

    switchToQuery();

  }

});
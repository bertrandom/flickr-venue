(function ($) {

    $.foursquareAutocomplete = function (element, options) {
        this.options = {};

        element.data('foursquareAutocomplete', this);

        this.init = function (element, options) {
            this.options = $.extend({}, $.foursquareAutocomplete.defaultOptions, options);
            this.options = $.metadata ? $.extend({}, this.options, element.metadata()) : this.options;
            updateElement(element, this.options);
        };
        this.init(element, options);
        this.select = function (event, ui) {
        };
        
    };
    $.fn.foursquareAutocomplete = function (options) {
        return this.each(function () {
            (new $.foursquareAutocomplete($(this), options));
        });
    };

    $.widget( "ui.autocomplete", $.ui.autocomplete, {
    _renderItem: function (ul, item) {
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + getAutocompleteText(item) + "</a>")
            .appendTo(ul);
    }
    });    

    function updateElement(element, options) {
        element.autocomplete({
            source: function (request, response) {

                url = "https://api.foursquare.com/v2/venues/suggestcompletion?"
                        + "query=" + request.term
                        + "&ll=" + options.latitude + "," + options.longitude
                        + "&v=" + "20120214"
                        + "&limit=" + "10"
                        + "&client_id=" + options.client_id
                        + "&client_secret=" + options.client_secret;
                         
                $.getJSON(url, function() { 
                    console.log("get search results ajax called");
                })
                .success(function(data) {

                                    // Check to see if there was success
                                    if (data.meta.code != 200)
                                    {
                                        element.removeClass("ui-autocomplete-loading")
                                        options.onError(data.meta.code, data.meta.errorType, data.meta.errorDetail);
                                        return false;
                                    }

                                    var results = $.map(data.response.minivenues, function (item) {
                                    return {
                                        name: item.name,
                                        id: item.id,
                                        address: (item.location.address == undefined ? "" : item.location.address),
                                        cityLine: (item.location.city == undefined ? "" : item.location.city + ", ") + (item.location.state == undefined ? "" : item.location.state + " ") + (item.location.postalCode == undefined ? "" : item.location.postalCode),
                                        photo: (item.category == undefined ? "" : item.category.icon.prefix + "32" + item.category.icon.name), 
                                        full: item
                                    };
                                });
                                
                                    console.log(results);

                                response(results);

                })
                .error(function(header, status, errorThrown) {

                    options.onAjaxError(header, status, errorThrown);
                    //TODO show some kind of error message
                    //"this application doesn't MAKE errors"
                });

            },
            minLength: options.minLength,
            select: function (event, ui) {
                element.val(ui.item.name);
                options.search(event, ui);
                return false;
            },
            open: function () {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close: function () {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            }
        });



            // .data("autocomplete")._renderItem = function (ul, item) {
            //     return $("<li></li>")
            //         .data("item.autocomplete", item)
            //         .append("<a>" + getAutocompleteText(item) + "</a>")
            //         .appendTo(ul);
            // };

    };

    $.foursquareAutocomplete.defaultOptions = {
        'latitude': 47.22,
        'longitude': -122.2,
        'client_id': "",
        'client_secret': "",
        'minLength': 3,
        'select': function (event, ui) {},
        'onError': function (errorCode, errorType, errorDetail) {},
        'onAjaxError' : function (header, status, errorThrown) {}
    };
    

    /// Builds out the <select> portion of autocomplete control
    function getAutocompleteText(item) {
        var text = "<div>";
        text += "<div class='categoryIconContainer'><img src='" + (item.photo == "" ? "" : item.photo) + "' /></div>";
        text += "<div class='autocomplete-name'>" + item.name + "</div>";
        if (item.address == "" && item.cityLine == "")
            text += "<div class='autocomplete-detail'>&nbsp;</div>";
        if (item.address != "")
            text += "<div class='autocomplete-detail'>" + item.address + "</div>";
        if (item.cityLine != "")
            text += "<div class='autocomplete-detail'>" + item.cityLine + "</div>";
        text += "</div>";
        return text;
    }
})(jQuery);

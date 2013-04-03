/*jshint browser:true */
/*global document, chrome */

var RedmineTweak = (function () {
    var tweaks = {

        prefixPref: 'pref_',

        preferences: [
            {
                name: 'relativeDate',
                default: true
            },
            {
                name: 'displayAvatars',
                default: true
            },
            {
                name: 'dontCareTicket',
                default: true
            },
            {
                name: 'directEditLink',
                default: true
            },
            {
                name: 'colorizeRevisions',
                default: true
            },
            {
                name: 'reviewToChange',
                default: true
            },
            {
                name: 'autoQAonHold',
                default: true
            },
            {
                name: 'autoDisplayUpdateForm',
                default: true
            },
            {
                name: 'hideFirstEntries',
                default: true
            },
            {
                name: 'changesetsAbstract',
                default: true
            },
            {
                name: 'fileListAbstract',
                default: true
            }
        ],

        colors: {
            trunk: "#00dd00",
            qa: "#E8811A",
            prod: "#DB0F0F"
        },

        // this will load preferences from storage
        // if a pref is undefined in storage, get the default value, and save it
        // then call the callback with all the preferences
        loadPreferences: function (callback) {
            var getPrefIndexByName = function (name) {
                    var pref = RedmineTweak.preferences.filter(function (item) {
                            return item.name === name;
                        });

                    return (pref.length > 0) ? pref[0] : null;
                };

            chrome.storage.local.get(null, function (prefObject) {
                RedmineTweak.preferences.forEach(function (pref) {
                    var name = RedmineTweak.prefixPref + pref.name,
                        obj = {};

                    // if the preference does not exist, let's get the default
                    if (prefObject[name] === undefined) {
                        // internally used object
                        prefObject[name] = getPrefIndexByName(pref.name).default;

                        // chrome storage
                        obj[name] = prefObject[name];
                        chrome.storage.local.set(obj);
                    }
                });
                callback(prefObject);
            });
        },

        lightenDarkenColor: function (hex, lum) {
        // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i += 1) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }
            return rgb;
        },

        querySelectorAllIterate: function (query, func, amount) {
            var elem = document.querySelectorAll(query),
                i,
                l;

            for (i = 0, l = amount || elem.length; i < l; i += 1) {
                func(elem[i], i);
            }

            return elem;
        },

        relativeDate: function (input, reference) {
            var SECOND = 1000,
                MINUTE = 60 * SECOND,
                HOUR = 60 * MINUTE,
                DAY = 24 * HOUR,
                WEEK = 7 * DAY,
                YEAR = DAY * 365,
                MONTH = YEAR / 12;

            var formats = [
                [ 0.7 * MINUTE, 'just now' ],
                [ 1.5 * MINUTE, 'a minute ago' ],
                [ 60 * MINUTE, 'minutes ago', MINUTE ],
                [ 1.5 * HOUR, 'an hour ago' ],
                [ DAY, 'hours ago', HOUR ],
                [ 2 * DAY, 'yesterday' ],
                [ 7 * DAY, 'days ago', DAY ],
                [ 1.5 * WEEK, 'a week ago'],
                [ MONTH, 'weeks ago', WEEK ],
                [ 1.5 * MONTH, 'a month ago' ],
                [ YEAR, 'months ago', MONTH ],
                [ 1.5 * YEAR, 'a year ago' ],
                [ Number.MAX_VALUE, 'years ago', YEAR ]
            ];

            !reference && ( reference = (new Date()).getTime() );
            reference instanceof Date && ( reference = reference.getTime() );
            input instanceof Date && ( input = input.getTime() );

            var delta = reference - input, format, i, len;

            for(i = -1, len=formats.length; ++i < len; ){
                format = formats[i];
                if(delta < format[0]){
                    return format[2] === undefined ? format[1] : Math.round(delta/format[2]) + ' ' + format[1];
                }
            }
        },

        xhrLoad: function (url, callback) {
            var Xhr = new XMLHttpRequest();

            Xhr.onreadystatechange = function() {
                if (Xhr.readyState == 4) {
                    if (Xhr.status == 200) {
                        callback(Xhr);
                    } else {
                    }
                }
            };

            try {
                Xhr.open('GET', url, true); // True for asynchronous call.
                Xhr.send(null);
            } catch (error) {

            }
        },

        isFrench: function () {
            return (document.querySelector('a.home').textContent === "Accueil");
        }

    };

    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size += 1;
            }
        }
        return size;
    };


    return tweaks;
}());

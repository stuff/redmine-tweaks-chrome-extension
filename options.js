(function (RedmineTweak) {

    var prefixPref = RedmineTweak.prefixPref,
        preferences = [
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
        ];

    function createPreferences () {
        var container = document.querySelector('.options');
        chrome.storage.local.get(null, function (prefObject) {

            preferences.forEach(function (pref) {
                var el = document.createElement('label'),
                    checked = prefObject[prefixPref + pref.name];

                if (checked === undefined) {
                    checked = true;
                }

                el.innerHTML = '<input type="checkbox" ' + (checked ? 'checked': '') + ' name="' + pref.name + '">' + pref.name;
                container.appendChild(el);
            });

        });


    };

    document.addEventListener('DOMContentLoaded', function () {
        var i, l,
            options = document.querySelector('.options');

        createPreferences();

        options.addEventListener('click', function (e) {
            var pref,
                objPref = {},
                el = e.toElement;

            if (el.type === 'checkbox') {
                pref = prefixPref + el.name;
                objPref[pref] = el.checked;

                chrome.storage.local.set(objPref);
            }
        });
    });

}(RedmineTweak));

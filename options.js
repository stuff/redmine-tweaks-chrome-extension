(function (RedmineTweak) {

    var prefixPref = RedmineTweak.prefixPref,
        preferences = RedmineTweak.preferences;

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

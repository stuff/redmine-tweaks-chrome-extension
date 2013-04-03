/*jshint browser:true */
/*global RedmineTweak, chrome, document */

(function (RedmineTweak) {
    var R = RedmineTweak;

    function start (preferences) {
        if (preferences[R.prefixPref + 'fileListAbstract']) {
            (function () {
                var e = document.createElement('div'),
                    elm = document.querySelector('.autoscroll'),
                    p = elm.parentNode;

                p.insertBefore(e, elm);

                var list = document.createElement('ul');
                e.appendChild(list);
                R.querySelectorAllIterate('.filename', function (link) {
                    var li = document.createElement('li');
                    li.innerHTML = link.innerHTML.split('(')[0];
                    list.appendChild(li);
                });
            }());
        }
     }

    chrome.storage.local.get(null, function (prefObject) {
        start(prefObject);
    });

}(RedmineTweak));

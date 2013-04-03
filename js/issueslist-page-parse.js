/*jshint browser:true */
/*global RedmineTweak, chrome, document */

(function (RedmineTweak) {
    var R = RedmineTweak,
        currentUserId = document.querySelector('#loggedas a');

    currentUserId = currentUserId ? parseInt(currentUserId.href.match(/users\/([0-9])+/)[1], 10) : null;

    function start (preferences) {
        var userId;

        // relative time in issues list -------------------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'relativeDate']) {
            (function () {
                R.querySelectorAllIterate('.updated_on', function (elem) {
                    var fullDate = elem.textContent,
                        relDate = R.relativeDate(new Date(fullDate)),
                        newContent = relDate;
                    elem.innerHTML = '<span title="' + fullDate + '">' + newContent + '</span>';
                });
            }());
        }

        // display avatars in assignee column -------------------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'displayAvatars']) {
            (function () {
                var users = {};

                // get unique userids list
                R.querySelectorAllIterate('.assigned_to', function (elem) {
                    var link = elem.querySelector('a');
                    if (link) {
                        elem.align = 'left';
                        userId = link.href.match(/users\/(.*)/)[1];
                        users[userId] = userId;
                    }
                });

                Object.keys(users).forEach(function(k){
                    R.xhrLoad('/users/' + k, function(xhr){
                        users[k] = xhr.responseText.match(/<h2>.*src="(.*)\/64".*<\/h2>/)[1];
                        R.querySelectorAllIterate('.assigned_to a[href="/users/' + k + '"]', function(elm){
                            elm.innerHTML = '<img style="vertical-align:text-top;" width="16" src="' + users[k] + '/16"/>&nbsp;' + elm.innerHTML;
                        });
                    });
                });
            }());
        }

        // lighten Review tickets you don't have to care of -------------------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'dontCareTicket']) {
            (function () {
                var filters = ['Review', 'QA on hold', 'QA', 'Merge to QA'];

                // get unique userids list
                R.querySelectorAllIterate('tr.issue', function (tr) {
                    var statusElm = tr.querySelector('td.status'),
                        status = statusElm ? statusElm.innerHTML : null,
                        assignedToElm = tr.querySelector('td.assigned_to a'),
                        assignedUserId = assignedToElm ? parseInt(assignedToElm.href.match(/users\/(.*)/)[1], 10) : null;

                    if (filters.indexOf(status) >=0 && assignedUserId === userId) {
                        tr.style.opacity = '0.4';
                    }
                });
            }());
        }

        // add direct link edit -------------------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'directEditLink']) {
            (function () {
                R.querySelectorAllIterate('.subject a', function (a) {
                    var elem = document.createElement('span');

                    elem.innerHTML = '[<strong><a target="_blank" href="' + a.href + '/edit' + '">edit</a></strong>]&nbsp;';
                    a.parentNode.insertBefore(elem, a);
                });
            }());
        }

    }

    chrome.storage.local.get(null, function (prefObject) {
        start(prefObject);
    });

}(RedmineTweak));

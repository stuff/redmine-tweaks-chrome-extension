/*jshint browser:true */
/*global RedmineTweak, chrome, document */

(function (RedmineTweak) {
    var _changesetsElem,
        R = RedmineTweak;

    function getChangesetsElements() {
        if (!_changesetsElem) {
            var elem, i, l, where, rev, link,
                elements = document.querySelectorAll('div.changeset'),
                res = {};

            for (i = 0, l = elements.length; i < l; i += 1) {
                elem = elements[i];
                where = elem.querySelectorAll('.branches strong')[1];
                rev = elem.querySelectorAll('.branches strong')[0];
                link = elem.querySelectorAll(".branches a")[1].href;

                if (where) {
                    res[where.textContent] = res[where.textContent] || [];
                    res[where.textContent].push({
                        rev: parseInt(rev.textContent.split(' ')[1], 10),
                        link: link,
                        elements: {
                            where: where,
                            revision: rev
                        }
                    });
                }
            }
            _changesetsElem = res;
        }

        return _changesetsElem;
    }

    function start (preferences) {
        var output = document.createElement('div'),
            changesetsElem = getChangesetsElements();

        output.className = 'changeset changesetRecap';
        output.style.border = "1px solid #bbb";
        output.style.padding = "4px";
        output.style.background = "#ddd";
        output.style.marginTop = "8px";
        output.style.display = 'none';

        if (preferences[R.prefixPref + 'changesetsAbstract']) {
            (function () {
                var func = function (changeset) {
                    return 'r' + changeset.rev;
                };

                if (Object.size(changesetsElem) > 0) {
                    var historyElement, html, branch, changesets, where;

                    historyElement = document.getElementById('history');

                    html = '';
                    for (branch in changesetsElem) {
                        if (changesetsElem.hasOwnProperty(branch)) {
                            changesets = changesetsElem[branch].map(func);
                            where = branch.split(' ')[1];
                            html += '<div class="branches"><strong style="background:' + R.colors[where] + '">' + branch + '</strong>: ' + changesets.join(', ') + '</div>';
                        }
                    }

                    output.innerHTML = html;
                    historyElement.insertBefore(output);

                    output.style.display = '';
                }
            }());
        }

        // colorize revisions -----------------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'colorizeRevisions']) {
            (function () {
                var branch, where, changesets,
                    func = function (changeset) {
                        changeset.elements.revision.style.background = R.lightenDarkenColor(R.colors[where], -0.5);
                        changeset.elements.where.style.background = R.colors[where];
                    };

                for (branch in changesetsElem) {
                    if (changesetsElem.hasOwnProperty(branch)) {
                        changesets = changesetsElem[branch];
                        where = branch.split(' ')[1];
                        if (where && R.colors[where]) {
                            changesets.forEach(func);
                        }

                    }
                }
            }());
        }

        // auto display Update form -------------------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'autoDisplayUpdateForm']) {
            (function () {
                document.getElementById('update').style.display = '';
            }());
        }

        // hilight "review to" status change ---------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'reviewToChange']) {
            (function () {
                R.querySelectorAllIterate("div.journal", function (elem) {
                    if (elem.textContent.indexOf('Review to') > -1) {
                        elem.style.background = "#ddd";
                    }
                });
             }());
        }

        // auto change to "qa on hold when writing "review ok" in the comment field  ----------------------------------------------
        if (preferences[R.prefixPref + 'autoQAonHold']) {
            (function () {
                var notes = document.getElementById('issue_notes');
                if (notes) {
                    notes.addEventListener('keyup', function () {
                        if (this.value.match(/^review ok/)) {
                            document.getElementById('issue_status_id').value = 53; // qa_on_hold
                        }
                    });
                }
            }());
        }

        // Only show the last 6 items on the list -------------------------------------------------------------------------------------
        if (preferences[R.prefixPref + 'hideFirstEntries']) {
            (function () {
                var elem = document.querySelectorAll('.journal'),
                    hidden = true,
                    count = elem.length,
                    hiddenCount = 0,
                    displayMin = 6,

                    updateItemsVisibility = function (state, amount) {
                        R.querySelectorAllIterate('.journal', function (elem) {
                            elem.style.display = state ? 'block' : 'none';
                        }, amount);
                    },

                    updateShowHideLink = function (state, hiddenCount) {
                        var hideShowElem = document.getElementById('hideShowLink'),
                            html = '',
                            elem = document.querySelector('.journal');

                        if (!hideShowElem) {
                            hideShowElem = document.createElement('a');
                            hideShowElem.id = 'hideShowLink';
                            elem.parentNode.insertBefore(hideShowElem, elem);

                            hideShowElem.addEventListener('click', function () {
                                hidden = !hidden;
                                updateItemsVisibility(!hidden, hiddenCount);
                                updateShowHideLink(hidden, hiddenCount);
                            });
                        }

                        html = (state) ? '▶ show' : '▼ hide';
                        html += ' ' + hiddenCount + ' items';

                        hideShowElem.innerHTML = html;
                    };

                if (count - displayMin >= displayMin) {
                    hiddenCount = count - displayMin;

                    updateItemsVisibility(!hidden, hiddenCount);
                    updateShowHideLink(hidden, hiddenCount);
                }
            }());
        }

    }

    chrome.storage.local.get(null, function (prefObject) {
        start(prefObject);
    });

}(RedmineTweak));

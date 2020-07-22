$.fn.profileEntries = function(options) {
    var i18n = {};
    var entries = [];
    var API = {};
    var Notification = {};
    var mainEndpoint = "";
    var ENTRIES_PER_PAGE = 6;

    // helper function to update in number of comments to each entry
    var updateNumberOfComments = function() {
        $('[data-entry-id]').each(function() {
            var commentsNumber = $(this).find('[data-comment-id]').length;

            var $show = $(this).find(".js-comment-show.caption-element");
            var $hide = $(this).find(".js-comment-hide.caption-element");

            var showStr = $show.text().replace(/[0-9]+/g, commentsNumber);
            var hideStr = $hide.text().replace(/[0-9]+/g, commentsNumber);
            $show.html(showStr);
            $hide.html(hideStr);

            if (commentsNumber === 0) {
                $show.addClass('is-hidden');
                $hide.addClass('is-hidden');
            } else if ($show.hasClass('is-hidden') && $hide.hasClass('is-hidden')) {
                // if number of comments moved from 0 to 1 (otherwise, just leave as it was,
                // so app doesn't need to figured out if the comments listening was open or collapsed)
                $show.removeClass('is-hidden');
            }
        });
    }

    // helper function to update # of results and # of entries on top of the list
    var updateEntryNumbers = function(entries) {
        var results = entries.matchingItems.length;
        var resultsStr = $(".js-nbResults").text().replace(/[0-9]+/g, results);
        $(".js-nbResults").html(resultsStr);

        var nbEntries = entries.items.length;
        var nbEntriesStr = $(".js-nbEntries").text().replace(/[0-9]+/g, nbEntries);
        $(".js-nbEntries").html(nbEntriesStr);

        if (results <= ENTRIES_PER_PAGE) {
            $(".js-pager").hide();
        } else {
            $(".js-pager").show();
        }
    }

    var initSearchFeature = function() {
        // fuzzy search:
        $(".js-input-search-entry").on("focus blur", function(e) {
            e.preventDefault();

            $(this).closest(".search_field").toggleClass('is-focused');
        });
        $(".js-submit-entry").on("click", function(e) {
            e.preventDefault();

            var searchData = $(".js-input-search-entry").val().trim();
            entries.search(searchData);
        })
        $(".js-input-search-entry").on("keyup", function(e) {
            e.preventDefault();

            var searchData = $(this).val();
            if (e.which == 13) {
                entries.search(searchData);
                return false;
            }
            if (searchData === "") {
                entries.search(searchData);
            }
        });
    }

    var initPostEntryFeature = function() {
        $(".js-profile-post-entry").on("click", function(e) {
            e.preventDefault();

            var $container = $("#post-entry-form-modal");
            var EntryForm = $("#post-entry-form-modal").find(".js-profile-entry-form").formCtrl();
            EntryForm.clear();
            $container
                .find('button[rel="modal:submit"]')
                .off("click.post-entry")
                .on("click.post-entry", function() {
                    if (EntryForm.validate()) {
                        API.post(
                            mainEndpoint,
                            JSON.stringify(EntryForm.getData()),
                            function() {
                                Notification.success(i18n.messages.success.postEntry, true);
                            },
                            function() {
                                Notification.error(i18n.messages.error.postEntry, true);
                            }
                        );
                        $.modal.close();
                    }
                });

            $container.modal({
                fadeDuration: 100
            });
        });
    }

    var initEditEntryFeature = function() {
        $(".js-menu-edit").on("click", function(e) {
            e.preventDefault();

            var $entryContainer = $(this).closest("[data-entry-id]");
            var EntryEditForm = $entryContainer.find(".js-profile-entry-form").formCtrl();
            var $editContainer = $entryContainer.find('.js-profile-edit-entry');

            if ($editContainer.hasClass('is-hidden')) {
                $editContainer.removeClass('is-hidden');

                $editContainer
                    .find('button[rel="edit:submit"]')
                    .off("click.edit-entry")
                    .on("click.edit-entry", function(e) {
                        e.preventDefault();
                        
                        var endpoint = $entryContainer.data("endpoint");
                        if (EntryEditForm.validate()) {
                            API.put(
                                endpoint,
                                JSON.stringify(EntryEditForm.getData()),
                                function() {
                                    Notification.success(i18n.messages.success.postEntry, true);
                                },
                                function() {
                                    Notification.error(i18n.messages.error.postEntry, true);
                                }
                            );
                            $editContainer.addClass('is-hidden');
                            window.scroll({
                                top: 0,
                                behavior: "smooth"
                            });
                        }
                    });
                $editContainer
                    .find('button[rel="edit:cancel"]')
                    .off("click.edit-entry")
                    .on("click.edit-entry", function(e) {
                        e.preventDefault();

                        var titleOrigin = $entryContainer.find('.slat--content .entry-title').html().trim();
                        var commentOrigin = $entryContainer.find('.slat--content .entry-comment').html().trim();
                        $editContainer.find('input[name="title"]').val(titleOrigin);
                        $editContainer.find('textarea[name="comment"]').val(commentOrigin);
                        $editContainer.addClass('is-hidden');
                    });
            } else {
                $editContainer.addClass('is-hidden');
            }
        });
    }

    var initDeleteEntryOrCommentFeature = function() {
        // set handler on delete entry action
        $(".js-menu-delete").on("click", function(e) {
            e.preventDefault();

            var $entryContainer = $(this).closest("[data-entry-id]");
            var entryId = $entryContainer.data("entry-id");
            var $container = $("#delete-entry-confirmation");

            $container
                .find('button[rel="modal:confirm"]')
                .off("click.delete-entry")
                .on("click.delete-entry", function(e) {
                    e.preventDefault();

                    // set temporary handler on the popup's confirmation button
                    var $entryContainer = $("[data-entry-id=" + entryId + "]");
                    var endpoint = $entryContainer.data("endpoint");
                    API.delete(
                        endpoint,
                        {},
                        function() {
                            entries.remove('entry-id', entryId);
                            $entryContainer.remove();
                            updateEntryNumbers(entries);
                            Notification.success(i18n.messages.success.deleteEntry, true);
                        },
                        function() {
                            Notification.error(i18n.messages.error.deleteEntry, true);
                        }
                    );
                    $.modal.close();
                });

            $container.modal({
                fadeDuration: 100
            });
        });

        // set handler on delete comment action
        $(".js-menu-delete-comment").on("click", function(e) {
            var $commentContainer = $(this).closest("[data-comment-id]");
            var commentId = $commentContainer.data("comment-id");
            var $container = $("#delete-comment-confirmation");

            $container
                .find('button[rel="modal:confirm"]')
                .off("click.delete-comment")
                .on('click.delete-comment', function(e) {
                    e.preventDefault();

                    // set temporary handler on the popup's confirmation button
                    var $commentContainer = $("[data-comment-id=" + commentId + "]");
                    var endpoint = $commentContainer.data("endpoint");
                    API.delete(
                        endpoint,
                        {},
                        function() {
                            $commentContainer.remove();
                            updateNumberOfComments();
                            Notification.success(i18n.messages.success.deleteComment, true);
                        },
                        function() {
                            Notification.error(i18n.messages.error.deleteComment, true);
                        }
                    );
                    $.modal.close();
                });
            $container.modal({
                fadeDuration: 100
            });
        });
    }

    var initReplyToEntryFeature = function() {
        $(".js-menu-reply").on("click", function(e) {
            e.preventDefault();

            var $entryContainer = $(this).closest("[data-entry-id]");
            var EntryReplyForm = $entryContainer.find(".js-profile-entry-comment-form").formCtrl();
            var $replyContainer = $entryContainer.find('.js-profile-post-comment');

            if ($replyContainer.hasClass('is-hidden')) {
                $replyContainer.removeClass('is-hidden');

                $replyContainer
                    .find('button[rel="comment:submit"]')
                    .off("click.reply-to-entry")
                    .on("click.reply-to-entry", function(e) {
                        e.preventDefault();

                        var endpoint = $entryContainer.data("comments-endpoint");
                        if (EntryReplyForm.validate()) {
                            API.post(
                                endpoint,
                                JSON.stringify(EntryReplyForm.getData()),
                                function() {
                                    $replyContainer.find('textarea[name="comment"]').val("");
                                    Notification.success(i18n.messages.success.postComment, true);
                                },
                                function() {
                                    Notification.error(i18n.messages.error.postComment, true);
                                }
                            );

                            $replyContainer.addClass('is-hidden');
                            window.scroll({
                                top: 0,
                                behavior: "smooth"
                            });
                        }
                    });
                $replyContainer
                    .find('button[rel="comment:cancel"]')
                    .off("click.cancel-reply-entry")
                    .on("click.cancel-reply-entry", function(e) {
                        e.preventDefault();

                        $replyContainer.find('textarea[name="comment"]').val("");
                        $replyContainer.addClass('is-hidden');
                    });
            } else {
                $replyContainer.addClass('is-hidden');
            }
        });
    }

    var mapEntries = function() {
        // define options, entry-id is considered as unique id when application is removing item
        var entryListOptions = {
            valueNames: [  { data: ['entry-id'] }, "entry-title", "entry-comment"] 
        }
        if ($(".js-slat").length > ENTRIES_PER_PAGE) {
            entryListOptions.page = ENTRIES_PER_PAGE;
            entryListOptions.pagination = {
                left: 1,
                right: 1,
                innerWindow: 1
            };
        }
        entries = new List("customer-entries-container", entryListOptions);
        // update numbers when search complete
        entries.on("searchComplete", updateEntryNumbers);
        // update arrows behaviour
        entries.on('updated', function() {
            setTimeout( function() { $(".js-pager").paginationArrows('update'); }, 0 );
        })
    }

    var init = function() {
        i18n = !!options && !!options.i18n ? JSON.parse($('<textarea />').html(options.i18n).text()) : {};
        mainEndpoint = !!options && !!options.endpoint ? options.endpoint : "";

        API = new ActionAPI();
        Notification = $(".js-notification").notificationCtrl();

        initPostEntryFeature();

        if ($(".js-slat").length >= 1) {
            initSearchFeature();
            initEditEntryFeature();
            initDeleteEntryOrCommentFeature();
            initReplyToEntryFeature();
            mapEntries();
            $(".js-pager").paginationArrows();
            $(".js-entry-container").enableComments();
        }
    }
    init();
}

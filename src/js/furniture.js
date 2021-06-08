$(document).ready(function() {
    // injecting current year into footer
    // DO NOT DELETE

    var d = new Date();
    var year = d.getFullYear();

    $('.copyright').text(year);


    // some code blocks require javascript to function, like slideshows, synopsis blocks, etc
    // you can find that code here: https://github.com/DallasMorningNews/generator-dmninteractives/wiki/Cookbook

    // closes any header dropdown menus and resets the up/down chevron
    function closeList() {
        $(".open-list").removeClass("open-list");
        $(".open-button").removeClass("open-button");
    }

    var $hedButton = $(".header-group button");

    // clicking any of the header dropdown menu buttons (i.e. "topics", or "my account")
    $hedButton.click(function(e) {

        // if the button that is clicked is already open, close the menu, else, close the
        // menu then open the selected menu
        if ($hedButton.hasClass("open-button") === true && $(this).hasClass("open-button") === true) {
            closeList();
        } else {
            closeList();
            $(this).addClass("open-button");
            $(this).siblings("ul").addClass("open-list");
        }
        e.stopPropagation();
    });

    // clicking anywhere in the body should close any open menus
    $("body").click(function() {
        closeList();
    });

    // if the user is signed in, add the subscribed class to the body, which will reveal
    // the proper my account menu items.
    if (document.cookie.indexOf("DMN-P") >= 0) {
        $("body").addClass("subscribed");
    } else {
        $("body").removeClass("subscribed");
    }
})

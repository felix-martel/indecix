var data = {
    "khotes": [
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "ceci est un test je crois", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "encore un test à mon avis", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "tiens mais hello world lol", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "voici un test, le numéro 10", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "ceci est un test je crois", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "encore un test à mon avis", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "tiens mais hello world lol", "up-number": 76, "down-number": 37, "fav-number": 8},
    {"khote_id": 1, "khoteur": "F**ix M*rt*l", "khote": "voici un test, le numéro 10", "up-number": 76, "down-number": 37, "fav-number": 8}
]}
;
console.log("init ok");
/*$('#container').bind('swipeleft', goLeft);
$('#container').bind('swiperight', goRight);*/

/*window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);*/

function goLeft() {
    if ($('menu-item-top').hasClass('active')) {
        window.open('#all', '_self');
    }
    else if ($('menu-item-fav').hasClass('active')) {
        window.open('#top', '_self');
    }
}

function goRight() {}

$(".menu-item-a").click(function() {
    console.log("active nav link ok");
    $('.menu-item-a').removeClass("active");
    $(this).addClass("active");
});

serverURL = '';

$(window).on('hashchange', route);
function route() {
    var page, hash = window.location.hash;
    console.log(hash);
    switch (hash) {
        /*case '#all':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                page = Mustache.render(template, data);
                $('#container').html(page);
            }, 'html');
            break;*/
        case '#all':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?filter=all", 
                    function(data) {
                    page = Mustache.render(template, data);
                    $('#container').html(page);
                });
            }, 'html');
            break;


        case '#top':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                page = Mustache.render(template, data);
                $('#container').html(page);
            }, 'html');
            break;

        case '#fav':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                page = Mustache.render(template, data);
                $('#container').html(page);
            }, 'html');
            break;

        case '#new':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#writing-page-tpl').html();
                page = Mustache.render(template, {});
                $('#container').html(page);
            }, 'html');
            break;

        case '#login':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#login-page-tpl').html();
                page = Mustache.render(template, {});
                $('#container').html(page);
            }, 'html');
            break;

        default:
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                page = Mustache.render(template, data);
                $('#container').html(page);
            }, 'html');
            break;
    }
}
$(window).on('hashchange', route);
route();
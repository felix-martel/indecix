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

$('.menu-item').click(function() {
    $('.menu-item').removeClass("active");
    $(this).addClass("active");
});

function route() {
    var page, hash = window.location.hash;
    console.log(hash);
    switch (hash) {
        case '#all':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                page = Mustache.render(template, data);
                $('#container').html(page);
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

        default:
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                page = Mustache.render(template, data);
                $('#container').html(page);
            }, 'html');
            break;
    }
}
route();
$('#container').bind('swipeleft', goLeft);
$('#container').bind('swiperight', goRight);

var current_page = 1; // 1 : ALL, 2 : TOP, 3 : FAV
var page_href = ['#login', '#all', '#top', '#fav', '#settings', '#new'];
var nb_pages = 3;

window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

function goLeft() {
    var current_page = (current_page + 1) % nb_pages;
    window.location = "index.html" + page_href[current_page];
    /*
    if ($('menu-item-top').hasClass('active')) {
        window.open('#all', '_self');
    }
    else if ($('menu-item-fav').hasClass('active')) {
        window.open('#top', '_self');
    }*/
}

function goRight() {}

function activateTitles(e){
    console.log("Activation...");
    $('.menu-item-a').removeClass("active");
    $(e).addClass("active");
}
/*
$(".menu-item-a").click(function() {
    console.log("active nav link ok");
    $('.menu-item-a').removeClass("active");
    $(this).addClass("active");
});*/

serverURL = '';


function login() {
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    console.log("Envoi des données...");
    $.post(serverURL + 'login.php', {username: username, password: password}, 
        function(messageJson) {
            console.log('lecture json');
            var messageAffiche = "";
            for (var i=0; i < messageJson.length; i++) {
                if (messageJson[i].session_id) {
                    sessionStorage['session_id'] = messageJson[i].session_id;
                    console.log('session id =' + sessionStorage['session_id']);
                }
                if (messageJson[i].error) {
                    messageAffiche = "Error : " + messageJson[i].error;
                    alert(messageAffiche);
                }
                else if (messageJson[i].success) {
                    console.log("Bienvenue");
                    window.location.replace("index.html");
                }
            }
        });
    window.location.replace("index.html#all");
}

function add_khote() {
    var new_khoteur = $("input[name='khoteur']").val();
    var new_khote = $("textarea[name='khote']").val();
    console.log(new_khoteur);
    console.log(new_khote);
    $.post(
        "add.php",
        {MODAL : sessionStorage['session_id'], khoteur : new_khoteur, khote: new_khote},
        function(data) {
        }
    );
    console.log("OK c'est parti");
    window.location.replace("index.html#all");
}

$(window).on('hashchange', route);
function route() {
    var page, hash = window.location.hash;
    console.log(hash);
    switch (hash) {
        case '#all':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL="+sessionStorage['session_id']+"&filter=all", 
                    function(data) {
                    page = Mustache.render(template, data);
                    $('#container').html(page);
                });
            }, 'html');
            break;

        case '#top':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL="+sessionStorage['session_id']+"&filter=top", 
                    function(data) {
                    page = Mustache.render(template, data);
                    $('#container').html(page);
                });
            }, 'html');
            break;

        case '#fav':
            $.get('js/template.html', function(templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL="+sessionStorage['session_id']+"&filter=fav", 
                    function(data) {
                    page = Mustache.render(template, data);
                    $('#container').html(page);
                });
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
                $.getJSON(serverURL + "get.php?MODAL="+sessionStorage['session_id']+"&filter=all", 
                    function(data) {
                    console.log("get OK");
                    page = Mustache.render(template, data);
                    $('#container').html(page);
                });
            }, 'html');
            break;
    }
}
$(window).on('hashchange', route);
route();
// Activation FastClick = réduit la latence sur mobile
window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

// --- Navigation tactile par swipe gauche et droit --- \\

var current_page = 0; // 1 : ALL, 2 : TOP, 3 : FAV
var page_href = ['#all', '#top', '#fav'];
var nb_pages = 3;
function setCurrentPage(n) {
    if (n >= 0 && n < nb_pages) {
        current_page = n;
        console.log("New current page = {id : " + current_page + ", href : " + page_href[n] +"}");
        n = n + 1;
        var active_element = ".menu-item:nth-of-type(" + n + ")";
        console.log(active_element);
        //$(".menu-item").removeClass("active");
        $(active_element).addClass("active");
    }
}
function goLeft() {
    console.log("Going left...");
    setCurrentPage((current_page + 2) % nb_pages);
    window.location = "index.html" + page_href[current_page];
}

function goRight() {
    console.log("Going right...");
    setCurrentPage((current_page + 1) % nb_pages);
    window.location = "index.html" + page_href[current_page];
}
$('body').keydown(function (event) {
    var right_arrow = 39;
    var left_arrow = 37;
    if (event.which == right_arrow) {
        goRight();
    }
    else if (event.which == left_arrow) {
        goLeft();
    }
});
$('#container').bind('swipeleft', goLeft);
$('#container').bind('swiperight', goRight);

serverURL = '';
//serverURL = 'http://perone.polytechnique.fr/~vivien.dahan/';

function login() {
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    console.log("Logging in...");
    $.post(serverURL + 'login.php', {username: username, password: password},
            function (messageJson) {
                console.log('Login : réception JSON');
                var messageAffiche = "";
                for (var i = 0; i < messageJson.length; i++) {
                    if (messageJson[i].session_id) {
                        sessionStorage['session_id'] = messageJson[i].session_id;
                        console.log('Login : session id =' + sessionStorage['session_id']);
                    }
                    if (messageJson[i].status) {
                        if (messageJson[i].status == 'success') {
                            console.log("Logging in successful");
                            window.location.replace("index.html#all");
                        }
                        else {
                            // Affichage d'un message d'avertissement
                            var error = messageJson[i];
                            $('#alert-message').html(error.detail);
                            $('#alert-message').show(400);
                            // Réinitialisation du formulaire
                            $("input[name='username']").val("");
                            $("input[name='password']").val("");
                        }
                    } 
                    /*else if (messageJson[i].success) {
                        console.log("Logging in successful");
                        window.location.replace("index.html#all");
                    }*/
                }
            });
    //window.location.replace("index.html#all");
}

function add_khote() {
    var new_khoteur = $("input[name='khoteur']").val();
    var new_khote = $("textarea[name='khote']").val();
    console.log("New khoteur : " + new_khoteur);
    console.log("New khote : " + new_khote);
    $.post(
            serverURL + "add.php",
            {MODAL: sessionStorage['session_id'], khoteur: new_khoteur, khote: new_khote},
            function (data) {
            }
    );
    console.log("New khote sent");
    window.location.replace("index.html#all");
}

function action(action, id) {
    $.post(
            serverURL + "action.php",
            {MODAL: sessionStorage['session_id'], action: action, id: id},
            function (data) {
                window.location.reload();
            }
    );
    //alert("Action effectuée !");  //Le alert a l'utilité d'éviter d'actualiser la page avant la fin du POST, sinon celui-ci échoue !
    //window.location.reload();
}

$(window).on('hashchange', route);
function route() {
    var page, hash = window.location.hash;
    //console.log(hash);
    switch (hash) {
        case '#all':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL=" + sessionStorage['session_id'] + "&filter=all",
                        function (data) {
                            if (data === "not_logged_in") {
                                window.location.replace("index.html#login");
                            }
                            page = Mustache.render(template, data);
                            $('#container').html(page);
                            setCurrentPage(0);
                        });
            }, 'html');
            setCurrentPage(0);
            break;

        case '#top':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL=" + sessionStorage['session_id'] + "&filter=top",
                        function (data) {
                            if (data === "not_logged_in") {
                                window.location.replace("index.html#login");
                            }
                            page = Mustache.render(template, data);
                            $('#container').html(page);
                            setCurrentPage(1);
                        });
            }, 'html');
            break;

        case '#fav':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL=" + sessionStorage['session_id'] + "&filter=fav",
                        function (data) {
                            if (data === "not_logged_in") {
                                window.location.replace("index.html#login");
                            }
                            page = Mustache.render(template, data);
                            $('#container').html(page);
                            setCurrentPage(2);
                        });
            }, 'html');
            break;

        case '#new':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#writing-page-tpl').html();
                page = Mustache.render(template, {});
                $('#container').html(page);
            }, 'html');
            break;

        case '#login':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#login-page-tpl').html();
                page = Mustache.render(template, {});
                $('#container').html(page);
            }, 'html');
            break;

        case '#logout':
            $.get(serverURL + 'logout.php?MODAL=' + sessionStorage['session_id'], function(){
                console.log("Logging out...");
            }, 'html');
            delete sessionStorage['session_id'];
            window.location.replace(serverURL + 'index.html#login');
            break;


        default:
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#main-tpl').html();
                $.getJSON(serverURL + "get.php?MODAL=" + sessionStorage['session_id'] + "&filter=all",
                        function (data) {
                            if (data === "not_logged_in") {
                                window.location.replace("index.html#login");
                            }
                            page = Mustache.render(template, data);
                            $('#container').html(page);
                        });
            }, 'html');
            break;
    }
}
$(window).on('hashchange', route);
route();
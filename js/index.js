// -- Activation FastClick
// réduit la latence sur mobile
window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);



/////////////////////////////
// NAVIGATION TACTILE -------
/////////////////////////////


var current_page = 0; // 1 : ALL, 2 : TOP, 3 : FAV
var page_href = ['#all', '#top', '#fav'];
var nb_pages = 3;

function setCurrentPage(n) {
    if (n >= 0 && n < nb_pages) {
        current_page = n;
        console.log("New current page = {id : " + current_page + ", href : " + page_href[n] + "}");
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

// -- Navigation au clavier
$('body').keydown(function (event) {
    var right_arrow = 39;
    var left_arrow = 37;
    if (event.which === right_arrow) {
        goRight();
    } else if (event.which === left_arrow) {
        goLeft();
    }
});

// -- Navigation tactile
$('body').swipe({
    swipeLeft:goRight,
    swipeRight: goLeft 
});
// Navigation tactile
$('#container').bind('swipeleft', goLeft);
$('#container').bind('swiperight', goRight);

//serverURL = '';
serverURL = 'http://s621682634.onlinehome.fr/';

/////////////////////////////
// GESTION DES THEMES -------
/////////////////////////////


// Non-implémenté dans l'interface
var themes = {
    'purple': '#673AB7',
    'red': '#820013',
    'blue': '#2D1D82',
    'blue_green': '#15825A',
    'green': '#208214',
    'taupe': '#705E44',
    'burgundy': '#702D34',
    'alt_purple': '#4C1070',
    'yellow': '#D6D03A',
    'default': '#673AB7'
};

function changeColor(color){
    $('body').css('background-color', color);
    $('.main-menu').css('background-color', color);
    $('.search-bar').css('background-color', color);
}

function setTheme(name) {
    changeColor(themes[name]);
}


/////////////////////////////
// GESTION DES UTILISATEURS--
/////////////////////////////


function login() {
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    console.log("Logging in...");
    $.post(serverURL + 'login.php', {username: username, password: password},
            function (messageJson) {
                console.log('Login : réception JSON');
                for (var i = 0; i < messageJson.length; i++) {
                    if (messageJson[i].session_id) {
                        // Enregistrement de l'id de session dans le sessionStorage
                        sessionStorage['session_id'] = messageJson[i].session_id;
                        console.log('Login : session id =' + sessionStorage['session_id']);
                    }
                    if (messageJson[i].email && messageJson[i].username) {
                        sessionStorage['username'] = messageJson[i].username;
                        sessionStorage['email'] = messageJson[i].email;
                    }
                    if (messageJson[i].status) {
                        if (messageJson[i].status === 'success') {
                            // -- Succès --

                            console.log("Logging in successful");
                            window.location.replace("index.html#all");
                        } else {
                            // -- Echec --

                            // Affichage d'un message d'avertissement
                            var error = messageJson[i];
                            $('#alert-message').html(error.detail);
                            $('#alert-message').show(400);
                            // Réinitialisation du formulaire
                            $("input[name='username']").val("");
                            $("input[name='password']").val("");
                        }
                    }
                }
            });
    //window.location.replace("index.html#all");
}

function signup() {
    // Constantes
    var EMAIL_PATTERN = /polytechnique\.edu$/;
    var ALERT_DURATION = 400;
    var ALERT_MESSAGE = $("#alert-message");
    // Récupération des entrées
    var username = $("input[name='username']").val();
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();
    var confirm_password = $("input[name='confirm_password']").val();
    // -- Vérification des entrées --
    // Les deux mots de passe coïncident
    if (password !== confirm_password) {
        ALERT_MESSAGE.html("The two passwords are different");
        ALERT_MESSAGE.show(ALERT_DURATION);
        return false;
    }
    // Le mot de passe fait au moins 5 caractères
    if (password.length < 6) {
        ALERT_MESSAGE.html("Your password must be at least six characters long");
        ALERT_MESSAGE.show(ALERT_DURATION);
        return false;
    }
    // Le nom de domaine de l'adresse mail est x.edu
    if (!EMAIL_PATTERN.test(email)) {
        ALERT_MESSAGE.html("You must register with your polytechnique.edu email address");
        ALERT_MESSAGE.show(ALERT_DURATION);
        return false;
    }
    // Création d'un nouvel user
    console.log("Signing up...");
    $.post(serverURL + 'signup.php', {username: username, email: email, password: password},
            function (messageJson) {
                console.log('Signup : réception JSON');
                for (var i = 0; i < messageJson.length; i++) {
                    if (messageJson[i].status) {
                        if (messageJson[i].status === 'success') {
                            // -- Succès --

                            console.log("Logging in successful");
                            window.location.replace("index.html#login");
                            $("#header-message").html("Your account have been successfully created ! We've sent you an activation link by email. Please click on it to access the app");
                            $("#header-message").show(400);
                        } else {
                            // -- Echec --

                            // Affichage d'un message d'avertissement
                            var error = messageJson[i];
                            ALERT_MESSAGE.html(error.detail);
                            ALERT_MESSAGE.show(ALERT_DURATION);
                            // Réinitialisation du formulaire
                            $("input[name='username']").val("");
                            $("input[name='password']").val("");
                            $("input[name='email']").val("");
                            $("input[name='confirm-password']").val("");
                        }
                    }
                }
            });
}

function changePassword() {
    //Constantes
    var ALERT_DURATION = 400;
    var ALERT_MESSAGE = $("#alert-message");
    //Entrées
    var old_pass = $("input[name='old-password']").val();
    var new_pass = $("input[name='new-password']").val();
    var confirm_pass = $("input[name='confirm-password']").val();
    //Vérification de la coïncidence des mots de passe
    if (new_pass === confirm_pass) {
        if (new_pass.length > 5) {
            console.log("Changing password...");
            $.post(serverURL + 'user_config.php', {MODAL: sessionStorage['session_id'], pass: old_pass, new_pass: new_pass},
                    function (messageJson) {
                        console.log('Password change : réception JSON');
                        for (var i = 0; i < messageJson.length; i++) {
                            if (messageJson[i].status) {
                                if (messageJson[i].status === 'success') {
                                    // -- Succès --

                                    console.log("Password changed successfully");
                                    ALERT_MESSAGE.html("Your password has been successfully changed !");
                                    ALERT_MESSAGE.show(ALERT_DURATION);
                                } else {
                                    // -- Echec --

                                    // Affichage d'un message d'avertissement
                                    var error = messageJson[i];
                                    ALERT_MESSAGE.html(error.detail);
                                    ALERT_MESSAGE.show(ALERT_DURATION);
                                    // Réinitialisation du formulaire
                                    $("input[name='old-password']").val("");
                                    $("input[name='new-password']").val("");
                                    $("input[name='confirm-password']").val("");
                                }
                            }
                        }
                    });
        } else {
            ALERT_MESSAGE.html("The new password must be at least 6 characters long");
            ALERT_MESSAGE.show(ALERT_DURATION);
        }
    } else {
        ALERT_MESSAGE.html("The two passwords are different");
        ALERT_MESSAGE.show(ALERT_DURATION);
    }
    $(".changing-password").show();
    $(".settings-buttons").hide();
}

function cancelPasswordChange(){
    $(".changing-password input").val("");
    $(".changing-password").hide();
    $(".settings-buttons").show();
}


/////////////////////////////
// RECHERCHE ----------------
/////////////////////////////


function search() {
    var query = $('#search').val();
    $.get('js/template.html', function (templates) {
        var template = $(templates).filter('#search-tpl').html();
        $.getJSON(serverURL + "get.php?MODAL=" + sessionStorage['session_id'] + "&filter=search&q=" + query,
                function (data) {
                    if (data === "not_logged_in") {
                        window.location.replace("index.html#login");
                    }
                    page = Mustache.render(template, data);
                    $('#container').html(page);
                    console.log(data.length);
                    if (data.length === 0) {
                        console.log('displaying alert message');
                        $('#alert-message').html("no result bro :(");
                        $('#alert-message').show();
                    } else {
                        $('#search-list').show();
                    }
                });
    }, 'html');
}

function triggerSearch(event) {
    if (event.which === 13) { // On presse 'Entrée'
        search();
    }
}


/////////////////////////////
// GESTION DES KHÔTES -------
/////////////////////////////


function addKhote() {
    var new_khoteur = $("input[name='khoteur']").val();
    var new_khote = $("textarea[name='khote']").val();
    console.log("New khoteur : " + new_khoteur);
    console.log("New khote : " + new_khote);
    $.post(
            serverURL + "add.php",
            {MODAL: sessionStorage['session_id'], khoteur: new_khoteur, khote: new_khote},
            function (data) {
                console.log("New khote sent");
                window.location.replace("index.html#all");
            }
    );
}

$('#khote').keydown(function (event){
    if (event.which === 13) {
        addKhote();
    }
});

function action(action, id) {
    $.post(
            serverURL + "action.php",
            {MODAL: sessionStorage['session_id'], action: action, id: id},
            function (data) {
                //window.location.reload();
            }
    );
    var parent = '#khote-' + id + ' .' + action + '-number';
    var child = '#khote-' + id + ' .' + action + '-number span';
    console.log(action);
    var number = parseInt($(child).html());
    if ($(parent).hasClass('is-set-1')) {
        // L'utilisateur a déjà actionné ce bouton, le clic annule donc cette action
        $(child).html(number - 1);
        $(parent).removeClass('is-set-1');
        $(parent).addClass('is-set-0');
    } else {
        $(child).html(number + 1);
        $(parent).addClass('is-set-1');
        $(parent).removeClass('is-set-0');

    }
}


/////////////////////////////
// ROUTING ------------------
/////////////////////////////


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

        case '#search':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#search-tpl').html();
                page = Mustache.render(template, {});
                $('#container').html(page);
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

        case '#signup':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#signup-page-tpl').html();
                page = Mustache.render(template, {});
                $('#container').html(page);
            }, 'html');
            break;

        case '#settings':
            $.get('js/template.html', function (templates) {
                var template = $(templates).filter('#settings-tpl').html();
                page = Mustache.render(template, {'username': sessionStorage['username'], 'email': sessionStorage['email']});
                $('#container').html(page);
            }, 'html');
            break;

        case '#logout':
            $.get(serverURL + 'logout.php?MODAL=' + sessionStorage['session_id'], function () {
                console.log("Logging out...");
            }, 'html');
            delete sessionStorage['session_id'];
            window.location.replace('index.html#login');
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
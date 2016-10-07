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


function login() {
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();
    alert("Envoi des données");
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

function login2() {
    $.ajax({
      type:    "POST",
      url:     "/"+contentId+"/postComment",
      data:    {"postComment":""},
      success: function(data) {
            alert('call back');
      },
      // vvv---- This is the new bit
      error:   function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                  "error thrown: " + errorThrown
            );
      }
    });
}

function add_khote() {
    var khoteur = $("input[name='khoteur']").val();
    var khote = $("input[name='khote']").val();
    $.post(serverURL + 'add.php', {khoteur: khoteur, khote: khote});
}

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
                $.getJSON(serverURL + "get.php?MODAL="+sessionStorage['session_id']+"&filter=all", 
                    function(data) {
                    console.log("get OK");
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
                    console.log("get OK");
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
                    console.log("get OK");
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
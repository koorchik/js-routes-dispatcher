### Javascript Routes Dispatcher
Minimalistic routes dispatcher that supports everything you need to build a js application.

    // Routes definition
    var ROUTES = [
        {
            pattern: '/user/:user_id/message/:message_id',
            name: 'messages_show',
            cb: function(captures) { console.log( captures.user_id, captures.message_id, captures.route ); }
        },
        {
            pattern: '/user/:user_id',
            name: 'users_profile',
            cb: function(captures) { console.log( captures.user_id, captures.route ); }
        }
    ];


    // Pre dispatch call
    function pre_dispatch(captures) {
        $('#main_content').empty();
    }

    // Post dispatch call
    function post_dispatch(captures) {
        var route_name = captures.route.name;
        highlight_menu_item(route_name);
    }

    var dispatcher = new RoutesDispatcher(ROUTES, pre_dispatch, post_dispatch);

    dispatcher.start(); // Starts tracking url changes

    var url = dispatcher.url_for('messages_show', {user_id: 1, message_id: 12} ); // Make url for route

    dispatcher.redirect_to('messages_show', {user_id: 1, message_id: 12} ); // Redirect to route


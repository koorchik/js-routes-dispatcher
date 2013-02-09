"use strict";

function RoutesDispatcher(routes, precall, postcall) {
    this.routes = routes; 
    this.precall = precall;
    this.postcall = postcall;
    
    this.redirect_to = function ( route, captures ) {
        window.location.hash = this.url_for(route, captures);
    };
    
    this.start = function() {
        var dispatcher = this;
        $(window).bind('hashchange', function() {
            dispatcher._dispatch();    
        }).trigger('hashchange');
    };

    this.url_for = function (route_name, captures) {
        // Find pattern
        var pattern;
        for (var i = 0; i < this.routes.length; i++ ) {
            if ( route_name == this.routes[i].name ) {
                pattern = this.routes[i].pattern;
                break;
            }
        }

        if(!pattern) return route_name;
  
        // Fill placeholders with values
        if (!captures) captures = {};
        
        _.each(captures, function(val, prop_name){
            var re = new RegExp('[:*]' + prop_name, 'g');
            pattern = pattern.replace(re, captures[prop_name]);
        });

        
        // Clean not replaces placeholders
        pattern = pattern.replace(/[:*][^/.]+/g, '');
        
        return '#' + pattern;
    };
    
    this.match = function (location_hash) {
        var location = location_hash.replace(/^#/, '');

        var captures = {};
        var route;
        for (var route_idx = 0; route_idx < this.routes.length; route_idx++ ) {
            var pattern = this.routes[route_idx].pattern.replace(/:\w+/g, '([^\/]+)');
            var re = new RegExp('^' + pattern + '$');
            var matched = location.match(re);
            if ( matched ) {
                // Find capture names
                var captures_names = [];
                var captures_re = /:(\w+)/g;
                var found;
                while ((found = captures_re.exec(this.routes[route_idx].pattern)) !== null) {
                    captures_names.push(found[1]);
                  
                }
                
                // Collect found captures 
                for (var cn_idx = 0; cn_idx < captures_names.length; cn_idx++) {
                    captures[captures_names[cn_idx]] = matched[cn_idx+1]; 
                } 

                // Take route
                route = this.routes[route_idx];

                break;
            }
        }
        if (route) {
            captures.route = route;
            return captures; 
        } else {
            return;
        }
    };
    
    this._dispatch = function () {
        var captures = this.match(window.location.hash);
        if ( captures ) {
            var route = captures.route;
            
            if ( $.isFunction( this.precall ) ) {
               this.precall(captures);
            }
            
            if ( $.isFunction( route.cb ) ) {
               route.cb(captures);
            }
            
            if ( $.isFunction( this.postcall ) ) {
               this.postcall(captures);
            }
        }
    };
}

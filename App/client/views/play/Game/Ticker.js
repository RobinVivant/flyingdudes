
(function(){
    var lastTime = 0
        ,active = false
        ,listeners = [],
        _context = this,
        dt = 1000/60
        ;

    /**
     * Publish a tick to subscribed callbacks
     * @private
     * @param {Number} time The current time
     * @return {void}
     */
    function step( time ){

        var fns = listeners;

        if (!active){
            return;
        }

        window.setTimeout( step, _dt );

        for ( var i = 0, l = fns.length; i < l; ++i ){

            fns[ i ].call(_context, time, time - lastTime );
        }

        lastTime = time;
    }

    /**
     * Start the ticker
     * @return {this}
     */
    function start(context,dt){
        _dt = dt;
        _context = context;
        lastTime = (new Date()).getTime();
        active = true;
        step();
    }

    /**
     * Stop the ticker
     * @return {this}
     */
    function stop(){

        active = false;
        //listeners = [];
    }

    /**
     * Subscribe a callback to the ticker
     * @param {Function} listener The callback function
     * @return {this}
     */
    function subscribe( listener ){

        // if function and not already in listeners...
        if ( typeof listener === 'function' ){

            for ( var i = 0, l = listeners.length; i < l; ++i ){

                if (listener === listeners[ i ]){
                    return;
                }
            }

            // add it
            listeners.push( listener );
        }
    }

    /**
     * Unsubscribe a callback from the ticker
     * @param {Function} listener Original callback added
     * @return {this}
     */
    function unsubscribe( listener ){

        var fns = listeners;

        for ( var i = 0, l = fns.length; i < l; ++i ){

            if ( fns[ i ] === listener ){

                // remove it
                fns.splice( i, 1 );
                return;
            }
        }
    }

    /**
     * Determine if ticker is currently running
     * @return {Boolean} True if running
     */
    function isActive(){
        return !!active;
    }

    // API
    ticker = {
        start: start,
        stop: stop,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        isActive: isActive
    };
})();

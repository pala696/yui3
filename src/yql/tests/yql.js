YUI({
    base: '../../../build/',
    //filter: 'DEBUG',
    filter: 'RAW',
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true,
        useConsole: true
    }
}).use('yql', 'console', 'test', 'substitute', 'selector-css3', function(Y) {
        var myConsole = new Y.Console({
            height: Y.one(window).get('winHeight') + 'px',
            width: '375px'
        }).render();    
            

    var template = {
        name: 'YQL Test',
        setUp : function() {
        },
        
        tearDown : function() {
        },
        test_load: function() {
            Y.Assert.isFunction(Y.YQL);
            Y.Assert.isFunction(Y.YQLRequest);
        },
        test_query: function() {
            var wait = function() {
                Y.YQL('select * from weather.forecast where location=62896', function(r) {
                    Y.Assert.isObject(r);
                    Y.Assert.isObject(r.query);
                    Y.Assert.areEqual(1, r.query.count);
                });
            };
            this.wait(wait, 1500);
        },
        test_failed: function() {
            var wait = function() {
                Y.YQL('select * from weatherFOO.forecast where location=62896', function(r) {
                    Y.Assert.isObject(r);
                    Y.Assert.isObject(r.error);
                });
            };
            this.wait(wait, 1500);
        }
    };
    var suite = new Y.Test.Suite("YQL");
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);
    Y.Test.Runner.run();
});


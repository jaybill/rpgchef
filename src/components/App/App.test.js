var TestUtils = require('react/lib/ReactTestUtils');
var rewire = require('rewire');
var rewireModule = require('../../../test/helpers/rewire-module.js');
var TestRoot = require('../../../test/helpers/test-root.js');
var dump = require('../../../test/helpers/util.js').dump;
var React = require('react');
var stateTree = require('../../lib/StateTree');
var emptyTree = require('../../lib/StateTree').emptyTree;
var baobabMixins = require('baobab-react/mixins');
var Baobab = require('baobab');
var Promise = require('es6-promise').Promise;

var fakeRouteHandler = require('../../../test/helpers/fakeRouteHandler');


describe("App (component)", function() {

    var App = rewire("./App.js");

    // Stub RouteHandler so it won't render
    rewireModule(App,fakeRouteHandler());

    beforeEach(function() {

    });

    // This is just a silly example function that returns a promise.
    var pv = function(){
        return new Promise(function(resolve,reject){
            resolve("HAI");
        });
    }

    // Here's how to test things that return promises, like DAOs:
    it("resolves a promise",function(done){
        pv().then(function(result){
            expect(result).toEqual("HAI");
            done();
        });
    });



    it("renders", function() {
        var tree = new Baobab(emptyTree, {asynchronous: false});

        var component = TestUtils.renderIntoDocument(
            React.createElement(TestRoot,{tree: tree, component:App})
        );
        var foundComponent = TestUtils.findRenderedDOMComponentWithClass(component, 'App');
        expect(foundComponent).toBeDefined();
    });

    it("does not render contents if cookies aren't loaded", function() {
        var tree = new Baobab(emptyTree, {asynchronous: false});
        var component = TestUtils.renderIntoDocument(
            React.createElement(TestRoot,{tree: tree, component:App})
        );
        var foundComponent = TestUtils.scryRenderedDOMComponentsWithClass(component, 'FakeRouteHandler');
        expect(foundComponent.length).toBe(0);
    });

    it("does render contents if cookies are loaded", function() {
        var tree = new Baobab(emptyTree, {asynchronous: false});
        tree.set(['cookiesLoaded'],true);
        var component = TestUtils.renderIntoDocument(
            React.createElement(TestRoot,{tree: tree, component:App})
        );
        var foundComponent = TestUtils.scryRenderedDOMComponentsWithClass(component, 'FakeRouteHandler');
        expect(foundComponent.length).toBe(1);
    });

    it("throws an error if the cookiesLoaded cursor is missing from the tree", function() {
        var tree = new Baobab({auth:{loggedIn:null}}, {asynchronous: false});
        var attempt = function(){
            var component = TestUtils.renderIntoDocument(
                React.createElement(TestRoot,{tree: tree, component:App})
            );
        }
        expect(attempt).toThrowError("Cursor 'cookiesLoaded' points to a leaf in the state tree that is not defined.");
    });

});

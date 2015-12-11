var TestUtils = require('react/lib/ReactTestUtils');
var rewire = require('rewire');
var rewireModule = require('../../../test/helpers/rewire-module.js');
var fakeRouteHandler = require('../../../test/helpers/fakeRouteHandler');
var TestRoot = require('../../../test/helpers/test-root.js');
var dump = require('../../../test/helpers/util.js').dump;
var React = require('react');
var stateTree = require('../../lib/StateTree');
var emptyTree = require('../../lib/StateTree').emptyTree;
var baobabMixins = require('baobab-react/mixins');
var CursorMixin = require('../../lib/CursorMixin');
var Baobab = require('baobab');

describe("Welcome (component)", function() {

    // Get a rewire instance of the Welcome component
    var WelcomeC = rewire("./Welcome");
    // Replace AuthMixin with CursorMixin so we don't have to actually log in
    var WelcomeDef = WelcomeC.componentDef;
    WelcomeDef.mixins = [CursorMixin];

    // Stub RouteHandler
    rewireModule(WelcomeC,fakeRouteHandler());
    var Welcome = React.createClass(WelcomeDef);

    it("renders", function() {
        var tree = new Baobab(emptyTree, {asynchronous: false});

        var component = TestUtils.renderIntoDocument(
            React.createElement(TestRoot, {tree: tree, component: Welcome})
        );
        var foundComponent = TestUtils.findRenderedDOMComponentWithClass(component, 'Welcome');
        expect(foundComponent).toBeDefined();


    });

    it("throws an error if the loggedIn cursor is missing from the tree", function() {
        var tree = new Baobab(emptyTree, {asynchronous: false});
        tree.unset(['auth','loggedIn']);

        var attempt = function() {
            var component = TestUtils.renderIntoDocument(
                React.createElement(TestRoot, {tree: tree, component: Welcome})
            );
        }

        expect(attempt).toThrowError("Cursor 'loggedIn' points to a leaf in the state tree that is not defined.");
    });
});

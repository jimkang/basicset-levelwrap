var assert = require('assert');
// var _ = require('underscore');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var uid = require('./uid').uid;
//createLevelWrap('test.db');


/* Utils */

var utils = {};

utils.optionsAreValid = function optionsAreValid(options, expectedTypes) {
  if (!options) {
    options = {};
  }
  return _.every(expectedTypes, function optionIsValid(expectedType, key) {
    var valid = false;
    var value = options[key];
    return (typeof value === expectedType);
  });
};

/* Settings */

var settings = {
  redShyguyObject: {
    name: 'Red Shyguy',
    hp: 1,
    shouldTurnAwayFromCliffs: false
  },
  pinkShyguyObject: {
    name: 'Pink Shyguy',
    hp: 1,
    shouldTurnAwayFromCliffs: true
  },
  birdoObject: {
    name: 'Birdo',
    hp: 3,
    shouldTurnAwayFromCliffs: true,
    treasures: [
      {
        name: 'Crystal Ball',
        opensBirdHead: true
      }
    ]
  },

  docA: {
    id: uid(4),
    name: 'Document A'
  },
  docB: {
    id: uid(4),
    name: 'Document B'
  }  
};

/* Session */

var session = {
};

/* The tests */

// before(function setUpAllTests(done) {  
//   var outerDone = done;
// };

suite('Instantiation', function instantiationSuite() {

  test('should create the module', function instantiateModule() {
    debugger;
    session.levelwrap = require('../basicset-levelwrap').createLevelWrap(
      'test.db'
    );
    assert.ok(session.levelwrap, 'Could not create basicset-levelwrap');    
  });

});

suite('Document', function documentSuite() {

  test('should create Document A', function createDocA(testDone) {
    session.levelwrap.saveDoc(settings.docA, function done(error) {
      assert.ok(!error, 'Creating the document failed.');
      testDone();
    });
  });

  test('should get Document A', function getDocA(testDone) {
    session.levelwrap.getDoc(settings.docA.id, function done(error, doc) {
      assert.ok(!error, error);
      assert.deepEqual(settings.docA, doc, 
        'The doc gotten does not match Document A.'
      );
      testDone();
    });
  });

  test('should fail to get Document B', function attemptToGetDocB(testDone) {
    session.levelwrap.getDoc(settings.docB.id, function done(error, doc) {
      assert.equal(error.name, 'NotFoundError');
      assert.ok(!doc);
      testDone();
    });
  });

  test('should create Document B', function createDocB(testDone) {
    session.levelwrap.saveDoc(settings.docB, function done(error) {
      assert.ok(!error, 'Creating the document failed.');
      testDone();
    });
  });

  test('should get Document B', function getDocB(testDone) {
    session.levelwrap.getDoc(settings.docB.id, function done(error, doc) {
      assert.ok(!error, error);
      assert.deepEqual(settings.docB, doc, 
        'The doc gotten does not match Document B.'
      );
      testDone();
    });
  });

  test('should update Document A', function updateDocA(testDone) {
    settings.docA.name = 'Document A updated.';
    session.levelwrap.saveDoc(settings.docA, function done(error) {
      assert.ok(!error, 'Creating the document failed.');

      // Get the document again to check it.
      session.levelwrap.getDoc(settings.docA.id, function done(error, doc) {
        assert.ok(!error, error);
        console.log(settings.docA);
        assert.deepEqual(settings.docA, doc, 
          'The doc gotten does not match Document A.'
        );
        testDone();
      });
    });
  });

});



// These tests need to be run with the "--ui tdd" switch.

var assert = require('assert');
var uid = require('./uid').uid;

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

var docAId = uid(4);
var docBId = uid(4);

var settings = {
  redShyguyObject: {
    id: uid(8),
    name: 'Red Shyguy',
    doc: docAId,
    hp: 1,
    shouldTurnAwayFromCliffs: false
  },
  pinkShyguyObject: {
    id: uid(8),
    name: 'Pink Shyguy',
    doc: docBId,
    hp: 1,
    shouldTurnAwayFromCliffs: true
  },
  birdoObject: {
    id: uid(8),
    name: 'Birdo',
    doc: docBId,
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
    id: docAId,
    name: 'Document A'
  },
  docB: {
    id: docBId,
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

suite('Object (non-destructive)', function documentObject() {

  test('should fail to get Red Shyguy object', 
    function attemptToGetRedShyguy(testDone) {
      session.levelwrap.getObject(settings.redShyguyObject.id, 
        settings.docA.id, 
        function done(error, obj) {
          assert.equal(error.name, 'NotFoundError');
          assert.ok(!obj);
          testDone();
        }
      );
    }
  );

  test('should create Red Shyguy object', function createShyguy(testDone) {
    session.levelwrap.saveObject(settings.redShyguyObject, 
      function done(error, obj) {
        assert.ok(!error, 'Creating the Red Shyguy object failed.');
        testDone();
      }
    );
  });

  test('should get Red Shyguy object', function getRedShyguy(testDone) {
    session.levelwrap.getObject(settings.redShyguyObject.id, 
      settings.docA.id, 
      function done(error, obj) {
        assert.ok(!error, error);
        assert.deepEqual(obj, settings.redShyguyObject);
        testDone();
      }
    );
  });

  test('should fail to get Red Shyguy object in document B', 
    function attemptToGetRedShyguy(testDone) {
      session.levelwrap.getObject(settings.redShyguyObject.id, 
        settings.docB.id, 
        function done(error, obj) {
          assert.equal(error.name, 'NotFoundError');
          assert.ok(!obj);
          testDone();
        }
      );
    }
  );

  test('should create Pink Shyguy object in document B', 
    function createPinkShyguy(testDone) {
      session.levelwrap.saveObject(settings.pinkShyguyObject, 
        function done(error, obj) {
          assert.ok(!error, 'Creating the Pink Shyguy object failed.');
          testDone();
        }
      );
    }
  );

  test('should fail to get Pink Shyguy object in document A', 
    function attemptToGetPinkShyguy(testDone) {
      session.levelwrap.getObject(settings.pinkShyguyObject.id, 
        settings.docA.id, 
        function done(error, obj) {
          assert.equal(error.name, 'NotFoundError');
          assert.ok(!obj);
          testDone();
        }
      );
    }
  );

  test('should get Pink Shyguy object', function getPinkShyguy(testDone) {
    session.levelwrap.getObject(settings.pinkShyguyObject.id, settings.docB.id, 
      function done(error, obj) {
        assert.ok(!error, error);
        assert.deepEqual(obj, settings.pinkShyguyObject);
        testDone();
      }
    );
  });

});


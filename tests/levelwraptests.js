// These tests need to be run with the "--ui tdd" switch.
// TODO: Make suites independent instead of all of them depending on the 
// Instantiation suite.

var assert = require('assert');
var uid = require('./uid').uid;
var fs = require('fs');

var testDbLocation = 'test.db';

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
    session.levelwrap = require('../basicset-levelwrap').createLevelWrap(
      testDbLocation
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
        console.log(doc);
        assert.deepEqual(settings.docA, doc, 
          'The doc gotten does not match Document A.'
        );
        testDone();
      });
    });
  });

});

suite('Object (non-destructive)', function objectSuite() {

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

  test('should update Pink Shyguy object', function updatePinkShyguy(testDone) {
    settings.pinkShyguyObject.hp = 2;
    session.levelwrap.saveObject(settings.pinkShyguyObject, 
      function done(error) {
        assert.ok(!error, error);

      // Get the object again to check it.
      session.levelwrap.getObject(settings.pinkShyguyObject.id, 
        settings.docB.id, 
        function done(error, obj) {
          assert.ok(!error, error);
          console.log(obj);
          assert.deepEqual(settings.pinkShyguyObject, obj, 
            'The object gotten does not match the Pink Shyguy object.'
          );
          testDone();
        });
      }
    );
  });


  test('should create Birdo object in document B', 
    function createBirdo(testDone) {
      session.levelwrap.saveObject(settings.birdoObject, 
        function done(error, obj) {
          assert.ok(!error, 'Creating the Birdo object failed.');
          testDone();
        }
      );
    }
  );

  test('should be able to get Pink Shyguy and Birdo from document B stream', 
    function streamDocB(testDone) {
      var objStream = session.levelwrap.getDocObjectStream(settings.docB.id);
      var objCount = 0;

      objStream.on('data', function readData(obj) {
        if (obj.id === settings.pinkShyguyObject.id) {
          assert.deepEqual(obj, settings.pinkShyguyObject, 
            'The Pink Shyguy object does not match the one in settings.');
          ++objCount;
        }
        else if (obj.id === settings.birdoObject.id) {
          assert.deepEqual(obj, settings.birdoObject,
            'The Birdo object does not match the one in settings.');
          ++objCount;
        }
        else {
          assert.ok(false, 'An unexpected object was retrieved.');
          testDone();
        }
      });

      objStream.on('end', function end() {
        assert.equal(objCount, 2, 
          'Did not get as many objects from the Document B stream as expected.');
        testDone();
      });
    }
  );

});

suite('Object (destructive)', function destructiveObjectSuite() {
  test('should delete Red Shyguy object', function deleteRedShyguy(testDone) {
    session.levelwrap.deleteObject(settings.redShyguyObject.id, 
      settings.redShyguyObject.doc,
      function done(error) {
        assert.ok(!error, error);

        // Get the object again to check it.
        session.levelwrap.getObject(settings.redShyguyObject.id, 
          settings.redShyguyObject.doc, 
          function done(error, obj) {
            assert.equal(error.name, 'NotFoundError');
            assert.ok(!obj);
            testDone();
          }
        );
      }
    );
  });
});

suite('Closing', function closingDbSuite() {

  test('should close database', function closeDb(testDone) {
    session.levelwrap.close(function done(error) {
      assert.ok(!error, error);
      deleteFolderRecursive(testDbLocation);
      testDone();
    });
  });
});

// http://www.geedew.com/2012/10/24/remove-a-directory-that-is-not-empty-in-nodejs/
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      }
      else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

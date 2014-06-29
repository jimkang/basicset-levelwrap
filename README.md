basicset-levelwrap
==================

This is a module that provides functions for using a LevelDb database (via [levelup](https://github.com/rvagg/node-levelup)) to store JSON objects in a really basic way.

It's geared toward a two-level hierarchy: There's documents, which are a collection of objects. And then there's objects. You don't have to use the documents. Since you can store anything you want in an object, you can create all sorts of hierarchies. However, since objects are stored with keys that use the document id, getting all the objects in a document is optimized. (See getDocObjectStream.)

It expect objects to have an 'id' string property as well as a 'doc' string property. If you don't want to bother with documents, just use the same string for every doc property.

Usage
-----

    var levelwrap = require('basicset-levelwrap').createLevelWrap('stuff.db');
    levelwrap.saveObject({
        id: uid(8),
        name: 'Red Shyguy',
        doc: docAId,
        hp: 1,
        shouldTurnAwayFromCliffs: false
      }, 
      function done(error, obj) {
        if (error) {
          console.log(error);
        }
        else {
          console.log('OK, cool.');
        }
      }
    );

How to run the tests
--------------------

    mocha --ui tdd -R spec tests/levelwraptests.js

License
-------

MIT.

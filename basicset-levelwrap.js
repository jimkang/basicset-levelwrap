function createLevelWrap(leveldbFilePath) {
  var levelup = require('level');

  var db = levelup(leveldbFilePath, {valueEncoding: 'json'});
  var nsDelimiter = '!';
  var nsEndRangeDelimiter = '\xff'; // ÿ

  // If the key can't be found, the done callback will be passed an empty array. 
  // If there is another error, the done callback will be passed null.
  function getObject(id, docId, done) {
    var key = getObjectKey(id, docId);
    db.get(key, done);
  };

  // doc (an id) is assumed to be one of the object properties.
  function saveObject(obj, done) {
    var key = getObjectKey(obj.id, obj.doc);
    db.put(key, obj, done);
  };

  function deleteObject(id, docId, done) {
    var key = getObjectKey(id, docId);
    db.del(key, {}, done);
  };

  function saveDoc(doc, done) {
    var key = getDocKey(doc.id);
    db.put(key, doc, done);
  };

  function getDoc(id, done) {
    var key = getDocKey(id);
    db.get(key, done);
  };

  function sanitizeKeySegment(key) {
    return key.replace(nsDelimiter, '');
  };

  function getObjectKey(id, docId) {
    var cleanId = sanitizeKeySegment(id);
    var cleanDocId = sanitizeKeySegment(docId);
    var key = 's' + nsDelimiter + cleanDocId + nsDelimiter + cleanId;  
    return key;
  };

  function getDocKey(id) {
    var cleanId = sanitizeKeySegment(id);
    var key = 'd' + nsDelimiter + cleanId;
    return key;
  };

  function getDocIdFromKey(key) {
    var parts = key.split(nsDelimiter);
    var id = null;
    if (parts.length > 1) {
      id = parts[1];
    }
    return id;
  };

  function getRangeForObjectsInDoc(docId) {
    var cleanDocId = sanitizeKeySegment(docId);
    return [
      's' + nsDelimiter + cleanDocId + nsDelimiter,
      's' + nsDelimiter + cleanDocId + nsEndRangeDelimiter
    ];
  };

  function getDocObjectStream(docId) {
    var range = getRangeForObjectsInDoc(docId);
    return db.createValueStream({
      start: range[0],
      end: range[1]
    });
  };

  function close(done) {
    db.close(done);
  };

  function getDb() {
    return db;
  }

  return {
    getObject: getObject,
    saveObject: saveObject,
    deleteObject: deleteObject,
    saveDoc: saveDoc,
    getDoc: getDoc,
    getDocObjectStream: getDocObjectStream,
    close: close,
    getDb: getDb
  };
}

module.exports.createLevelWrap = createLevelWrap;

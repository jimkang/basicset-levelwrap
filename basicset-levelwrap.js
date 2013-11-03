function createLevelWrap(leveldbFilePath) {
  var levelup = require('level');

  var levelwrap = {
    db: levelup(leveldbFilePath, {valueEncoding: 'json'}),
    nsDelimiter: '!',
    nsEndRangeDelimiter: '\xff' // ÿ
  };

  // If the key can't be found, the done callback will be passed an empty array. 
  // If there is another error, the done callback will be passed null.
  levelwrap.getObject = function getObject(id, docId, done) {
    var key = this.getObjectKey(id, docId);
    this.db.get(key, done);
  };

  // doc (an id) is assumed to be one of the object properties.
  levelwrap.saveObject = function saveObject(obj, done) {
    var key = this.getObjectKey(obj.id, obj.doc);
    this.db.put(key, obj, done);
  };

  levelwrap.deleteObject = function deleteObject(id, docId, done) {
    var key = this.getObjectKey(id, docId);
    this.db.del(key, {}, done);
  };

  levelwrap.saveDoc = function saveDoc(doc, done) {
    var key = this.getDocKey(doc.id);
    this.db.put(key, doc, done);
  };

  levelwrap.getDoc = function getDoc(id, done) {
    var key = this.getDocKey(id);
    this.db.get(key, done);
  };

  levelwrap.sanitizeKeySegment = function sanitizeKeySegment(key) {
    return key.replace(this.nsDelimiter, '');
  };

  levelwrap.getObjectKey = function getObjectKey(id, docId) {
    var cleanId = this.sanitizeKeySegment(id);
    var cleanDocId = this.sanitizeKeySegment(docId);
    var key = 's' + this.nsDelimiter + cleanDocId + this.nsDelimiter + cleanId;  
    return key;
  };

  levelwrap.getDocKey = function getDocKey(id) {
    var cleanId = this.sanitizeKeySegment(id);
    var key = 'd' + this.nsDelimiter + cleanId;
    return key;
  };

  levelwrap.getDocIdFromKey = function getDocIdFromKey(key) {
    var parts = key.split(this.nsDelimiter);
    var id = null;
    if (parts.length > 1) {
      id = parts[1];
    }
    return id;
  };

  levelwrap.getRangeForObjectsInDoc = function getRangeForObjectsInDoc(docId) {
    var cleanDocId = this.sanitizeKeySegment(docId);
    return [
      's' + this.nsDelimiter + cleanDocId + this.nsDelimiter,
      's' + this.nsDelimiter + cleanDocId + this.nsEndRangeDelimiter
    ];
  };

  levelwrap.getDocObjectStream = function getDocObjectStream(docId) {
    var range = this.getRangeForObjectsInDoc(docId);
    return this.db.createValueStream({
      start: range[0],
      end: range[1]
    });
  };

  return levelwrap;
}

module.exports.createLevelWrap = createLevelWrap;


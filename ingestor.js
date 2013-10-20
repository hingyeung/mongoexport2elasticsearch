var nodeio = require('node.io');
var fs = require('fs');
var elastical = require('elastical');
var elasticHost = '192.168.56.101';
var elasticPort = 9200;
var client = new elastical.Client(elasticHost, {port: elasticPort});

exports.job = new nodeio.Job(
  {
    take: 10000,
    max: 1
    // read_buffer: (8096 * 1048)
  },
  {
    run: function (docs) {

      if (!(docs instanceof Array)) {
        docs = [docs];
      }

      var jsonDocs = docs.map(
        function(element) {
          // rename "_id" field to "mongo_id", elastic search seems to hate
          // doc with "_id" field with object value ({}) and make it unsearchable.
          docObj = JSON.parse(element);
          docObj.mongo_id = docObj._id;
          delete docObj['_id'];
          return {
            index: {
              _index:"wpcontent", 
              _type:"wpdoc", 
              data: docObj
            }
          };
        }
      );

      console.log(jsonDocs);

      var that = this;
      client.bulk(jsonDocs, function(err, response) {
        console.log(err);
        that.emit('ingested');
      });
    }
});

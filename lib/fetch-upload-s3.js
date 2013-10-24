 /* Created by
 * User: saintmac
 * Date: 22/10/13
 */

var init_tmp = require('./init_tmp'),
    download = require('./download'),
    S3Bucket = require('./bucket'),
    async = require('async');


var FUS3 = function(s3_bucket_name) {
  this.s3_bucket_name = s3_bucket_name;
};

FUS3.prototype.init = function(done) {
  self = this;
  async.parallel([
    init_tmp,
    function(callback) {
      self.bucket = new S3Bucket(self.s3_bucket_name);
      self.bucket.exists(function(exists){
        if (!exists) {
          self.bucket.create(callback);
        }
        else {
          callback();
        }
      });
    }
  ], done);
};

FUS3.prototype.do = function (resource_to_fetch_url, s3_bucket, s3_key, done) {
  self = this;
  download(resource_to_fetch_url, s3_key, function(err){
    if (err) {
      return done(err);
    }
    self.bucket.upload('./.tmp/fetch_upload_s3/'+s3_key, s3_key, done);
  });
};

module.exports = FUS3;


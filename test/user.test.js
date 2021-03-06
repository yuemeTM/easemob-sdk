var should = require('should');
var testConfig = require('./config');
var easemobSDK = require('../index');
var async = require('async');

describe('User Test', function () {
  var token;
  before(function (done) {
    // Init the SDK before testing.
    easemobSDK.init(testConfig.org_name, testConfig.app_name, testConfig.client_id, testConfig.client_secret);
    easemobSDK.get_token(function (err, result) {
      if (!err) {
        token = result.access_token;
        done();
      }
    });
  });

  describe('Create user', function () {
    var username = 'create_wayne';
    var password = '123456';
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.entities[0].username.should.equal(username);
        done();
      });
    });
  });


  describe('Create user with nickname', function () {
    var username = '13455667788';
    var password = '123456';
    var nickname = "create_leo_nickname";
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.create_with_nickname(username, password, nickname, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.entities[0].username.should.equal(username);
        body.entities[0].nickname.should.equal(nickname);
        done();
      });
    });
  });


  describe('Batch create user', function () {
    batch_user = [{
      username: 'create_wayne1',
      password: '123456'
    }, {
      username: 'create_wayne2',
      password: '123456'
    }];
    after(function (done) {
      async.eachSeries(batch_user, function iterator(user, callback) {
        easemobSDK.user.remove(user.username, token, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            callback(null);
          } else {
            callback(err || 'can not delte !');
          }
        });
      }, function (err) {
        done();
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.create_batch(batch_user, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.entities[0].username.should.equal(batch_user[0].username);
        body.entities[1].username.should.equal(batch_user[1].username);
        done();
      });
    });
  });

  describe('Get user', function () {
    var username = 'get_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.get(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.entities[0].username.should.equal(username);
        done();
      });
    });
  });


  describe('Batch get user with page', function () {
    batch_get_user = [{
      username: 'batch_get_wayne1',
      password: '123456'
    }, {
      username: 'batch_get_wayne2',
      password: '123456'
    }, {
      username: 'batch_get_wayne3',
      password: '123456'
    }];
    var limit = 2;
    before(function (done) {
      easemobSDK.user.create_batch(batch_get_user, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      async.eachSeries(batch_get_user, function iterator(user, callback) {
        easemobSDK.user.remove(user.username, token, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            callback(null);
          } else {
            callback(err || 'can not delete !');
          }
        });
      }, function (err) {
        done();
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.get_batch(limit, token, function (err, res, body) {
        if (!err && res.statusCode == 200 && body.cursor) {
          easemobSDK.user.get_batch_page(limit, body.cursor, token, function (err, res, body) {
            should.not.exists(err);
            res.statusCode.should.equal(200);
            done();
          });
        }
      });
    });
  });

  describe('Batch get user ', function () {
    batch_get_user = [{
      username: 'get_wayne1',
      password: '123456'
    }, {
      username: 'get_wayne2',
      password: '123456'
    }, {
      username: 'get_wayne3',
      password: '123456'
    }];
    var limit = 2;
    before(function (done) {
      easemobSDK.user.create_batch(batch_get_user, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      async.eachSeries(batch_get_user, function iterator(user, callback) {
        easemobSDK.user.remove(user.username, token, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            callback(null);
          } else {
            callback(err || 'can not delete !');
          }
        });
      }, function (err) {
        done();
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.get_batch(limit, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.count.should.equal(limit);
        done();
      });
    });
  });


  describe('Reset user password', function () {
    var username = 'password_wayne';
    var password = '123456';
    var newpassword = '654321';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.reset_password(username, newpassword, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.action.should.equal('set user password');
        done();
      });
    });
  });

  describe('Set user nickname', function () {
    var username = 'nickname_wayne';
    var password = '123456';
    var nickname = '梁健伟';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.set_nickname(username, nickname, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.entities[0].username.should.equal(username);
        body.entities[0].nickname.should.equal(nickname);
        done();
      });
    });
  });

  describe('Get user status', function () {
    var username = 'status_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.get_status(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Get user offline msg count', function () {
    var username = 'msg_count_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.get_offline_msg_count(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Get user offline msg status', function () {
    var username = '';
    var password = '123456';
    var msg_id = '';
    before(function (done) {
      async.waterfall([
        function (cb) {
          var data = {
            limit: 1,
            timestamp: '<' + Date.now()
          };
          easemobSDK.log.export(data, token, function (err, res, body) {
            if (!err && res.statusCode == 200) {
              msg_id = body.entities[0]['msg_id'];
              username = body.entities[0]['to'];
              cb(null)
            } else {
              cb(err || 'Could not export log!');
            }
          });
        }, function (cb) {
          easemobSDK.user.create(username, password, token, function (err, res, body) {
            if (!err && res.statusCode == 200) {
              cb(null)
            } else {
              cb(err || 'could not create!');
            }
          });
        }
      ], function (err, result) {
        done(err);
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.get_offline_msg_status(username, msg_id, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.data.should.have.property(msg_id);
        done();
      });
    });
  });

  describe('Deactivate user', function () {
    var username = 'deactivate_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.deactivate(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Activate user', function () {
    var username = 'activate_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.activate(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Disconnect user', function () {
    var username = 'disconnect_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    after(function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.disconnect(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('Remove user', function () {
    var username = 'remove_wayne';
    var password = '123456';
    before(function (done) {
      easemobSDK.user.create(username, password, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.remove(username, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        body.action.should.equal("delete");
        body.entities[0].username.should.equal(username);
        done();
      });
    });
  });

  describe('Batch remove user', function () {
    batch_user = [{
      username: 'batch_remove_wayne1',
      password: '123456'
    }, {
      username: 'batch_remove_wayne2',
      password: '123456'
    }];
    var limit = 2;
    before(function (done) {
      easemobSDK.user.create_batch(batch_user, token, function (err, res, body) {
        if (!err && res.statusCode == 200) {
          done();
        }
      });
    });
    it('Should return OK', function (done) {
      easemobSDK.user.remove_batch(limit, token, function (err, res, body) {
        should.not.exists(err);
        res.statusCode.should.equal(200);
        done();
      });
    });
  });

});

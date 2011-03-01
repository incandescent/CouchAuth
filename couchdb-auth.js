// CouchAuth

// Wrapper around $.couch used to manage authentication 
// in a backbone event-based fashion

// dependencies: underscore, Backbone.js, couch, jQuery

// CouchAuth constructor
function CouchAuth() {}

// extend with backbone events
_.extend(CouchAuth.prototype, Backbone.Events, {
  // restore constructor
  constructor: CouchAuth,
  
  // login user based on given username/password
  login: function(username, password, options) {
    options = options || {};
    var that = this,
      params = {
        name: username,
        password: password,
        success: function() {
          that.trigger('auth:login:success', username);
          if (options.success) {
            options.success();
          }
        },
        error: function(code, error, reason) {
          that.trigger('auth:login:error', 
            {code:code, error:error, reason:reason});
          if (options.error) {
            options.error(code, error, reason);
          }
        }
      };
    $.couch.login(params);
  },

  // logout currently login user
  logout: function(options) {
    options = options || {};
    var that = this;
    $.couch.logout({
      success: function(resp) {
        that.trigger('auth:logout');
        options.success && options.success(resp);
      }
    })
  },

  // signup user for given username/password
  signup: function(username, password, options) {
    options = options || {};
    var that = this,
      params = {
        success: function() {
          that.trigger('auth:signup:success');
          options.success && options.success();  
        },
        error: function(status, error, reason) {
          that.trigger('auth:signup:error', {code:code, error:error, reason:reason});
          options.error && options.error(status, error, reason);
        }
      };
    $.couch.signup({name: username}, password, params);
  },

  // tests if user is authenticated
  isLogin: function(callback) {
    callback = callback || null;
    var that = this;
    var params = {
      success: function(result) {
        var isAuth = false;
        if (result.userCtx.name) {
          isAuth = true;
        }
        that.trigger('auth:islogin', isAuth);
        callback && callback(isAuth);
      },
      error: function() {
        that.trigger('auth:islogin', false);
        callback && callback(false);
      }
    }
    $.couch.session(params);
  }
});

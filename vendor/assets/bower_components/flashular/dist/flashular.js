(function() {
  angular.module("flashular", []).factory("flash", function($rootScope) {
    var Flash, eventName, flash, isModuleLoaded;
    Flash = (function() {
      function Flash() {
        this.data = {};
      }

      Flash.prototype.set = function(k, v) {
        return this.data[k] = v;
      };

      Flash.prototype.get = function(k) {
        return this.data[k];
      };

      Flash.prototype.has = function(k) {
        return k in this.data;
      };

      Flash.prototype.remove = function(k) {
        return delete this.data[k];
      };

      Flash.prototype.clear = function() {
        var k, _results;
        _results = [];
        for (k in this.data) {
          _results.push(this.remove(k));
        }
        return _results;
      };

      Flash.prototype.isEmpty = function() {
        return this.data.length <= 0;
      };

      return Flash;

    })();
    isModuleLoaded = function(name) {
      var e;
      try {
        return angular.module(name) != null;
      } catch (_error) {
        e = _error;
        return false;
      }
    };
    if (isModuleLoaded("ngRoute")) {
      eventName = "$routeChangeSuccess";
    } else if (isModuleLoaded("ui.router")) {
      eventName = "$stateChangeSuccess";
    } else {
      eventName = "$locationChangeSuccess";
    }
    flash = new Flash;
    flash.now = new Flash;
    $rootScope.$on(eventName, function(event, args) {
      if (args.redirectTo == null) {
        flash.now.clear();
        angular.extend(flash.now.data, flash.data);
        return flash.clear();
      }
    });
    return flash;
  }).directive("flashAlerts", function(flash, $interpolate) {
    return {
      restrict: "E",
      replace: true,
      scope: {
        closeable: "&",
        preProcess: "&"
      },
      template: "<div ng-show=\"flash\" class=\"alerts\">\n  <div ng-repeat=\"alertType in alertTypes\" ng-show=\"flash.has(alertType)\" class=\"alert alert-{{alertClass(alertType)}}\">\n    <button ng-if=\"closeable\" type=\"button\" class=\"close\" ng-click=\"flash.remove(alertType)\">&times;</button>\n    {{flash.has(alertType) ? preProcess({alert: flash.get(alertType)}) : \"\"}}\n  </div>\n</div>",
      link: function(scope, iElement, iAttrs) {
        var alertClassMap, _ref, _ref1;
        scope.flash = flash.now;
        scope.alertTypes = ["info", "success", "error", "warning", "danger"];
        scope.closeable = (_ref = iAttrs.closeable) != null ? _ref : false;
        scope.preProcess = (_ref1 = iAttrs.preProcess) != null ? _ref1 : function(alert) {
          return $interpolate("{{alert}}")(alert);
        };
        alertClassMap = {
          alert: 'danger',
          error: 'danger'
        };
        return scope.alertClass = function(alertType) {
          return alertClassMap[alertType] || alertType;
        };
      }
    };
  });

}).call(this);

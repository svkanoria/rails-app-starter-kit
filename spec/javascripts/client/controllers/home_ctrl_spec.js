describe('HomeCtrl', function () {
  beforeEach(module('App'));

  it("should have 'hello' set to 'Hello World!'",
    inject(function($controller) {
      var scope = {};
      var ctrl = $controller('HomeCtrl', {$scope:scope});

      expect(scope.hello).toBe('Hello World!');
    }));
});

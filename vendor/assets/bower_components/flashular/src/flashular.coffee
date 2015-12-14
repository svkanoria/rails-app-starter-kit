angular.module "flashular", []

.factory "flash", ($rootScope) ->

  # Define the flash class.
  class Flash
    constructor: -> @data = {}
    set: (k, v) -> @data[k] = v
    get: (k) -> @data[k]
    has: (k) -> k of @data
    remove: (k) -> delete @data[k]
    clear: -> @remove(k) for k of @data
    isEmpty: -> @data.length <= 0

  # Determine which event to listen for based on the installed router.
  isModuleLoaded = (name) ->
    try angular.module(name)? catch e then false

  if isModuleLoaded "ngRoute"
    eventName = "$routeChangeSuccess"
  else if isModuleLoaded "ui.router"
    eventName = "$stateChangeSuccess"
  else
    eventName = "$locationChangeSuccess"

  # Every route change, make the "next" flash become the "now" flash.
  flash = new Flash
  flash.now = new Flash
  $rootScope.$on eventName, (event, args) ->
    unless args.redirectTo? # To preserve flash across redirects.
      flash.now.clear()
      angular.extend flash.now.data, flash.data
      flash.clear()

  return flash

# Helper directive for enabling the use of Angular directives in flash alerts.
.directive "alertMsg", ($compile) ->
  restrict: 'E'
  replace: yes
  scope:
    content: "@"
  template:
    """
    <span></span>
    """
  link: (scope, iElement, iAttrs) ->
    scope.$watch 'content', (value) ->
      if value
        wrappedValue = "<span>#{value}</span>"
        # Allow directives within flash messages
        compiledValue = $compile(wrappedValue)(scope)
        $(iElement).html(compiledValue)

.directive "flashAlerts", (flash, $interpolate) ->

  restrict: "E"
  replace: yes
  scope:
    closeable: "&"
    preProcess: "&"
  template:
    """
    <div ng-show="flash" class="alerts">
      <div ng-repeat="alertType in alertTypes" ng-show="flash.has(alertType)" class="alert alert-{{alertClass(alertType)}}">
        <button ng-if="closeable" type="button" class="close" ng-click="flash.remove(alertType)">&times;</button>
        <alert-msg content="{{flash.has(alertType) ? preProcess({alert: flash.get(alertType)}) : ''}}"></alert-msg>
      </div>
    </div>
    """
  link: (scope, iElement, iAttrs) ->
    scope.flash = flash.now
    scope.alertTypes = ["info", "success", "error", "warning", "danger"]
    scope.closeable = iAttrs.closeable ? no
    scope.preProcess = iAttrs.preProcess ? (alert) -> $interpolate("{{alert}}")(alert) # Fallback to a default function that does no processing.

    # Map alert types to Bootstrap alert compatible CSS classes.
    alertClassMap = { alert: 'danger', error: 'danger' }
    scope.alertClass = (alertType) -> alertClassMap[alertType] or alertType

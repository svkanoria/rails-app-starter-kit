flashular [![Bower version](http://img.shields.io/bower/v/flashular.svg?style=flat-square)](https://github.com/lukehorvat/flashular/releases) [![Build Status](http://img.shields.io/travis/lukehorvat/flashular.svg?style=flat-square)](https://travis-ci.org/lukehorvat/flashular) [![devDependency Status](http://img.shields.io/david/dev/lukehorvat/flashular.svg?style=flat-square)](https://david-dm.org/lukehorvat/flashular#info=devDependencies)
=========

A simple flash service for AngularJS that provides you with the means to pass temporary data between routes (or "states", if using [UI Router](https://github.com/angular-ui/ui-router) terminology). Anything you place in the flash is exposed to the very next route and then immediately cleared out, making it somewhat similar to the [Rails flash](http://api.rubyonrails.org/classes/ActionDispatch/Flash.html). Also comes with a Twitter Bootstrap-compatible directive for displaying flash alerts.

## Installation

You can manually add the [flashular.js](/dist/flashular.js) file to your AngularJS application, or install it with Bower:

```bash
$ bower install flashular
```

After that, just add Flashular to any Angular module's dependency list:

```coffeescript
angular.module("app", ["flashular"])
```

## Service

Flashular provides a **flash** service that allows you to temporarily store values of *any* type (e.g. strings, arrays, objects, etc.) so that they are available for retrieval when the [$location](http://docs.angularjs.org/api/ng.$location) changes. Values are only stored in the flash for a maximum of one $location change before being cleared out.

To use the flash service, simply inject it as a dependency in your Angular controller:

```coffeescript
.controller "SignInCtrl", (flash) ->
```

The injected flash service is simply an object that stores a bunch of key-value pairs intended for the *next* $location. It exposes the following functions you can call to manipulate and query the stored data:

```coffeescript
.get(key) # Returns the value stored in the flash for the specified key.
.set(key, value) # Stores a value in the flash with the specified key.
.has(key) # Returns a boolean indicating whether a value is stored in the flash for the specified key.
.remove(key) # Removes the value stored in the flash with the specified key.
.clear() # Removes all key-value pairs in the flash.
.isEmpty() # Returns a boolean indicating whether any key-value pairs are stored in the flash.
```

It also has two properties:

```coffeescript
.data # All key-value pairs as stored in their "raw" form. Try not to touch this.
.now # The flash object intended for the current $location. Has all the same methods above.
```

As can be seen, the flash stores data for the *next* $location, and its `now` property is itself a flash that contains the data stored for the *current* $location. When the $location changes, the "next" flash becomes the "current" flash. Here's a code example to demonstrate how it all works:

```coffeescript
# Store a value for the next $location.
flash.set("username", "John Smith")
flash.has("username") # Should return true.
flash.now.has("username") # Should return false.
flash.get("username") # Should return "John Smith".

# --- $location change occurs.

# Get the value stored for the current $location.
flash.has("username") # Should return false.
flash.now.has("username") # Should return true.
flash.now.get("username") # Should return "John Smith".
```

## Directive

Flashular also provides a **flashAlerts** directive that allows you to easily display "alerts" in your HTML templates. Anything you store in the flash with a key of `info`, `success`, `warning`, or `danger` will automatically be rendered as an alert wherever you include this directive in your templates. Furthermore, the HTML outputted by this directive is completely compatible with Twitter Bootstrap (and doesn't require [UI Bootstrap](https://github.com/angular-ui/bootstrap) either!).

Adding the flashAlerts directive to a template can be done like so:

```
<flash-alerts closeable="true"></flash-alerts>
```

It should be mentioned that this directive utilizes the flash for the *current* $location i.e. `flash.now`. So if you store alerts in the flash for the next $location, they will only render once the $location actually changes. If you want to immediately display an alert *without* waiting for the $location to change, then just add values to `flash.now`, of course.

**Need to do some pre-processing of your alerts before they are rendered?** Just add a `preProcess` attribute, which should specify a function that has a single parameter (the alert stored in the flash, which can be *any* type) and returns the "processed" alert (which should be something renderable, like a string):

```
<flash-alerts pre-process="processFlashAlert(alert)"></flash-alerts>
```

How might this be useful? Well, flash alerts are definitely something you want to localize, for example. But a lot of i18n libraries out there tend to load their translation dictionaries asynchronously. So what if you want to store a translated alert string in the flash, but i18n hasn't finished loading yet? You can't do it. Or can you?

Flashular automatically detects changes to the return value of your `preProcess` function (using [$interpolate](http://docs.angularjs.org/api/ng.$interpolate) magic) and re-renders alerts as needed. So if your i18n library returns null or an empty string if you try to use it before it has finished loading, and a translated string once it has loaded, then it's pretty obvious what you should do - perform the translation inside your `preProcess` function!

Still not clear? Below is an example:

```coffeescript
# Define a translation in your i18n dictionary.
{"key": "SIGN_IN_SUCCESS", "value": "You signed in successfully. Welcome back, %s!"}
```

```coffeescript
# Store the i18n dictionary key in the flash along with any strings to substitute.
flash.set("success", ["SIGN_IN_SUCCESS", username])
```

```coffeescript
# Perform translations and string substituting in the preProcess function.
$rootScope.processFlashAlert = (alert) ->
  [message, args...] = alert
  stringUtils.format(i18n.translate(message), args...)
```

![Alert example](http://i.imgur.com/DGZ7sgg.png)

## Contributing

All contributions are welcome.

Execute `npm install` to sort out your development dependencies, `npm start` to auto-build Flashular while you work, and `npm test` to run the Protractor e2e test suite.

Make your changes to [flashular.coffee](/src/flashular.coffee), but ensure you also commit the compiled [flashular.js](/dist/flashular.js) and [flashular.min.js](/dist/flashular.min.js) scripts.

### Development Roadmap

Some things to look at doing:
- A small sample/demo application on GitHub Pages.
- Replicate more functionality of the Rails flash.
- Make the flashAlerts directive more compatible with other front-end frameworks e.g. Foundation.

/*
 * To configure and retrieve i18n details.
 *
 * Also sets up angular-translate to fetch the required translations from
 * '/i18n/translations.json?lang=some_locale', iff a locale is set.
 *
 * Configuration:
 *   // Set the locale. If you don't want or need to set one, skip it.
 *   // Consequently, the locale will remain null.
 *   //
 *   // Note that here, setting the locale is not semantically equivalent to
 *   // "switching" locales. It just "informs" the Angular code of the locale
 *   // being used, so that the UI can be rendered appropriately.
 *   //
 *   // We believe the actual switching of locales should be left in the hands
 *   // of the server. The server can then "seed" the locale to be used in the
 *   // form of a JS variable, which can then be retrieved by the Angular code.
 *   //
 *   // Thus, switching locales needs to require a complete reload of the page.
 *   // This obviates the need for any `$watch`es on the locale, and also gives
 *   // the server more control over handling locales.
 *   //
 *   // Also, set the available locales. This is needed to populate the locale
 *   // switcher, and to configure localized URL construction. For details, see
 *   // the documentation for `setAvailableLocales`.
 *   //
 *   // Similar to the locale, the available locales can also be "seeded" from
 *   // the server.
 *   app.config(['I18nProvider', function (I18nProvider) {
 *     I18nProvider.setLocale(someLocaleSeededByServer);
 *
 *     I18nProvider.setAvailableLocales(availableLocales);
 *   }]);
 *
 * Usage:
 *   // Retrieve the current locale anywhere in your code, using the `I18n`
 *   // service.
 *   I18n.getLocale();
 *
 *   // Localize a URL: Done using the `l` function; see its documentation
 *
 *   // Perform translations: See documentation for the `t` and `ts` functions
 *
 *   // Pop up an internationalized `window.confirm` dialog: See documentation
 *   // for the `confirm` function.
 */
angular.module('I18nProvider', ['pascalprecht.translate'])
  .provider('I18n', [
    '$translateProvider',
    function ($translateProvider) {
      // For security reasons. For details, see
      // https://angular-translate.github.io/docs/#/guide/19_security.
      //
      // There are safer strategies available, but because we want to support
      // HTML in translations, and because the safest strategy for this, i.e.
      // 'sanitize' does not seem to work, we use this strategy instead.
      $translateProvider.useSanitizeValueStrategy('escapeParameters');

      var locale = null;
      var availableLocales = null;
      var localeSwitchUrlBuilder = null;

      /**
       * Sets the locale.
       *
       * @param {string} locale_ - The locale to set. Example: 'en', 'de'.
       */
      function setLocale (locale_) {
        locale = locale_;

        if (locale) {
          $translateProvider.useUrlLoader('/i18n/translations.json');
          $translateProvider.preferredLanguage(locale);

          moment.locale(locale);
        }
      }

      /**
       * Gets the locale.
       *
       * @returns {string}
       */
      function getLocale () {
        return locale;
      }

      /**
       * Gets the string to be used to localize URLs.
       *
       * Depending on your design, both this function as well as `getLocale`
       * should be used as appropriate whenever you need to manually construct
       * localized URLs.
       *
       * @param {string} [locale] - The locale to get the URL param for. If no
       *   no locale is given, the current locale is used.
       *
       * @returns {?string}
       */
      function getLocaleUrlParam (locale) {
        var adjLocale = locale || getLocale();

        return (_.has(availableLocales[adjLocale], 'url'))
          ? availableLocales[adjLocale].url
          : adjLocale;
      }

      /**
       * Sets available locales.
       *
       * @param {Object<string, Object>} availableLocales_ - The available
       *   locales, formatted in the following format (? indicates optional):
       *
       *     {
       *       en: { name: 'English', ?url: null },
       *       hi: { name: 'Hindi' },
       *       :
       *     }
       *
       *   Provide the 'url' property for only those locales, whose localized
       *   URLs need to contain a locale fragment that differs from the locale
       *   itself. For example, depending on your design, you may require that
       *   for the default locale, the URLs need not contain an explicit locale
       *   (such as for 'en' above, where `null` indicates no explicit locale).
       */
      function setAvailableLocales (availableLocales_) {
        availableLocales = availableLocales_;
      }

      /**
       * Gets available locales.
       *
       * @returns {Object<string, Object>}
       */
      function getAvailableLocales () {
        return availableLocales;
      }

      /**
       * Localizes the given URL string, by replacing the first (if any)
       * instance of the substring ':locale' with the given (if any), or else
       * the current (if any) locale.
       *
       * If the current locale is null, then it removes the ':locale' and any
       * trailing slash altogether. This behaviour is carefully designed to be
       * consistent with how Angular's own `ngResource` service handles dynamic
       * URLs.
       *
       * Always returns a new string.
       *
       * This is useful for constructing localized server URLs, and for cases
       * where using UI Router's states or state-to-URL conversion tools is not
       * a solution, or is not possible.
       *
       * It is possible to override the actual replacement string used, as the
       * locale itself may not always be appropriate (see `setAvailableLocales`
       * for details).
       *
       * Note that for constructing localized URLs in views, we also provide an
       * `l-href` directive, which itself uses this function.
       *
       * Usage:
       *   // Assuming the current locale is 'en', this returns
       *   // '/admin/en/posts.json'.
       *   I18n.l('/admin/:locale/posts.json');
       *
       *   // Other examples
       *
       *   // Assuming the current locale is 'de'
       *   I18n.l('/:locale'); // '/de'
       *
       *   // Assuming the current locale is null
       *   I18n.l(':locale/posts.json'); // 'posts.json'
       *   I18n.l('/:locale/posts.json'); // '/posts.json'
       *
       *   // Assuming the current locale is 'en', but we have configured via
       *   // `setAvailableLocales` as follows:
       *   //
       *   //   I18n.setAvailableLocales({
       *   //     en: { name: 'English', url: null } // Note the `null` here!
       *   //      :
       *   //   });
       *   I18n.l(':locale/posts.json'); // 'posts.json' (no explicit locale)
       *   I18n.l('/:locale/posts.json'); // '/posts.json' (no explicit locale)
       *
       * @param {string} url - The URL to localize.
       * @param {string} [locale] - The locale to use to localize the URL. If
       *   no locale is given, the current locale is used.
       *
       * @returns {string} The localized URL.
       */
      function l (url, locale) {
        var param = getLocaleUrlParam(locale);

        return (param && param !== '')
          ? url.replace(':locale', param)
          : url.replace(/:locale\/?/, '');
      }

      /**
       * De-localizes the given absolute URL, by replacing the first (if any)
       * instance of the locale with ':locale'. If the URL does not contain an
       * explicit locale, then inserts ':locale' in the absolute URL at index
       * `absoluteUrl.length - relativeUrl.length`.
       *
       * @param {string} absoluteUrl - The absolute URL to de-localize.
       * @param {string} relativeUrl - The relative URL to use to determine the
       *   insertion index of ':locale' when it cannot be inferred implicitly.
       *
       * @returns {string} The de-localized URL.
       */
      function dl (absoluteUrl, relativeUrl) {
        var currentLocale = getLocale();
        var endLocaleRegExp = new RegExp('/' + currentLocale + '$');
        var midLocaleRegExp = new RegExp('/' + currentLocale + '/');
        var delocalizedUrl = null;

        if (endLocaleRegExp.test(absoluteUrl)) {
          delocalizedUrl = absoluteUrl.replace(endLocaleRegExp, '/:locale');
        } else if (midLocaleRegExp.test(absoluteUrl)) {
          delocalizedUrl = absoluteUrl.replace(midLocaleRegExp, '/:locale/');
        } else {
          var localeAddIndex = absoluteUrl.length - relativeUrl.length;

          delocalizedUrl = _.insert(absoluteUrl, localeAddIndex, '/:locale');
        }

        return delocalizedUrl;
      }

      /**
       * Sets the locale switch URL builder function.
       *
       * The locale switch URL builder function knows how to build a locale
       * switch URL (i.e. a URL for conducting a locale switch). Typically, it
       * would build and return a URL to some server endpoint that performs the
       * locale switch.
       *
       * You may ask: Why not navigate directly to the new locale? Because the
       * server might want to do some stuff, like updating the user's preferred
       * locale etc.
       *
       * @param {function} builder - A function accepting two arguments: a new
       *   locale as a string, and a new URL that denotes the current page, but
       *   in the new locale. This can be very handy in constructing the locale
       *   switch URL. The function should then return the locale switch URL as
       *   a string.
       */
      function setLocaleSwitchUrlBuilder (builder) {
        localeSwitchUrlBuilder = builder;
      }

      /**
       * Gets the locale switch URL builder function.
       *
       * @returns {?function}
       */
      function getLocaleSwitchUrlBuilder () {
        return localeSwitchUrlBuilder;
      }

      // The service factory
      var serviceFactory = [
        '$q', '$translate',
        function ($q, $translate) {
          /**
           * A function for translating an item.
           *
           * Builds on angular-translate's `$translate` service, by adding a
           * concept of "relative" and "absolute" translation ids. This turns
           * out to be a surprisingly useful concept.
           *
           * An id starting with a '.' is considered relative, and is appended
           * to the `translationPath` to yield an absolute translation id. One
           * not starting with '.' is absolute anyway. This absolute id is used
           * to find a translation.
           *
           * If found, the returned promise is resolved with the result. If not
           * then if a `defaultValue` is provided, the promise is resolved with
           * it, else the promise is rejected with the translation id used. In
           * the edge case that a null `id` is passed, the promise is rejected
           * with null, and the `$translate` service is not even called.
           *
           * @param {string} id - The "relative" or "absolute" translation id.
           * @param {string} [translationPath] - The path to prepend to any
           *   relative id.
           * @param {string} [defaultValue] - The default value to use in case
           *   no translation is found.
           * @param {Object} [vars] - A map containing values for the variables
           *   (if any) to be interpolated. Note that interpolation only happens
           *   on successful translation, and not if the default value is used.
           *
           * @returns {Promise}
           */
          function t (id, translationPath, defaultValue, vars) {
            var deferred = $q.defer();

            if (!id) {
              deferred.reject(null);
            } else {
              var absTranslationId = (id[0] === '.')
                ? translationPath + id
                : id;

              $translate(absTranslationId, vars).then(function (result) {
                deferred.resolve(result);
              }, function (rejection) {
                if (defaultValue) {
                  deferred.resolve(defaultValue);
                } else {
                  deferred.reject(rejection);
                }
              });
            }

            return deferred.promise;
          }

          /**
           * A function for translating a collection of items.
           *
           * Builds on angular-translate's `$translate` service, and handles a
           * wide variety of use cases.
           *
           * Performs the following steps:
           * 1. Takes an array of "things" to be translated
           * 1. Immediately returns a promise that is never rejected, and only
           *    resolves once all translations have been attempted.
           * 1. If `skipTranslation` is true, immediately resolves the promise
           *    and then does nothing else.
           * 1. For each thing, extracts a translation id using an "extractor":
           *   * If the extractor is:
           *     * null: The thing itself is the translation id
           *     * a string: The thing contains a property of this name, whose
           *       value is the transaction id. The extractor may start with a
           *       '.'. This is a marker, to denote that the extracted value is
           *       to be treated as a "relative" id.
           *
           *       Furthermore, if the thing contains the property
           *       `translation_id`, then the value of this property supersedes
           *       the value of the property denoted by the extractor.
           *     * a function: The function must accept an item (and optionally
           *       an index), and return a translation id.
           * 1. Once the translation id has been computed, if it is a relative
           *    one (i.e. starts with a '.'), then it is appended to the
           *    `translationPath` to yield an absolute translation id.
           * 1. Attempts to retrieve a translation for the translation id. Then:
           *    * On success, calls `success(thing, result_string)`
           *    * On failure, calls `failure(thing, translation_id_used)`
           *
           * @param {Object} opts - A hash of options, in the following format:
           *   {
           *     items: array_of_strings_or_objects,
           *     idExtractor: ?string_or_function,
           *     translationPath: ?some_translation_id_prefix,
           *     skipTranslation: ?true|false,
           *     success: ?function (item, result_string) { ... }
           *     failure: ?function (item, translation_id_used) { ... }
           *   }
           *
           * @returns {Promise}
           */
          function ts (opts) {
            var o = _.extend({
              items: null, // Only for completeness
              idExtractor: null,
              translationPath: '',
              skipTranslation: false,
              success: null,
              failure: null
            }, opts);

            if (o.skipTranslation) {
              return $q(function (resolve, reject) {
                resolve();
              });
            }

            var promises = [];

            _.each(o.items, function (item, index) {
              var translationId = null;

              if (!o.idExtractor) {
                translationId = item;
              } else if (typeof o.idExtractor === 'string') {
                translationId = item.translation_id;

                if (!translationId) {
                  if (o.idExtractor[0] === '.') {
                    translationId = '.' + item[o.idExtractor.substring(1)];
                  } else {
                    translationId = item[o.idExtractor];
                  }
                }
              } else if (typeof o.idExtractor === 'function') {
                translationId = o.idExtractor(item, index);
              }

              if (!translationId) {
                if (o.failure) o.failure(item, null);
              } else {
                var absTranslationId = (translationId[0] === '.')
                  ? o.translationPath + translationId
                  : translationId;

                var deferred = $q.defer();
                promises.push(deferred.promise);

                $translate(absTranslationId).then(function (result) {
                  if (o.success) o.success(item, result);

                  deferred.resolve();
                }, function (rejection) {
                  if (o.failure) o.failure(item, rejection);

                  deferred.resolve();
                });
              }
            });

            return $q.all(promises);
          }

          /**
           * Pops up an internationalized `window.confirm` dialog.
           *
           * No argument is mandatory. These are the defaults:
           * * If no `message` is supplied, it defaults to 'Are you sure?'
           * * If no `translationId` is supplied, it defaults to
           *   'confirm_dialog.are_you_sure?' *iff no message is supplied*!
           *   Otherwise, it remains undefined.
           *
           * Translations for the message can be provided via `translationId`.
           * If the translation id begins with '.', then 'confirm_dialog' is
           * prepended to it.
           *
           * @param {string} [message] - The confirmatory message.
           * @param {string} [translationId] - The translation id.
           * @param {Object} [vars] - A map containing values for the variables
           *   (if any) to be interpolated. Note that interpolation only happens
           *   on successful translation, and not if `message` is used.
           *
           * @returns {Promise} A promise that resolves if 'OK' was pressed and
           *   rejects if 'Cancel' was pressed.
           */
          function confirm (message, translationId, vars) {
            var adjMessage = message || 'Are you sure?';
            var adjTranslationId =
              translationId || (!message && '.are_you_sure?');

            var deferred = $q.defer();

            t(adjTranslationId, 'confirm_dialog', adjMessage, vars)
              .then(function (result) {
                if (window.confirm(result)) {
                  deferred.resolve();
                } else {
                  deferred.reject();
                }
              });

            return deferred.promise;
          }

          // Return the service object
          return {
            getLocale: getLocale,
            getLocaleUrlParam: getLocaleUrlParam,
            getAvailableLocales: getAvailableLocales,
            l: l,
            dl: dl,
            getLocaleSwitchUrlBuilder: getLocaleSwitchUrlBuilder,
            t: t,
            ts: ts,
            confirm: confirm
          };
        }];

      // Return the provider object
      return {
        setLocale: setLocale,
        getLocale: getLocale,
        getLocaleUrlParam: getLocaleUrlParam,
        setAvailableLocales: setAvailableLocales,
        getAvailableLocales: getAvailableLocales,
        l: l,
        dl: dl,
        setLocaleSwitchUrlBuilder: setLocaleSwitchUrlBuilder,
        getLocaleSwitchUrlBuilder: getLocaleSwitchUrlBuilder,

        $get: serviceFactory
      };
    }]);

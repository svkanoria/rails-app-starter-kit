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
 *   // You only need to set it here, and leave it unchanged thereafter. We
 *   // believe that a locale change is addressed most easily and flexibly by
 *   // reloading the page completely. This obviates the need for any $watches
 *   // on the locale, and also gives the server more control over handling
 *   // locales.
 *   app.config(['I18nProvider', function (I18nProvider) {
 *     I18nProvider.setLocale(someLocale);
 *   }]);
 *
 * Usage:
 *   // Retrieve the current locale anywhere in your code, using the 'I18n'
 *   // service.
 *   I18n.getLocale();
 *
 *   // Localize a URL: Done using the 'l' function; see its documentation.
 */
angular.module('I18nProvider', ['pascalprecht.translate'])
  .provider('I18n', [
    '$translateProvider',
    function ($translateProvider) {
      // For security reasons. For details, see
      // https://angular-translate.github.io/docs/#/guide/19_security
      $translateProvider.useSanitizeValueStrategy('escape');

      var locale = null;

      /**
       * Sets the locale.
       *
       * @param locale_ {string} - The locale to set. Example: 'en', 'de'.
       */
      function setLocale (locale_) {
        locale = locale_;

        if (locale) {
          $translateProvider.useUrlLoader('/i18n/translations.json');
          $translateProvider.preferredLanguage(locale);
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
       * Localizes the given URL string, by replacing the first (if any)
       * instance of the substring ':locale' with the actual (if any) current
       * locale.
       *
       * If the current locale is null, then it removes the ':locale' and any
       * trailing slash altogether. This behaviour is designed to be consistent
       * with how Angular's very own ngResource service rewrites dynamic URLs.
       *
       * Always returns a new string.
       *
       * This is useful for constructing localized server URLs, and for cases
       * where using UI Router's states or state to URL conversion tools is not
       * a solution, or is not possible.
       *
       * Note that we also provide an 'l-href' directive for constructing
       * localized URLs, which itself uses this function. If you need such a
       * URL in a view, prefer using the directive instead.
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
       * @param url {string} - The URL to localize.
       *
       * @returns {string} The localized URL.
       */
      function l (url) {
        return (locale)
          ? url.replace(':locale', locale)
          : url.replace(/:locale\/?/, '');
      }

      // Return the provider object
      return {
        setLocale: setLocale,

        // The service object
        $get: function () {
          return {
            getLocale: getLocale,
            l: l
          };
        }
      };
    }]);

(function(){'use strict';function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : String(i);
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}// String formatter to output opt-in message of disabled elements
// source: https://stackoverflow.com/a/18234317
String.prototype.formatUnicorn = String.prototype.formatUnicorn || function () {

  var str = this.toString();
  if (arguments.length) {
    var t = _typeof(arguments[0]);
    var key;
    var args = "string" === t || "number" === t ? Array.prototype.slice.call(arguments) : arguments[0];
    for (key in args) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }
  }
  return str;
};var PrivacyWire = /*#__PURE__*/function () {
  function PrivacyWire(PrivacyWireSettings) {
    _classCallCheck(this, PrivacyWire);
    this.name = "privacywire";
    this.toggleToStatus = true;
    this.cookieGroups = Object.freeze(["necessary", "functional", "statistics", "marketing", "external_media"]);
    this.settings = this.sanitizeSettings(PrivacyWireSettings);
    this.userConsent = this.sanitizeStoredConsent();
    this.elements = this.initiateElements();
    this.syncConsentToCheckboxes();
    if (!this.checkForValidConsent()) {
      this.showBanner();
    }
    this.checkElementsWithRequiredConsent();
    this.handleButtons();
  }

  /**
   * Sanitize the inline script settings
   * @param {Object} PrivacyWireSettings - The inline script settings container
   * @returns {Object} Sanitized object with the settings
   */
  _createClass(PrivacyWire, [{
    key: "sanitizeSettings",
    value: function sanitizeSettings(PrivacyWireSettings) {
      var settings = {};
      settings.version = parseInt(PrivacyWireSettings.version);
      settings.dnt = Boolean(parseInt(PrivacyWireSettings.dnt));
      settings.bots = Boolean(parseInt(PrivacyWireSettings.bots));
      settings.customFunction = "".concat(PrivacyWireSettings.customFunction);
      settings.messageTimeout = parseInt(PrivacyWireSettings.messageTimeout);
      settings.consentByClass = Boolean(parseInt(PrivacyWireSettings.consentByClass));
      settings.cookieGroups = {};
      var _iterator = _createForOfIteratorHelper(this.cookieGroups),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          settings.cookieGroups[key] = "".concat(PrivacyWireSettings.cookieGroups[key]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return settings;
    }

    /**
     * Sanitize stored consent from LocalStorage
     * @returns {Object} either empty object or sanitized stored consent object if version matches with settings version
     */
  }, {
    key: "sanitizeStoredConsent",
    value: function sanitizeStoredConsent() {
      if (!window.localStorage.getItem(this.name)) {
        return this.getDefaultConsent();
      }
      var storedConsentRaw = JSON.parse(window.localStorage.getItem(this.name));
      if (parseInt(storedConsentRaw.version) !== this.settings.version) {
        return this.getDefaultConsent();
      }
      if (typeof storedConsentRaw.cookieGroups === 'undefined') {
        this.removeStoredConsent();
        return this.getDefaultConsent();
      }
      var storedConsent = {};
      storedConsent.version = parseInt(storedConsentRaw.version);
      storedConsent.cookieGroups = {};
      var _iterator2 = _createForOfIteratorHelper(this.cookieGroups),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value;
          storedConsent.cookieGroups[key] = Boolean(storedConsentRaw.cookieGroups[key]);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return storedConsent;
    }

    /**
     * Get default Consent object
     * @returns {Object} Consent object with only necessary allowed
     */
  }, {
    key: "getDefaultConsent",
    value: function getDefaultConsent() {
      var consent = {};
      consent.version = 0;
      consent.cookieGroups = {};
      var _iterator3 = _createForOfIteratorHelper(this.cookieGroups),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var key = _step3.value;
          consent.cookieGroups[key] = key === "necessary";
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return consent;
    }
  }, {
    key: "initiateElements",
    value: function initiateElements() {
      var elements = {};
      elements.banner = {};
      elements.banner.wrapper = document.getElementById("privacywire-wrapper");
      elements.banner.intro = elements.banner.wrapper.getElementsByClassName("privacywire-banner");
      elements.banner.options = elements.banner.wrapper.getElementsByClassName("privacywire-options");
      elements.banner.message = elements.banner.wrapper.getElementsByClassName("privacywire-message");
      elements.buttons = {};
      elements.buttons.acceptAll = elements.banner.wrapper.getElementsByClassName("allow-all");
      elements.buttons.acceptNecessary = elements.banner.wrapper.getElementsByClassName("allow-necessary");
      elements.buttons.choose = elements.banner.wrapper.getElementsByClassName("choose");
      elements.buttons.toggle = elements.banner.wrapper.getElementsByClassName("toggle");
      elements.buttons.save = elements.banner.wrapper.getElementsByClassName("save");
      elements.buttons.askForConsent = document.getElementsByClassName("privacywire-consent-button");
      elements.buttons.externalTrigger = document.getElementsByClassName("privacywire-show-options");
      elements.checkboxes = {};
      var _iterator4 = _createForOfIteratorHelper(this.cookieGroups),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var key = _step4.value;
          if (key === "necessary") {
            continue;
          }
          elements.checkboxes[key] = document.getElementById(key);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      elements.blueprint = document.getElementById("privacywire-ask-consent-blueprint");
      elements.elementsWithRequiredConsent = this.settings.consentByClass === true ? document.getElementsByClassName("require-consent") : document.querySelectorAll("[data-category]");
      elements.consentWindows = document.getElementsByClassName("privacywire-ask-consent");
      return elements;
    }
  }, {
    key: "handleButtons",
    value: function handleButtons() {
      this.handleButtonHelper(this.elements.buttons.acceptAll, "handleButtonAcceptAll");
      this.handleButtonHelper(this.elements.buttons.acceptNecessary, "handleButtonAcceptNecessary");
      this.handleButtonHelper(this.elements.buttons.choose, "handleButtonChoose");
      this.handleButtonHelper(this.elements.buttons.toggle, "handleButtonToggle");
      this.handleButtonHelper(this.elements.buttons.save, "handleButtonSave");
      this.handleButtonHelper(this.elements.buttons.askForConsent, "handleButtonAskForConsent");
      this.handleButtonHelper(this.elements.buttons.externalTrigger, "handleButtonExternalTrigger");
    }
  }, {
    key: "handleButtonHelper",
    value: function handleButtonHelper(buttons, method) {
      if (buttons) {
        var pw = this;
        Array.from(buttons).forEach(function (btn) {
          pw[method](btn);
        });
      }
    }
  }, {
    key: "reHandleExternalButtons",
    value: function reHandleExternalButtons() {
      this.elements.buttons.externalTrigger = document.getElementsByClassName("privacywire-show-options");
      this.handleButtonHelper(this.elements.buttons.externalTrigger, "handleButtonExternalTrigger");
    }
  }, {
    key: "handleButtonAcceptAll",
    value: function handleButtonAcceptAll(btn) {
      var _this = this;
      btn.addEventListener("click", function () {
        var _iterator5 = _createForOfIteratorHelper(_this.cookieGroups),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var key = _step5.value;
            _this.userConsent.cookieGroups[key] = true;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        _this.syncConsentToCheckboxes();
        _this.saveConsent();
      });
    }
  }, {
    key: "handleButtonAcceptNecessary",
    value: function handleButtonAcceptNecessary(btn) {
      var _this2 = this;
      btn.addEventListener("click", function () {
        _this2.userConsent = _this2.getDefaultConsent();
        _this2.syncConsentToCheckboxes();
        _this2.saveConsent();
      });
    }
  }, {
    key: "handleButtonChoose",
    value: function handleButtonChoose(btn) {
      var _this3 = this;
      btn.addEventListener("click", function () {
        _this3.showOptions();
      });
    }
  }, {
    key: "handleButtonToggle",
    value: function handleButtonToggle(btn) {
      var _this4 = this;
      btn.addEventListener("click", function () {
        for (var key in _this4.elements.checkboxes) {
          _this4.elements.checkboxes[key].checked = _this4.toggleToStatus;
        }
        _this4.toggleToStatus = !_this4.toggleToStatus;
      });
    }
  }, {
    key: "handleButtonSave",
    value: function handleButtonSave(btn) {
      var _this5 = this;
      btn.addEventListener("click", function () {
        var _iterator6 = _createForOfIteratorHelper(_this5.cookieGroups),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var key = _step6.value;
            if (key === "necessary") {
              continue;
            }
            _this5.userConsent.cookieGroups[key] = _this5.elements.checkboxes[key].checked;
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
        _this5.saveConsent();
      });
    }
  }, {
    key: "handleButtonAskForConsent",
    value: function handleButtonAskForConsent(btn) {
      var _this6 = this;
      btn.addEventListener("click", function () {
        var dataset = btn.dataset;
        _this6.userConsent.cookieGroups[dataset.consentCategory] = true;
        _this6.syncConsentToCheckboxes();
        _this6.saveConsent();
        btn.parentElement.remove();
      });
    }
  }, {
    key: "handleButtonExternalTrigger",
    value: function handleButtonExternalTrigger(btn) {
      var _this7 = this;
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        _this7.showOptions();
      });
    }
  }, {
    key: "syncConsentToCheckboxes",
    value: function syncConsentToCheckboxes() {
      var _iterator7 = _createForOfIteratorHelper(this.cookieGroups),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var key = _step7.value;
          if (key === "necessary") {
            continue;
          }
          this.elements.checkboxes[key].checked = this.userConsent.cookieGroups[key];
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "checkForValidConsent",
    value: function checkForValidConsent() {
      if (this.userConsent.version > 0 && this.userConsent.version === this.settings.version) {
        return true;
      }
      if (this.settings.bots) {
        return this.checkForBots();
      }
      return this.settings.dnt && this.checkForUsersDNT() === true;
    }
  }, {
    key: "checkForUsersDNT",
    value: function checkForUsersDNT() {
      if (this.settings.dnt && navigator.doNotTrack === "1") {
        this.userConsent = this.getDefaultConsent();
        this.saveConsent(true);
        return true;
      }
      return false;
    }
  }, {
    key: "detectRobot",
    value: function detectRobot() {
      var robots = new RegExp([/bot/, /spider/, /crawl/,
      // GENERAL TERMS
      /APIs-Google/, /AdsBot/, /Googlebot/,
      // GOOGLE ROBOTS
      /mediapartners/, /Google Favicon/, /Google Page Speed Insights/, /Chrome-Lighthouse/,
      // GOOGLE PAGESPEED AND LIGHTHOUSE
      /FeedFetcher/, /Google-Read-Aloud/, /DuplexWeb-Google/, /googleweblight/, /bing/, /yandex/, /baidu/, /duckduck/, /yahoo/,
      // OTHER ENGINES
      /ecosia/, /ia_archiver/, /facebook/, /instagram/, /pinterest/, /reddit/,
      // SOCIAL MEDIA
      /slack/, /twitter/, /whatsapp/, /youtube/, /semrush/ // OTHER
      ].map(function (r) {
        return r.source;
      }).join("|"), "i"); // BUILD REGEXP + "i" FLAG

      return robots.test(navigator.userAgent);
    }
  }, {
    key: "checkForBots",
    value: function checkForBots() {
      if (this.detectRobot()) {
        this.userConsent = this.getDefaultConsent();
        this.saveConsent(true);
        return true;
      }
      return false;
    }
  }, {
    key: "saveConsent",
    value: function saveConsent() {
      var silent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.userConsent.version = this.settings.version;
      window.localStorage.removeItem(this.name);
      window.localStorage.setItem(this.name, JSON.stringify(this.userConsent));
      this.hideBannerAndOptions();
      if (!silent) {
        this.showMessage();
      }
      this.checkElementsWithRequiredConsent();
      this.triggerCustomFunction();
    }
  }, {
    key: "triggerCustomFunction",
    value: function triggerCustomFunction() {
      if (this.settings.customFunction.length && typeof window[this.settings.customFunction] === "function") {
        window[this.settings.customFunction]();
      }
    }
  }, {
    key: "hideBannerAndOptions",
    value: function hideBannerAndOptions() {
      this.elements.banner.wrapper.classList.remove("show-banner", "show-options");
      document.body.classList.remove("has-privacywire-window-opened");
      document.dispatchEvent(new CustomEvent('PrivacyWireBannerAndOptionsClosed'));
    }
  }, {
    key: "showBanner",
    value: function showBanner() {
      this.elements.banner.wrapper.classList.add("show-banner");
      document.body.classList.add("has-privacywire-window-opened");
      document.dispatchEvent(new CustomEvent('PrivacyWireBannerOpened'));
    }
  }, {
    key: "showOptions",
    value: function showOptions() {
      this.elements.banner.wrapper.classList.remove("show-banner");
      this.elements.banner.wrapper.classList.add("show-options");
      document.body.classList.add("has-privacywire-window-opened");
      document.dispatchEvent(new CustomEvent('PrivacyWireOptionsOpened'));
    }
  }, {
    key: "showMessage",
    value: function showMessage() {
      var _this8 = this;
      this.elements.banner.wrapper.classList.add("show-message");
      setTimeout(function () {
        _this8.elements.banner.wrapper.classList.remove("show-message");
      }, this.settings.messageTimeout);
    }
  }, {
    key: "checkElementsWithRequiredConsent",
    value: function checkElementsWithRequiredConsent() {
      if (this.settings.consentByClass === false) {
        this.elements.elementsWithRequiredConsent = document.querySelectorAll("[data-category]");
      }
      this.cleanOldConsentWindows();
      if (this.elements.elementsWithRequiredConsent) {
        var pw = this;
        Array.from(this.elements.elementsWithRequiredConsent).forEach(function (el) {
          var category = el.dataset.category;
          if (!category) {
            return;
          }
          var allowed = false;
          for (var consentCategory in pw.userConsent.cookieGroups) {
            if (consentCategory === category && pw.userConsent.cookieGroups[consentCategory] === true) {
              allowed = true;
              break;
            }
          }
          if (!allowed) {
            pw.updateDisallowedElement(el);
            return;
          }
          pw.updateAllowedElement(el);
        });
      }
    }
  }, {
    key: "cleanOldConsentWindows",
    value: function cleanOldConsentWindows() {
      var _this9 = this;
      if (this.elements.consentWindows) {
        Array.from(this.elements.consentWindows).forEach(function (el) {
          var dataset = el.dataset;
          var category = dataset.disallowedConsentCategory;
          var allowed = false;
          for (var consentCategory in _this9.userConsent.cookieGroups) {
            if (consentCategory === category && _this9.userConsent.cookieGroups[consentCategory] === true) {
              allowed = true;
              break;
            }
          }
          if (allowed) {
            el.remove();
          }
        });
      }
    }
  }, {
    key: "updateDisallowedElement",
    value: function updateDisallowedElement(el) {
      var dataset = el.dataset;
      if (!dataset.askConsent || dataset.askConsentRendered === "1") {
        return;
      }
      var category = dataset.category;
      var categoryLabel = this.settings.cookieGroups[category];
      var newEl = document.createElement("div");
      newEl.classList.add("privacywire-ask-consent", "consent-category-" + category);
      newEl.dataset.disallowedConsentCategory = category;
      newEl.innerHTML = this.elements.blueprint.innerHTML.formatUnicorn({
        category: categoryLabel,
        categoryname: category
      });
      if (dataset.askConsentMessage) {
        newEl.querySelector('.privacywire-consent-message').textContent = dataset.askConsentMessage;
      }
      if (dataset.askConsentButtonLabel) {
        newEl.querySelector('button').textContent = dataset.askConsentButtonLabel;
      }
      el.insertAdjacentElement('afterend', newEl);
      el.dataset.askConsentRendered = "1";
    }
  }, {
    key: "updateAllowedElement",
    value: function updateAllowedElement(el) {
      if (el.tagName.toLowerCase() === "script") {
        this.updateAllowedElementScript(el);
      } else {
        this.updateAllowedElementOther(el);
      }
    }
  }, {
    key: "updateAllowedElementScript",
    value: function updateAllowedElementScript(el) {
      var dataset = el.dataset;
      var newEl = document.createElement(el.tagName);
      for (var _i = 0, _Object$keys = Object.keys(dataset); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        newEl.dataset[key] = el.dataset[key];
      }
      newEl.type = dataset.type;
      if (dataset.src) {
        newEl.src = dataset.src;
      }
      // textContent is more suitable as innerText may change the value, is limited, costly and slower 
      // (like introduced <br> elements instead of new lines in inline scripts).
      // More: https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext
      newEl.textContent = el.textContent;
      if (el.id) {
        newEl.id = el.id;
      } // Do not create an empty ID attribute if no ID exist
      newEl.defer = el.defer;
      newEl.async = el.async;
      newEl = this.removeUnusedAttributesFromElement(newEl);
      el.insertAdjacentElement('afterend', newEl);
      el.remove();
    }
  }, {
    key: "updateAllowedElementOther",
    value: function updateAllowedElementOther(el) {
      var _dataset$type;
      var dataset = el.dataset;
      el.type = (_dataset$type = dataset.type) !== null && _dataset$type !== void 0 ? _dataset$type : 'text/javascript';
      ['src', 'srcset', 'srcdoc'].forEach(function (k) {
        if (dataset[k] !== undefined) {
          el[k] = dataset[k];
        }
      });
      this.removeUnusedAttributesFromElement(el);
    }
  }, {
    key: "removeUnusedAttributesFromElement",
    value: function removeUnusedAttributesFromElement(el) {
      el.removeAttribute("data-ask-consent");
      el.removeAttribute("data-ask-consent-rendered");
      el.removeAttribute("data-category");
      el.removeAttribute("data-src");
      el.removeAttribute("data-srcset");
      el.removeAttribute("data-srcdoc");
      el.removeAttribute("data-type");
      el.classList.remove("require-consent");
      return el;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.checkElementsWithRequiredConsent();
      this.handleButtonHelper(this.elements.buttons.askForConsent, "handleButtonAskForConsent");
    }
  }, {
    key: "removeStoredConsent",
    value: function removeStoredConsent() {
      if (!window.localStorage.getItem(this.name)) {
        return;
      }
      window.localStorage.removeItem(this.name);
    }
  }]);
  return PrivacyWire;
}();
document.addEventListener("DOMContentLoaded", function () {
  window.PrivacyWire = new PrivacyWire(PrivacyWireSettings);
});})();
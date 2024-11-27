# PrivacyWire
Cookie & Consent Manager for ProcessWire

This module adds the possibility to define cookie / consent groups and load corresponding elements only after the site visitor has given consent.  
The following cookie groups are available (the frontend visible label is editable and translatable, this is just the technical name)
* Necessary
* Functional
* Statistics
* Marketing
* External Media
* (All Cookies)  
Necessary elements are always active. You can let the user decide, which individual cookie group(s) should be allowed, and/or add an „Allow all“ button.

You can insert basic styles via css or completely style it yourself.
The PrivacyWire Core Javascript file is available both as ES6 as well as transpiled with Babel for IE11 support. Both versions have a very small footprint:

File   |   Size    | Gzipped
--- | :---: | ---:
PrivacyWire.js | < 9 kb | < 3 kb
PrivacyWire_legacy.js | < 13 kb | < 4 kb

To load scripts, frames, images or other elements only after the site visitor has given consent to that specific cookie group, use the following attributes:

```html
<script type="text/plain" data-type="text/javascript" data-category="functional" class="require-consent">console.log("This script only runs after giving consent to functional cookies");</script>
```
You can even render and alternate Opt-In text instead of the element:
```html
<iframe data-src="https://processwire.com/" data-category="marketing" data-ask-consent="1" class="require-consent" frameborder="0" height="400" width="400"></iframe>
```

**Available attributes:**

Attribute   |   Info    | Description | Type
--- | :---: | --- | ---:
class `require-consent` | optional (required if config option enabled) | If the config option "Detect consent windows by class `require-consent` instead of data-attribute" is enabled |string
`data-category` | required | defines the assigned cookie group for this element | string
`data-type` | optional (required for scripts) | replaces the type attribute after giving consent | string
`data-src` | optional (required for external scripts, images or iframes) | replaces the src attribute after giving consent | string
`data-srcset` | optional | replaces the srcset attribute for images after giving consent | string
`data-srcdoc` | optional | replaces the srcdoc attribute for iframes after giving consent | string
`data-ask-consent`| optional | Replace element with Opt-In-Element | bool `0/1`
`data-ask-consent-message`| optional | Replace configured message with this text for this instance | string
`data-ask-consent-button-label`| optional | Replace configured message with this text for this instance | string

For script tags it is required to add `type="text/plain"`, otherwise the script executes directly.

## Textformatter to choose Cookie groups / Opt-Out
With PrivacyWire itself comes a Textformatter with the shortcode `[[privacywire-choose-cookies]]` to add a button to show the cookie group selection window.  
To automatically include the Opt-In-Element for embedded videos via [TextformatterVideoEmbed](https://processwire.com/modules/textformatter-video-embed/) you can choose the cookie group in the Textformatter settings.

## Multiple language support / i18n
The module uses the [ProcessWire-integrated translation system](https://processwire.com/docs/multi-language-support/).

## Hookable methods
Most of the module methods are hookable! Have a look into [PrivacyWire.module](PrivacyWire.module) to find out more.

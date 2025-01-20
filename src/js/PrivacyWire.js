import '../css/PrivacyWire.css'
import "./string-formatter"

class PrivacyWire {
    constructor(PrivacyWireSettings) {
        this.name = "privacywire"
        this.toggleToStatus = true
        this.cookieGroups = Object.freeze([
            "necessary",
            "functional",
            "statistics",
            "marketing",
            "external_media"
        ])
        this.settings = this.sanitizeSettings(PrivacyWireSettings)
        this.userConsent = this.sanitizeStoredConsent()
        this.elements = this.initiateElements()
        this.syncConsentToCheckboxes()

        if (!this.checkForValidConsent()) {
            this.showBanner()
        }
        this.checkElementsWithRequiredConsent()
        this.handleButtons()
    }

    /**
     * Sanitize the inline script settings
     * @param {Object} PrivacyWireSettings - The inline script settings container
     * @returns {Object} Sanitized object with the settings
     */
    sanitizeSettings(PrivacyWireSettings) {
        let settings = {}
        settings.version = parseInt(PrivacyWireSettings.version)
        settings.dnt = Boolean(parseInt(PrivacyWireSettings.dnt))
        settings.bots = Boolean(parseInt(PrivacyWireSettings.bots))
        settings.customFunction = `${PrivacyWireSettings.customFunction}`
        settings.messageTimeout = parseInt(PrivacyWireSettings.messageTimeout)
        settings.consentByClass = Boolean(parseInt(PrivacyWireSettings.consentByClass))
        settings.cookieGroups = {}

        for (const key of this.cookieGroups) {
            settings.cookieGroups[key] = `${PrivacyWireSettings.cookieGroups[key]}`
        }

        return settings
    }

    /**
     * Sanitize stored consent from LocalStorage
     * @returns {Object} either empty object or sanitized stored consent object if version matches with settings version
     */
    sanitizeStoredConsent() {
        if (!window.localStorage.getItem(this.name)) {
            return this.getDefaultConsent()
        }

        const storedConsentRaw = JSON.parse(window.localStorage.getItem(this.name))
        if (parseInt(storedConsentRaw.version) !== this.settings.version) {
            return this.getDefaultConsent()
        }

        if (typeof storedConsentRaw.cookieGroups === 'undefined') {
            this.removeStoredConsent();
            return this.getDefaultConsent()
        }

        let storedConsent = {}
        storedConsent.version = parseInt(storedConsentRaw.version)
        storedConsent.cookieGroups = {}

        for (const key of this.cookieGroups) {
            storedConsent.cookieGroups[key] = Boolean(storedConsentRaw.cookieGroups[key])
        }

        return storedConsent
    }

    /**
     * Get default Consent object
     * @returns {Object} Consent object with only necessary allowed
     */
    getDefaultConsent() {
        let consent = {}
        consent.version = 0
        consent.cookieGroups = {}
        for (const key of this.cookieGroups) {
            consent.cookieGroups[key] = (key === "necessary")
        }
        return consent
    }

    initiateElements() {
        let elements = {}
        elements.banner = {}
        elements.banner.wrapper = document.getElementById("privacywire-wrapper")
        elements.banner.intro = elements.banner.wrapper.getElementsByClassName("privacywire-banner")
        elements.banner.options = elements.banner.wrapper.getElementsByClassName("privacywire-options")
        elements.banner.message = elements.banner.wrapper.getElementsByClassName("privacywire-message")

        elements.buttons = {}
        elements.buttons.acceptAll = elements.banner.wrapper.getElementsByClassName("allow-all")
        elements.buttons.acceptNecessary = elements.banner.wrapper.getElementsByClassName("allow-necessary")
        elements.buttons.choose = elements.banner.wrapper.getElementsByClassName("choose")
        elements.buttons.toggle = elements.banner.wrapper.getElementsByClassName("toggle")
        elements.buttons.save = elements.banner.wrapper.getElementsByClassName("save")
        elements.buttons.askForConsent = document.getElementsByClassName("privacywire-consent-button")
        elements.buttons.externalTrigger = document.getElementsByClassName("privacywire-show-options")

        elements.checkboxes = {}
        for (const key of this.cookieGroups) {
            if (key === "necessary") {
                continue
            }
            elements.checkboxes[key] = document.getElementById(key)
        }

        elements.blueprint = document.getElementById("privacywire-ask-consent-blueprint")

        elements.elementsWithRequiredConsent = (this.settings.consentByClass === true) ? document.getElementsByClassName("require-consent") : document.querySelectorAll("[data-category]")

        elements.consentWindows = document.getElementsByClassName("privacywire-ask-consent")

        return elements
    }


    handleButtons() {
        this.handleButtonHelper(this.elements.buttons.acceptAll, "handleButtonAcceptAll")
        this.handleButtonHelper(this.elements.buttons.acceptNecessary, "handleButtonAcceptNecessary")
        this.handleButtonHelper(this.elements.buttons.choose, "handleButtonChoose")
        this.handleButtonHelper(this.elements.buttons.toggle, "handleButtonToggle")
        this.handleButtonHelper(this.elements.buttons.save, "handleButtonSave")
        this.handleButtonHelper(this.elements.buttons.askForConsent, "handleButtonAskForConsent")
        this.handleButtonHelper(this.elements.buttons.externalTrigger, "handleButtonExternalTrigger")
    }

    handleButtonHelper(buttons, method) {
        if (buttons) {
            const pw = this
            Array.from(buttons).forEach((btn) => {
                pw[method](btn)
            })
        }
    }

    reHandleExternalButtons() {
        this.elements.buttons.externalTrigger = document.getElementsByClassName("privacywire-show-options")
        this.handleButtonHelper(this.elements.buttons.externalTrigger, "handleButtonExternalTrigger")
    }

    handleButtonAcceptAll(btn) {
        btn.addEventListener("click", () => {
            for (const key of this.cookieGroups) {
                this.userConsent.cookieGroups[key] = true
            }
            this.syncConsentToCheckboxes()
            this.saveConsent()
        })
    }

    handleButtonAcceptNecessary(btn) {
        btn.addEventListener("click", () => {
            this.userConsent = this.getDefaultConsent()
            this.syncConsentToCheckboxes()
            this.saveConsent()
        })
    }

    handleButtonChoose(btn) {
        btn.addEventListener("click", () => {
            this.showOptions()
        })
    }

    handleButtonToggle(btn) {
        btn.addEventListener("click", () => {
            for (const key in this.elements.checkboxes) {
                this.elements.checkboxes[key].checked = this.toggleToStatus
            }
            this.toggleToStatus = !this.toggleToStatus
        })
    }

    handleButtonSave(btn) {
        btn.addEventListener("click", () => {
            for (const key of this.cookieGroups) {
                if (key === "necessary") {
                    continue
                }
                this.userConsent.cookieGroups[key] = this.elements.checkboxes[key].checked
            }
            this.saveConsent()
        })
    }

    handleButtonAskForConsent(btn) {
        btn.addEventListener("click", () => {
            const {dataset} = btn
            this.userConsent.cookieGroups[dataset.consentCategory] = true
            this.syncConsentToCheckboxes()
            this.saveConsent()
            btn.parentElement.remove()
        })
    }

    handleButtonExternalTrigger(btn) {
        btn.addEventListener("click", (event) => {
            event.preventDefault()
            this.showOptions()
        })
    }

    syncConsentToCheckboxes() {
        for (const key of this.cookieGroups) {
            if (key === "necessary") {
                continue
            }
            this.elements.checkboxes[key].checked = this.userConsent.cookieGroups[key]
        }
    }

    checkForValidConsent() {
        if (this.userConsent.version > 0 && this.userConsent.version === this.settings.version) {
            return true
        }
        if (this.settings.bots) {
            return this.checkForBots();
        }

        return this.settings.dnt && this.checkForUsersDNT() === true

    }

    checkForUsersDNT() {
        if (this.settings.dnt && navigator.doNotTrack === "1") {
            this.userConsent = this.getDefaultConsent()
            this.saveConsent(true)

            return true
        }
        return false
    }

    detectRobot() {

        const robots = new RegExp([
            /bot/, /spider/, /crawl/,                            // GENERAL TERMS
            /APIs-Google/, /AdsBot/, /Googlebot/,                // GOOGLE ROBOTS
            /mediapartners/, /Google Favicon/,
            /Google Page Speed Insights/, /Chrome-Lighthouse/,  // GOOGLE PAGESPEED AND LIGHTHOUSE
            /FeedFetcher/, /Google-Read-Aloud/,
            /DuplexWeb-Google/, /googleweblight/,
            /bing/, /yandex/, /baidu/, /duckduck/, /yahoo/,        // OTHER ENGINES
            /ecosia/, /ia_archiver/,
            /facebook/, /instagram/, /pinterest/, /reddit/,       // SOCIAL MEDIA
            /slack/, /twitter/, /whatsapp/, /youtube/,
            /semrush/,                                         // OTHER
        ].map((r) => r.source).join("|"), "i");               // BUILD REGEXP + "i" FLAG

        return robots.test(navigator.userAgent);
    }

    checkForBots() {
        if (this.detectRobot()) {
            this.userConsent = this.getDefaultConsent()
            this.saveConsent(true)
            return true
        }
        return false
    }

    saveConsent(silent = false) {
        this.userConsent.version = this.settings.version
        window.localStorage.removeItem(this.name)
        window.localStorage.setItem(this.name, JSON.stringify(this.userConsent))
        this.hideBannerAndOptions()

        if (!silent) {
            this.showMessage()
        }

        this.checkElementsWithRequiredConsent()
        this.triggerCustomFunction()

    }

    triggerCustomFunction() {
        if (this.settings.customFunction.length && typeof window[this.settings.customFunction] === "function") {
            window[this.settings.customFunction]()
        }
    }

    hideBannerAndOptions() {
        this.elements.banner.wrapper.classList.remove("show-banner", "show-options")
        document.body.classList.remove("has-privacywire-window-opened")
        document.dispatchEvent(new CustomEvent('PrivacyWireBannerAndOptionsClosed'))
    }

    showBanner() {
        this.elements.banner.wrapper.classList.add("show-banner")
        document.body.classList.add("has-privacywire-window-opened")
        document.dispatchEvent(new CustomEvent('PrivacyWireBannerOpened'))
    }

    showOptions() {
        this.elements.banner.wrapper.classList.remove("show-banner")
        this.elements.banner.wrapper.classList.add("show-options")
        document.body.classList.add("has-privacywire-window-opened")
        document.dispatchEvent(new CustomEvent('PrivacyWireOptionsOpened'))
    }

    showMessage() {
        this.elements.banner.wrapper.classList.add("show-message")
        setTimeout(() => {
            this.elements.banner.wrapper.classList.remove("show-message")
        }, this.settings.messageTimeout)
    }

    checkElementsWithRequiredConsent() {

        if (this.settings.consentByClass === false) {
            this.elements.elementsWithRequiredConsent = document.querySelectorAll("[data-category]")
        }

        this.cleanOldConsentWindows()
        if (this.elements.elementsWithRequiredConsent) {
            const pw = this
            Array.from(this.elements.elementsWithRequiredConsent).forEach(function (el) {
                const category = el.dataset.category
                if (!category) {
                    return
                }
                let allowed = false

                for (const consentCategory in pw.userConsent.cookieGroups) {
                    if (consentCategory === category && pw.userConsent.cookieGroups[consentCategory] === true) {
                        allowed = true
                        break
                    }
                }
                if (!allowed) {
                    pw.updateDisallowedElement(el)
                    return
                }
                pw.updateAllowedElement(el)
            })
        }
    }

    cleanOldConsentWindows() {
        if (this.elements.consentWindows) {
            Array.from(this.elements.consentWindows).forEach((el) => {
                const {dataset} = el
                const category = dataset.disallowedConsentCategory
                let allowed = false

                for (const consentCategory in this.userConsent.cookieGroups) {
                    if (consentCategory === category && this.userConsent.cookieGroups[consentCategory] === true) {
                        allowed = true
                        break
                    }
                }
                if (allowed) {
                    el.remove()
                }
            })
        }
    }

    updateDisallowedElement(el) {
        const {dataset} = el
        if (!dataset.askConsent || dataset.askConsentRendered === "1") {
            return
        }

        const category = dataset.category
        const categoryLabel = this.settings.cookieGroups[category]

        let newEl = document.createElement("div")
        newEl.classList.add("privacywire-ask-consent", "consent-category-" + category)
        newEl.dataset.disallowedConsentCategory = category
        newEl.innerHTML = this.elements.blueprint.innerHTML.formatUnicorn({
            category: categoryLabel,
            categoryname: category
        })
        el.insertAdjacentElement('afterend', newEl)
        el.dataset.askConsentRendered = "1"
    }

    updateAllowedElement(el) {
        if (el.tagName.toLowerCase() === "script") {
            this.updateAllowedElementScript(el)
        } else {
            this.updateAllowedElementOther(el)
        }
    }

    updateAllowedElementScript(el) {
        const {dataset} = el

        let newEl = document.createElement(el.tagName)
        for (const key of Object.keys(dataset)) {
            newEl.dataset[key] = el.dataset[key]
        }
        newEl.type = dataset.type ?? 'text/javascript'
        if (dataset.src) {
            newEl.src = dataset.src
        }
        // textContent is more suitable as innerText may change the value, is limited, costly and slower 
        // (like introduced <br> elements instead of new lines in inline scripts).
        // More: https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext
        newEl.textContent = el.textContent
        if (el.id) { newEl.id = el.id} // Do not create an empty ID attribute if no ID exist
        newEl.defer = el.defer
        newEl.async = el.async
        newEl = this.removeUnusedAttributesFromElement(newEl)
        el.insertAdjacentElement('afterend', newEl)
        el.remove()
    }

    updateAllowedElementOther(el) {
        const {dataset} = el
        el.type = dataset.type ?? 'text/javascript'
        el.src = dataset.src
        el.srcset = dataset.srcset
        el.poster = dataset.poster
        this.removeUnusedAttributesFromElement(el)
    }

    removeUnusedAttributesFromElement(el) {
        el.removeAttribute("data-ask-consent")
        el.removeAttribute("data-ask-consent-rendered")
        el.removeAttribute("data-category")
        el.removeAttribute("data-src")
        el.removeAttribute("data-srcset")
        el.removeAttribute("data-poster")
        el.removeAttribute("data-type")
        el.classList.remove("require-consent")
        return el
    }

    refresh() {
        this.checkElementsWithRequiredConsent()
        this.handleButtonHelper(this.elements.buttons.askForConsent, "handleButtonAskForConsent")
    }

    removeStoredConsent() {
        if (!window.localStorage.getItem(this.name)) {
            return;
        }
        window.localStorage.removeItem(this.name);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.PrivacyWire = new PrivacyWire(PrivacyWireSettings)
});

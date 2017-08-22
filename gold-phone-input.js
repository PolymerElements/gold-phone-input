import '../polymer/polymer.js';
import { PaperInputBehavior } from '../paper-input/paper-input-behavior.js';
import '../paper-input/paper-input-container.js';
import '../paper-input/paper-input-error.js';
import '../paper-styles/typography.js';
import '../iron-input/iron-input.js';
import { IronFormElementBehavior } from '../iron-form-element-behavior/iron-form-element-behavior.js';
import '../iron-flex-layout/iron-flex-layout.js';
import { Polymer } from '../polymer/lib/legacy/polymer-fn.js';
import { DomModule } from '../polymer/lib/elements/dom-module.js';
import { Element } from '../polymer/polymer-element.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="gold-phone-input">
  <template>
    <style>
      :host {
        display: block;
      }

      /* TODO: This should be a dropdown */
      span {
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }

      .country-code {
        width: 40px;
        @apply --gold-phone-input-country-code;
      }

      input {
        @apply --layout-flex;
      }
      input
      {
        position: relative; /* to make a stacking context */
        outline: none;
        box-shadow: none;
        padding: 0;
        width: 100%;
        max-width: 100%;
        background: transparent;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: bottom;
        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }
      input::-webkit-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input::-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-ms-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
    </style>
    <paper-input-container id="container" disabled\$="[[disabled]]" no-label-float="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]" invalid="[[invalid]]">

      <label slot="label" hidden\$="[[!label]]">[[label]]</label>

      <span slot="prefix" prefix="" class="country-code">+[[countryCode]]</span>

      <span id="template-placeholder"></span>

      <template is="dom-if" if="[[errorMessage]]">
        <paper-input-error slot="add-on" id="error">
          [[errorMessage]]
        </paper-input-error>
      </template>

    </paper-input-container>
  </template>

  <template id="v0">
    <input is="iron-input" id="input" slot="input" aria-labelledby\$="[[_ariaLabelledBy]]" aria-describedby\$="[[_ariaDescribedBy]]" required\$="[[required]]" bind-value="{{value}}" name\$="[[name]]" allowed-pattern="[0-9\\-]" autocomplete="tel" type="tel" prevent-invalid-input="" disabled\$="[[disabled]]" invalid="{{invalid}}" autofocus\$="[[autofocus]]" inputmode\$="[[inputmode]]" placeholder\$="[[placeholder]]" readonly\$="[[readonly]]" maxlength\$="[[maxlength]]" size\$="[[size]]">
  </template>

  <template id="v1">
    <iron-input id="input" slot="input" bind-value\$="{{value}}" allowed-pattern="[0-9\\-]" invalid\$="{{invalid}}">
      <input id="nativeInput" aria-labelledby\$="[[_ariaLabelledBy]]" aria-describedby\$="[[_ariaDescribedBy]]" required="[[required]]" name="[[name]]" autocomplete="tel" type="tel" disabled="[[disabled]]" autofocus="[[autofocus]]" inputmode="[[inputmode]]" placeholder="[[placeholder]]" readonly="[[readonly]]" maxlength="[[maxlength]]" size="[[size]]">
    </iron-input>
  </template>

  

</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({

  is: 'gold-phone-input',

  behaviors: [
    PaperInputBehavior,
    IronFormElementBehavior
  ],

  properties: {

    /**
     * The label for this input.
     */
    label: {
      type: String,
      value: 'Phone number'
    },

    /*
     * The country code that should be recognized and parsed.
     */
    countryCode: {
      type: String,
      value: '1'
    },

    /*
     * The format of a valid phone number, including formatting but excluding
     * the country code. Use 'X' to denote the digits separated by dashes.
     */
    phoneNumberPattern: {
      type: String,
      value: 'XXX-XXX-XXXX',
      observer: '_phoneNumberPatternChanged'
    },

    value: {
      type: String,
      observer: '_onValueChanged'
    },

    /**
     * International format of the input value.
     *
     * @type {String}
     */
    internationalValue: {
      type: String,
      computed: '_computeInternationalValue(countryCode, value)'
    }
  },

  observers: [
    '_onFocusedChanged(focused)'
  ],

  beforeRegister: function() {
    var template = DomModule.import('gold-phone-input', 'template');
    var version = Element ? 'v1' : 'v0';
    var inputTemplate = DomModule.import('gold-phone-input', 'template#' + version);
    var inputPlaceholder = template.content.querySelector('#template-placeholder');
    if (inputPlaceholder) {
      inputPlaceholder.parentNode.replaceChild(inputTemplate.content, inputPlaceholder);
    }
  },

  /**
  * Returns a reference to the focusable element. Overridden from PaperInputBehavior
  * to correctly focus the native input.
  */
  get _focusableElement() {
    return Element ? this.inputElement._inputElement : this.inputElement;
  },

  // Note: This event is only available in the 2.0 version of this element.
  // In 1.0, the functionality of `_onIronInputReady` is done in
  // PaperInputBehavior::attached.
  listeners: {
    'iron-input-ready': '_onIronInputReady'
  },

  ready: function() {
    if (this.value && !Element) {
        this._handleAutoValidate();
    }
  },

  _onIronInputReady: function() {
    // Only validate when attached if the input already has a value.
    if (!!this.inputElement.bindValue) {
      this._handleAutoValidate();
    // Assign an empty string value if no value so if it becomes time
    // to validate it is not undefined.
    } else {
      this.value = '';
    }
  },

  _phoneNumberPatternChanged: function() {
    // Transform the pattern into a regex the iron-input understands.
    var regex = '';
    regex = this.phoneNumberPattern.replace(/\s/g, '\\s');
    regex = regex.replace(/X/gi, '\\d');
    regex = regex.replace(/\+/g, '\\+');
    if (this.$.nativeInput) {
      this.$.nativeInput.pattern = regex;
    } else {
      this.$.input.pattern = regex;
    }
  },

  /**
   * A handler that is called on input
   */
  _onValueChanged: function(value, oldValue) {
    // The initial property assignment is handled by `ready`.
    if (oldValue == undefined || value === oldValue)
      return;

    //Ensure value is a string
    value = value ? value.toString() : '';

    // Keep track of how many dashes the original value has. After
    // reformatting the value, we might gain or lose some of them, which
    // means we have to correctly move the caret to account for the difference.
    var start = this.$.input.selectionStart;
    var initialDashesBeforeCaret = value.substr(0, start).split('-').length - 1;

    // Remove any already-applied formatting.
    value = value.replace(/-/g, '');
    var shouldFormat = value.length <= this.phoneNumberPattern.replace(/-/g, '').length;
    var formattedValue = '';

    // Fill in the dashes according to the specified pattern.
    var currentDashIndex = 0;
    var totalDashesAdded = 0;
    for (var i = 0; i < value.length; i++) {
      currentDashIndex = this.phoneNumberPattern.indexOf('-', currentDashIndex);

      // Since we remove any formatting first, we need to account added dashes
      // when counting the position of new dashes in the pattern.
      if (shouldFormat && i == (currentDashIndex - totalDashesAdded)) {
        formattedValue += '-';
        currentDashIndex++;
        totalDashesAdded++;
      }

      formattedValue += value[i];
    }

    var updatedDashesBeforeCaret = formattedValue.substr(0, start).split('-').length - 1;
    var dashesDifference = updatedDashesBeforeCaret - initialDashesBeforeCaret;

    // Note: this will call _onValueChanged again, which will move the
    // cursor to the end of the value. Correctly adjust the caret afterwards.
    this.updateValueAndPreserveCaret(formattedValue.trim());

    // Advance or back up the caret based on the change that happened before it.
    this.$.input.selectionStart =
        this.$.input.selectionEnd = start + dashesDifference;

    this._handleAutoValidate();
  },

  /**
   * Overidden from Polymer.PaperInputBehavior.
   */
  validate: function() {
    // Update the container and its addons (i.e. the custom error-message).
    var valid = this.$.input.validate();

    this.$.container.invalid = !valid;
    this.$.container.updateAddons({
      inputElement: this.$.input,
      value: this.value,
      invalid: !valid
    });

    return valid;
  },

  /**
   * Overidden from Polymer.IronControlState.
   */
  _onFocusedChanged: function(focused) {
    if (!focused) {
      this._handleAutoValidate();
    }
  },

  /**
   * Returns the phone number value prefixed by the country code or simply
   * the value if the country code is not set. When	`value` equals
   * "3-44-55-66-77" and the `countryCode` is "33", the `internationalValue`
   * equals "+(33)3-44-55-66-77"
   */
  _computeInternationalValue: function(countryCode, value) {
    return countryCode ? '+(' + countryCode + ')' + value : value;
  }
});

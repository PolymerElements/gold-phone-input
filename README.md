[![Published on NPM](https://img.shields.io/npm/v/@polymer/gold-phone-input.svg)](https://www.npmjs.com/package/@polymer/gold-phone-input)
[![Build status](https://travis-ci.org/PolymerElements/gold-phone-input.svg?branch=master)](https://travis-ci.org/PolymerElements/gold-phone-input)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://webcomponents.org/element/@polymer/gold-phone-input)

## &lt;gold-phone-input&gt;
`<gold-phone-input>` is a single-line text field with Material Design styling
for entering a phone number.

See: [Documentation](https://www.webcomponents.org/element/@polymer/gold-phone-input),
  [Demo](https://www.webcomponents.org/element/@polymer/gold-phone-input/demo/demo/index.html).

## Usage

### Installation
```
npm install --save @polymer/gold-phone-input
```

### In an html file
```html
<html>
  <head>
    <script type="module">
      import '@polymer/gold-phone-input/gold-phone-input.js';
    </script>
  </head>
  <body>
    <gold-phone-input
        label="France phone number"
        country-code="33"
        phone-number-pattern="X-XX-XX-XX-XX"
        auto-validate>
    </gold-phone-input>
  </body>
</html>
```

### In a Polymer 3 element
```js
import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/gold-phone-input/gold-phone-input.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
      <gold-phone-input
          label="France phone number"
          country-code="33"
          phone-number-pattern="X-XX-XX-XX-XX"
          auto-validate>
      </gold-phone-input>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Contributing
If you want to send a PR to this element, here are
the instructions for running the tests and demo locally:

### Installation
```sh
git clone https://github.com/PolymerElements/gold-phone-input
cd gold-phone-input
npm install
npm install -g polymer-cli
```

### Running the demo locally
```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```



/*!
 * customizer-buy-btn-gate.js
 *
 * Hides the buy buttons (.buy-btn-part and #gokwik-buy-now) on PDPs that
 * have required Product Customizer fields, until ALL required fields are
 * filled in. On products without customizer fields it is a no-op.
 *
 * The selectors target the Product Customizer ASW app DOM:
 *   .product-customizer-option.option-required > input[required]
 *   .product-customizer-option.option-required > textarea[required]
 *   .product-customizer-option.option-required > select[required]
 */
(function () {
  'use strict';

  var REQUIRED_FIELD_SELECTOR =
    '.product-customizer-option.option-required input[required]:not([type="radio"]):not([type="checkbox"]),' +
    '.product-customizer-option.option-required textarea[required],' +
    '.product-customizer-option.option-required select[required]';

  var BUY_TARGET_SELECTOR = '.buy-btn-part, #gokwik-buy-now';

  function getRequiredFields() {
    return document.querySelectorAll(REQUIRED_FIELD_SELECTOR);
  }

  function getBuyTargets() {
    return document.querySelectorAll(BUY_TARGET_SELECTOR);
  }

  function allFilled(fields) {
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f.type === 'radio' || f.type === 'checkbox') {
        if (!f.checked) return false;
        continue;
      }
      var v = f.value == null ? '' : String(f.value).trim();
      if (v === '') return false;
    }
    return true;
  }

  function update() {
    var fields = getRequiredFields();
    var targets = getBuyTargets();
    if (fields.length === 0 || targets.length === 0) return;
    var show = allFilled(fields);
    for (var i = 0; i < targets.length; i++) {
      targets[i].style.display = show ? '' : 'none';
    }
  }

  // Event delegation at document level catches inputs even if the
  // customizer app re-renders its DOM.
  document.addEventListener('input', update, true);
  document.addEventListener('change', update, true);
  document.addEventListener('keyup', update, true);

  function init() {
    update();
    // The customizer DOM may render slightly after DOMContentLoaded
    // (some app versions insert nodes via JS). Re-check a few times.
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      update();
      if (attempts >= 10 || getRequiredFields().length > 0) {
        // We either found the fields or gave up after ~5s.
        clearInterval(interval);
      }
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

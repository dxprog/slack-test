/**
 * Wrapper for some basic functionality on a <select> element
 *
 * @constructor
 * @param {HTMLSelectElement} el The select element to use.
 */
function Dropdown(el) {
  if (!(el instanceof HTMLSelectElement)) {
    throw new Error('Dropdown requires a <select> element');
  }
  this.el = el;
  this.el.addEventListener('change', this.onSelect.bind(this));
}

Dropdown.prototype = {
  /**
   * Handler for select's "onchange" event. Fires the event out.
   */
  _onSelect: function onSelect(evt) {
    this.fire('change', this.el.value);
  },

  /**
   * Returns the value of the dropdown
   *
   * @method getValue
   * @return {String} The value of the dropdown
   */
  getValue: function getValue() {
    return this.el.value;
  }
};

mixinEvents(Dropdown);

module.exports = Dropdown;
function Dropdown(el) {
  if (!(el instanceof HTMLSelectElement)) {
    throw new Error('Dropdown requires a <select> element');
  }
  this.el = el;
  this.el.addEventListener('change', this.onSelect.bind(this));
  this.eventMap = {};
}

Dropdown.prototype = {
  onSelect: function onSelect(evt) {
    this.fire('change', this.el.value);
  }
};

mixinEvents(Dropdown);

module.exports = Dropdown;
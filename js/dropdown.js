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
  },

  fire: function(event, data) {
    var callbacks = this.eventMap[event];
    if (!!callbacks) {
      for (var i = 0, count = callbacks.length; i < count; i++) {
        callbacks[i](data);
      }
    }
  },

  on: function(event, cb) {
    if (typeof cb !== 'function') {
      throw new Error('callback must be a function');
    }
    var callbacks = this.eventMap[event] || [];
    callbacks.push(cb);
    this.eventMap[event] = callbacks;
  }
}

module.exports = Dropdown;
function ImageGrid(el) {
  if (!(el instanceof HTMLElement)) {
    throw new Error('el must be an element');
  }
  this.el = el;
  this.cells = [];
  this.init();
};

ImageGrid.prototype = {
  init: function init() {
    this.el.classList.add('image-container');
  },

  // Loads images from the specified provider. Arguably, not
  // terribly secure at all...
  load: function load(provider) {
    var self = this;
    return new Promise(function(resolve, reject) {
      // Temporarily grab images from redditbooru
      require('./js/service-connectors/' + provider + '.js', function(provider) {
        provider().then(function(data) {
          self.data = data;
          self.render();
        });
      });
    });
  },

  render: function render() {
    // TODO - make this less ugly somehow...
    var self = this;
    require('./js/image-cell.js', function(ImageCell) {
      var newCells = [];
      var cell;
      self.empty();
      for (var i = 0, count = self.data.length; i < count; i++) {
        // Try to reuse cells where possible
        cell = self.cells.pop() || new ImageCell();
        cell.update(self.data[i]);
        self.el.appendChild(cell.el);
      }
    });
  },

  empty: function empty() {
    var el = this.el;
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
};

module.exports = ImageGrid;
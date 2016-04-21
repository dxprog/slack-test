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

  render: function render(data) {
    // TODO - make this less ugly somehow...
    var self = this;
    require('./js/image-cell.js', function(ImageCell) {
      var newCells = [];
      var el = self.el;
      var cell;
      for (var i = 0, count = data.length; i < count; i++) {
        // Try to reuse cells where possible
        cell = self.cells.shift() || new ImageCell(el);
        cell.render(data[i]);
        newCells.push(cell);
      }

      // Scrub any remaining old cells off the grid
      var remainingCells = self.cells.splice(i);
      while (!!remainingCells.length) {
        console.log('throwing away cell');
        cell = self.cells.shift();
        el.removeChild(cell.el);
      }

      self.cells = newCells;
    });
  }
};

module.exports = ImageGrid;
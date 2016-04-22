var CLICK = 'ontouchend' in window ? 'touchend' : 'click';

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
    this.el.addEventListener(CLICK, this.onClick.bind(this));
  },

  onClick: function onClick(evt) {
    if (evt.target.tagName === 'IMG') {
      var parent = evt.target.parentNode;
      this.fire('image-click', parseInt(parent.getAttribute('data-index')));
    }
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
        cell.el.setAttribute('data-index', i);
        newCells.push(cell);
      }

      // Scrub any remaining old cells off the grid
      var remainingCells = self.cells;
      while (!!remainingCells.length) {
        cell = remainingCells.shift();
        cell.el.parentNode.removeChild(cell.el);
      }

      self.cells = newCells;
    });
  }
};

mixinEvents(ImageGrid);

module.exports = ImageGrid;
/**
 * A single Image cell for use in an ImageGride
 *
 * @constructor
 * @param {HTMLElement} parent The cell's parent element
 */
function ImageCell(parent) {
  this.parent = parent;
  this.el = document.createElement('div');
  this.el.classList.add('image-cell');
  this.image = document.createElement('img');
  this.el.appendChild(this.image);
  this._inDOM = false;
}

ImageCell.prototype = {
  /**
   * Updates the cell with new data and renders it
   *
   * @method render
   * @param {Object} data The data to render. Ex: { src, title }
   */
  render: function update(data) {
    var el = this.el;
    var image = this.image;
    el.style.backgroundImage = 'url(' + data.src + ')';
    image.src = data.src;
    image.setAttribute('alt', data.title);
    image.setAttribute('title', data.title);
    if (!this._inDOM) {
      this.parent.appendChild(this.el);
      this._inDOM = true;
    }
  }
};

module.exports = ImageCell;
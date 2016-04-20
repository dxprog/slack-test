function ImageCell(parent) {
  this.parent = parent;
  this.el = document.createElement('div');
  this.image = document.createElement('img');
  this.el.appendChild(this.image);
  this._inDOM = false;
}

ImageCell.prototype = {
  render: function update(data) {
    this.image.src = data.src;
    if (!this._inDOM) {
      this.parent.appendChild(this.el);
      this._inDOM = true;
    }
  }
};

module.exports = ImageCell;
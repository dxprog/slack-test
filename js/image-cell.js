function ImageCell() {
  this.el = document.createElement('div');
  this.image = document.createElement('img');
  this.el.appendChild(this.image);
}

ImageCell.prototype = {
  update: function update(data) {
    this.image.src = data.src;
  }
};

module.exports = ImageCell;
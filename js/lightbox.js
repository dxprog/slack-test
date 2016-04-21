var VISIBLE = 'visible';

function Lightbox(el, data) {
  this.el = el;
  this.data = data;
  this.index = 0;
  this.init();
}

Lightbox.prototype = {
  init: function() {
    var modalEl = this.modalEl = document.createElement('div');
    modalEl.className = 'modal';

    var imageContainerEl = this.imageContainerEl = document.createElement('div');
    imageContainerEl.className = 'image-container';
    this.imageEl = document.createElement('img');
    imageContainerEl.appendChild(this.imageEl);
    modalEl.appendChild(imageContainerEl);

    this.titleEl = document.createElement('h2');
    modalEl.appendChild(this.titleEl);

    this.prevButtonEl = document.createElement('button');
    modalEl.appendChild(this.prevButtonEl);
    this.nextButtonEl = document.createElement('button');
    modalEl.appendChild(this.nextButtonEl);

    this.el.appendChild(modalEl);
  },

  setData: function setData(data) {
    this.data = data;
    this.index = 0;
  },

  show: function show(index) {
    var image = this.data[index];
    if (image) {
      index = index || this.index;
      this.el.classList.add(VISIBLE);
      this.imageContainerEl.style.backgroundImage = 'url(' + image.src + ')';
      this.imageEl.src = image.src;
      this.titleEl.textContent = image.title;
    }
  },

  hide: function hide() {
    this.el.classList.remove(VISIBLE);
  }
};

module.exports = Lightbox;
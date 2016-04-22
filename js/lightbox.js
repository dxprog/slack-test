var VISIBLE = 'visible';
var MODAL_PADDING = 80;

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

    this.imageEl = document.createElement('img');
    modalEl.appendChild(this.imageEl);

    this.titleEl = document.createElement('h2');
    modalEl.appendChild(this.titleEl);

    this.backButtonEl = this._createButton('Back', 'back', this._onBackClick);
    modalEl.appendChild(this.backButtonEl);
    this.nextButtonEl = this._createButton('Next', 'next', this._onNextClick);
    modalEl.appendChild(this.nextButtonEl);

    this.el.appendChild(modalEl);
  },

  setData: function setData(data) {
    this.data = data;
    this.index = 0;
  },

  _createButton: function _createButton(title, className, cb) {
    var button = document.createElement('button');
    button.className = className;
    button.textContent = title;
    if (cb) {
      button.addEventListener('click', cb.bind(this));
    }
    return button;
  },

  _loadImage: function(src) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
        resolve(img);
      };

      img.onerror = function() {
        reject();
      }

      img.src = src;
    });
  },

  _onNextClick: function(evt) {
    this.index += this.index + 1 < this.data.length ? 1 : 0;
    this.show();
  },

  _onBackClick: function(evt) {
    this.index -= this.index - 1 >= 0 ? 1 : 0;
    this.show();
  },

  resizeLightbox: function resizeLightbox(img) {
    img = img || this.imageEl;
    var winWidth = window.innerWidth - MODAL_PADDING;
    var winHeight = window.innerHeight - MODAL_PADDING;
    var imgWidth = img.naturalWidth;
    var imgHeight = img.naturalHeight;

    // Resize
    if (imgWidth > winWidth || imgHeight > winHeight) {
      if (imgWidth > imgHeight) {
        imgHeight = Math.round(imgHeight / imgWidth * winWidth);
        imgWidth = winWidth;
      } else {
        imgWidth = Math.round(imgWidth / imgHeight * winHeight);
        imgHeight = winHeight;
      }

      // If still too large, resize using the other axis as the clamp
      if (imgWidth > winWidth) {
        imgHeight = Math.round(imgHeight / imgWidth * winWidth);
        imgWidth = winWidth;
      } else if (imgHeight > winHeight) {
        imgWidth = Math.round(imgWidth / imgHeight * winHeight);
        imgHeight = winHeight;
      }

    }

    this.modalEl.style.width = imgWidth + 'px';
    this.modalEl.style.height = imgHeight + 'px';
  },

  show: function show(index) {
    var self = this;
    index = index || self.index;
    var image = self.data[index];
    if (image) {
      self._loadImage(image.src).then(function(img) {
        self.el.classList.add(VISIBLE);
        self.resizeLightbox(img);
        self.imageEl.src = image.src;
        self.titleEl.textContent = image.title;
        self.index = index;
      });
    }
  },

  hide: function hide() {
    this.el.classList.remove(VISIBLE);
  }
};

module.exports = Lightbox;
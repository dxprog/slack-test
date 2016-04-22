var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_ESC = 27;
var VISIBLE = 'visible';
var FADEOUT = 'fadeout';
var MODAL_PADDING = 80;
var CLICK = 'ontouchend' in window ? 'touchend' : 'click';

/**
 * Lightbox modal object
 *
 * @constructor
 * @param {HTMLElement} el The element that the lightbox will use
 * @param {Object[]} data An array of image objects
 * @param {String} data[].src The URL to the image
 * @param {String} data[].title The title of the image
 */
function Lightbox(el, data) {
  if (!(el instanceof HTMLElement)) {
    throw new Error('el must be an element');
  }

  data = Array.isArray(data) ? data : [ data ];
  this.el = el;
  this.data = data;
  this.index = 0;
  this.isVisible = false;
  this._sizeDebounce = null;
  this.init();
}

Lightbox.prototype = {
  /**
   * Creates the DOM structure and adds event listeners
   */
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
    this.closeButtonEl = this._createButton('Close', 'close', this._onCloseClick);
    modalEl.appendChild(this.closeButtonEl);

    this.el.appendChild(modalEl);

    this.el.addEventListener(CLICK, this._onOverlayClick.bind(this));
    window.addEventListener('resize', this._onWindowResize.bind(this));
    window.addEventListener('keydown', this._onKeyPress.bind(this));
  },

  /**
   * Updates the image data and sets the index back to 0
   *
   * @method setData
   * @param {Object[]} data An array of image objects
   * @param {String} data[].src The URL to the image
   * @param {String} data[].title The title of the image
   */
  setData: function setData(data) {
    this.data = data;
    this.index = 0;
  },

  /**
   * Creates a button element with a name and click event listeners
   *
   * @private
   * @param {String} title The title of the button
   * @param {String} className A class to add to the button
   * @param {Function} [cb] A callback to bind to the click event
   * @return {HTMLButtonElement} The generate button
   */
  _createButton: function _createButton(title, className, cb) {
    var button = document.createElement('button');
    button.className = className;
    button.textContent = title;
    if (cb) {
      button.addEventListener(CLICK, cb.bind(this));
    }
    return button;
  },

  /**
   * Debounced window resize event handler
   *
   * @private
   */
  _onWindowResize: function _windowResize() {
    clearTimeout(this._sizeDebounce);
    this._sizeDebounce = setTimeout(this.resizeLightbox.bind(this), 50);
  },

  /**
   * Keyboard input handler
   *
   * @private
   */
  _onKeyPress: function _onKeyPress(evt) {
    var keyCode = evt.keyCode || evt.charCode;
    if (this.isVisible) {
      switch (keyCode) {
        case KEY_LEFT:
          this._onBackClick(evt);
          break;
        case KEY_RIGHT:
          this._onNextClick(evt);
          break;
        case KEY_ESC:
          this.hide();
          break;
      }
    }
  },

  /**
   * Overlay click handler. Hides the modal when clicked outside
   *
   * @private
   */
  _onOverlayClick: function _onOverlayClick(evt) {
    if (evt.target === this.el) {
      this.hide();
    }
  },

  /**
   * Image preloader
   *
   * @method _loadImage
   * @private
   * @param {String} src The URL of the image to load
   * @return {Promise} A promise that resolves with the loaded image
   */
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

  /**
   * Next button click handler
   *
   * @private
   */
  _onNextClick: function _onBackClick(evt) {
    this.index += this.index + 1 < this.data.length ? 1 : 0;
    this.show();
  },

  /**
   * Back button click handler
   *
   * @private
   */
  _onBackClick: function _onBackClick(evt) {
    this.index -= this.index - 1 >= 0 ? 1 : 0;
    this.show();
  },

  /**
   * Close button click handler
   *
   * @private
   */
  _onCloseClick: function _onCloseClick(evt) {
    this.hide();
  },

  /**
   * Resizes the lightbox to fit the passed/current image within the screen
   *
   * @method resizeLightbox
   * @param {HTMLImageElement} [img] The image that will be in the lightbox. Uses current image if not passed.
   */
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

  /**
   * Displays the modal and shows an image
   *
   * @method show
   * @param {Number} [index] The array index of the image to display
   */
  show: function show(index) {
    var self = this;
    index = typeof index === 'undefined' ? self.index : index;
    var image = self.data[index];
    if (image) {
      self._loadImage(image.src).then(function(img) {
        self.el.classList.add(VISIBLE);
        self.resizeLightbox(img);
        self.imageEl.src = image.src;
        self.titleEl.textContent = image.title;
        self.backButtonEl.disabled = index === 0;
        self.nextButtonEl.disabled = index === self.data.length - 1;
        self.index = index;
        self.isVisible = true;
      });
    }
  },

  /**
   * Hides the modal
   *
   * @method hide
   */
  hide: function hide() {
    var el = this.el;
    var fadeoutEnd = function(evt) {
      // IE doesn't seem to support the multiple argument version.
      // Of course it doesn't...
      el.classList.remove(FADEOUT);
      el.classList.remove(VISIBLE);
      self.isVisible = false;
      el.removeEventListener('transitionend', fadeoutEnd);
    };
    el.addEventListener('transitionend', fadeoutEnd);
    el.classList.add(FADEOUT);
  }
};

module.exports = Lightbox;
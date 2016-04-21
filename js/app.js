// App code
require([ './js/image-grid.js', './js/dropdown.js', './js/lightbox.js' ], function(ImageGrid, Dropdown, Lightbox) {
  var imageGrid = new ImageGrid(document.getElementById('images'));
  var dropdown = new Dropdown(document.getElementById('sources'));
  var lightbox = new Lightbox(document.getElementById('lightbox'));
  var images = [];

  // Loads images from the specified provider. Arguably, not
  // terribly secure at all...
  function loadImageSource(provider) {
    return new Promise(function(resolve, reject) {
      // Temporarily grab images from redditbooru
      require('./js/service-connectors/' + provider + '.js', function(provider) {
        provider().then(function(data) {
          images = data;
          lightbox.setData(data);
          imageGrid.render(images);
        });
      });
    });
  }

  imageGrid.on('image-click', function(index) {
    lightbox.show(index);
  });

  dropdown.on('change', function(value) {
    loadImageSource(value);
  });

  loadImageSource('redditbooru');
});
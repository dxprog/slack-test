// App code
require('./js/image-grid.js', function(ImageGrid) {
  var imageGrid = new ImageGrid(document.getElementById('images'));
  imageGrid.load('redditbooru');
  window.reloadImages = function() {
    imageGrid.load('redditbooru');
  }
});
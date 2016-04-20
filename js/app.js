// App code
require([ './js/image-grid.js', './js/dropdown.js' ], function(ImageGrid, Dropdown) {
  var imageGrid = new ImageGrid(document.getElementById('images'));
  var dropdown = new Dropdown(document.getElementById('sources'));
  imageGrid.load('redditbooru');
  dropdown.on('change', function(value) {
    imageGrid.load(value);
  });
});
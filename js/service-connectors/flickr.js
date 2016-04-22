module.exports = function() {
  return new Promise(function(resolve, reject) {
    ajax('https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=0861094f8d4c00348357d0ef08ebdef2&gallery_id=72157664861690780&format=json&media=photos', 'jsonp', 'jsonFlickrApi').then(function(data) {
      var out = [];
      if (data.photos) {
        var photos = data.photos.photo;
        var photo;
        for (var i = 0, count = photos.length; i < count; i++) {
          photo = photos[i];
          out.push({
            src: 'https://c1.staticflickr.com/' + photo.farm + '/' + photo.server + '/' + photo.id + '_' + photo.secret + '_z.jpg',
            title: photo.title
          });
        }
        resolve(out);
      }
    });
  });
};
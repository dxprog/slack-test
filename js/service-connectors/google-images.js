module.exports = function() {
  return new Promise(function(resolve, reject) {
    ajax('https://www.googleapis.com/customsearch/v1?key=AIzaSyBNUpT5D0e6_087CrStBxlB12I4gV3DcII&cx=005827267787967123976:swzeq01jooa&q=banana&searchType=image', 'jsonp').then(function(data) {
      var out = [];
      if (data.items) {
        var photos = data.items;
        var photo;
        for (var i = 0, count = photos.length; i < count; i++) {
          photo = photos[i];
          out.push({
            src: photo.link,
            title: photo.snippet
          });
        }
        resolve(out);
      }
    });
  });
};
module.exports = function() {
  return new Promise(function(resolve, reject) {
    ajax('http://redditbooru.com/images/?sources=15').then(function(data) {
      resolve(data.map(function(item) {
        return {
          src: item.cdnUrl,
          title: item.title
        }
      }));
    }, reject);
  });
};
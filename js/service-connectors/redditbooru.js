module.exports = function() {
  return new Promise(function(resolve, reject) {
    ajax('http://redditbooru.com/images/').then(function(data) {
      resolve(data.map(function(item) {
        return {
          src: item.cdnUrl,
          title: item.title
        }
      }));
    }, reject);
  });
};
(function(window, document) {
  var Vimmers = {}
  window.Vimmers = Vimmers;

  Vimmers.load = function(callback) {
    var fname = 'Vimmers_onload_' + (new Date().getTime());

    window[fname] = function(vimmers) {
      callback(vimmers);
      delete window[fname];
    }

    var js = document.createElement('script');
    js.src = 'http://vim-jp.herokuapp.com/vimmers?callback=' + fname;
    js.async = true;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(js, s);
  }

  Vimmers.shuffle = function(vimmers, keepBramTop) {
    var src = vimmers.slice(0);
    var dst = [];
    if (keepBramTop && src.length > 0) {
      dst.push(src.splice(0, 1)[0]);
    }
    while (src.length > 0) {
      var i = Math.floor(Math.random() * src.length);
      dst.push(src.splice(i, 1)[0]);
    }
    return dst;
  }

  Vimmers.avatarImgSrc = function(vimmer) {
    if (vimmer.logo) {
      return vimmer.logo;
    } else if (vimmer.twitter_icon) {
      return vimmer.twitter_icon;
    } else {
      return 'default_avatar.png'
    }
  }

})(this, this.document);

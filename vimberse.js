(function(window, document) {
  var DEBUG = 0;

  var vimberse = document.getElementsByClassName('vimberse')[0];
  var vimmersSource;
  var vimmersQueue = [];

  function addStar(options) {
    if (options == void 0) {
      options = {}
    }

    var pos = calcPos();
    if (options.endPos) {
      pos.end = options.endPos;
    }

    var star = document.createElement('div');
    star.setAttribute('class', 'star');
    star.setAttribute('style', pos2style(pos.start));
    if (options.build) {
      options.build(star, document);
    }

    // transition-end event to remove star.
    var removeStar = (function() {
      var p = this.parentNode;
      if (p) {
        p.removeChild(this);
        if (options.onEnd) {
          options.onEnd();
        }
      }
    }).bind(star);
    if (!DEBUG) {
      star.addEventListener('transitionend', removeStar);
      star.addEventListener('webkitTransitionEnd', removeStar);
      star.addEventListener('oTransitionEnd', removeStar);
    }

    vimberse.insertBefore(star, vimberse.firstChild);

    setTimeout(function() {
      star.setAttribute('class', 'star moved');
      star.setAttribute('style', pos2style(pos.end));
    }, 100);
  }

  function calcPos() {
    var w = vimberse.clientWidth, h = vimberse.clientHeight;
    var t = (w + h) * 2;
    var f = [ w / t, w * 2 / t, (w * 2 + h) / t ];
    var r = Math.random();
    var x, y;
    if (r < f[0]) {
      x = Math.floor(r * t);
      y = 0;
    } else if (r < f[1]) {
      x = Math.floor((r - f[0]) * t);
      y = h;
    } else if (r < f[2]) {
      x = 0;
      y = Math.floor((r - f[1]) * t);
    } else {
      x = w;
      y = Math.floor((r - f[2]) * t);
    }

    return {
      start: { x: Math.floor(w / 2), y: Math.floor(h / 2) },
      end: { x: x, y: y }
    }
  }

  function pos2style(p) {
    return 'left:' + p.x + 'px; top:' + p.y + 'px;';
  }

  function firstVimStar() {
    return {
      endPos: {
        x: Math.floor(vimberse.clientWidth / 2),
        y: Math.floor(vimberse.clientHeight / 2)
      },
      onEnd: function() {
        if (!DEBUG) {
          setInterval(addNextVimStar, 250);
        }
      }
    }
  }

  function addNextVimStar() {
    var vimmer = fetchVimmer();
    addVimStar(vimmer, {});
  }

  function fetchVimmer() {
    if (vimmersQueue.length <= 0) {
      vimmersQueue = Vimmers.shuffle(vimmersSource, false);
    }
    return vimmersQueue.splice(0, 1)[0];
  }

  function addClass(element, className) {
    var attr = element.getAttribute('class');
    var classes = attr ? attr.split(/\s+/) : [];
    classes.push(className);
    element.setAttribute('class', classes.join(' '));
  }

  function getVimmerImg(vimmer) {
    if (vimmer._imgTag) {
      return vimmer._imgTag;
    }
    var img = document.createElement('img');
    img.src = Vimmers.avatarImgSrc(vimmer);
    vimmer._imgTag = img;
    return img;
  }

  function buildVimStar(vimmer, star, document) {
    // Avatar icon.
    var avatar = document.createElement('div');
    avatar.appendChild(getVimmerImg(vimmer));
    addClass(avatar, 'avatar');
    star.appendChild(avatar);
    // Name.
    var name = document.createElement('div');
    name.appendChild(document.createTextNode(vimmer.name));
    addClass(name, 'name');
    star.appendChild(name);
  }

  function addVimStar(vimmer, options) {
    options.build = function(star, document) {
      buildVimStar(vimmer, star, document);
    }
    addStar(options);
  }

  function startVimberse(vimmers) {
    vimmersSource = vimmers;
    vimmersQueue = Vimmers.shuffle(vimmersSource, true);
    var bram = fetchVimmer();
    addVimStar(bram, firstVimStar());
  }

  window.addEventListener('load', function() {
    Vimmers.load(startVimberse);
  });

})(this, this.document);

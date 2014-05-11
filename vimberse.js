(function(window, document) {
  var DEBUG = true;

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
    star.addEventListener('transitionend', removeStar);
    star.addEventListener('webkitTransitionEnd', removeStar);
    star.addEventListener('oTransitionEnd', removeStar);

    vimberse.appendChild(star);

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

  function addVimStar(vimmer, options) {
    addStar(options);
  }

  function startVimberse(vimmers) {
    vimmersSource = vimmers;
    vimmersQueue = Vimmers.shuffle(vimmersSource, true);
    addVimStar(fetchVimmer(), firstVimStar());
  }

  window.addEventListener('load', function() {
    Vimmers.load(startVimberse);
  });

})(this, this.document);

(function () {
  'use strict';
  var style = '{{STYLE_NAME}}';

  function replaceIcons(icons) {
    var selectors = [
      '.stria-' + style,
      '[class*="st-' + style + '"]'
    ];
    var elements = document.querySelectorAll(selectors.join(','));

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var classList = el.className.split(' ');
      var iconName = null;

      for (var j = 0; j < classList.length; j++) {
        var cls = classList[j].trim();
        if (cls.startsWith('stria-') && cls !== 'stria-' + style) {
          iconName = cls.replace('stria-', '');
        } else if (cls.startsWith('st-') && cls !== 'st-' + style) {
          iconName = cls.replace('st-', '');
        }
      }

      if (!iconName || !icons[iconName]) continue;
      var icon = icons[iconName];

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('class', el.className);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = '1em';
      svg.style.height = '1em';
      svg.style.verticalAlign = '-0.125em';

      var paths = Array.isArray(icon.paths) ? icon.paths : [icon.paths];
      for (var k = 0; k < paths.length; k++) {
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', paths[k]);
        if (style === 'duotone' && k === 0) {
          p.setAttribute('class', 'stria-secondary');
          p.style.opacity = '0.4';
        }
        svg.appendChild(p);
      }

      el.parentNode.replaceChild(svg, el);
    }
  }

  var currentScript = document.currentScript;
  var dataUrl = '';
  if (currentScript && currentScript.src) {
    dataUrl = currentScript.src.replace(/\/js\/[^/]+$/, '/data/' + style + '.json');
  } else {
    dataUrl = '../data/' + style + '.json';
  }

  function init() {
    fetch(dataUrl)
      .then(function (res) { return res.json(); })
      .then(function (icons) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () { replaceIcons(icons); });
        } else {
          replaceIcons(icons);
        }
      })
      .catch(function (err) {
        console.error('Failed to load Stria Icons data for style ' + style + ':', err);
      });
  }

  init();
})();

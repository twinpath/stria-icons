(function () {
  'use strict';

  var STYLES = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'];
  var iconsByStyle = {};
  var fetchedStyles = {};

  function replaceIcons(styleName, icons) {
    iconsByStyle[styleName] = icons;

    var elements = document.querySelectorAll('[class*="stria-"], [class*="st-"], [data-stria]');

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var iconName = el.getAttribute('data-stria');
      var styleNameAttr = el.getAttribute('data-stria-style') || 'solid';

      if (!iconName) {
        var classList = el.className.split(' ');
        for (var j = 0; j < classList.length; j++) {
          var cls = classList[j].trim();
          if (cls.startsWith('stria-') && STYLES.indexOf(cls.replace('stria-','')) !== -1) {
            styleNameAttr = cls.replace('stria-', '');
          } else if (cls.startsWith('st-') && STYLES.indexOf(cls.replace('st-','')) !== -1) {
            styleNameAttr = cls.replace('st-', '');
          } else if (cls.startsWith('stria-')) {
            iconName = cls.replace('stria-', '');
          } else if (cls.startsWith('st-') && cls !== 'st-solid' && cls !== 'st-regular' && cls !== 'st-light' && cls !== 'st-thin' && cls !== 'st-duotone' && cls !== 'st-brands') {
            iconName = cls.replace('st-', '');
          }
        }
      }

      if (!iconName) continue;
      
      var styleIcons = iconsByStyle[styleNameAttr];
      if (!styleIcons || !styleIcons[iconName]) continue;
      var icon = styleIcons[iconName];

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
        if (styleNameAttr === 'duotone' && k === 0) {
          p.setAttribute('class', 'stria-secondary');
          p.style.opacity = '0.4';
        }
        svg.appendChild(p);
      }

      el.parentNode.replaceChild(svg, el);
    }
  }

  var currentScript = document.currentScript;
  var dataDirUrl = '';
  if (currentScript && currentScript.src) {
    dataDirUrl = currentScript.src.replace(/\/js\/[^/]+$/, '/data/');
  } else {
    dataDirUrl = '../data/';
  }

  function loadStyle(styleName) {
    if (fetchedStyles[styleName]) return;
    fetchedStyles[styleName] = true;

    fetch(dataDirUrl + styleName + '.json')
      .then(function (res) { return res.json(); })
      .then(function (icons) {
        replaceIcons(styleName, icons);
      })
      .catch(function (err) {
        console.error('Failed to load Stria Icons data for style ' + styleName + ':', err);
      });
  }

  function scanAndLoad() {
    var elements = document.querySelectorAll('[class*="stria-"], [class*="st-"], [data-stria]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var styleName = el.getAttribute('data-stria-style') || 'solid';
      var classList = el.className.split(' ');
      for (var j = 0; j < classList.length; j++) {
        var cls = classList[j].trim();
        if (cls.startsWith('stria-') && STYLES.indexOf(cls.replace('stria-','')) !== -1) {
          styleName = cls.replace('stria-', '');
        } else if (cls.startsWith('st-') && STYLES.indexOf(cls.replace('st-','')) !== -1) {
          styleName = cls.replace('st-', '');
        }
      }
      loadStyle(styleName);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAndLoad);
  } else {
    scanAndLoad();
  }
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stria = {}));
})(this, (function (exports) { 'use strict';

  var icons = {};
  var fetchingStyles = {};

  var currentScript = document.currentScript;
  var dataDirUrl = '';
  if (currentScript && currentScript.src) {
    dataDirUrl = currentScript.src.replace(/\/js\/[^/]+$/, '/data/');
  } else {
    dataDirUrl = '../data/';
  }

  function replace(options) {
    var opts = options || {};
    var attribute = opts.attribute || 'data-stria';
    var styleAttribute = opts.styleAttribute || 'data-stria-style';
    var defaultStyle = opts.defaultStyle || 'regular';

    var elements = document.querySelectorAll('[' + attribute + ']');
    var requiredStyles = {};
    for (var i = 0; i < elements.length; i++) {
      var style = elements[i].getAttribute(styleAttribute) || defaultStyle;
      requiredStyles[style] = true;
    }

    var stylesToFetch = Object.keys(requiredStyles).filter(function (s) {
      return !icons[s];
    });

    if (stylesToFetch.length === 0) {
      performReplace(elements, attribute, styleAttribute, defaultStyle);
      return;
    }

    var promises = stylesToFetch.map(function (style) {
      if (fetchingStyles[style]) return fetchingStyles[style];
      
      fetchingStyles[style] = fetch(dataDirUrl + style + '.json')
        .then(function (res) { return res.json(); })
        .then(function (styleData) {
          icons[style] = styleData;
          return styleData;
        })
        .catch(function (err) {
          console.error('Failed to load Stria Icons data for style ' + style + ':', err);
        });
      return fetchingStyles[style];
    });

    Promise.all(promises).then(function () {
      var currentElements = document.querySelectorAll('[' + attribute + ']');
      performReplace(currentElements, attribute, styleAttribute, defaultStyle);
    });
  }

  function performReplace(elements, attribute, styleAttribute, defaultStyle) {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var name = el.getAttribute(attribute);
      var style = el.getAttribute(styleAttribute) || defaultStyle;
      var icon = icons[style] && icons[style][name];
      if (!icon) continue;

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.width = '1em';
      svg.style.height = '1em';

      for (var j = 0; j < el.attributes.length; j++) {
        var attr = el.attributes[j];
        if (attr.name !== attribute && attr.name !== styleAttribute) {
          svg.setAttribute(attr.name, attr.value);
        }
      }

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

  exports.icons = icons;
  exports.replace = replace;
  Object.defineProperty(exports, '__esModule', { value: true });
}));

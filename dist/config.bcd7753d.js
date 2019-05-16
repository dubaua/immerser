// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../immerser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Immerser =
/*#__PURE__*/
function () {
  function Immerser(options) {
    _classCallCheck(this, Immerser);

    this.defaults = {
      immerserSelector: {
        defaultValue: '[data-immerser]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator
      },
      layerSelector: {
        defaultValue: '[data-immerser-classnames]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator
      },
      solidSelector: {
        defaultValue: '[data-immerser-solid-id]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator
      },
      pagerSelector: {
        defaultValue: '[data-immerser-pager]',
        description: 'non empty .js- preffixed classname or data-attribute selector',
        validator: this.selectorValidator
      },
      solidClassnames: {
        defaultValue: null,
        description: 'non empty array of objects',
        validator: function validator(x) {
          return Array.isArray(x) && x.length !== 0;
        }
      },
      pagerTreshold: {
        defaultValue: 0.5,
        description: 'a number between 0 and 1',
        validator: function validator(x) {
          return typeof x === 'number' && 0 <= x && x <= 1;
        }
      },
      immerserClassname: {
        defaultValue: 'immerser',
        description: 'valid non empty classname string',
        validator: this.classnameValidator
      },
      immerserWrapperClassname: {
        defaultValue: 'immerser__wrapper',
        description: 'valid non empty classname string',
        validator: this.classnameValidator
      },
      immerserMaskClassname: {
        defaultValue: 'immerser__mask',
        description: 'valid non empty classname string',
        validator: this.classnameValidator
      },
      pagerClassname: {
        defaultValue: 'pager',
        description: 'valid non empty classname string',
        validator: this.classnameValidator
      },
      pagerLinkClassname: {
        defaultValue: 'pager__link',
        description: 'valid non empty classname string',
        validator: this.classnameValidator
      },
      pagerLinkActiveClassname: {
        defaultValue: 'pager__link--active',
        description: 'valid non empty classname string',
        validator: this.classnameValidator
      }
    }; // state

    this.options = {};
    this.immerserNode = null;
    this.immerserClassnames = [];
    this.states = [];
    this.documentHeight = 0;
    this.windowHeight = 0;
    this.resizeTimerId = null; // TODO user defined solid layout

    for (var key in this.defaults) {
      var _this$defaults$key = this.defaults[key],
          defaultValue = _this$defaults$key.defaultValue,
          description = _this$defaults$key.description,
          validator = _this$defaults$key.validator;

      if (options.hasOwnProperty(key)) {
        var value = options[key];

        if (validator(value)) {
          this.options[key] = value;
        } else {
          console.warn("Expected ".concat(key, " is ").concat(description, ", got ").concat(_typeof(value), " ").concat(value, ". Fallback to default value ").concat(defaultValue));
          this.options[key] = defaultValue;
        }
      }
    }

    this.init();
    this.setWindowSizes();
    this.setLayerSizes();
    this.setStates();
    this.createPagerLinks(options);
    this.createDOMStructure();
    this.initPagerLinks();
    this.draw();
    window.addEventListener('scroll', this.draw.bind(this), false);
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  _createClass(Immerser, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.immerserNode = document.querySelector(this.options.immerserSelector);

      if (!this.immerserNode) {
        console.warn('Immerser element not found. Check documentation https://github.com/dubaua/immerser');
      }

      if (this.options.solidClassnames) {
        this.immerserClassnames = this.options.solidClassnames;
      }

      var layerNodeList = document.querySelectorAll(this.options.layerSelector);
      this.forEachNode(layerNodeList, function (layerNode) {
        if (!_this.options.solidClassnames) {
          _this.immerserClassnames.push(JSON.parse(layerNode.dataset.immerserClassnames));
        }

        _this.states.push({
          node: layerNode,
          top: 0,
          bottom: 0
        });
      }); // warn if no classnames given
    }
  }, {
    key: "setWindowSizes",
    value: function setWindowSizes() {
      this.documentHeight = document.documentElement.offsetHeight;
      this.windowHeight = window.innerHeight;
    }
  }, {
    key: "setLayerSizes",
    value: function setLayerSizes() {
      this.states = this.states.map(function (state) {
        var top = state.node.offsetTop;
        var bottom = top + state.node.offsetHeight;
        return _objectSpread({}, state, {
          top: top,
          bottom: bottom
        });
      });
    }
  }, {
    key: "setStates",
    value: function setStates() {
      var _this2 = this;

      this.states = this.states.map(function (state, index) {
        var isFirst = index === 0;
        var isLast = index === _this2.states.length - 1;
        var immerserHeight = _this2.immerserNode.offsetHeight;
        var immerserTop = _this2.immerserNode.offsetTop; // actually not 0 and this.documentHeight but start of first and end of last.

        var startEnter = isFirst ? 0 : immerserTop + _this2.states[index - 1].top; // == previous start

        var enter = isFirst ? 0 : startEnter + immerserHeight;
        var startLeave = isLast ? _this2.documentHeight : immerserTop + _this2.states[index].top;
        var leave = isLast ? _this2.documentHeight : startLeave + immerserHeight;
        return _objectSpread({}, state, {
          startEnter: startEnter,
          enter: enter,
          startLeave: startLeave,
          leave: leave,
          height: immerserHeight
        });
      });
    }
  }, {
    key: "createPagerLinks",
    value: function createPagerLinks() {
      var pagerNode = document.querySelector(this.options.pagerSelector);
      if (!pagerNode) return;
      var _this$options = this.options,
          pagerClassname = _this$options.pagerClassname,
          pagerLinkClassname = _this$options.pagerLinkClassname;
      pagerNode.classList.add(pagerClassname);
      this.states.forEach(function (state, index) {
        var layerId = state.node.id; // if no layerId create it, to point anchor to

        if (layerId === '') {
          layerId = "immerser-section-".concat(index);
          state.node.id = layerId;
        }

        var pagerLinkNode = document.createElement('a');
        pagerLinkNode.classList.add(pagerLinkClassname);
        pagerLinkNode.href = "#".concat(layerId); // not the best way to store index for

        pagerLinkNode.dataset.stateIndex = index;
        pagerNode.appendChild(pagerLinkNode);
        state.pagerLinkNodeArray = [];
      });
    }
  }, {
    key: "createDOMStructure",
    value: function createDOMStructure() {
      var _this3 = this;

      var maskAndWrapperStyles = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: 'hidden'
      };
      var _this$options2 = this.options,
          immerserClassname = _this$options2.immerserClassname,
          immerserWrapperClassname = _this$options2.immerserWrapperClassname,
          immerserMaskClassname = _this$options2.immerserMaskClassname;
      var originalChildrenNodeList = this.immerserNode.querySelectorAll(this.options.solidSelector);
      this.immerserNode.classList.add(immerserClassname);
      this.states = this.states.map(function (state, stateIndex) {
        var wrapper = document.createElement('div');

        _this3.applyStyles(wrapper, maskAndWrapperStyles);

        wrapper.classList.add(immerserWrapperClassname);

        _this3.forEachNode(originalChildrenNodeList, function (childNode) {
          var clonnedChildNode = childNode.cloneNode(true);
          wrapper.appendChild(clonnedChildNode); // TODO remove original children. mess with DOM
        }); // TODO achieve hovering with linking clonned elements


        var clonedSolidNodeList = wrapper.querySelectorAll(_this3.options.solidSelector);

        _this3.forEachNode(clonedSolidNodeList, function (_ref) {
          var dataset = _ref.dataset,
              classList = _ref.classList;
          var solidId = dataset.immerserSolidId;

          if (_this3.immerserClassnames[stateIndex].hasOwnProperty(solidId)) {
            classList.add(_this3.immerserClassnames[stateIndex][solidId]);
          }
        });

        var mask = document.createElement('div');

        _this3.applyStyles(mask, maskAndWrapperStyles);

        mask.classList.add(immerserMaskClassname);

        if (stateIndex !== 0) {
          mask.setAttribute('aria-hidden', 'true');
        }

        mask.appendChild(wrapper);

        _this3.immerserNode.appendChild(mask);

        state.maskNode = mask;
        state.wrapperNode = wrapper;
        return state;
      });
    }
  }, {
    key: "initPagerLinks",
    value: function initPagerLinks() {
      var pagerLinkHTMLCollection = this.immerserNode.getElementsByClassName(this.options.pagerLinkClassname);

      for (var index = 0; index < pagerLinkHTMLCollection.length; index++) {
        var pagerLinkNode = pagerLinkHTMLCollection[index];
        var stateIndex = pagerLinkNode.dataset.stateIndex;
        this.states[stateIndex].pagerLinkNodeArray.push(pagerLinkNode);
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this4 = this;

      var y = this.getLastScrollPositionY();
      this.states.forEach(function (_ref2) {
        var startEnter = _ref2.startEnter,
            enter = _ref2.enter,
            startLeave = _ref2.startLeave,
            leave = _ref2.leave,
            height = _ref2.height,
            maskNode = _ref2.maskNode,
            wrapperNode = _ref2.wrapperNode,
            top = _ref2.top,
            bottom = _ref2.bottom,
            pagerLinkNodeArray = _ref2.pagerLinkNodeArray;
        var progress;

        if (startEnter > y) {
          progress = height;
        } else if (startEnter <= y && y < enter) {
          progress = enter - y;
        } else if (enter <= y && y < startLeave) {
          progress = 0;
        } else if (startLeave <= y && y < leave) {
          progress = startLeave - y;
        } else {
          progress = -height;
        }

        maskNode.style.transform = "translateY(".concat(progress, "px)");
        wrapperNode.style.transform = "translateY(".concat(-progress, "px)"); // check if pager

        var pagerScrollActivePoint = y + _this4.windowHeight * _this4.options.pagerTreshold;

        if (top <= pagerScrollActivePoint && pagerScrollActivePoint < bottom) {
          pagerLinkNodeArray.forEach(function (_ref3) {
            var classList = _ref3.classList;
            classList.add(_this4.options.pagerLinkActiveClassname);
          });
        } else {
          pagerLinkNodeArray.forEach(function (_ref4) {
            var classList = _ref4.classList;
            classList.remove(_this4.options.pagerLinkActiveClassname);
          });
        }
      });
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var _this5 = this;

      // TODO maybe refactor on requestAnimationFrame
      // simlpe debouncer
      clearTimeout(this.resizeTimerId);
      this.resizeTimerId = setTimeout(function () {
        _this5.setWindowSizes();

        _this5.setLayerSizes();

        _this5.setStates();

        _this5.draw();
      }, 16);
    } // utils

  }, {
    key: "getLastScrollPositionY",
    value: function getLastScrollPositionY() {
      // limit scroll position between 0 and document height in case of iOS overflow scroll
      return Math.min(Math.max(document.documentElement.scrollTop, 0), this.documentHeight);
    }
  }, {
    key: "applyStyles",
    value: function applyStyles(_ref5, styles) {
      var style = _ref5.style;

      for (var rule in styles) {
        style[rule] = styles[rule];
      }
    }
  }, {
    key: "forEachNode",
    value: function forEachNode(nodeList, callback) {
      for (var index = 0; index < nodeList.length; index++) {
        var node = nodeList[index];
        callback(node, index, nodeList);
      }
    }
  }, {
    key: "classnameValidator",
    value: function classnameValidator(string) {
      return typeof string === 'string' && string !== '' && /^[a-z_-][a-z\d_-]*$/i.test(string);
    }
  }, {
    key: "selectorValidator",
    value: function selectorValidator(string) {
      return typeof string === 'string' && string !== '' && /\.js\-[a-z-_]+|\[[a-z]+(\-[a-z]+)*\]/.test(string);
    }
  }]);

  return Immerser;
}();

exports.default = Immerser;
},{}],"config.js":[function(require,module,exports) {
"use strict";

var _immerser = _interopRequireDefault(require("../immerser.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var my = new _immerser.default({
  solidClassnames: [{
    logo: 'logo--contrast',
    pager: 'pager--contrast'
  }, {
    menu: 'menu--contrast'
  }, {
    logo: 'logo--contrast',
    pager: 'pager--contrast'
  }, {
    menu: 'menu--contrast'
  }],
  pagerTreshold: 1.3,
  pagerClassname: 'jopa',
  pagerLinkClassname: 'jopa',
  pagerLinkActiveClassname: 'jopa',
  layerSelector: 'sea',
  suka: 'bitch'
});
console.log(my);
},{"../immerser.js":"../immerser.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35084" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","config.js"], null)
//# sourceMappingURL=/config.bcd7753d.js.map
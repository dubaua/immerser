parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"LiPP":[function(require,module,exports) {
"use strict";function e(e){for(var i=1;i<arguments.length;i++){var r=null!=arguments[i]?arguments[i]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(i){t(e,i,r[i])})}return e}function t(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var o=function(){function t(e){r(this,t),this.defaults={selectorImmerser:"[data-immerser]",selectorLayer:"[data-immerser-layer]",selectorSolid:"[data-immerser-solid]",selectorPager:"[data-immerser-pager]",selectorMask:"[data-immerser-mask]",selectorMaskInner:"[data-immerser-mask-inner]",selectorSynchroHover:"[data-immerser-synchro-hover]",classnameImmerser:"immerser",classnameImmerserMask:"immerser__mask",classnameImmerserSolid:"immerser__solid",solidClassnameArray:{defaultValue:[],description:"non empty array of objects",validator:function(e){return Array.isArray(e)&&0!==e.length}},fromViewportWidth:{defaultValue:1024,description:"a natural number",validator:function(e){return"number"==typeof e&&0<=e&&e%1==0}},pagerTreshold:{defaultValue:.5,description:"a number between 0 and 1",validator:function(e){return"number"==typeof e&&0<=e&&e<=1}},stylesInCSS:{defaultValue:!1,description:"boolean",validator:function(e){return"boolean"==typeof e}},synchroHoverPagerLinks:{defaultValue:!1,description:"boolean",validator:function(e){return"boolean"==typeof e}},classnamePager:{defaultValue:"pager",description:"valid non empty classname string",validator:this.classnameValidator},classnamePagerLink:{defaultValue:"pager__link",description:"valid non empty classname string",validator:this.classnameValidator},classnamePagerLinkActive:{defaultValue:"pager__link--active",description:"valid non empty classname string",validator:this.classnameValidator},onInit:{defaultValue:null,description:"function",validator:function(e){return"function"==typeof e}},onActiveLayerChange:{defaultValue:null,description:"function",validator:function(e){return"function"==typeof e}}},this.initState(),this.init(e)}return a(t,[{key:"initState",value:function(){this.options={},this.statemap=[],this.immerserNode=null,this.pagerNode=null,this.immerserMaskNodeArray=[],this.originalChildrenNodeList=[],this.documentHeight=0,this.windowHeight=0,this.resizeTimerId=null,this.activeLayer=null,this.activeSynchroHoverId=null,this.synchroHoverNodeArray=[]}},{key:"init",value:function(e){this.mergeOptions(e),window.innerWidth<this.options.fromViewportWidth||(this.immerserNode=document.querySelector(this.options.selectorImmerser),this.immerserNode?(this.initStatemap(),this.setWindowSizes(),this.setLayerSizes(),this.setStatemap(),this.initPager(),this.createPagerLinks(),this.initDOMStructure(),this.initPagerLinks(),this.initHoverSynchro(),this.draw(),window.addEventListener("scroll",this.draw.bind(this),!1),window.addEventListener("resize",this.onResize.bind(this),!1),"function"==typeof this.options.onInit&&this.options.onInit(this)):console.warn("Immerser element not found. Check documentation https://github.com/dubaua/immerser#how-to-use"))}},{key:"mergeOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};for(var t in this.defaults)if("function"!=typeof this.defaults[t].validator)this.options[t]=this.defaults[t];else{var r=this.defaults[t],n=r.defaultValue,a=r.description,o=r.validator;if(this.options[t]=n,e.hasOwnProperty(t)){var s=e[t];o(s)?this.options[t]=s:console.warn("Expected ".concat(t," is ").concat(a,", got <").concat(i(s),"> ").concat(s,". Fallback to default value ").concat(n,". Check documentation https://github.com/dubaua/immerser#options"))}}}},{key:"initStatemap",value:function(){var e=this,t=document.querySelectorAll(this.options.selectorLayer);this.forEachNode(t,function(t,i){var r=e.options.solidClassnameArray[i];if(t.dataset.immerserLayerConfig)try{r=JSON.parse(t.dataset.immerserLayerConfig)}catch(n){console.error("Failed to parse JSON class configuration.",n)}e.statemap.push({node:t,solidClassnames:r,top:0,bottom:0})})}},{key:"setWindowSizes",value:function(){this.documentHeight=document.documentElement.offsetHeight,this.windowHeight=window.innerHeight}},{key:"setLayerSizes",value:function(){this.statemap=this.statemap.map(function(t){var i=t.node.offsetTop;return e({},t,{top:i,bottom:i+t.node.offsetHeight})})}},{key:"setStatemap",value:function(){var t=this,i=this.immerserNode.offsetHeight,r=this.immerserNode.offsetTop;this.statemap=this.statemap.map(function(n,a){var o=0===a,s=a===t.statemap.length-1,l=o?0:t.statemap[a-1].bottom-r,c=o?0:l-i,d=s?t.documentHeight:t.statemap[a].bottom-r;return e({},n,{startEnter:c,enter:l,startLeave:s?t.documentHeight:d-i,leave:d,height:i})})}},{key:"initPager",value:function(){var e=this;this.pagerNode=document.querySelector(this.options.selectorPager),this.pagerNode&&(this.activeLayer=s(void 0,function(t){e.drawPagerLinks(t),"function"==typeof e.options.onActiveLayerChange&&e.options.onActiveLayerChange(t,e)}))}},{key:"createPagerLinks",value:function(){var e=this;if(this.pagerNode){var t=this.options,i=t.classnamePager,r=t.classnamePagerLink;this.pagerNode.classList.add(i),this.statemap.forEach(function(t,i){var n=t.node.id;""===n&&(n="immerser-section-".concat(i),t.node.id=n);var a=document.createElement("a");a.classList.add(r),a.href="#".concat(n),a.dataset.stateIndex=i,e.options.synchroHoverPagerLinks&&(a.dataset.immerserSynchroHover="pager-link-".concat(i)),e.pagerNode.appendChild(a),t.pagerLinkNodeArray=[]})}}},{key:"initDOMStructure",value:function(){var t=this,i={position:"absolute",top:0,right:0,bottom:0,left:0,overflow:"hidden"},r=this.options,n=r.classnameImmerser,a=r.classnameImmerserMask,o=r.classnameImmerserSolid;this.originalChildrenNodeList=this.immerserNode.querySelectorAll(this.options.selectorSolid),this.bindClassOrStyle(this.immerserNode,n,{pointerEvents:"none"});var s=this.immerserNode.querySelectorAll(this.options.selectorMask),l=s.length===this.statemap.length;s.length>0&&s.length!==this.statemap.length&&console.warn("You're trying use custom markup, but count of your immerser masks doesn't equal layers count."),this.statemap=this.statemap.map(function(r,n){var c=l?s[n]:document.createElement("div");t.bindClassOrStyle(c,a,i);var d=l?c.querySelector(t.options.selectorMaskInner):document.createElement("div");t.bindClassOrStyle(d,a,i),t.forEachNode(t.originalChildrenNodeList,function(e){var i=e.cloneNode(!0);t.bindClassOrStyle(i,o,{pointerEvents:"all"}),d.appendChild(i)});var u=d.querySelectorAll(t.options.selectorSolid);return t.forEachNode(u,function(e){var t=e.dataset.immerserSolid;r.solidClassnames&&r.solidClassnames.hasOwnProperty(t)&&e.classList.add(r.solidClassnames[t])}),0!==n&&c.setAttribute("aria-hidden","true"),c.appendChild(d),t.immerserNode.appendChild(c),t.immerserMaskNodeArray.push(c),e({},r,{maskNode:c,maskInnerNode:d})}),this.forEachNode(this.originalChildrenNodeList,function(e){t.immerserNode.removeChild(e)})}},{key:"initPagerLinks",value:function(){if(this.pagerNode)for(var e=this.immerserNode.getElementsByClassName(this.options.classnamePagerLink),t=0;t<e.length;t++){var i=e[t],r=i.dataset.stateIndex;this.statemap[r].pagerLinkNodeArray.push(i)}}},{key:"initHoverSynchro",value:function(){var e=this,t=document.querySelectorAll(this.options.selectorSynchroHover);t.length&&(this.activeSynchroHoverId=s(void 0,function(t){e.drawSynchroHover(t)}),this.forEachNode(t,function(t){var i=t.dataset.immerserSynchroHover;t.addEventListener("mouseover",function(){e.activeSynchroHoverId.value=i}),t.addEventListener("mouseout",function(){e.activeSynchroHoverId.value=void 0}),e.synchroHoverNodeArray.push(t)}))}},{key:"draw",value:function(){var e=this,t=this.getLastScrollPositionY();this.statemap.forEach(function(i,r){var n,a=i.startEnter,o=i.enter,s=i.startLeave,l=i.leave,c=i.height,d=i.maskNode,u=i.maskInnerNode,m=i.top,h=i.bottom;if(a>t&&(n=c),a<=t&&t<o&&(n=o-t),o<=t&&t<s&&(n=0),s<=t&&t<l&&(n=s-t),t>=l&&(n=-c),d.style.transform="translateY(".concat(n,"px)"),u.style.transform="translateY(".concat(-n,"px)"),e.pagerNode){var f=t+e.windowHeight*(1-e.options.pagerTreshold);m<=f&&f<h&&(e.activeLayer.value=r)}})}},{key:"drawPagerLinks",value:function(){var e=this;this.statemap.forEach(function(t){t.pagerLinkNodeArray.forEach(function(t){parseInt(t.dataset.stateIndex,10)===e.activeLayer.value?t.classList.add(e.options.classnamePagerLinkActive):t.classList.remove(e.options.classnamePagerLinkActive)})})}},{key:"drawSynchroHover",value:function(e){this.synchroHoverNodeArray.forEach(function(t){t.dataset.immerserSynchroHover===e?t.classList.add("_hover"):t.classList.remove("_hover")})}},{key:"onResize",value:function(){var e=this;this.resizeTimerId&&window.cancelAnimationFrame(this.resizeTimerId),this.resizeTimerId=window.requestAnimationFrame(function(){e.setWindowSizes(),e.setLayerSizes(),e.setStatemap(),e.draw()})}},{key:"destroy",value:function(){var e=this;this.forEachNode(this.originalChildrenNodeList,function(t){e.immerserNode.appendChild(t)}),this.immerserMaskNodeArray.forEach(function(t){e.immerserNode.removeChild(t)}),this.pagerNode.innerHTML="",this.initState(),window.removeEventListener("scroll",this.draw,!1),window.removeEventListener("resize",this.onResize,!1)}},{key:"getLastScrollPositionY",value:function(){return Math.min(Math.max(document.documentElement.scrollTop,0),this.documentHeight)}},{key:"applyStyles",value:function(e,t){var i=e.style;for(var r in t)i[r]=t[r]}},{key:"bindClassOrStyle",value:function(e,t,i){this.options.stylesInCSS?e.classList.add(t):this.applyStyles(e,i)}},{key:"forEachNode",value:function(e,t){for(var i=0;i<e.length;i++){t(e[i],i,e)}}},{key:"classnameValidator",value:function(e){return"string"==typeof e&&""!==e&&/^[a-z_-][a-z\d_-]*$/i.test(e)}}]),t}();function s(e,t){return{internal:e,get value(){return this.internal},set value(e){e!==this.internal&&(this.internal=e,t(this.internal))}}}exports.default=o;
},{}],"DOAq":[function(require,module,exports) {

},{}],"epB2":[function(require,module,exports) {
"use strict";var e=n(require("../immerser.js"));function n(e){return e&&e.__esModule?e:{default:e}}require("normalize.css"),require("../immerser.scss");for(var i=new e.default({stylesInCSS:!0,synchroHoverPagerLinks:!0,onInit:function(e){console.log(e)},onActiveLayerChange:function(e,n){console.log(e,n)}}),t=document.querySelectorAll("[data-highlighter]"),r="highlighter-animation-active",a=0;a<t.length;a++){var s=function(e){return function(){for(var n=e.dataset.highlighter,i=document.querySelectorAll(n),t=function(e){var n=i[e];if(!n.isHighlighting){n.isHighlighting=!0,n.classList.add(r);var t=setTimeout(function(){n.classList.remove(r),clearTimeout(t),n.isHighlighting=!1},1500)}},a=0;a<i.length;a++)t(a)}},o=t[a];o.addEventListener("mouseover",s(o)),o.addEventListener("click",s(o))}for(var c=document.querySelectorAll("[data-face-spinning]"),l=function(e){var n=c[e];n.addEventListener("click",function(){"false"===n.dataset.faceSpinning&&(n.dataset.faceSpinning="true",setTimeout(function(){n.dataset.faceSpinning="false"},620))})},u=0;u<c.length;u++)l(u);
},{"../immerser.js":"LiPP","normalize.css":"DOAq","../immerser.scss":"DOAq"}]},{},["epB2"], null)
//# sourceMappingURL=main.7f59bd97.js.map
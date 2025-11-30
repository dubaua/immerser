(() => {
  var t = {
      34: (t, e, r) => {
        'use strict';
        var i = r(4901);
        t.exports = function (t) {
          return 'object' == typeof t ? null !== t : i(t);
        };
      },
      81: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(9306),
          o = r(8551),
          s = r(6823),
          a = r(851),
          c = TypeError;
        t.exports = function (t, e) {
          var r = arguments.length < 2 ? a(t) : e;
          if (n(r)) return o(i(r, t));
          throw new c(s(t) + ' is not iterable');
        };
      },
      181: (t, e, r) => {
        var i = /^\s+|\s+$/g,
          n = /^[-+]0x[0-9a-f]+$/i,
          o = /^0b[01]+$/i,
          s = /^0o[0-7]+$/i,
          a = parseInt,
          c = 'object' == typeof r.g && r.g && r.g.Object === Object && r.g,
          l = 'object' == typeof self && self && self.Object === Object && self,
          u = c || l || Function('return this')(),
          h = Object.prototype.toString,
          f = Math.max,
          d = Math.min,
          p = function () {
            return u.Date.now();
          };
        function v(t) {
          var e = typeof t;
          return !!t && ('object' == e || 'function' == e);
        }
        function g(t) {
          if ('number' == typeof t) return t;
          if (
            (function (t) {
              return (
                'symbol' == typeof t ||
                ((function (t) {
                  return !!t && 'object' == typeof t;
                })(t) &&
                  '[object Symbol]' == h.call(t))
              );
            })(t)
          )
            return NaN;
          if (v(t)) {
            var e = 'function' == typeof t.valueOf ? t.valueOf() : t;
            t = v(e) ? e + '' : e;
          }
          if ('string' != typeof t) return 0 === t ? t : +t;
          t = t.replace(i, '');
          var r = o.test(t);
          return r || s.test(t) ? a(t.slice(2), r ? 2 : 8) : n.test(t) ? NaN : +t;
        }
        t.exports = function (t, e, r) {
          var i,
            n,
            o,
            s,
            a,
            c,
            l = 0,
            u = !1,
            h = !1,
            y = !0;
          if ('function' != typeof t) throw new TypeError('Expected a function');
          function m(e) {
            var r = i,
              o = n;
            return (i = n = void 0), (l = e), (s = t.apply(o, r));
          }
          function b(t) {
            var r = t - c;
            return void 0 === c || r >= e || r < 0 || (h && t - l >= o);
          }
          function x() {
            var t = p();
            if (b(t)) return w(t);
            a = setTimeout(
              x,
              (function (t) {
                var r = e - (t - c);
                return h ? d(r, o - (t - l)) : r;
              })(t),
            );
          }
          function w(t) {
            return (a = void 0), y && i ? m(t) : ((i = n = void 0), s);
          }
          function E() {
            var t = p(),
              r = b(t);
            if (((i = arguments), (n = this), (c = t), r)) {
              if (void 0 === a)
                return (function (t) {
                  return (l = t), (a = setTimeout(x, e)), u ? m(t) : s;
                })(c);
              if (h) return (a = setTimeout(x, e)), m(c);
            }
            return void 0 === a && (a = setTimeout(x, e)), s;
          }
          return (
            (e = g(e) || 0),
            v(r) &&
              ((u = !!r.leading),
              (o = (h = 'maxWait' in r) ? f(g(r.maxWait) || 0, e) : o),
              (y = 'trailing' in r ? !!r.trailing : y)),
            (E.cancel = function () {
              void 0 !== a && clearTimeout(a), (l = 0), (i = c = n = a = void 0);
            }),
            (E.flush = function () {
              return void 0 === a ? s : w(p());
            }),
            E
          );
        };
      },
      235: (t, e, r) => {
        'use strict';
        var i = r(9213).forEach,
          n = r(4598)('forEach');
        t.exports = n
          ? [].forEach
          : function (t) {
              return i(this, t, arguments.length > 1 ? arguments[1] : void 0);
            };
      },
      283: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(9039),
          o = r(4901),
          s = r(9297),
          a = r(3724),
          c = r(350).CONFIGURABLE,
          l = r(3706),
          u = r(1181),
          h = u.enforce,
          f = u.get,
          d = String,
          p = Object.defineProperty,
          v = i(''.slice),
          g = i(''.replace),
          y = i([].join),
          m =
            a &&
            !n(function () {
              return 8 !== p(function () {}, 'length', { value: 8 }).length;
            }),
          b = String(String).split('String'),
          x = (t.exports = function (t, e, r) {
            'Symbol(' === v(d(e), 0, 7) && (e = '[' + g(d(e), /^Symbol\(([^)]*)\).*$/, '$1') + ']'),
              r && r.getter && (e = 'get ' + e),
              r && r.setter && (e = 'set ' + e),
              (!s(t, 'name') || (c && t.name !== e)) &&
                (a ? p(t, 'name', { value: e, configurable: !0 }) : (t.name = e)),
              m && r && s(r, 'arity') && t.length !== r.arity && p(t, 'length', { value: r.arity });
            try {
              r && s(r, 'constructor') && r.constructor
                ? a && p(t, 'prototype', { writable: !1 })
                : t.prototype && (t.prototype = void 0);
            } catch (t) {}
            var i = h(t);
            return s(i, 'source') || (i.source = y(b, 'string' == typeof e ? e : '')), t;
          });
        Function.prototype.toString = x(function () {
          return (o(this) && f(this).source) || l(this);
        }, 'toString');
      },
      298: (t, e, r) => {
        'use strict';
        var i = r(2195),
          n = r(5397),
          o = r(8480).f,
          s = r(7680),
          a =
            'object' == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
        t.exports.f = function (t) {
          return a && 'Window' === i(t)
            ? (function (t) {
                try {
                  return o(t);
                } catch (t) {
                  return s(a);
                }
              })(t)
            : o(n(t));
        };
      },
      350: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(9297),
          o = Function.prototype,
          s = i && Object.getOwnPropertyDescriptor,
          a = n(o, 'name'),
          c = a && 'something' === function () {}.name,
          l = a && (!i || (i && s(o, 'name').configurable));
        t.exports = { EXISTS: a, PROPER: c, CONFIGURABLE: l };
      },
      397: (t, e, r) => {
        'use strict';
        var i = r(7751);
        t.exports = i('document', 'documentElement');
      },
      421: (t) => {
        'use strict';
        t.exports = {};
      },
      597: (t, e, r) => {
        'use strict';
        var i = r(9039),
          n = r(8227),
          o = r(9519),
          s = n('species');
        t.exports = function (t) {
          return (
            o >= 51 ||
            !i(function () {
              var e = [];
              return (
                ((e.constructor = {})[s] = function () {
                  return { foo: 1 };
                }),
                1 !== e[t](Boolean).foo
              );
            })
          );
        };
      },
      616: (t, e, r) => {
        'use strict';
        var i = r(9039);
        t.exports = !i(function () {
          var t = function () {}.bind();
          return 'function' != typeof t || t.hasOwnProperty('prototype');
        });
      },
      655: (t, e, r) => {
        'use strict';
        var i = r(6955),
          n = String;
        t.exports = function (t) {
          if ('Symbol' === i(t)) throw new TypeError('Cannot convert a Symbol value to a string');
          return n(t);
        };
      },
      679: (t, e, r) => {
        'use strict';
        var i = r(1625),
          n = TypeError;
        t.exports = function (t, e) {
          if (i(e, t)) return t;
          throw new n('Incorrect invocation');
        };
      },
      687: (t, e, r) => {
        'use strict';
        var i = r(4913).f,
          n = r(9297),
          o = r(8227)('toStringTag');
        t.exports = function (t, e, r) {
          t && !r && (t = t.prototype), t && !n(t, o) && i(t, o, { configurable: !0, value: e });
        };
      },
      741: (t) => {
        'use strict';
        var e = Math.ceil,
          r = Math.floor;
        t.exports =
          Math.trunc ||
          function (t) {
            var i = +t;
            return (i > 0 ? r : e)(i);
          };
      },
      757: (t, e, r) => {
        'use strict';
        var i = r(7751),
          n = r(4901),
          o = r(1625),
          s = r(7040),
          a = Object;
        t.exports = s
          ? function (t) {
              return 'symbol' == typeof t;
            }
          : function (t) {
              var e = i('Symbol');
              return n(e) && o(e.prototype, a(t));
            };
      },
      851: (t, e, r) => {
        'use strict';
        var i = r(6955),
          n = r(5966),
          o = r(4117),
          s = r(6269),
          a = r(8227)('iterator');
        t.exports = function (t) {
          if (!o(t)) return n(t, a) || n(t, '@@iterator') || s[i(t)];
        };
      },
      926: (t, e, r) => {
        'use strict';
        var i = r(9306),
          n = r(8981),
          o = r(7055),
          s = r(6198),
          a = TypeError,
          c = 'Reduce of empty array with no initial value',
          l = function (t) {
            return function (e, r, l, u) {
              var h = n(e),
                f = o(h),
                d = s(h);
              if ((i(r), 0 === d && l < 2)) throw new a(c);
              var p = t ? d - 1 : 0,
                v = t ? -1 : 1;
              if (l < 2)
                for (;;) {
                  if (p in f) {
                    (u = f[p]), (p += v);
                    break;
                  }
                  if (((p += v), t ? p < 0 : d <= p)) throw new a(c);
                }
              for (; t ? p >= 0 : d > p; p += v) p in f && (u = r(u, f[p], p, h));
              return u;
            };
          };
        t.exports = { left: l(!1), right: l(!0) };
      },
      1034: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(9297),
          o = r(1625),
          s = r(5213),
          a = r(7979),
          c = RegExp.prototype;
        t.exports = s.correct
          ? function (t) {
              return t.flags;
            }
          : function (t) {
              return s.correct || !o(c, t) || n(t, 'flags') ? t.flags : i(a, t);
            };
      },
      1072: (t, e, r) => {
        'use strict';
        var i = r(1828),
          n = r(8727);
        t.exports =
          Object.keys ||
          function (t) {
            return i(t, n);
          };
      },
      1088: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(9565),
          o = r(6395),
          s = r(350),
          a = r(4901),
          c = r(3994),
          l = r(2787),
          u = r(2967),
          h = r(687),
          f = r(6699),
          d = r(6840),
          p = r(8227),
          v = r(6269),
          g = r(7657),
          y = s.PROPER,
          m = s.CONFIGURABLE,
          b = g.IteratorPrototype,
          x = g.BUGGY_SAFARI_ITERATORS,
          w = p('iterator'),
          E = 'keys',
          S = 'values',
          O = 'entries',
          k = function () {
            return this;
          };
        t.exports = function (t, e, r, s, p, g, A) {
          c(r, e, s);
          var L,
            T,
            C,
            N = function (t) {
              if (t === p && z) return z;
              if (!x && t && t in M) return M[t];
              switch (t) {
                case E:
                case S:
                case O:
                  return function () {
                    return new r(this, t);
                  };
              }
              return function () {
                return new r(this);
              };
            },
            j = e + ' Iterator',
            R = !1,
            M = t.prototype,
            I = M[w] || M['@@iterator'] || (p && M[p]),
            z = (!x && I) || N(p),
            _ = ('Array' === e && M.entries) || I;
          if (
            (_ &&
              (L = l(_.call(new t()))) !== Object.prototype &&
              L.next &&
              (o || l(L) === b || (u ? u(L, b) : a(L[w]) || d(L, w, k)), h(L, j, !0, !0), o && (v[j] = k)),
            y &&
              p === S &&
              I &&
              I.name !== S &&
              (!o && m
                ? f(M, 'name', S)
                : ((R = !0),
                  (z = function () {
                    return n(I, this);
                  }))),
            p)
          )
            if (((T = { values: N(S), keys: g ? z : N(E), entries: N(O) }), A))
              for (C in T) (x || R || !(C in M)) && d(M, C, T[C]);
            else i({ target: e, proto: !0, forced: x || R }, T);
          return (o && !A) || M[w] === z || d(M, w, z, { name: p }), (v[e] = z), T;
        };
      },
      1181: (t, e, r) => {
        'use strict';
        var i,
          n,
          o,
          s = r(8622),
          a = r(4576),
          c = r(34),
          l = r(6699),
          u = r(9297),
          h = r(7629),
          f = r(6119),
          d = r(421),
          p = 'Object already initialized',
          v = a.TypeError,
          g = a.WeakMap;
        if (s || h.state) {
          var y = h.state || (h.state = new g());
          (y.get = y.get),
            (y.has = y.has),
            (y.set = y.set),
            (i = function (t, e) {
              if (y.has(t)) throw new v(p);
              return (e.facade = t), y.set(t, e), e;
            }),
            (n = function (t) {
              return y.get(t) || {};
            }),
            (o = function (t) {
              return y.has(t);
            });
        } else {
          var m = f('state');
          (d[m] = !0),
            (i = function (t, e) {
              if (u(t, m)) throw new v(p);
              return (e.facade = t), l(t, m, e), e;
            }),
            (n = function (t) {
              return u(t, m) ? t[m] : {};
            }),
            (o = function (t) {
              return u(t, m);
            });
        }
        t.exports = {
          set: i,
          get: n,
          has: o,
          enforce: function (t) {
            return o(t) ? n(t) : i(t, {});
          },
          getterFor: function (t) {
            return function (e) {
              var r;
              if (!c(e) || (r = n(e)).type !== t) throw new v('Incompatible receiver, ' + t + ' required');
              return r;
            };
          },
        };
      },
      1291: (t, e, r) => {
        'use strict';
        var i = r(741);
        t.exports = function (t) {
          var e = +t;
          return e != e || 0 === e ? 0 : i(e);
        };
      },
      1469: (t, e, r) => {
        'use strict';
        var i = r(7433);
        t.exports = function (t, e) {
          return new (i(t))(0 === e ? 0 : e);
        };
      },
      1625: (t, e, r) => {
        'use strict';
        var i = r(9504);
        t.exports = i({}.isPrototypeOf);
      },
      1761: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(9504),
          o = r(9228),
          s = r(8551),
          a = r(34),
          c = r(8014),
          l = r(655),
          u = r(7750),
          h = r(5966),
          f = r(7829),
          d = r(1034),
          p = r(6682),
          v = n(''.indexOf);
        o('match', function (t, e, r) {
          return [
            function (e) {
              var r = u(this),
                n = a(e) ? h(e, t) : void 0;
              return n ? i(n, e, r) : new RegExp(e)[t](l(r));
            },
            function (t) {
              var i = s(this),
                n = l(t),
                o = r(e, i, n);
              if (o.done) return o.value;
              var a = l(d(i));
              if (-1 === v(a, 'g')) return p(i, n);
              var u = -1 !== v(a, 'u');
              i.lastIndex = 0;
              for (var h, g = [], y = 0; null !== (h = p(i, n)); ) {
                var m = l(h[0]);
                (g[y] = m), '' === m && (i.lastIndex = f(n, c(i.lastIndex), u)), y++;
              }
              return 0 === y ? null : g;
            },
          ];
        });
      },
      1828: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(9297),
          o = r(5397),
          s = r(9617).indexOf,
          a = r(421),
          c = i([].push);
        t.exports = function (t, e) {
          var r,
            i = o(t),
            l = 0,
            u = [];
          for (r in i) !n(a, r) && n(i, r) && c(u, r);
          for (; e.length > l; ) n(i, (r = e[l++])) && (~s(u, r) || c(u, r));
          return u;
        };
      },
      2008: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(9213).filter;
        i(
          { target: 'Array', proto: !0, forced: !r(597)('filter') },
          {
            filter: function (t) {
              return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
            },
          },
        );
      },
      2010: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(350).EXISTS,
          o = r(9504),
          s = r(2106),
          a = Function.prototype,
          c = o(a.toString),
          l = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,
          u = o(l.exec);
        i &&
          !n &&
          s(a, 'name', {
            configurable: !0,
            get: function () {
              try {
                return u(l, c(this))[1];
              } catch (t) {
                return '';
              }
            },
          });
      },
      2106: (t, e, r) => {
        'use strict';
        var i = r(283),
          n = r(4913);
        t.exports = function (t, e, r) {
          return r.get && i(r.get, e, { getter: !0 }), r.set && i(r.set, e, { setter: !0 }), n.f(t, e, r);
        };
      },
      2140: (t, e, r) => {
        'use strict';
        var i = {};
        (i[r(8227)('toStringTag')] = 'z'), (t.exports = '[object z]' === String(i));
      },
      2195: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = i({}.toString),
          o = i(''.slice);
        t.exports = function (t) {
          return o(n(t), 8, -1);
        };
      },
      2211: (t, e, r) => {
        'use strict';
        var i = r(9039);
        t.exports = !i(function () {
          function t() {}
          return (t.prototype.constructor = null), Object.getPrototypeOf(new t()) !== t.prototype;
        });
      },
      2360: (t, e, r) => {
        'use strict';
        var i,
          n = r(8551),
          o = r(6801),
          s = r(8727),
          a = r(421),
          c = r(397),
          l = r(4055),
          u = r(6119),
          h = 'prototype',
          f = 'script',
          d = u('IE_PROTO'),
          p = function () {},
          v = function (t) {
            return '<' + f + '>' + t + '</' + f + '>';
          },
          g = function (t) {
            t.write(v('')), t.close();
            var e = t.parentWindow.Object;
            return (t = null), e;
          },
          y = function () {
            try {
              i = new ActiveXObject('htmlfile');
            } catch (t) {}
            var t, e, r;
            y =
              'undefined' != typeof document
                ? document.domain && i
                  ? g(i)
                  : ((e = l('iframe')),
                    (r = 'java' + f + ':'),
                    (e.style.display = 'none'),
                    c.appendChild(e),
                    (e.src = String(r)),
                    (t = e.contentWindow.document).open(),
                    t.write(v('document.F=Object')),
                    t.close(),
                    t.F)
                : g(i);
            for (var n = s.length; n--; ) delete y[h][s[n]];
            return y();
          };
        (a[d] = !0),
          (t.exports =
            Object.create ||
            function (t, e) {
              var r;
              return (
                null !== t ? ((p[h] = n(t)), (r = new p()), (p[h] = null), (r[d] = t)) : (r = y()),
                void 0 === e ? r : o.f(r, e)
              );
            });
      },
      2478: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(8981),
          o = Math.floor,
          s = i(''.charAt),
          a = i(''.replace),
          c = i(''.slice),
          l = /\$([$&'`]|\d{1,2}|<[^>]*>)/g,
          u = /\$([$&'`]|\d{1,2})/g;
        t.exports = function (t, e, r, i, h, f) {
          var d = r + t.length,
            p = i.length,
            v = u;
          return (
            void 0 !== h && ((h = n(h)), (v = l)),
            a(f, v, function (n, a) {
              var l;
              switch (s(a, 0)) {
                case '$':
                  return '$';
                case '&':
                  return t;
                case '`':
                  return c(e, 0, r);
                case "'":
                  return c(e, d);
                case '<':
                  l = h[c(a, 1, -1)];
                  break;
                default:
                  var u = +a;
                  if (0 === u) return n;
                  if (u > p) {
                    var f = o(u / 10);
                    return 0 === f ? n : f <= p ? (void 0 === i[f - 1] ? s(a, 1) : i[f - 1] + s(a, 1)) : n;
                  }
                  l = i[u - 1];
              }
              return void 0 === l ? '' : l;
            })
          );
        };
      },
      2529: (t) => {
        'use strict';
        t.exports = function (t, e) {
          return { value: t, done: e };
        };
      },
      2652: (t, e, r) => {
        'use strict';
        var i = r(6080),
          n = r(9565),
          o = r(8551),
          s = r(6823),
          a = r(4209),
          c = r(6198),
          l = r(1625),
          u = r(81),
          h = r(851),
          f = r(9539),
          d = TypeError,
          p = function (t, e) {
            (this.stopped = t), (this.result = e);
          },
          v = p.prototype;
        t.exports = function (t, e, r) {
          var g,
            y,
            m,
            b,
            x,
            w,
            E,
            S = r && r.that,
            O = !(!r || !r.AS_ENTRIES),
            k = !(!r || !r.IS_RECORD),
            A = !(!r || !r.IS_ITERATOR),
            L = !(!r || !r.INTERRUPTED),
            T = i(e, S),
            C = function (t) {
              return g && f(g, 'normal'), new p(!0, t);
            },
            N = function (t) {
              return O ? (o(t), L ? T(t[0], t[1], C) : T(t[0], t[1])) : L ? T(t, C) : T(t);
            };
          if (k) g = t.iterator;
          else if (A) g = t;
          else {
            if (!(y = h(t))) throw new d(s(t) + ' is not iterable');
            if (a(y)) {
              for (m = 0, b = c(t); b > m; m++) if ((x = N(t[m])) && l(v, x)) return x;
              return new p(!1);
            }
            g = u(t, y);
          }
          for (w = k ? t.next : g.next; !(E = n(w, g)).done; ) {
            try {
              x = N(E.value);
            } catch (t) {
              f(g, 'throw', t);
            }
            if ('object' == typeof x && x && l(v, x)) return x;
          }
          return new p(!1);
        };
      },
      2703: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(9039),
          o = r(9504),
          s = r(655),
          a = r(3802).trim,
          c = r(7452),
          l = i.parseInt,
          u = i.Symbol,
          h = u && u.iterator,
          f = /^[+-]?0x/i,
          d = o(f.exec),
          p =
            8 !== l(c + '08') ||
            22 !== l(c + '0x16') ||
            (h &&
              !n(function () {
                l(Object(h));
              }));
        t.exports = p
          ? function (t, e) {
              var r = a(s(t));
              return l(r, e >>> 0 || (d(f, r) ? 16 : 10));
            }
          : l;
      },
      2712: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(926).left,
          o = r(4598),
          s = r(9519);
        i(
          { target: 'Array', proto: !0, forced: (!r(6193) && s > 79 && s < 83) || !o('reduce') },
          {
            reduce: function (t) {
              var e = arguments.length;
              return n(this, t, e, e > 1 ? arguments[1] : void 0);
            },
          },
        );
      },
      2744: (t, e, r) => {
        'use strict';
        var i = r(9039);
        t.exports = !i(function () {
          return Object.isExtensible(Object.preventExtensions({}));
        });
      },
      2777: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(34),
          o = r(757),
          s = r(5966),
          a = r(4270),
          c = r(8227),
          l = TypeError,
          u = c('toPrimitive');
        t.exports = function (t, e) {
          if (!n(t) || o(t)) return t;
          var r,
            c = s(t, u);
          if (c) {
            if ((void 0 === e && (e = 'default'), (r = i(c, t, e)), !n(r) || o(r))) return r;
            throw new l("Can't convert object to primitive value");
          }
          return void 0 === e && (e = 'number'), a(t, e);
        };
      },
      2787: (t, e, r) => {
        'use strict';
        var i = r(9297),
          n = r(4901),
          o = r(8981),
          s = r(6119),
          a = r(2211),
          c = s('IE_PROTO'),
          l = Object,
          u = l.prototype;
        t.exports = a
          ? l.getPrototypeOf
          : function (t) {
              var e = o(t);
              if (i(e, c)) return e[c];
              var r = e.constructor;
              return n(r) && e instanceof r ? r.prototype : e instanceof l ? u : null;
            };
      },
      2796: (t, e, r) => {
        'use strict';
        var i = r(9039),
          n = r(4901),
          o = /#|\.prototype\./,
          s = function (t, e) {
            var r = c[a(t)];
            return r === u || (r !== l && (n(e) ? i(e) : !!e));
          },
          a = (s.normalize = function (t) {
            return String(t).replace(o, '.').toLowerCase();
          }),
          c = (s.data = {}),
          l = (s.NATIVE = 'N'),
          u = (s.POLYFILL = 'P');
        t.exports = s;
      },
      2839: (t, e, r) => {
        'use strict';
        var i = r(4576).navigator,
          n = i && i.userAgent;
        t.exports = n ? String(n) : '';
      },
      2953: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(7400),
          o = r(9296),
          s = r(3792),
          a = r(6699),
          c = r(687),
          l = r(8227)('iterator'),
          u = s.values,
          h = function (t, e) {
            if (t) {
              if (t[l] !== u)
                try {
                  a(t, l, u);
                } catch (e) {
                  t[l] = u;
                }
              if ((c(t, e, !0), n[e]))
                for (var r in s)
                  if (t[r] !== s[r])
                    try {
                      a(t, r, s[r]);
                    } catch (e) {
                      t[r] = s[r];
                    }
            }
          };
        for (var f in n) h(i[f] && i[f].prototype, f);
        h(o, 'DOMTokenList');
      },
      2967: (t, e, r) => {
        'use strict';
        var i = r(6706),
          n = r(34),
          o = r(7750),
          s = r(3506);
        t.exports =
          Object.setPrototypeOf ||
          ('__proto__' in {}
            ? (function () {
                var t,
                  e = !1,
                  r = {};
                try {
                  (t = i(Object.prototype, '__proto__', 'set'))(r, []), (e = r instanceof Array);
                } catch (t) {}
                return function (r, i) {
                  return o(r), s(i), n(r) ? (e ? t(r, i) : (r.__proto__ = i), r) : r;
                };
              })()
            : void 0);
      },
      3167: (t, e, r) => {
        'use strict';
        var i = r(4901),
          n = r(34),
          o = r(2967);
        t.exports = function (t, e, r) {
          var s, a;
          return o && i((s = e.constructor)) && s !== r && n((a = s.prototype)) && a !== r.prototype && o(t, a), t;
        };
      },
      3179: (t, e, r) => {
        'use strict';
        var i = r(2140),
          n = r(6955);
        t.exports = i
          ? {}.toString
          : function () {
              return '[object ' + n(this) + ']';
            };
      },
      3392: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = 0,
          o = Math.random(),
          s = i((1.1).toString);
        t.exports = function (t) {
          return 'Symbol(' + (void 0 === t ? '' : t) + ')_' + s(++n + o, 36);
        };
      },
      3451: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(9504),
          o = r(421),
          s = r(34),
          a = r(9297),
          c = r(4913).f,
          l = r(8480),
          u = r(298),
          h = r(4124),
          f = r(3392),
          d = r(2744),
          p = !1,
          v = f('meta'),
          g = 0,
          y = function (t) {
            c(t, v, { value: { objectID: 'O' + g++, weakData: {} } });
          },
          m = (t.exports = {
            enable: function () {
              (m.enable = function () {}), (p = !0);
              var t = l.f,
                e = n([].splice),
                r = {};
              (r[v] = 1),
                t(r).length &&
                  ((l.f = function (r) {
                    for (var i = t(r), n = 0, o = i.length; n < o; n++)
                      if (i[n] === v) {
                        e(i, n, 1);
                        break;
                      }
                    return i;
                  }),
                  i({ target: 'Object', stat: !0, forced: !0 }, { getOwnPropertyNames: u.f }));
            },
            fastKey: function (t, e) {
              if (!s(t)) return 'symbol' == typeof t ? t : ('string' == typeof t ? 'S' : 'P') + t;
              if (!a(t, v)) {
                if (!h(t)) return 'F';
                if (!e) return 'E';
                y(t);
              }
              return t[v].objectID;
            },
            getWeakData: function (t, e) {
              if (!a(t, v)) {
                if (!h(t)) return !0;
                if (!e) return !1;
                y(t);
              }
              return t[v].weakData;
            },
            onFreeze: function (t) {
              return d && p && h(t) && !a(t, v) && y(t), t;
            },
          });
        o[v] = !0;
      },
      3500: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(7400),
          o = r(9296),
          s = r(235),
          a = r(6699),
          c = function (t) {
            if (t && t.forEach !== s)
              try {
                a(t, 'forEach', s);
              } catch (e) {
                t.forEach = s;
              }
          };
        for (var l in n) n[l] && c(i[l] && i[l].prototype);
        c(o);
      },
      3506: (t, e, r) => {
        'use strict';
        var i = r(3925),
          n = String,
          o = TypeError;
        t.exports = function (t) {
          if (i(t)) return t;
          throw new o("Can't set " + n(t) + ' as a prototype');
        };
      },
      3517: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(9039),
          o = r(4901),
          s = r(6955),
          a = r(7751),
          c = r(3706),
          l = function () {},
          u = a('Reflect', 'construct'),
          h = /^\s*(?:class|function)\b/,
          f = i(h.exec),
          d = !h.test(l),
          p = function (t) {
            if (!o(t)) return !1;
            try {
              return u(l, [], t), !0;
            } catch (t) {
              return !1;
            }
          },
          v = function (t) {
            if (!o(t)) return !1;
            switch (s(t)) {
              case 'AsyncFunction':
              case 'GeneratorFunction':
              case 'AsyncGeneratorFunction':
                return !1;
            }
            try {
              return d || !!f(h, c(t));
            } catch (t) {
              return !0;
            }
          };
        (v.sham = !0),
          (t.exports =
            !u ||
            n(function () {
              var t;
              return (
                p(p.call) ||
                !p(Object) ||
                !p(function () {
                  t = !0;
                }) ||
                t
              );
            })
              ? v
              : p);
      },
      3635: (t, e, r) => {
        'use strict';
        var i = r(9039),
          n = r(4576).RegExp;
        t.exports = i(function () {
          var t = n('.', 's');
          return !(t.dotAll && t.test('\n') && 's' === t.flags);
        });
      },
      3706: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(4901),
          o = r(7629),
          s = i(Function.toString);
        n(o.inspectSource) ||
          (o.inspectSource = function (t) {
            return s(t);
          }),
          (t.exports = o.inspectSource);
      },
      3717: (t, e) => {
        'use strict';
        e.f = Object.getOwnPropertySymbols;
      },
      3724: (t, e, r) => {
        'use strict';
        var i = r(9039);
        t.exports = !i(function () {
          return (
            7 !==
            Object.defineProperty({}, 1, {
              get: function () {
                return 7;
              },
            })[1]
          );
        });
      },
      3772: (t, e, r) => {
        'use strict';
        r(5746);
      },
      3792: (t, e, r) => {
        'use strict';
        var i = r(5397),
          n = r(6469),
          o = r(6269),
          s = r(1181),
          a = r(4913).f,
          c = r(1088),
          l = r(2529),
          u = r(6395),
          h = r(3724),
          f = 'Array Iterator',
          d = s.set,
          p = s.getterFor(f);
        t.exports = c(
          Array,
          'Array',
          function (t, e) {
            d(this, { type: f, target: i(t), index: 0, kind: e });
          },
          function () {
            var t = p(this),
              e = t.target,
              r = t.index++;
            if (!e || r >= e.length) return (t.target = null), l(void 0, !0);
            switch (t.kind) {
              case 'keys':
                return l(r, !1);
              case 'values':
                return l(e[r], !1);
            }
            return l([r, e[r]], !1);
          },
          'values',
        );
        var v = (o.Arguments = o.Array);
        if ((n('keys'), n('values'), n('entries'), !u && h && 'values' !== v.name))
          try {
            a(v, 'name', { value: 'values' });
          } catch (t) {}
      },
      3802: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(7750),
          o = r(655),
          s = r(7452),
          a = i(''.replace),
          c = RegExp('^[' + s + ']+'),
          l = RegExp('(^|[^' + s + '])[' + s + ']+$'),
          u = function (t) {
            return function (e) {
              var r = o(n(e));
              return 1 & t && (r = a(r, c, '')), 2 & t && (r = a(r, l, '$1')), r;
            };
          };
        t.exports = { start: u(1), end: u(2), trim: u(3) };
      },
      3925: (t, e, r) => {
        'use strict';
        var i = r(34);
        t.exports = function (t) {
          return i(t) || null === t;
        };
      },
      3994: (t, e, r) => {
        'use strict';
        var i = r(7657).IteratorPrototype,
          n = r(2360),
          o = r(6980),
          s = r(687),
          a = r(6269),
          c = function () {
            return this;
          };
        t.exports = function (t, e, r, l) {
          var u = e + ' Iterator';
          return (t.prototype = n(i, { next: o(+!l, r) })), s(t, u, !1, !0), (a[u] = c), t;
        };
      },
      4006: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(6279),
          o = r(3451).getWeakData,
          s = r(679),
          a = r(8551),
          c = r(4117),
          l = r(34),
          u = r(2652),
          h = r(9213),
          f = r(9297),
          d = r(1181),
          p = d.set,
          v = d.getterFor,
          g = h.find,
          y = h.findIndex,
          m = i([].splice),
          b = 0,
          x = function (t) {
            return t.frozen || (t.frozen = new w());
          },
          w = function () {
            this.entries = [];
          },
          E = function (t, e) {
            return g(t.entries, function (t) {
              return t[0] === e;
            });
          };
        (w.prototype = {
          get: function (t) {
            var e = E(this, t);
            if (e) return e[1];
          },
          has: function (t) {
            return !!E(this, t);
          },
          set: function (t, e) {
            var r = E(this, t);
            r ? (r[1] = e) : this.entries.push([t, e]);
          },
          delete: function (t) {
            var e = y(this.entries, function (e) {
              return e[0] === t;
            });
            return ~e && m(this.entries, e, 1), !!~e;
          },
        }),
          (t.exports = {
            getConstructor: function (t, e, r, i) {
              var h = t(function (t, n) {
                  s(t, d), p(t, { type: e, id: b++, frozen: null }), c(n) || u(n, t[i], { that: t, AS_ENTRIES: r });
                }),
                d = h.prototype,
                g = v(e),
                y = function (t, e, r) {
                  var i = g(t),
                    n = o(a(e), !0);
                  return !0 === n ? x(i).set(e, r) : (n[i.id] = r), t;
                };
              return (
                n(d, {
                  delete: function (t) {
                    var e = g(this);
                    if (!l(t)) return !1;
                    var r = o(t);
                    return !0 === r ? x(e).delete(t) : r && f(r, e.id) && delete r[e.id];
                  },
                  has: function (t) {
                    var e = g(this);
                    if (!l(t)) return !1;
                    var r = o(t);
                    return !0 === r ? x(e).has(t) : r && f(r, e.id);
                  },
                }),
                n(
                  d,
                  r
                    ? {
                        get: function (t) {
                          var e = g(this);
                          if (l(t)) {
                            var r = o(t);
                            if (!0 === r) return x(e).get(t);
                            if (r) return r[e.id];
                          }
                        },
                        set: function (t, e) {
                          return y(this, t, e);
                        },
                      }
                    : {
                        add: function (t) {
                          return y(this, t, !0);
                        },
                      },
                ),
                h
              );
            },
          });
      },
      4055: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(34),
          o = i.document,
          s = n(o) && n(o.createElement);
        t.exports = function (t) {
          return s ? o.createElement(t) : {};
        };
      },
      4117: (t) => {
        'use strict';
        t.exports = function (t) {
          return null == t;
        };
      },
      4124: (t, e, r) => {
        'use strict';
        var i = r(9039),
          n = r(34),
          o = r(2195),
          s = r(5652),
          a = Object.isExtensible,
          c = i(function () {
            a(1);
          });
        t.exports =
          c || s
            ? function (t) {
                return !!n(t) && (!s || 'ArrayBuffer' !== o(t)) && (!a || a(t));
              }
            : a;
      },
      4209: (t, e, r) => {
        'use strict';
        var i = r(8227),
          n = r(6269),
          o = i('iterator'),
          s = Array.prototype;
        t.exports = function (t) {
          return void 0 !== t && (n.Array === t || s[o] === t);
        };
      },
      4213: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(9504),
          o = r(9565),
          s = r(9039),
          a = r(1072),
          c = r(3717),
          l = r(8773),
          u = r(8981),
          h = r(7055),
          f = Object.assign,
          d = Object.defineProperty,
          p = n([].concat);
        t.exports =
          !f ||
          s(function () {
            if (
              i &&
              1 !==
                f(
                  { b: 1 },
                  f(
                    d({}, 'a', {
                      enumerable: !0,
                      get: function () {
                        d(this, 'b', { value: 3, enumerable: !1 });
                      },
                    }),
                    { b: 2 },
                  ),
                ).b
            )
              return !0;
            var t = {},
              e = {},
              r = Symbol('assign detection'),
              n = 'abcdefghijklmnopqrst';
            return (
              (t[r] = 7),
              n.split('').forEach(function (t) {
                e[t] = t;
              }),
              7 !== f({}, t)[r] || a(f({}, e)).join('') !== n
            );
          })
            ? function (t, e) {
                for (var r = u(t), n = arguments.length, s = 1, f = c.f, d = l.f; n > s; )
                  for (var v, g = h(arguments[s++]), y = f ? p(a(g), f(g)) : a(g), m = y.length, b = 0; m > b; )
                    (v = y[b++]), (i && !o(d, g, v)) || (r[v] = g[v]);
                return r;
              }
            : f;
      },
      4215: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(2839),
          o = r(2195),
          s = function (t) {
            return n.slice(0, t.length) === t;
          };
        t.exports = s('Bun/')
          ? 'BUN'
          : s('Cloudflare-Workers')
          ? 'CLOUDFLARE'
          : s('Deno/')
          ? 'DENO'
          : s('Node.js/')
          ? 'NODE'
          : i.Bun && 'string' == typeof Bun.version
          ? 'BUN'
          : i.Deno && 'object' == typeof Deno.version
          ? 'DENO'
          : 'process' === o(i.process)
          ? 'NODE'
          : i.window && i.document
          ? 'BROWSER'
          : 'REST';
      },
      4270: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(4901),
          o = r(34),
          s = TypeError;
        t.exports = function (t, e) {
          var r, a;
          if ('string' === e && n((r = t.toString)) && !o((a = i(r, t)))) return a;
          if (n((r = t.valueOf)) && !o((a = i(r, t)))) return a;
          if ('string' !== e && n((r = t.toString)) && !o((a = i(r, t)))) return a;
          throw new s("Can't convert object to primitive value");
        };
      },
      4376: (t, e, r) => {
        'use strict';
        var i = r(2195);
        t.exports =
          Array.isArray ||
          function (t) {
            return 'Array' === i(t);
          };
      },
      4428: (t, e, r) => {
        'use strict';
        var i = r(8227)('iterator'),
          n = !1;
        try {
          var o = 0,
            s = {
              next: function () {
                return { done: !!o++ };
              },
              return: function () {
                n = !0;
              },
            };
          (s[i] = function () {
            return this;
          }),
            Array.from(s, function () {
              throw 2;
            });
        } catch (t) {}
        t.exports = function (t, e) {
          try {
            if (!e && !n) return !1;
          } catch (t) {
            return !1;
          }
          var r = !1;
          try {
            var o = {};
            (o[i] = function () {
              return {
                next: function () {
                  return { done: (r = !0) };
                },
              };
            }),
              t(o);
          } catch (t) {}
          return r;
        };
      },
      4495: (t, e, r) => {
        'use strict';
        var i = r(9519),
          n = r(9039),
          o = r(4576).String;
        t.exports =
          !!Object.getOwnPropertySymbols &&
          !n(function () {
            var t = Symbol('symbol detection');
            return !o(t) || !(Object(t) instanceof Symbol) || (!Symbol.sham && i && i < 41);
          });
      },
      4576: function (t, e, r) {
        'use strict';
        var i = function (t) {
          return t && t.Math === Math && t;
        };
        t.exports =
          i('object' == typeof globalThis && globalThis) ||
          i('object' == typeof window && window) ||
          i('object' == typeof self && self) ||
          i('object' == typeof r.g && r.g) ||
          i('object' == typeof this && this) ||
          (function () {
            return this;
          })() ||
          Function('return this')();
      },
      4598: (t, e, r) => {
        'use strict';
        var i = r(9039);
        t.exports = function (t, e) {
          var r = [][t];
          return (
            !!r &&
            i(function () {
              r.call(
                null,
                e ||
                  function () {
                    return 1;
                  },
                1,
              );
            })
          );
        };
      },
      4610: (t) => {
        var e = !('undefined' == typeof window || !window.document || !window.document.createElement);
        t.exports = e;
      },
      4901: (t) => {
        'use strict';
        var e = 'object' == typeof document && document.all;
        t.exports =
          void 0 === e && void 0 !== e
            ? function (t) {
                return 'function' == typeof t || t === e;
              }
            : function (t) {
                return 'function' == typeof t;
              };
      },
      4913: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(5917),
          o = r(8686),
          s = r(8551),
          a = r(6969),
          c = TypeError,
          l = Object.defineProperty,
          u = Object.getOwnPropertyDescriptor,
          h = 'enumerable',
          f = 'configurable',
          d = 'writable';
        e.f = i
          ? o
            ? function (t, e, r) {
                if (
                  (s(t),
                  (e = a(e)),
                  s(r),
                  'function' == typeof t && 'prototype' === e && 'value' in r && d in r && !r[d])
                ) {
                  var i = u(t, e);
                  i &&
                    i[d] &&
                    ((t[e] = r.value),
                    (r = { configurable: f in r ? r[f] : i[f], enumerable: h in r ? r[h] : i[h], writable: !1 }));
                }
                return l(t, e, r);
              }
            : l
          : function (t, e, r) {
              if ((s(t), (e = a(e)), s(r), n))
                try {
                  return l(t, e, r);
                } catch (t) {}
              if ('get' in r || 'set' in r) throw new c('Accessors not supported');
              return 'value' in r && (t[e] = r.value), t;
            };
      },
      5031: (t, e, r) => {
        'use strict';
        var i = r(7751),
          n = r(9504),
          o = r(8480),
          s = r(3717),
          a = r(8551),
          c = n([].concat);
        t.exports =
          i('Reflect', 'ownKeys') ||
          function (t) {
            var e = o.f(a(t)),
              r = s.f;
            return r ? c(e, r(t)) : e;
          };
      },
      5213: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(9039),
          o = i.RegExp,
          s = !n(function () {
            var t = !0;
            try {
              o('.', 'd');
            } catch (e) {
              t = !1;
            }
            var e = {},
              r = '',
              i = t ? 'dgimsy' : 'gimsy',
              n = function (t, i) {
                Object.defineProperty(e, t, {
                  get: function () {
                    return (r += i), !0;
                  },
                });
              },
              s = { dotAll: 's', global: 'g', ignoreCase: 'i', multiline: 'm', sticky: 'y' };
            for (var a in (t && (s.hasIndices = 'd'), s)) n(a, s[a]);
            return Object.getOwnPropertyDescriptor(o.prototype, 'flags').get.call(e) !== i || r !== i;
          });
        t.exports = { correct: s };
      },
      5397: (t, e, r) => {
        'use strict';
        var i = r(7055),
          n = r(7750);
        t.exports = function (t) {
          return i(n(t));
        };
      },
      5440: (t, e, r) => {
        'use strict';
        var i = r(8745),
          n = r(9565),
          o = r(9504),
          s = r(9228),
          a = r(9039),
          c = r(8551),
          l = r(4901),
          u = r(34),
          h = r(1291),
          f = r(8014),
          d = r(655),
          p = r(7750),
          v = r(7829),
          g = r(5966),
          y = r(2478),
          m = r(1034),
          b = r(6682),
          x = r(8227)('replace'),
          w = Math.max,
          E = Math.min,
          S = o([].concat),
          O = o([].push),
          k = o(''.indexOf),
          A = o(''.slice),
          L = function (t) {
            return void 0 === t ? t : String(t);
          },
          T = '$0' === 'a'.replace(/./, '$0'),
          C = !!/./[x] && '' === /./[x]('a', '$0');
        s(
          'replace',
          function (t, e, r) {
            var o = C ? '$' : '$0';
            return [
              function (t, r) {
                var i = p(this),
                  o = u(t) ? g(t, x) : void 0;
                return o ? n(o, t, i, r) : n(e, d(i), t, r);
              },
              function (t, n) {
                var s = c(this),
                  a = d(t);
                if ('string' == typeof n && -1 === k(n, o) && -1 === k(n, '$<')) {
                  var u = r(e, s, a, n);
                  if (u.done) return u.value;
                }
                var p = l(n);
                p || (n = d(n));
                var g,
                  x = d(m(s)),
                  T = -1 !== k(x, 'g');
                T && ((g = -1 !== k(x, 'u')), (s.lastIndex = 0));
                for (var C, N = []; null !== (C = b(s, a)) && (O(N, C), T); ) {
                  '' === d(C[0]) && (s.lastIndex = v(a, f(s.lastIndex), g));
                }
                for (var j = '', R = 0, M = 0; M < N.length; M++) {
                  for (var I, z = d((C = N[M])[0]), _ = w(E(h(C.index), a.length), 0), P = [], W = 1; W < C.length; W++)
                    O(P, L(C[W]));
                  var B = C.groups;
                  if (p) {
                    var H = S([z], P, _, a);
                    void 0 !== B && O(H, B), (I = d(i(n, void 0, H)));
                  } else I = y(z, a, _, P, B, n);
                  _ >= R && ((j += A(a, R, _) + I), (R = _ + z.length));
                }
                return j + A(a, R);
              },
            ];
          },
          !!a(function () {
            var t = /./;
            return (
              (t.exec = function () {
                var t = [];
                return (t.groups = { a: '7' }), t;
              }),
              '7' !== ''.replace(t, '$<a>')
            );
          }) ||
            !T ||
            C,
        );
      },
      5610: (t, e, r) => {
        'use strict';
        var i = r(1291),
          n = Math.max,
          o = Math.min;
        t.exports = function (t, e) {
          var r = i(t);
          return r < 0 ? n(r + e, 0) : o(r, e);
        };
      },
      5652: (t, e, r) => {
        'use strict';
        var i = r(9039);
        t.exports = i(function () {
          if ('function' == typeof ArrayBuffer) {
            var t = new ArrayBuffer(8);
            Object.isExtensible(t) && Object.defineProperty(t, 'a', { value: 8 });
          }
        });
      },
      5745: (t, e, r) => {
        'use strict';
        var i = r(7629);
        t.exports = function (t, e) {
          return i[t] || (i[t] = e || {});
        };
      },
      5746: (t, e, r) => {
        'use strict';
        var i,
          n = r(2744),
          o = r(4576),
          s = r(9504),
          a = r(6279),
          c = r(3451),
          l = r(6468),
          u = r(4006),
          h = r(34),
          f = r(1181).enforce,
          d = r(9039),
          p = r(8622),
          v = Object,
          g = Array.isArray,
          y = v.isExtensible,
          m = v.isFrozen,
          b = v.isSealed,
          x = v.freeze,
          w = v.seal,
          E = !o.ActiveXObject && 'ActiveXObject' in o,
          S = function (t) {
            return function () {
              return t(this, arguments.length ? arguments[0] : void 0);
            };
          },
          O = l('WeakMap', S, u),
          k = O.prototype,
          A = s(k.set);
        if (p)
          if (E) {
            (i = u.getConstructor(S, 'WeakMap', !0)), c.enable();
            var L = s(k.delete),
              T = s(k.has),
              C = s(k.get);
            a(k, {
              delete: function (t) {
                if (h(t) && !y(t)) {
                  var e = f(this);
                  return e.frozen || (e.frozen = new i()), L(this, t) || e.frozen.delete(t);
                }
                return L(this, t);
              },
              has: function (t) {
                if (h(t) && !y(t)) {
                  var e = f(this);
                  return e.frozen || (e.frozen = new i()), T(this, t) || e.frozen.has(t);
                }
                return T(this, t);
              },
              get: function (t) {
                if (h(t) && !y(t)) {
                  var e = f(this);
                  return e.frozen || (e.frozen = new i()), T(this, t) ? C(this, t) : e.frozen.get(t);
                }
                return C(this, t);
              },
              set: function (t, e) {
                if (h(t) && !y(t)) {
                  var r = f(this);
                  r.frozen || (r.frozen = new i()), T(this, t) ? A(this, t, e) : r.frozen.set(t, e);
                } else A(this, t, e);
                return this;
              },
            });
          } else
            n &&
              d(function () {
                var t = x([]);
                return A(new O(), t, 1), !m(t);
              }) &&
              a(k, {
                set: function (t, e) {
                  var r;
                  return g(t) && (m(t) ? (r = x) : b(t) && (r = w)), A(this, t, e), r && r(t), this;
                },
              });
      },
      5858: (t, e, r) => {
        var i = 'Expected a function',
          n = /^\s+|\s+$/g,
          o = /^[-+]0x[0-9a-f]+$/i,
          s = /^0b[01]+$/i,
          a = /^0o[0-7]+$/i,
          c = parseInt,
          l = 'object' == typeof r.g && r.g && r.g.Object === Object && r.g,
          u = 'object' == typeof self && self && self.Object === Object && self,
          h = l || u || Function('return this')(),
          f = Object.prototype.toString,
          d = Math.max,
          p = Math.min,
          v = function () {
            return h.Date.now();
          };
        function g(t, e, r) {
          var n,
            o,
            s,
            a,
            c,
            l,
            u = 0,
            h = !1,
            f = !1,
            g = !0;
          if ('function' != typeof t) throw new TypeError(i);
          function b(e) {
            var r = n,
              i = o;
            return (n = o = void 0), (u = e), (a = t.apply(i, r));
          }
          function x(t) {
            var r = t - l;
            return void 0 === l || r >= e || r < 0 || (f && t - u >= s);
          }
          function w() {
            var t = v();
            if (x(t)) return E(t);
            c = setTimeout(
              w,
              (function (t) {
                var r = e - (t - l);
                return f ? p(r, s - (t - u)) : r;
              })(t),
            );
          }
          function E(t) {
            return (c = void 0), g && n ? b(t) : ((n = o = void 0), a);
          }
          function S() {
            var t = v(),
              r = x(t);
            if (((n = arguments), (o = this), (l = t), r)) {
              if (void 0 === c)
                return (function (t) {
                  return (u = t), (c = setTimeout(w, e)), h ? b(t) : a;
                })(l);
              if (f) return (c = setTimeout(w, e)), b(l);
            }
            return void 0 === c && (c = setTimeout(w, e)), a;
          }
          return (
            (e = m(e) || 0),
            y(r) &&
              ((h = !!r.leading),
              (s = (f = 'maxWait' in r) ? d(m(r.maxWait) || 0, e) : s),
              (g = 'trailing' in r ? !!r.trailing : g)),
            (S.cancel = function () {
              void 0 !== c && clearTimeout(c), (u = 0), (n = l = o = c = void 0);
            }),
            (S.flush = function () {
              return void 0 === c ? a : E(v());
            }),
            S
          );
        }
        function y(t) {
          var e = typeof t;
          return !!t && ('object' == e || 'function' == e);
        }
        function m(t) {
          if ('number' == typeof t) return t;
          if (
            (function (t) {
              return (
                'symbol' == typeof t ||
                ((function (t) {
                  return !!t && 'object' == typeof t;
                })(t) &&
                  '[object Symbol]' == f.call(t))
              );
            })(t)
          )
            return NaN;
          if (y(t)) {
            var e = 'function' == typeof t.valueOf ? t.valueOf() : t;
            t = y(e) ? e + '' : e;
          }
          if ('string' != typeof t) return 0 === t ? t : +t;
          t = t.replace(n, '');
          var r = s.test(t);
          return r || a.test(t) ? c(t.slice(2), r ? 2 : 8) : o.test(t) ? NaN : +t;
        }
        t.exports = function (t, e, r) {
          var n = !0,
            o = !0;
          if ('function' != typeof t) throw new TypeError(i);
          return (
            y(r) && ((n = 'leading' in r ? !!r.leading : n), (o = 'trailing' in r ? !!r.trailing : o)),
            g(t, e, { leading: n, maxWait: e, trailing: o })
          );
        };
      },
      5917: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(9039),
          o = r(4055);
        t.exports =
          !i &&
          !n(function () {
            return (
              7 !==
              Object.defineProperty(o('div'), 'a', {
                get: function () {
                  return 7;
                },
              }).a
            );
          });
      },
      5966: (t, e, r) => {
        'use strict';
        var i = r(9306),
          n = r(4117);
        t.exports = function (t, e) {
          var r = t[e];
          return n(r) ? void 0 : i(r);
        };
      },
      6080: (t, e, r) => {
        'use strict';
        var i = r(7476),
          n = r(9306),
          o = r(616),
          s = i(i.bind);
        t.exports = function (t, e) {
          return (
            n(t),
            void 0 === e
              ? t
              : o
              ? s(t, e)
              : function () {
                  return t.apply(e, arguments);
                }
          );
        };
      },
      6099: (t, e, r) => {
        'use strict';
        var i = r(2140),
          n = r(6840),
          o = r(3179);
        i || n(Object.prototype, 'toString', o, { unsafe: !0 });
      },
      6119: (t, e, r) => {
        'use strict';
        var i = r(5745),
          n = r(3392),
          o = i('keys');
        t.exports = function (t) {
          return o[t] || (o[t] = n(t));
        };
      },
      6193: (t, e, r) => {
        'use strict';
        var i = r(4215);
        t.exports = 'NODE' === i;
      },
      6198: (t, e, r) => {
        'use strict';
        var i = r(8014);
        t.exports = function (t) {
          return i(t.length);
        };
      },
      6269: (t) => {
        'use strict';
        t.exports = {};
      },
      6279: (t, e, r) => {
        'use strict';
        var i = r(6840);
        t.exports = function (t, e, r) {
          for (var n in e) i(t, n, e[n], r);
          return t;
        };
      },
      6395: (t) => {
        'use strict';
        t.exports = !1;
      },
      6468: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(4576),
          o = r(9504),
          s = r(2796),
          a = r(6840),
          c = r(3451),
          l = r(2652),
          u = r(679),
          h = r(4901),
          f = r(4117),
          d = r(34),
          p = r(9039),
          v = r(4428),
          g = r(687),
          y = r(3167);
        t.exports = function (t, e, r) {
          var m = -1 !== t.indexOf('Map'),
            b = -1 !== t.indexOf('Weak'),
            x = m ? 'set' : 'add',
            w = n[t],
            E = w && w.prototype,
            S = w,
            O = {},
            k = function (t) {
              var e = o(E[t]);
              a(
                E,
                t,
                'add' === t
                  ? function (t) {
                      return e(this, 0 === t ? 0 : t), this;
                    }
                  : 'delete' === t
                  ? function (t) {
                      return !(b && !d(t)) && e(this, 0 === t ? 0 : t);
                    }
                  : 'get' === t
                  ? function (t) {
                      return b && !d(t) ? void 0 : e(this, 0 === t ? 0 : t);
                    }
                  : 'has' === t
                  ? function (t) {
                      return !(b && !d(t)) && e(this, 0 === t ? 0 : t);
                    }
                  : function (t, r) {
                      return e(this, 0 === t ? 0 : t, r), this;
                    },
              );
            };
          if (
            s(
              t,
              !h(w) ||
                !(
                  b ||
                  (E.forEach &&
                    !p(function () {
                      new w().entries().next();
                    }))
                ),
            )
          )
            (S = r.getConstructor(e, t, m, x)), c.enable();
          else if (s(t, !0)) {
            var A = new S(),
              L = A[x](b ? {} : -0, 1) !== A,
              T = p(function () {
                A.has(1);
              }),
              C = v(function (t) {
                new w(t);
              }),
              N =
                !b &&
                p(function () {
                  for (var t = new w(), e = 5; e--; ) t[x](e, e);
                  return !t.has(-0);
                });
            C ||
              (((S = e(function (t, e) {
                u(t, E);
                var r = y(new w(), t, S);
                return f(e) || l(e, r[x], { that: r, AS_ENTRIES: m }), r;
              })).prototype = E),
              (E.constructor = S)),
              (T || N) && (k('delete'), k('has'), m && k('get')),
              (N || L) && k(x),
              b && E.clear && delete E.clear;
          }
          return (
            (O[t] = S), i({ global: !0, constructor: !0, forced: S !== w }, O), g(S, t), b || r.setStrong(S, t, m), S
          );
        };
      },
      6469: (t, e, r) => {
        'use strict';
        var i = r(8227),
          n = r(2360),
          o = r(4913).f,
          s = i('unscopables'),
          a = Array.prototype;
        void 0 === a[s] && o(a, s, { configurable: !0, value: n(null) }),
          (t.exports = function (t) {
            a[s][t] = !0;
          });
      },
      6518: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(7347).f,
          o = r(6699),
          s = r(6840),
          a = r(9433),
          c = r(7740),
          l = r(2796);
        t.exports = function (t, e) {
          var r,
            u,
            h,
            f,
            d,
            p = t.target,
            v = t.global,
            g = t.stat;
          if ((r = v ? i : g ? i[p] || a(p, {}) : i[p] && i[p].prototype))
            for (u in e) {
              if (
                ((f = e[u]),
                (h = t.dontCallGetSet ? (d = n(r, u)) && d.value : r[u]),
                !l(v ? u : p + (g ? '.' : '#') + u, t.forced) && void 0 !== h)
              ) {
                if (typeof f == typeof h) continue;
                c(f, h);
              }
              (t.sham || (h && h.sham)) && o(f, 'sham', !0), s(r, u, f, t);
            }
        };
      },
      6682: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(8551),
          o = r(4901),
          s = r(2195),
          a = r(7323),
          c = TypeError;
        t.exports = function (t, e) {
          var r = t.exec;
          if (o(r)) {
            var l = i(r, t, e);
            return null !== l && n(l), l;
          }
          if ('RegExp' === s(t)) return i(a, t, e);
          throw new c('RegExp#exec called on incompatible receiver');
        };
      },
      6699: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(4913),
          o = r(6980);
        t.exports = i
          ? function (t, e, r) {
              return n.f(t, e, o(1, r));
            }
          : function (t, e, r) {
              return (t[e] = r), t;
            };
      },
      6706: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(9306);
        t.exports = function (t, e, r) {
          try {
            return i(n(Object.getOwnPropertyDescriptor(t, e)[r]));
          } catch (t) {}
        };
      },
      6801: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(8686),
          o = r(4913),
          s = r(8551),
          a = r(5397),
          c = r(1072);
        e.f =
          i && !n
            ? Object.defineProperties
            : function (t, e) {
                s(t);
                for (var r, i = a(e), n = c(e), l = n.length, u = 0; l > u; ) o.f(t, (r = n[u++]), i[r]);
                return t;
              };
      },
      6823: (t) => {
        'use strict';
        var e = String;
        t.exports = function (t) {
          try {
            return e(t);
          } catch (t) {
            return 'Object';
          }
        };
      },
      6840: (t, e, r) => {
        'use strict';
        var i = r(4901),
          n = r(4913),
          o = r(283),
          s = r(9433);
        t.exports = function (t, e, r, a) {
          a || (a = {});
          var c = a.enumerable,
            l = void 0 !== a.name ? a.name : e;
          if ((i(r) && o(r, l, a), a.global)) c ? (t[e] = r) : s(e, r);
          else {
            try {
              a.unsafe ? t[e] && (c = !0) : delete t[e];
            } catch (t) {}
            c
              ? (t[e] = r)
              : n.f(t, e, { value: r, enumerable: !1, configurable: !a.nonConfigurable, writable: !a.nonWritable });
          }
          return t;
        };
      },
      6955: (t, e, r) => {
        'use strict';
        var i = r(2140),
          n = r(4901),
          o = r(2195),
          s = r(8227)('toStringTag'),
          a = Object,
          c =
            'Arguments' ===
            o(
              (function () {
                return arguments;
              })(),
            );
        t.exports = i
          ? o
          : function (t) {
              var e, r, i;
              return void 0 === t
                ? 'Undefined'
                : null === t
                ? 'Null'
                : 'string' ==
                  typeof (r = (function (t, e) {
                    try {
                      return t[e];
                    } catch (t) {}
                  })((e = a(t)), s))
                ? r
                : c
                ? o(e)
                : 'Object' === (i = o(e)) && n(e.callee)
                ? 'Arguments'
                : i;
            };
      },
      6969: (t, e, r) => {
        'use strict';
        var i = r(2777),
          n = r(757);
        t.exports = function (t) {
          var e = i(t, 'string');
          return n(e) ? e : e + '';
        };
      },
      6980: (t) => {
        'use strict';
        t.exports = function (t, e) {
          return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: e };
        };
      },
      7040: (t, e, r) => {
        'use strict';
        var i = r(4495);
        t.exports = i && !Symbol.sham && 'symbol' == typeof Symbol.iterator;
      },
      7055: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(9039),
          o = r(2195),
          s = Object,
          a = i(''.split);
        t.exports = n(function () {
          return !s('z').propertyIsEnumerable(0);
        })
          ? function (t) {
              return 'String' === o(t) ? a(t, '') : s(t);
            }
          : s;
      },
      7323: (t, e, r) => {
        'use strict';
        var i,
          n,
          o = r(9565),
          s = r(9504),
          a = r(655),
          c = r(7979),
          l = r(8429),
          u = r(5745),
          h = r(2360),
          f = r(1181).get,
          d = r(3635),
          p = r(8814),
          v = u('native-string-replace', String.prototype.replace),
          g = RegExp.prototype.exec,
          y = g,
          m = s(''.charAt),
          b = s(''.indexOf),
          x = s(''.replace),
          w = s(''.slice),
          E = ((n = /b*/g), o(g, (i = /a/), 'a'), o(g, n, 'a'), 0 !== i.lastIndex || 0 !== n.lastIndex),
          S = l.BROKEN_CARET,
          O = void 0 !== /()??/.exec('')[1];
        (E || O || S || d || p) &&
          (y = function (t) {
            var e,
              r,
              i,
              n,
              s,
              l,
              u,
              d = this,
              p = f(d),
              k = a(t),
              A = p.raw;
            if (A) return (A.lastIndex = d.lastIndex), (e = o(y, A, k)), (d.lastIndex = A.lastIndex), e;
            var L = p.groups,
              T = S && d.sticky,
              C = o(c, d),
              N = d.source,
              j = 0,
              R = k;
            if (
              (T &&
                ((C = x(C, 'y', '')),
                -1 === b(C, 'g') && (C += 'g'),
                (R = w(k, d.lastIndex)),
                d.lastIndex > 0 &&
                  (!d.multiline || (d.multiline && '\n' !== m(k, d.lastIndex - 1))) &&
                  ((N = '(?: ' + N + ')'), (R = ' ' + R), j++),
                (r = new RegExp('^(?:' + N + ')', C))),
              O && (r = new RegExp('^' + N + '$(?!\\s)', C)),
              E && (i = d.lastIndex),
              (n = o(g, T ? r : d, R)),
              T
                ? n
                  ? ((n.input = w(n.input, j)),
                    (n[0] = w(n[0], j)),
                    (n.index = d.lastIndex),
                    (d.lastIndex += n[0].length))
                  : (d.lastIndex = 0)
                : E && n && (d.lastIndex = d.global ? n.index + n[0].length : i),
              O &&
                n &&
                n.length > 1 &&
                o(v, n[0], r, function () {
                  for (s = 1; s < arguments.length - 2; s++) void 0 === arguments[s] && (n[s] = void 0);
                }),
              n && L)
            )
              for (n.groups = l = h(null), s = 0; s < L.length; s++) l[(u = L[s])[0]] = n[u[1]];
            return n;
          }),
          (t.exports = y);
      },
      7347: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(9565),
          o = r(8773),
          s = r(6980),
          a = r(5397),
          c = r(6969),
          l = r(9297),
          u = r(5917),
          h = Object.getOwnPropertyDescriptor;
        e.f = i
          ? h
          : function (t, e) {
              if (((t = a(t)), (e = c(e)), u))
                try {
                  return h(t, e);
                } catch (t) {}
              if (l(t, e)) return s(!n(o.f, t, e), t[e]);
            };
      },
      7400: (t) => {
        'use strict';
        t.exports = {
          CSSRuleList: 0,
          CSSStyleDeclaration: 0,
          CSSValueList: 0,
          ClientRectList: 0,
          DOMRectList: 0,
          DOMStringList: 0,
          DOMTokenList: 1,
          DataTransferItemList: 0,
          FileList: 0,
          HTMLAllCollection: 0,
          HTMLCollection: 0,
          HTMLFormElement: 0,
          HTMLSelectElement: 0,
          MediaList: 0,
          MimeTypeArray: 0,
          NamedNodeMap: 0,
          NodeList: 1,
          PaintRequestList: 0,
          Plugin: 0,
          PluginArray: 0,
          SVGLengthList: 0,
          SVGNumberList: 0,
          SVGPathSegList: 0,
          SVGPointList: 0,
          SVGStringList: 0,
          SVGTransformList: 0,
          SourceBufferList: 0,
          StyleSheetList: 0,
          TextTrackCueList: 0,
          TextTrackList: 0,
          TouchList: 0,
        };
      },
      7433: (t, e, r) => {
        'use strict';
        var i = r(4376),
          n = r(3517),
          o = r(34),
          s = r(8227)('species'),
          a = Array;
        t.exports = function (t) {
          var e;
          return (
            i(t) &&
              ((e = t.constructor),
              ((n(e) && (e === a || i(e.prototype))) || (o(e) && null === (e = e[s]))) && (e = void 0)),
            void 0 === e ? a : e
          );
        };
      },
      7452: (t) => {
        'use strict';
        t.exports = '\t\n\v\f\r                　\u2028\u2029\ufeff';
      },
      7476: (t, e, r) => {
        'use strict';
        var i = r(2195),
          n = r(9504);
        t.exports = function (t) {
          if ('Function' === i(t)) return n(t);
        };
      },
      7495: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(7323);
        i({ target: 'RegExp', proto: !0, forced: /./.exec !== n }, { exec: n });
      },
      7629: (t, e, r) => {
        'use strict';
        var i = r(6395),
          n = r(4576),
          o = r(9433),
          s = '__core-js_shared__',
          a = (t.exports = n[s] || o(s, {}));
        (a.versions || (a.versions = [])).push({
          version: '3.47.0',
          mode: i ? 'pure' : 'global',
          copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru), 2025 CoreJS Company (core-js.io)',
          license: 'https://github.com/zloirock/core-js/blob/v3.47.0/LICENSE',
          source: 'https://github.com/zloirock/core-js',
        });
      },
      7654: (t, e, r) => {
        var i = '__lodash_hash_undefined__',
          n = '[object Function]',
          o = '[object GeneratorFunction]',
          s = /^\[object .+?Constructor\]$/,
          a = 'object' == typeof r.g && r.g && r.g.Object === Object && r.g,
          c = 'object' == typeof self && self && self.Object === Object && self,
          l = a || c || Function('return this')();
        var u,
          h = Array.prototype,
          f = Function.prototype,
          d = Object.prototype,
          p = l['__core-js_shared__'],
          v = (u = /[^.]+$/.exec((p && p.keys && p.keys.IE_PROTO) || '')) ? 'Symbol(src)_1.' + u : '',
          g = f.toString,
          y = d.hasOwnProperty,
          m = d.toString,
          b = RegExp(
            '^' +
              g
                .call(y)
                .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
              '$',
          ),
          x = h.splice,
          w = C(l, 'Map'),
          E = C(Object, 'create');
        function S(t) {
          var e = -1,
            r = t ? t.length : 0;
          for (this.clear(); ++e < r; ) {
            var i = t[e];
            this.set(i[0], i[1]);
          }
        }
        function O(t) {
          var e = -1,
            r = t ? t.length : 0;
          for (this.clear(); ++e < r; ) {
            var i = t[e];
            this.set(i[0], i[1]);
          }
        }
        function k(t) {
          var e = -1,
            r = t ? t.length : 0;
          for (this.clear(); ++e < r; ) {
            var i = t[e];
            this.set(i[0], i[1]);
          }
        }
        function A(t, e) {
          for (var r = t.length; r--; ) if (j(t[r][0], e)) return r;
          return -1;
        }
        function L(t) {
          if (!R(t) || ((e = t), v && v in e)) return !1;
          var e,
            r =
              (function (t) {
                var e = R(t) ? m.call(t) : '';
                return e == n || e == o;
              })(t) ||
              (function (t) {
                var e = !1;
                if (null != t && 'function' != typeof t.toString)
                  try {
                    e = !!(t + '');
                  } catch (t) {}
                return e;
              })(t)
                ? b
                : s;
          return r.test(
            (function (t) {
              if (null != t) {
                try {
                  return g.call(t);
                } catch (t) {}
                try {
                  return t + '';
                } catch (t) {}
              }
              return '';
            })(t),
          );
        }
        function T(t, e) {
          var r,
            i,
            n = t.__data__;
          return (
            'string' == (i = typeof (r = e)) || 'number' == i || 'symbol' == i || 'boolean' == i
              ? '__proto__' !== r
              : null === r
          )
            ? n['string' == typeof e ? 'string' : 'hash']
            : n.map;
        }
        function C(t, e) {
          var r = (function (t, e) {
            return null == t ? void 0 : t[e];
          })(t, e);
          return L(r) ? r : void 0;
        }
        function N(t, e) {
          if ('function' != typeof t || (e && 'function' != typeof e)) throw new TypeError('Expected a function');
          var r = function () {
            var i = arguments,
              n = e ? e.apply(this, i) : i[0],
              o = r.cache;
            if (o.has(n)) return o.get(n);
            var s = t.apply(this, i);
            return (r.cache = o.set(n, s)), s;
          };
          return (r.cache = new (N.Cache || k)()), r;
        }
        function j(t, e) {
          return t === e || (t != t && e != e);
        }
        function R(t) {
          var e = typeof t;
          return !!t && ('object' == e || 'function' == e);
        }
        (S.prototype.clear = function () {
          this.__data__ = E ? E(null) : {};
        }),
          (S.prototype.delete = function (t) {
            return this.has(t) && delete this.__data__[t];
          }),
          (S.prototype.get = function (t) {
            var e = this.__data__;
            if (E) {
              var r = e[t];
              return r === i ? void 0 : r;
            }
            return y.call(e, t) ? e[t] : void 0;
          }),
          (S.prototype.has = function (t) {
            var e = this.__data__;
            return E ? void 0 !== e[t] : y.call(e, t);
          }),
          (S.prototype.set = function (t, e) {
            return (this.__data__[t] = E && void 0 === e ? i : e), this;
          }),
          (O.prototype.clear = function () {
            this.__data__ = [];
          }),
          (O.prototype.delete = function (t) {
            var e = this.__data__,
              r = A(e, t);
            return !(r < 0) && (r == e.length - 1 ? e.pop() : x.call(e, r, 1), !0);
          }),
          (O.prototype.get = function (t) {
            var e = this.__data__,
              r = A(e, t);
            return r < 0 ? void 0 : e[r][1];
          }),
          (O.prototype.has = function (t) {
            return A(this.__data__, t) > -1;
          }),
          (O.prototype.set = function (t, e) {
            var r = this.__data__,
              i = A(r, t);
            return i < 0 ? r.push([t, e]) : (r[i][1] = e), this;
          }),
          (k.prototype.clear = function () {
            this.__data__ = { hash: new S(), map: new (w || O)(), string: new S() };
          }),
          (k.prototype.delete = function (t) {
            return T(this, t).delete(t);
          }),
          (k.prototype.get = function (t) {
            return T(this, t).get(t);
          }),
          (k.prototype.has = function (t) {
            return T(this, t).has(t);
          }),
          (k.prototype.set = function (t, e) {
            return T(this, t).set(t, e), this;
          }),
          (N.Cache = k),
          (t.exports = N);
      },
      7657: (t, e, r) => {
        'use strict';
        var i,
          n,
          o,
          s = r(9039),
          a = r(4901),
          c = r(34),
          l = r(2360),
          u = r(2787),
          h = r(6840),
          f = r(8227),
          d = r(6395),
          p = f('iterator'),
          v = !1;
        [].keys && ('next' in (o = [].keys()) ? (n = u(u(o))) !== Object.prototype && (i = n) : (v = !0)),
          !c(i) ||
          s(function () {
            var t = {};
            return i[p].call(t) !== t;
          })
            ? (i = {})
            : d && (i = l(i)),
          a(i[p]) ||
            h(i, p, function () {
              return this;
            }),
          (t.exports = { IteratorPrototype: i, BUGGY_SAFARI_ITERATORS: v });
      },
      7680: (t, e, r) => {
        'use strict';
        var i = r(9504);
        t.exports = i([].slice);
      },
      7740: (t, e, r) => {
        'use strict';
        var i = r(9297),
          n = r(5031),
          o = r(7347),
          s = r(4913);
        t.exports = function (t, e, r) {
          for (var a = n(e), c = s.f, l = o.f, u = 0; u < a.length; u++) {
            var h = a[u];
            i(t, h) || (r && i(r, h)) || c(t, h, l(e, h));
          }
        };
      },
      7750: (t, e, r) => {
        'use strict';
        var i = r(4117),
          n = TypeError;
        t.exports = function (t) {
          if (i(t)) throw new n("Can't call method on " + t);
          return t;
        };
      },
      7751: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(4901);
        t.exports = function (t, e) {
          return arguments.length < 2 ? ((r = i[t]), n(r) ? r : void 0) : i[t] && i[t][e];
          var r;
        };
      },
      7764: (t, e, r) => {
        'use strict';
        var i = r(8183).charAt,
          n = r(655),
          o = r(1181),
          s = r(1088),
          a = r(2529),
          c = 'String Iterator',
          l = o.set,
          u = o.getterFor(c);
        s(
          String,
          'String',
          function (t) {
            l(this, { type: c, string: n(t), index: 0 });
          },
          function () {
            var t,
              e = u(this),
              r = e.string,
              n = e.index;
            return n >= r.length ? a(void 0, !0) : ((t = i(r, n)), (e.index += t.length), a(t, !1));
          },
        );
      },
      7829: (t, e, r) => {
        'use strict';
        var i = r(8183).charAt;
        t.exports = function (t, e, r) {
          return e + (r ? i(t, e).length : 1);
        };
      },
      7979: (t, e, r) => {
        'use strict';
        var i = r(8551);
        t.exports = function () {
          var t = i(this),
            e = '';
          return (
            t.hasIndices && (e += 'd'),
            t.global && (e += 'g'),
            t.ignoreCase && (e += 'i'),
            t.multiline && (e += 'm'),
            t.dotAll && (e += 's'),
            t.unicode && (e += 'u'),
            t.unicodeSets && (e += 'v'),
            t.sticky && (e += 'y'),
            e
          );
        };
      },
      8014: (t, e, r) => {
        'use strict';
        var i = r(1291),
          n = Math.min;
        t.exports = function (t) {
          var e = i(t);
          return e > 0 ? n(e, 9007199254740991) : 0;
        };
      },
      8183: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(1291),
          o = r(655),
          s = r(7750),
          a = i(''.charAt),
          c = i(''.charCodeAt),
          l = i(''.slice),
          u = function (t) {
            return function (e, r) {
              var i,
                u,
                h = o(s(e)),
                f = n(r),
                d = h.length;
              return f < 0 || f >= d
                ? t
                  ? ''
                  : void 0
                : (i = c(h, f)) < 55296 || i > 56319 || f + 1 === d || (u = c(h, f + 1)) < 56320 || u > 57343
                ? t
                  ? a(h, f)
                  : i
                : t
                ? l(h, f, f + 2)
                : u - 56320 + ((i - 55296) << 10) + 65536;
            };
          };
        t.exports = { codeAt: u(!1), charAt: u(!0) };
      },
      8227: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(5745),
          o = r(9297),
          s = r(3392),
          a = r(4495),
          c = r(7040),
          l = i.Symbol,
          u = n('wks'),
          h = c ? l.for || l : (l && l.withoutSetter) || s;
        t.exports = function (t) {
          return o(u, t) || (u[t] = a && o(l, t) ? l[t] : h('Symbol.' + t)), u[t];
        };
      },
      8429: (t, e, r) => {
        'use strict';
        var i = r(9039),
          n = r(4576).RegExp,
          o = i(function () {
            var t = n('a', 'y');
            return (t.lastIndex = 2), null !== t.exec('abcd');
          }),
          s =
            o ||
            i(function () {
              return !n('a', 'y').sticky;
            }),
          a =
            o ||
            i(function () {
              var t = n('^r', 'gy');
              return (t.lastIndex = 2), null !== t.exec('str');
            });
        t.exports = { BROKEN_CARET: a, MISSED_STICKY: s, UNSUPPORTED_Y: o };
      },
      8480: (t, e, r) => {
        'use strict';
        var i = r(1828),
          n = r(8727).concat('length', 'prototype');
        e.f =
          Object.getOwnPropertyNames ||
          function (t) {
            return i(t, n);
          };
      },
      8551: (t, e, r) => {
        'use strict';
        var i = r(34),
          n = String,
          o = TypeError;
        t.exports = function (t) {
          if (i(t)) return t;
          throw new o(n(t) + ' is not an object');
        };
      },
      8622: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = r(4901),
          o = i.WeakMap;
        t.exports = n(o) && /native code/.test(String(o));
      },
      8686: (t, e, r) => {
        'use strict';
        var i = r(3724),
          n = r(9039);
        t.exports =
          i &&
          n(function () {
            return 42 !== Object.defineProperty(function () {}, 'prototype', { value: 42, writable: !1 }).prototype;
          });
      },
      8727: (t) => {
        'use strict';
        t.exports = [
          'constructor',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'toLocaleString',
          'toString',
          'valueOf',
        ];
      },
      8745: (t, e, r) => {
        'use strict';
        var i = r(616),
          n = Function.prototype,
          o = n.apply,
          s = n.call;
        t.exports =
          ('object' == typeof Reflect && Reflect.apply) ||
          (i
            ? s.bind(o)
            : function () {
                return s.apply(o, arguments);
              });
      },
      8773: (t, e) => {
        'use strict';
        var r = {}.propertyIsEnumerable,
          i = Object.getOwnPropertyDescriptor,
          n = i && !r.call({ 1: 2 }, 1);
        e.f = n
          ? function (t) {
              var e = i(this, t);
              return !!e && e.enumerable;
            }
          : r;
      },
      8814: (t, e, r) => {
        'use strict';
        var i = r(9039),
          n = r(4576).RegExp;
        t.exports = i(function () {
          var t = n('(?<a>b)', 'g');
          return 'b' !== t.exec('b').groups.a || 'bc' !== 'b'.replace(t, '$<a>c');
        });
      },
      8940: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(2703);
        i({ global: !0, forced: parseInt !== n }, { parseInt: n });
      },
      8981: (t, e, r) => {
        'use strict';
        var i = r(7750),
          n = Object;
        t.exports = function (t) {
          return n(i(t));
        };
      },
      9039: (t) => {
        'use strict';
        t.exports = function (t) {
          try {
            return !!t();
          } catch (t) {
            return !0;
          }
        };
      },
      9085: (t, e, r) => {
        'use strict';
        var i = r(6518),
          n = r(4213);
        i({ target: 'Object', stat: !0, arity: 2, forced: Object.assign !== n }, { assign: n });
      },
      9213: (t, e, r) => {
        'use strict';
        var i = r(6080),
          n = r(9504),
          o = r(7055),
          s = r(8981),
          a = r(6198),
          c = r(1469),
          l = n([].push),
          u = function (t) {
            var e = 1 === t,
              r = 2 === t,
              n = 3 === t,
              u = 4 === t,
              h = 6 === t,
              f = 7 === t,
              d = 5 === t || h;
            return function (p, v, g, y) {
              for (
                var m,
                  b,
                  x = s(p),
                  w = o(x),
                  E = a(w),
                  S = i(v, g),
                  O = 0,
                  k = y || c,
                  A = e ? k(p, E) : r || f ? k(p, 0) : void 0;
                E > O;
                O++
              )
                if ((d || O in w) && ((b = S((m = w[O]), O, x)), t))
                  if (e) A[O] = b;
                  else if (b)
                    switch (t) {
                      case 3:
                        return !0;
                      case 5:
                        return m;
                      case 6:
                        return O;
                      case 2:
                        l(A, m);
                    }
                  else
                    switch (t) {
                      case 4:
                        return !1;
                      case 7:
                        l(A, m);
                    }
              return h ? -1 : n || u ? u : A;
            };
          };
        t.exports = {
          forEach: u(0),
          map: u(1),
          filter: u(2),
          some: u(3),
          every: u(4),
          find: u(5),
          findIndex: u(6),
          filterReject: u(7),
        };
      },
      9228: (t, e, r) => {
        'use strict';
        r(7495);
        var i = r(9565),
          n = r(6840),
          o = r(7323),
          s = r(9039),
          a = r(8227),
          c = r(6699),
          l = a('species'),
          u = RegExp.prototype;
        t.exports = function (t, e, r, h) {
          var f = a(t),
            d = !s(function () {
              var e = {};
              return (
                (e[f] = function () {
                  return 7;
                }),
                7 !== ''[t](e)
              );
            }),
            p =
              d &&
              !s(function () {
                var e = !1,
                  r = /a/;
                if ('split' === t) {
                  var i = {};
                  (i[l] = function () {
                    return r;
                  }),
                    ((r = { constructor: i, flags: '' })[f] = /./[f]);
                }
                return (
                  (r.exec = function () {
                    return (e = !0), null;
                  }),
                  r[f](''),
                  !e
                );
              });
          if (!d || !p || r) {
            var v = /./[f],
              g = e(f, ''[t], function (t, e, r, n, s) {
                var a = e.exec;
                return a === o || a === u.exec
                  ? d && !s
                    ? { done: !0, value: i(v, e, r, n) }
                    : { done: !0, value: i(t, r, e, n) }
                  : { done: !1 };
              });
            n(String.prototype, t, g[0]), n(u, f, g[1]);
          }
          h && c(u[f], 'sham', !0);
        };
      },
      9263: function (t, e, r) {
        var i, n, o, s;
        function a(t) {
          return (
            (a =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  }),
            a(t)
          );
        }
        (t = r.nmd(t)),
          (s = function () {
            return (function () {
              'use strict';
              var t = {
                  819: function (t) {
                    function e(t) {
                      var e = (function (t) {
                        if ('object' != a(t) || !t) return t;
                        var e = t[Symbol.toPrimitive];
                        if (void 0 !== e) {
                          var r = e.call(t, 'string');
                          if ('object' != a(r)) return r;
                          throw new TypeError('@@toPrimitive must return a primitive value.');
                        }
                        return String(t);
                      })(t);
                      return 'symbol' == a(e) ? e : e + '';
                    }
                    t.exports = (function () {
                      function t(t) {
                        (this.callbacks = []), (this.internal = t);
                      }
                      var r, i;
                      return (
                        (t.prototype.subscribe = function (t) {
                          var e = this;
                          if ('function' != typeof t)
                            throw new TypeError('[createObservable]: expected callback to be a function.');
                          return (
                            this.callbacks.push(t),
                            function () {
                              var r = e.callbacks.indexOf(t);
                              e.callbacks = e.callbacks.slice(0, r).concat(e.callbacks.slice(r + 1));
                            }
                          );
                        }),
                        (r = t),
                        (i = [
                          {
                            key: 'value',
                            get: function () {
                              return this.internal;
                            },
                            set: function (t) {
                              if (t !== this.internal) {
                                var e = this.internal;
                                this.internal = t;
                                for (var r = 0; r < this.callbacks.length; r++) this.callbacks[r](this.internal, e);
                              }
                            },
                          },
                        ]) &&
                          (function (t, r) {
                            for (var i = 0; i < r.length; i++) {
                              var n = r[i];
                              (n.enumerable = n.enumerable || !1),
                                (n.configurable = !0),
                                'value' in n && (n.writable = !0),
                                Object.defineProperty(t, e(n.key), n);
                            }
                          })(r.prototype, i),
                        Object.defineProperty(r, 'prototype', { writable: !1 }),
                        r
                      );
                    })();
                  },
                  961: function (t) {
                    function e(t, e) {
                      return Object.prototype.hasOwnProperty.call(t, e);
                    }
                    function r(t) {
                      return null !== t && 'object' == a(t) && !1 === Array.isArray(t);
                    }
                    function i(t) {
                      var r = t.optionConfig,
                        i = t.userOptions,
                        n = void 0 === i ? {} : i,
                        o = t.prefix,
                        s = void 0 === o ? '' : o,
                        c = t.suffix,
                        l = void 0 === c ? '' : c,
                        u = t.strict,
                        h = void 0 === u || u,
                        f = function (t) {
                          return [s, t, l].join(' ');
                        },
                        d = {};
                      for (var p in r)
                        if (e(r, p)) {
                          var v = r[p],
                            g = v.required,
                            y = v.default,
                            m = v.description,
                            b = v.validator,
                            x = n[p],
                            w = !!e(v, 'required') && ('function' == typeof g ? g(n) : g),
                            E = e(n, p),
                            S = b(x, n);
                          if (w) {
                            if (!E) throw new TypeError(f(p + ' is required.'));
                            if (!S)
                              throw new TypeError(f('Expected ' + p + ' to be ' + m + ', got ' + a(x) + ' ' + x + '.'));
                            d[p] = x;
                          } else if (((d[p] = y), E))
                            if (S) d[p] = x;
                            else {
                              if (h)
                                throw new TypeError(
                                  f('Expected ' + p + ' to be ' + m + ', got ' + a(x) + ' ' + x + '.'),
                                );
                              console.warn(
                                f(
                                  'Expected ' +
                                    p +
                                    ' to be ' +
                                    m +
                                    ', got ' +
                                    a(x) +
                                    ' ' +
                                    x +
                                    '. Fallback to default value ' +
                                    y +
                                    '.',
                                ),
                              );
                            }
                        }
                      return d;
                    }
                    var n = '[mergeOptions]:',
                      o = '\nCheck out documentation https://github.com/dubaua/merge-options#parameters-and-return';
                    function s(t) {
                      throw new TypeError([n, t, o].join(' '));
                    }
                    var c = {
                      optionConfig: {
                        required: !0,
                        validator: function (t) {
                          for (var i in t)
                            if (e(t, i)) {
                              var n = t[i];
                              if (
                                (r(n) ||
                                  s(
                                    'Expected optionConfig.' +
                                      i +
                                      ' to be an object with declarative option configuration, got ' +
                                      a(n) +
                                      ' ' +
                                      n +
                                      '.',
                                  ),
                                e(n, 'required'))
                              ) {
                                var o = n.required,
                                  c = a(o);
                                'boolean' !== c &&
                                  'function' !== c &&
                                  s(
                                    'Expected optionConfig.' +
                                      i +
                                      '.required to be either boolean or function, got ' +
                                      a(o) +
                                      ' ' +
                                      o +
                                      '.',
                                  );
                              } else
                                e(n, 'default') ||
                                  s('Expected optionConfig.' + i + ' to either have required or default value.');
                              if (
                                (e(n, 'default') ||
                                  e(n, 'required') ||
                                  s('Expected optionConfig.' + i + ' to either have required or default value.'),
                                e(n, 'description'))
                              ) {
                                var l = n.description;
                                'string' != typeof n.description &&
                                  s(
                                    'Expected optionConfig.' +
                                      i +
                                      '.description to be a string, got ' +
                                      a(l) +
                                      ' ' +
                                      l +
                                      '.',
                                  );
                              } else s('Missing description on optionConfig.' + i + ' config.');
                              if (e(n, 'validator')) {
                                var u = n.validator;
                                'function' != typeof n.validator &&
                                  s(
                                    'Expected optionConfig.' +
                                      i +
                                      '.validator to be a function, got ' +
                                      a(u) +
                                      ' ' +
                                      u +
                                      '.',
                                  );
                              } else s('Missing validator on optionConfig.' + i + ' config.');
                            }
                          return r(t);
                        },
                        description: 'an object with declarative option configuration',
                      },
                      userOptions: { required: !1, default: {}, validator: r, description: 'an object' },
                      prefix: {
                        required: !1,
                        default: '',
                        validator: function (t) {
                          return 'string' == typeof t;
                        },
                        description: 'a string',
                      },
                      suffix: {
                        required: !1,
                        default: '',
                        validator: function (t) {
                          return 'string' == typeof t;
                        },
                        description: 'a string',
                      },
                      strict: {
                        required: !1,
                        default: !0,
                        validator: function (t) {
                          return 'boolean' == typeof t;
                        },
                        description: 'a boolean',
                      },
                    };
                    t.exports = function (t) {
                      var e = i({ optionConfig: c, userOptions: t, prefix: n, suffix: o });
                      return i(e);
                    };
                  },
                },
                e = {};
              function r(i) {
                var n = e[i];
                if (void 0 !== n) return n.exports;
                var o = (e[i] = { exports: {} });
                return t[i](o, o.exports, r), o.exports;
              }
              (r.n = function (t) {
                var e =
                  t && t.__esModule
                    ? function () {
                        return t.default;
                      }
                    : function () {
                        return t;
                      };
                return r.d(e, { a: e }), e;
              }),
                (r.d = function (t, e) {
                  for (var i in e)
                    r.o(e, i) && !r.o(t, i) && Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
                }),
                (r.o = function (t, e) {
                  return Object.prototype.hasOwnProperty.call(t, e);
                });
              var i = {};
              r.d(i, {
                default: function () {
                  return Immerser;
                },
              });
              var n = r(961),
                o = r.n(n),
                s = r(819),
                c = r.n(s),
                l = /^[a-z_-][a-z\d_-]*$/i,
                u = {
                  solidClassnameArray: {
                    default: [],
                    description: 'non empty array of objects',
                    validator: function (t) {
                      return Array.isArray(t) && 0 !== t.length;
                    },
                  },
                  fromViewportWidth: {
                    default: 0,
                    description: 'a natural number',
                    validator: function (t) {
                      return 'number' == typeof t && 0 <= t && t % 1 == 0;
                    },
                  },
                  pagerThreshold: {
                    default: 0.5,
                    description: 'a number between 0 and 1',
                    validator: function (t) {
                      return 'number' == typeof t && 0 <= t && t <= 1;
                    },
                  },
                  hasToUpdateHash: {
                    default: !1,
                    description: 'a boolean',
                    validator: function (t) {
                      return 'boolean' == typeof t;
                    },
                  },
                  scrollAdjustThreshold: {
                    default: 0,
                    description: 'a number greater than or equal to 0',
                    validator: function (t) {
                      return 'number' == typeof t && t >= 0;
                    },
                  },
                  scrollAdjustDelay: {
                    default: 600,
                    description: 'a number greater than or equal to 300',
                    validator: function (t) {
                      return 'number' == typeof t && t >= 300;
                    },
                  },
                  pagerLinkActiveClassname: {
                    default: 'pager-link-active',
                    description: 'valid non empty classname string',
                    validator: function (t) {
                      return 'string' == typeof t && '' !== t && l.test(t);
                    },
                  },
                  isScrollHandled: {
                    default: !0,
                    description: 'a boolean',
                    validator: function (t) {
                      return 'boolean' == typeof t;
                    },
                  },
                  onInit: {
                    default: null,
                    description: 'a function',
                    validator: function (t) {
                      return 'function' == typeof t;
                    },
                  },
                  onBind: {
                    default: null,
                    description: 'a function',
                    validator: function (t) {
                      return 'function' == typeof t;
                    },
                  },
                  onUnbind: {
                    default: null,
                    description: 'a function',
                    validator: function (t) {
                      return 'function' == typeof t;
                    },
                  },
                  onDestroy: {
                    default: null,
                    description: 'a function',
                    validator: function (t) {
                      return 'function' == typeof t;
                    },
                  },
                  onActiveLayerChange: {
                    default: null,
                    description: 'a function',
                    validator: function (t) {
                      return 'function' == typeof t;
                    },
                  },
                },
                h = '[immmerser:]';
              function f(t, e) {
                for (var r in e) t.style[r] = e[r];
              }
              function d(t) {
                var e = t.selector,
                  r = t.parent,
                  i = void 0 === r ? document : r;
                if (!i) return [];
                var n = i.querySelectorAll(e);
                return [].slice.call(n);
              }
              function p(t) {
                var e = t.message,
                  r = t.warning,
                  i = void 0 !== r && r,
                  n = t.docs || '',
                  o = ''
                    .concat(h, ' ')
                    .concat(e, ' \nCheck out documentation https://github.com/dubaua/immerser')
                    .concat(n);
                if (!i) throw new Error(o);
                console.warn(o);
              }
              function v(t, e, r) {
                return Math.max(Math.min(t, r), e);
              }
              function g() {
                var t = window.scrollX || document.documentElement.scrollLeft,
                  e = window.scrollY || document.documentElement.scrollTop;
                return {
                  x: v(t, 0, document.documentElement.offsetWidth),
                  y: v(e, 0, document.documentElement.offsetHeight),
                };
              }
              function y(t) {
                return (
                  (y =
                    'function' == typeof Symbol && 'symbol' == a(Symbol.iterator)
                      ? function (t) {
                          return a(t);
                        }
                      : function (t) {
                          return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                            ? 'symbol'
                            : a(t);
                        }),
                  y(t)
                );
              }
              function m(t, e) {
                var r = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(t);
                  e &&
                    (i = i.filter(function (e) {
                      return Object.getOwnPropertyDescriptor(t, e).enumerable;
                    })),
                    r.push.apply(r, i);
                }
                return r;
              }
              function b(t) {
                for (var e = 1; e < arguments.length; e++) {
                  var r = null != arguments[e] ? arguments[e] : {};
                  e % 2
                    ? m(Object(r), !0).forEach(function (e) {
                        w(t, e, r[e]);
                      })
                    : Object.getOwnPropertyDescriptors
                    ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
                    : m(Object(r)).forEach(function (e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
                      });
                }
                return t;
              }
              function x(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var i = e[r];
                  (i.enumerable = i.enumerable || !1),
                    (i.configurable = !0),
                    'value' in i && (i.writable = !0),
                    Object.defineProperty(t, E(i.key), i);
                }
              }
              function w(t, e, r) {
                return (
                  (e = E(e)) in t
                    ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 })
                    : (t[e] = r),
                  t
                );
              }
              function E(t) {
                var e = (function (t) {
                  if ('object' != y(t) || !t) return t;
                  var e = t[Symbol.toPrimitive];
                  if (void 0 !== e) {
                    var r = e.call(t, 'string');
                    if ('object' != y(r)) return r;
                    throw new TypeError('@@toPrimitive must return a primitive value.');
                  }
                  return String(t);
                })(t);
                return 'symbol' == y(e) ? e : e + '';
              }
              var S = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' },
                O = { pointerEvents: 'none', touchAction: 'none' },
                k = { pointerEvents: 'all', touchAction: 'auto' },
                Immerser = (function () {
                  return (
                    (t = function Immerser(t) {
                      !(function (t, e) {
                        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
                      })(this, Immerser),
                        w(this, 'options', {}),
                        w(this, 'selectors', {
                          root: '[data-immerser]',
                          layer: '[data-immerser-layer]',
                          solid: '[data-immerser-solid]',
                          pagerLink: '[data-immerser-pager-link]',
                          mask: '[data-immerser-mask]',
                          maskInner: '[data-immerser-mask-inner]',
                          synchroHover: '[data-immerser-synchro-hover]',
                        }),
                        w(this, 'stateArray', []),
                        w(this, 'stateIndexById', {}),
                        w(this, 'isBound', !1),
                        w(this, 'rootNode', null),
                        w(this, 'layerNodeArray', []),
                        w(this, 'solidNodeArray', []),
                        w(this, 'pagerLinkNodeArray', []),
                        w(this, 'originalSolidNodeArray', []),
                        w(this, 'maskNodeArray', []),
                        w(this, 'synchroHoverNodeArray', []),
                        w(this, 'isCustomMarkup', !1),
                        w(this, 'customMaskNodeArray', []),
                        w(this, 'documentHeight', 0),
                        w(this, 'windowHeight', 0),
                        w(this, 'immerserTop', 0),
                        w(this, 'immerserHeight', 0),
                        w(this, 'resizeFrameId', null),
                        w(this, 'scrollFrameId', null),
                        w(this, 'scrollAdjustTimerId', null),
                        w(this, 'reactiveActiveLayer', new (c())()),
                        w(this, 'reactiveWindowWidth', new (c())()),
                        w(this, 'reactiveSynchroHoverId', new (c())()),
                        w(this, 'stopRedrawingPager', null),
                        w(this, 'stopUpdatingHash', null),
                        w(this, 'stopFiringActiveLayerChangeCallback', null),
                        w(this, 'stopTrackingSynchroHover', null),
                        w(this, 'stopToggleBindOnResize', null),
                        w(this, 'onResize', null),
                        w(this, 'onScroll', null),
                        w(this, 'onSynchroHoverMouseOver', null),
                        w(this, 'onSynchroHoverMouseOut', null),
                        this.init(t);
                    }),
                    (e = [
                      {
                        key: 'init',
                        value: function (t) {
                          this.setNodes(),
                            this.validateMarkup(),
                            this.mergeOptions(t),
                            this.getClassnamesFromMarkup(),
                            this.validateSolidClassnameArray(),
                            this.initSectionIds(),
                            this.initStatemap(),
                            this.validateClassnames(),
                            this.toggleBindOnResize(),
                            this.setSizes(),
                            this.addScrollAndResizeListeners(),
                            'function' == typeof this.options.onInit && this.options.onInit(this);
                        },
                      },
                      {
                        key: 'setNodes',
                        value: function () {
                          (this.rootNode = document.querySelector(this.selectors.root)),
                            (this.layerNodeArray = d({ selector: this.selectors.layer })),
                            (this.solidNodeArray = d({ selector: this.selectors.solid, parent: this.rootNode }));
                        },
                      },
                      {
                        key: 'validateMarkup',
                        value: function () {
                          this.rootNode ||
                            p({ message: 'immerser root node not found.', docs: '#prepare-your-markup' }),
                            this.layerNodeArray.length < 0 &&
                              p({
                                message: 'immerser will not work without layer nodes.',
                                docs: '#prepare-your-markup',
                              }),
                            this.solidNodeArray.length < 0 &&
                              p({
                                message: 'immerser will not work without solid nodes.',
                                docs: '#prepare-your-markup',
                              });
                        },
                      },
                      {
                        key: 'mergeOptions',
                        value: function (t) {
                          this.options = o()({
                            optionConfig: u,
                            userOptions: t,
                            preffix: h,
                            suffix: '\nCheck out documentation https://github.com/dubaua/immerser#options',
                          });
                        },
                      },
                      {
                        key: 'getClassnamesFromMarkup',
                        value: function () {
                          var t = this;
                          this.layerNodeArray.forEach(function (e, r) {
                            if (e.dataset.immerserLayerConfig)
                              try {
                                t.options.solidClassnameArray[r] = JSON.parse(e.dataset.immerserLayerConfig);
                              } catch (t) {
                                console.error(h, 'Failed to parse JSON classname configuration.', t);
                              }
                          });
                        },
                      },
                      {
                        key: 'validateSolidClassnameArray',
                        value: function () {
                          var t = this.layerNodeArray.length;
                          this.options.solidClassnameArray.length !== t &&
                            p({ message: 'solidClassnameArray length differs from count of layers', docs: '#options' });
                        },
                      },
                      {
                        key: 'initSectionIds',
                        value: function () {
                          var t = this;
                          this.layerNodeArray.forEach(function (e, r) {
                            var i = e.id;
                            i || ((i = 'immerser-section-'.concat(r)), (e.id = i), (e.__immerserCustomId = !0)),
                              (t.stateIndexById[i] = r);
                          });
                        },
                      },
                      {
                        key: 'initStatemap',
                        value: function () {
                          var t = this;
                          this.stateArray = this.layerNodeArray.map(function (e, r) {
                            var i = t.options.solidClassnameArray[r];
                            return {
                              beginEnter: 0,
                              beginLeave: 0,
                              endEnter: 0,
                              endLeave: 0,
                              id: e.id,
                              layerBottom: 0,
                              layerTop: 0,
                              maskInnerNode: null,
                              maskNode: null,
                              layerNode: e,
                              solidClassnames: i,
                            };
                          });
                        },
                      },
                      {
                        key: 'validateClassnames',
                        value: function () {
                          this.stateArray.every(function (t) {
                            return (
                              !(e = t.solidClassnames) || (0 === Object.keys(e).length && e.constructor === Object)
                            );
                            var e;
                          }) &&
                            p({
                              message: 'immerser will do nothing without solid classname configuration.',
                              docs: '#prepare-your-markup',
                            });
                        },
                      },
                      {
                        key: 'toggleBindOnResize',
                        value: function () {
                          var t = this;
                          this.stopToggleBindOnResize = this.reactiveWindowWidth.subscribe(function (e) {
                            e >= t.options.fromViewportWidth ? t.isBound || t.bind() : t.isBound && t.unbind();
                          });
                        },
                      },
                      {
                        key: 'setSizes',
                        value: function () {
                          var t = this;
                          (this.documentHeight = document.documentElement.offsetHeight),
                            (this.windowHeight = window.innerHeight),
                            (this.immerserTop = this.rootNode.offsetTop),
                            (this.immerserHeight = this.rootNode.offsetHeight),
                            (this.stateArray = this.stateArray.map(function (e) {
                              var r = e.layerNode.offsetTop,
                                i = r + e.layerNode.offsetHeight,
                                n = r - t.immerserTop,
                                o = n - t.immerserHeight,
                                s = i - t.immerserTop,
                                a = s - t.immerserHeight;
                              return b(
                                b({}, e),
                                {},
                                { layerTop: r, layerBottom: i, beginEnter: o, endEnter: n, beginLeave: a, endLeave: s },
                              );
                            })),
                            (this.reactiveWindowWidth.value = window.innerWidth);
                        },
                      },
                      {
                        key: 'addScrollAndResizeListeners',
                        value: function () {
                          this.options.isScrollHandled &&
                            ((this.onScroll = this.handleScroll.bind(this)),
                            window.addEventListener('scroll', this.onScroll, !1)),
                            (this.onResize = this.handleResize.bind(this)),
                            window.addEventListener('resize', this.onResize, !1);
                        },
                      },
                      {
                        key: 'bind',
                        value: function () {
                          this.createMarkup(),
                            this.initPagerLinks(),
                            this.initHoverSynchro(),
                            this.attachCallbacks(),
                            (this.isBound = !0),
                            this.draw(),
                            'function' == typeof this.options.onBind && this.options.onBind(this);
                        },
                      },
                      {
                        key: 'unbind',
                        value: function () {
                          this.detachCallbacks(),
                            this.removeSyncroHoverListeners(),
                            this.clearCustomSectionIds(),
                            this.restoreOriginalSolidNodes(),
                            this.cleanupClonedMarkup(),
                            (this.isBound = !1),
                            'function' == typeof this.options.onUnbind && this.options.onUnbind(this),
                            (this.reactiveActiveLayer.value = void 0);
                        },
                      },
                      {
                        key: 'resetInternalState',
                        value: function () {
                          (this.stateArray = []),
                            (this.stateIndexById = {}),
                            (this.isBound = !1),
                            (this.rootNode = null),
                            (this.layerNodeArray = []),
                            (this.solidNodeArray = []),
                            (this.pagerLinkNodeArray = []),
                            (this.originalSolidNodeArray = []),
                            (this.maskNodeArray = []),
                            (this.synchroHoverNodeArray = []),
                            (this.isCustomMarkup = !1),
                            (this.customMaskNodeArray = []),
                            (this.documentHeight = 0),
                            (this.windowHeight = 0),
                            (this.immerserTop = 0),
                            (this.immerserHeight = 0),
                            (this.resizeFrameId = null),
                            (this.scrollFrameId = null),
                            (this.scrollAdjustTimerId = null),
                            (this.reactiveActiveLayer = new (c())()),
                            (this.reactiveWindowWidth = new (c())()),
                            (this.reactiveSynchroHoverId = new (c())()),
                            (this.stopRedrawingPager = null),
                            (this.stopUpdatingHash = null),
                            (this.stopFiringActiveLayerChangeCallback = null),
                            (this.stopTrackingSynchroHover = null),
                            (this.stopToggleBindOnResize = null),
                            (this.onResize = null),
                            (this.onScroll = null),
                            (this.onSynchroHoverMouseOver = null),
                            (this.onSynchroHoverMouseOut = null);
                        },
                      },
                      {
                        key: 'destroy',
                        value: function () {
                          var t;
                          this.unbind(),
                            null === (t = this.stopToggleBindOnResize) || void 0 === t || t.call(this),
                            this.removeScrollAndResizeListeners(),
                            'function' == typeof this.options.onDestroy && this.options.onDestroy(this),
                            this.resetInternalState();
                        },
                      },
                      {
                        key: 'createMarkup',
                        value: function () {
                          var t = this;
                          f(this.rootNode, O),
                            this.initCustomMarkup(),
                            (this.originalSolidNodeArray = d({
                              selector: this.selectors.solid,
                              parent: this.rootNode,
                            })),
                            (this.stateArray = this.stateArray.map(function (e, r) {
                              var i = t.isCustomMarkup ? t.customMaskNodeArray[r] : document.createElement('div');
                              f(i, S);
                              var n = t.isCustomMarkup
                                ? i.querySelector(t.selectors.maskInner)
                                : document.createElement('div');
                              return (
                                f(n, S),
                                t.isCustomMarkup || ((i.dataset.immerserMask = ''), (n.dataset.immerserMaskInner = '')),
                                t.originalSolidNodeArray.forEach(function (t) {
                                  var e = t.cloneNode(!0);
                                  f(e, k), (e.__immerserCloned = !0), n.appendChild(e);
                                }),
                                (function (t, e) {
                                  for (var r = 0; r < t.length; r++) e(t[r]);
                                })(n.querySelectorAll(t.selectors.solid), function (t) {
                                  var r = t.dataset.immerserSolid;
                                  e.solidClassnames &&
                                    Object.prototype.hasOwnProperty.call(e.solidClassnames, r) &&
                                    t.classList.add(e.solidClassnames[r]);
                                }),
                                0 !== r && i.setAttribute('aria-hidden', 'true'),
                                i.appendChild(n),
                                t.rootNode.appendChild(i),
                                t.maskNodeArray.push(i),
                                b(b({}, e), {}, { maskNode: i, maskInnerNode: n })
                              );
                            })),
                            this.detachOriginalSolidNodes();
                        },
                      },
                      {
                        key: 'initCustomMarkup',
                        value: function () {
                          var t = this;
                          (this.customMaskNodeArray = d({ selector: this.selectors.mask, parent: this.rootNode })),
                            (this.isCustomMarkup = this.customMaskNodeArray.length === this.stateArray.length),
                            this.customMaskNodeArray.length > 0 &&
                              !this.isCustomMarkup &&
                              p({
                                message:
                                  "You're trying use custom markup, but count of your immerser masks doesn't equal layers count.",
                                warning: !0,
                                docs: '#cloning-event-listeners',
                              }),
                            this.customMaskNodeArray.forEach(function (e) {
                              for (var r = e.querySelector(t.selectors.maskInner).children, i = 0; i < r.length; i++)
                                f(r[i], k);
                            });
                        },
                      },
                      {
                        key: 'detachOriginalSolidNodes',
                        value: function () {
                          var t = this;
                          this.originalSolidNodeArray.forEach(function (e) {
                            t.rootNode.removeChild(e);
                          });
                        },
                      },
                      {
                        key: 'initPagerLinks',
                        value: function () {
                          var t = this;
                          (this.pagerLinkNodeArray = d({ selector: this.selectors.pagerLink, parent: this.rootNode })),
                            this.pagerLinkNodeArray.forEach(function (e) {
                              var r = e.href;
                              if (r) {
                                var i = r.split('#')[1];
                                if (i) {
                                  var n = t.stateIndexById[i];
                                  e.dataset.immerserLayerIndex = n.toString();
                                }
                              }
                            });
                        },
                      },
                      {
                        key: 'initHoverSynchro',
                        value: function () {
                          var t = this;
                          (this.synchroHoverNodeArray = d({
                            selector: this.selectors.synchroHover,
                            parent: this.rootNode,
                          })),
                            (this.onSynchroHoverMouseOver = function (e) {
                              var r = e.target.dataset.immerserSynchroHover;
                              t.reactiveSynchroHoverId.value = r;
                            }),
                            (this.onSynchroHoverMouseOut = function () {
                              t.reactiveSynchroHoverId.value = void 0;
                            }),
                            this.synchroHoverNodeArray.forEach(function (e) {
                              e.addEventListener('mouseover', t.onSynchroHoverMouseOver),
                                e.addEventListener('mouseout', t.onSynchroHoverMouseOut);
                            });
                        },
                      },
                      {
                        key: 'attachCallbacks',
                        value: function () {
                          var t = this;
                          this.pagerLinkNodeArray.length > 0 &&
                            (this.stopRedrawingPager = this.reactiveActiveLayer.subscribe(
                              this.drawPagerLinks.bind(this),
                            )),
                            this.options.hasToUpdateHash &&
                              (this.stopUpdatingHash = this.reactiveActiveLayer.subscribe(this.drawHash.bind(this))),
                            'function' == typeof this.options.onActiveLayerChange &&
                              (this.stopFiringActiveLayerChangeCallback = this.reactiveActiveLayer.subscribe(function (
                                e,
                              ) {
                                t.options.onActiveLayerChange(e, t);
                              })),
                            this.synchroHoverNodeArray.length > 0 &&
                              (this.stopTrackingSynchroHover = this.reactiveSynchroHoverId.subscribe(
                                this.drawSynchroHover.bind(this),
                              ));
                        },
                      },
                      {
                        key: 'detachCallbacks',
                        value: function () {
                          'function' == typeof this.stopRedrawingPager && this.stopRedrawingPager(),
                            'function' == typeof this.stopUpdatingHash && this.stopUpdatingHash(),
                            'function' == typeof this.stopFiringActiveLayerChangeCallback &&
                              this.stopFiringActiveLayerChangeCallback(),
                            'function' == typeof this.stopTrackingSynchroHover && this.stopTrackingSynchroHover();
                        },
                      },
                      {
                        key: 'removeSyncroHoverListeners',
                        value: function () {
                          var t = this;
                          this.synchroHoverNodeArray.forEach(function (e) {
                            e.removeEventListener('mouseover', t.onSynchroHoverMouseOver),
                              e.removeEventListener('mouseout', t.onSynchroHoverMouseOut);
                          });
                        },
                      },
                      {
                        key: 'clearCustomSectionIds',
                        value: function () {
                          this.stateArray.forEach(function (t) {
                            t.layerNode.__immerserCustomId && t.layerNode.removeAttribute('id');
                          });
                        },
                      },
                      {
                        key: 'restoreOriginalSolidNodes',
                        value: function () {
                          var t = this;
                          this.originalSolidNodeArray.forEach(function (e) {
                            t.rootNode.appendChild(e);
                          });
                        },
                      },
                      {
                        key: 'cleanupClonedMarkup',
                        value: function () {
                          var t = this;
                          this.maskNodeArray.forEach(function (e) {
                            if (t.isCustomMarkup) {
                              e.removeAttribute('style'), e.removeAttribute('aria-hidden');
                              var r = e.querySelector(t.selectors.maskInner);
                              r.removeAttribute('style'),
                                d({ selector: t.selectors.solid, parent: r }).forEach(function (t) {
                                  t.__immerserCloned && r.removeChild(t);
                                });
                            } else t.rootNode.removeChild(e);
                          });
                        },
                      },
                      {
                        key: 'removeScrollAndResizeListeners',
                        value: function () {
                          this.options.isScrollHandled && window.removeEventListener('scroll', this.onScroll, !1),
                            window.removeEventListener('resize', this.onResize, !1);
                        },
                      },
                      {
                        key: 'draw',
                        value: function (t) {
                          var e = this,
                            r = void 0 !== t ? t : g().y;
                          this.stateArray.forEach(function (t, i) {
                            var n,
                              o = t.beginEnter,
                              s = t.endEnter,
                              a = t.beginLeave,
                              c = t.endLeave,
                              l = t.maskNode,
                              u = t.maskInnerNode,
                              h = t.layerTop,
                              f = t.layerBottom;
                            (n =
                              o > r
                                ? e.immerserHeight
                                : o <= r && r < s
                                ? s - r
                                : s <= r && r < a
                                ? 0
                                : a <= r && r < c
                                ? a - r
                                : -e.immerserHeight),
                              (l.style.transform = 'translateY('.concat(n, 'px)')),
                              (u.style.transform = 'translateY('.concat(-n, 'px)'));
                            var d = r + e.windowHeight * (1 - e.options.pagerThreshold);
                            h <= d && d < f && (e.reactiveActiveLayer.value = i);
                          });
                        },
                      },
                      {
                        key: 'drawPagerLinks',
                        value: function (t) {
                          var e = this;
                          this.pagerLinkNodeArray.forEach(function (r) {
                            parseInt(r.dataset.immerserLayerIndex, 10) === t
                              ? r.classList.add(e.options.pagerLinkActiveClassname)
                              : r.classList.remove(e.options.pagerLinkActiveClassname);
                          });
                        },
                      },
                      {
                        key: 'drawHash',
                        value: function (t) {
                          var e = this.stateArray[t],
                            r = e.id,
                            i = e.layerNode;
                          i.removeAttribute('id'), (window.location.hash = r), i.setAttribute('id', r);
                        },
                      },
                      {
                        key: 'drawSynchroHover',
                        value: function (t) {
                          this.synchroHoverNodeArray.forEach(function (e) {
                            e.dataset.immerserSynchroHover === t
                              ? e.classList.add('_hover')
                              : e.classList.remove('_hover');
                          });
                        },
                      },
                      {
                        key: 'adjustScroll',
                        value: function () {
                          var t = this.stateArray[this.reactiveActiveLayer.value],
                            e = t.layerTop,
                            r = t.layerBottom,
                            i = g(),
                            n = i.x,
                            o = i.y,
                            s = Math.abs(o - e),
                            a = Math.abs(o + this.windowHeight - r);
                          0 !== s &&
                            0 !== a &&
                            (s <= a && s <= this.options.scrollAdjustThreshold
                              ? window.scrollTo(n, e)
                              : a <= s &&
                                a <= this.options.scrollAdjustThreshold &&
                                window.scrollTo(n, r - this.windowHeight));
                        },
                      },
                      {
                        key: 'onDOMChange',
                        value: function () {
                          this.setSizes(), this.draw();
                        },
                      },
                      {
                        key: 'handleScroll',
                        value: function () {
                          var t = this;
                          this.isBound &&
                            (this.scrollFrameId &&
                              (window.cancelAnimationFrame(this.scrollFrameId), (this.scrollFrameId = null)),
                            (this.scrollFrameId = window.requestAnimationFrame(function () {
                              t.draw(),
                                t.options.scrollAdjustThreshold > 0 &&
                                  (t.scrollAdjustTimerId &&
                                    (clearTimeout(t.scrollAdjustTimerId), (t.scrollAdjustTimerId = null)),
                                  (t.scrollAdjustTimerId = setTimeout(
                                    t.adjustScroll.bind(t),
                                    t.options.scrollAdjustDelay,
                                  )));
                            }, this.options.scrollAdjustDelay)));
                        },
                      },
                      {
                        key: 'handleResize',
                        value: function () {
                          var t = this;
                          this.resizeFrameId &&
                            (window.cancelAnimationFrame(this.resizeFrameId), (this.resizeFrameId = null)),
                            (this.resizeFrameId = window.requestAnimationFrame(function () {
                              t.setSizes(), t.draw();
                            }));
                        },
                      },
                    ]),
                    e && x(t.prototype, e),
                    Object.defineProperty(t, 'prototype', { writable: !1 }),
                    t
                  );
                  var t, e;
                })();
              return i.default;
            })();
          }),
          'object' == a(e) && 'object' == a(t)
            ? (t.exports = s())
            : ((n = []), void 0 === (o = 'function' == typeof (i = s) ? i.apply(e, n) : i) || (t.exports = o));
      },
      9296: (t, e, r) => {
        'use strict';
        var i = r(4055)('span').classList,
          n = i && i.constructor && i.constructor.prototype;
        t.exports = n === Object.prototype ? void 0 : n;
      },
      9297: (t, e, r) => {
        'use strict';
        var i = r(9504),
          n = r(8981),
          o = i({}.hasOwnProperty);
        t.exports =
          Object.hasOwn ||
          function (t, e) {
            return o(n(t), e);
          };
      },
      9306: (t, e, r) => {
        'use strict';
        var i = r(4901),
          n = r(6823),
          o = TypeError;
        t.exports = function (t) {
          if (i(t)) return t;
          throw new o(n(t) + ' is not a function');
        };
      },
      9433: (t, e, r) => {
        'use strict';
        var i = r(4576),
          n = Object.defineProperty;
        t.exports = function (t, e) {
          try {
            n(i, t, { value: e, configurable: !0, writable: !0 });
          } catch (r) {
            i[t] = e;
          }
          return e;
        };
      },
      9504: (t, e, r) => {
        'use strict';
        var i = r(616),
          n = Function.prototype,
          o = n.call,
          s = i && n.bind.bind(o, o);
        t.exports = i
          ? s
          : function (t) {
              return function () {
                return o.apply(t, arguments);
              };
            };
      },
      9519: (t, e, r) => {
        'use strict';
        var i,
          n,
          o = r(4576),
          s = r(2839),
          a = o.process,
          c = o.Deno,
          l = (a && a.versions) || (c && c.version),
          u = l && l.v8;
        u && (n = (i = u.split('.'))[0] > 0 && i[0] < 4 ? 1 : +(i[0] + i[1])),
          !n && s && (!(i = s.match(/Edge\/(\d+)/)) || i[1] >= 74) && (i = s.match(/Chrome\/(\d+)/)) && (n = +i[1]),
          (t.exports = n);
      },
      9539: (t, e, r) => {
        'use strict';
        var i = r(9565),
          n = r(8551),
          o = r(5966);
        t.exports = function (t, e, r) {
          var s, a;
          n(t);
          try {
            if (!(s = o(t, 'return'))) {
              if ('throw' === e) throw r;
              return r;
            }
            s = i(s, t);
          } catch (t) {
            (a = !0), (s = t);
          }
          if ('throw' === e) throw r;
          if (a) throw s;
          return n(s), r;
        };
      },
      9565: (t, e, r) => {
        'use strict';
        var i = r(616),
          n = Function.prototype.call;
        t.exports = i
          ? n.bind(n)
          : function () {
              return n.apply(n, arguments);
            };
      },
      9617: (t, e, r) => {
        'use strict';
        var i = r(5397),
          n = r(5610),
          o = r(6198),
          s = function (t) {
            return function (e, r, s) {
              var a = i(e),
                c = o(a);
              if (0 === c) return !t && -1;
              var l,
                u = n(s, c);
              if (t && r != r) {
                for (; c > u; ) if ((l = a[u++]) != l) return !0;
              } else for (; c > u; u++) if ((t || u in a) && a[u] === r) return t || u || 0;
              return !t && -1;
            };
          };
        t.exports = { includes: s(!0), indexOf: s(!1) };
      },
    },
    e = {};
  function r(i) {
    var n = e[i];
    if (void 0 !== n) return n.exports;
    var o = (e[i] = { id: i, loaded: !1, exports: {} });
    return t[i].call(o.exports, o, o.exports, r), (o.loaded = !0), o.exports;
  }
  (r.n = (t) => {
    var e = t && t.__esModule ? () => t.default : () => t;
    return r.d(e, { a: e }), e;
  }),
    (r.d = (t, e) => {
      for (var i in e) r.o(e, i) && !r.o(t, i) && Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
    }),
    (r.g = (function () {
      if ('object' == typeof globalThis) return globalThis;
      try {
        return this || new Function('return this')();
      } catch (t) {
        if ('object' == typeof window) return window;
      }
    })()),
    (r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (r.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
    (() => {
      'use strict';
      var t,
        e = r(9263),
        i = r.n(e),
        n = (r(6099), r(3500), r(4610)),
        o = r.n(n),
        s = (r(8940), r(9085), r(2008), r(3792), r(7764), r(3772), r(2953), r(5858)),
        a = r.n(s),
        c = r(181),
        l = r.n(c),
        u = r(7654),
        h = r.n(u),
        f = [],
        d = function () {
          return f.some(function (t) {
            return t.activeTargets.length > 0;
          });
        },
        p = 'ResizeObserver loop completed with undelivered notifications.';
      !(function (t) {
        (t.BORDER_BOX = 'border-box'),
          (t.CONTENT_BOX = 'content-box'),
          (t.DEVICE_PIXEL_CONTENT_BOX = 'device-pixel-content-box');
      })(t || (t = {}));
      var v,
        g = function (t) {
          return Object.freeze(t);
        },
        y = function (t, e) {
          (this.inlineSize = t), (this.blockSize = e), g(this);
        },
        m = (function () {
          function t(t, e, r, i) {
            return (
              (this.x = t),
              (this.y = e),
              (this.width = r),
              (this.height = i),
              (this.top = this.y),
              (this.left = this.x),
              (this.bottom = this.top + this.height),
              (this.right = this.left + this.width),
              g(this)
            );
          }
          return (
            (t.prototype.toJSON = function () {
              var t = this;
              return {
                x: t.x,
                y: t.y,
                top: t.top,
                right: t.right,
                bottom: t.bottom,
                left: t.left,
                width: t.width,
                height: t.height,
              };
            }),
            (t.fromRect = function (e) {
              return new t(e.x, e.y, e.width, e.height);
            }),
            t
          );
        })(),
        b = function (t) {
          return t instanceof SVGElement && 'getBBox' in t;
        },
        x = function (t) {
          if (b(t)) {
            var e = t.getBBox(),
              r = e.width,
              i = e.height;
            return !r && !i;
          }
          var n = t,
            o = n.offsetWidth,
            s = n.offsetHeight;
          return !(o || s || t.getClientRects().length);
        },
        w = function (t) {
          var e;
          if (t instanceof Element) return !0;
          var r = null === (e = null == t ? void 0 : t.ownerDocument) || void 0 === e ? void 0 : e.defaultView;
          return !!(r && t instanceof r.Element);
        },
        E = 'undefined' != typeof window ? window : {},
        S = new WeakMap(),
        O = /auto|scroll/,
        k = /^tb|vertical/,
        A = /msie|trident/i.test(E.navigator && E.navigator.userAgent),
        L = function (t) {
          return parseFloat(t || '0');
        },
        T = function (t, e, r) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            void 0 === r && (r = !1),
            new y((r ? e : t) || 0, (r ? t : e) || 0)
          );
        },
        C = g({
          devicePixelContentBoxSize: T(),
          borderBoxSize: T(),
          contentBoxSize: T(),
          contentRect: new m(0, 0, 0, 0),
        }),
        N = function (t, e) {
          if ((void 0 === e && (e = !1), S.has(t) && !e)) return S.get(t);
          if (x(t)) return S.set(t, C), C;
          var r = getComputedStyle(t),
            i = b(t) && t.ownerSVGElement && t.getBBox(),
            n = !A && 'border-box' === r.boxSizing,
            o = k.test(r.writingMode || ''),
            s = !i && O.test(r.overflowY || ''),
            a = !i && O.test(r.overflowX || ''),
            c = i ? 0 : L(r.paddingTop),
            l = i ? 0 : L(r.paddingRight),
            u = i ? 0 : L(r.paddingBottom),
            h = i ? 0 : L(r.paddingLeft),
            f = i ? 0 : L(r.borderTopWidth),
            d = i ? 0 : L(r.borderRightWidth),
            p = i ? 0 : L(r.borderBottomWidth),
            v = h + l,
            y = c + u,
            w = (i ? 0 : L(r.borderLeftWidth)) + d,
            E = f + p,
            N = a ? t.offsetHeight - E - t.clientHeight : 0,
            j = s ? t.offsetWidth - w - t.clientWidth : 0,
            R = n ? v + w : 0,
            M = n ? y + E : 0,
            I = i ? i.width : L(r.width) - R - j,
            z = i ? i.height : L(r.height) - M - N,
            _ = I + v + j + w,
            P = z + y + N + E,
            W = g({
              devicePixelContentBoxSize: T(Math.round(I * devicePixelRatio), Math.round(z * devicePixelRatio), o),
              borderBoxSize: T(_, P, o),
              contentBoxSize: T(I, z, o),
              contentRect: new m(h, c, I, z),
            });
          return S.set(t, W), W;
        },
        j = function (e, r, i) {
          var n = N(e, i),
            o = n.borderBoxSize,
            s = n.contentBoxSize,
            a = n.devicePixelContentBoxSize;
          switch (r) {
            case t.DEVICE_PIXEL_CONTENT_BOX:
              return a;
            case t.BORDER_BOX:
              return o;
            default:
              return s;
          }
        },
        R = function (t) {
          var e = N(t);
          (this.target = t),
            (this.contentRect = e.contentRect),
            (this.borderBoxSize = g([e.borderBoxSize])),
            (this.contentBoxSize = g([e.contentBoxSize])),
            (this.devicePixelContentBoxSize = g([e.devicePixelContentBoxSize]));
        },
        M = function (t) {
          if (x(t)) return 1 / 0;
          for (var e = 0, r = t.parentNode; r; ) (e += 1), (r = r.parentNode);
          return e;
        },
        I = function () {
          var t = 1 / 0,
            e = [];
          f.forEach(function (r) {
            if (0 !== r.activeTargets.length) {
              var i = [];
              r.activeTargets.forEach(function (e) {
                var r = new R(e.target),
                  n = M(e.target);
                i.push(r), (e.lastReportedSize = j(e.target, e.observedBox)), n < t && (t = n);
              }),
                e.push(function () {
                  r.callback.call(r.observer, i, r.observer);
                }),
                r.activeTargets.splice(0, r.activeTargets.length);
            }
          });
          for (var r = 0, i = e; r < i.length; r++) {
            (0, i[r])();
          }
          return t;
        },
        z = function (t) {
          f.forEach(function (e) {
            e.activeTargets.splice(0, e.activeTargets.length),
              e.skippedTargets.splice(0, e.skippedTargets.length),
              e.observationTargets.forEach(function (r) {
                r.isActive() && (M(r.target) > t ? e.activeTargets.push(r) : e.skippedTargets.push(r));
              });
          });
        },
        _ = function () {
          var t,
            e = 0;
          for (z(e); d(); ) (e = I()), z(e);
          return (
            f.some(function (t) {
              return t.skippedTargets.length > 0;
            }) &&
              ('function' == typeof ErrorEvent
                ? (t = new ErrorEvent('error', { message: p }))
                : ((t = document.createEvent('Event')).initEvent('error', !1, !1), (t.message = p)),
              window.dispatchEvent(t)),
            e > 0
          );
        },
        P = [],
        W = function (t) {
          if (!v) {
            var e = 0,
              r = document.createTextNode('');
            new MutationObserver(function () {
              return P.splice(0).forEach(function (t) {
                return t();
              });
            }).observe(r, { characterData: !0 }),
              (v = function () {
                r.textContent = ''.concat(e ? e-- : e++);
              });
          }
          P.push(t), v();
        },
        B = 0,
        H = { attributes: !0, characterData: !0, childList: !0, subtree: !0 },
        D = [
          'resize',
          'load',
          'transitionend',
          'animationend',
          'animationstart',
          'animationiteration',
          'keyup',
          'keydown',
          'mouseup',
          'mousedown',
          'mouseover',
          'mouseout',
          'blur',
          'focus',
        ],
        F = function (t) {
          return void 0 === t && (t = 0), Date.now() + t;
        },
        q = !1,
        V = new ((function () {
          function t() {
            var t = this;
            (this.stopped = !0),
              (this.listener = function () {
                return t.schedule();
              });
          }
          return (
            (t.prototype.run = function (t) {
              var e = this;
              if ((void 0 === t && (t = 250), !q)) {
                q = !0;
                var r,
                  i = F(t);
                (r = function () {
                  var r = !1;
                  try {
                    r = _();
                  } finally {
                    if (((q = !1), (t = i - F()), !B)) return;
                    r ? e.run(1e3) : t > 0 ? e.run(t) : e.start();
                  }
                }),
                  W(function () {
                    requestAnimationFrame(r);
                  });
              }
            }),
            (t.prototype.schedule = function () {
              this.stop(), this.run();
            }),
            (t.prototype.observe = function () {
              var t = this,
                e = function () {
                  return t.observer && t.observer.observe(document.body, H);
                };
              document.body ? e() : E.addEventListener('DOMContentLoaded', e);
            }),
            (t.prototype.start = function () {
              var t = this;
              this.stopped &&
                ((this.stopped = !1),
                (this.observer = new MutationObserver(this.listener)),
                this.observe(),
                D.forEach(function (e) {
                  return E.addEventListener(e, t.listener, !0);
                }));
            }),
            (t.prototype.stop = function () {
              var t = this;
              this.stopped ||
                (this.observer && this.observer.disconnect(),
                D.forEach(function (e) {
                  return E.removeEventListener(e, t.listener, !0);
                }),
                (this.stopped = !0));
            }),
            t
          );
        })())(),
        $ = function (t) {
          !B && t > 0 && V.start(), !(B += t) && V.stop();
        },
        X = (function () {
          function e(e, r) {
            (this.target = e),
              (this.observedBox = r || t.CONTENT_BOX),
              (this.lastReportedSize = { inlineSize: 0, blockSize: 0 });
          }
          return (
            (e.prototype.isActive = function () {
              var t,
                e = j(this.target, this.observedBox, !0);
              return (
                (t = this.target),
                b(t) ||
                  (function (t) {
                    switch (t.tagName) {
                      case 'INPUT':
                        if ('image' !== t.type) break;
                      case 'VIDEO':
                      case 'AUDIO':
                      case 'EMBED':
                      case 'OBJECT':
                      case 'CANVAS':
                      case 'IFRAME':
                      case 'IMG':
                        return !0;
                    }
                    return !1;
                  })(t) ||
                  'inline' !== getComputedStyle(t).display ||
                  (this.lastReportedSize = e),
                this.lastReportedSize.inlineSize !== e.inlineSize || this.lastReportedSize.blockSize !== e.blockSize
              );
            }),
            e
          );
        })(),
        U = function (t, e) {
          (this.activeTargets = []),
            (this.skippedTargets = []),
            (this.observationTargets = []),
            (this.observer = t),
            (this.callback = e);
        },
        Y = new WeakMap(),
        G = function (t, e) {
          for (var r = 0; r < t.length; r += 1) if (t[r].target === e) return r;
          return -1;
        },
        K = (function () {
          function t() {}
          return (
            (t.connect = function (t, e) {
              var r = new U(t, e);
              Y.set(t, r);
            }),
            (t.observe = function (t, e, r) {
              var i = Y.get(t),
                n = 0 === i.observationTargets.length;
              G(i.observationTargets, e) < 0 &&
                (n && f.push(i), i.observationTargets.push(new X(e, r && r.box)), $(1), V.schedule());
            }),
            (t.unobserve = function (t, e) {
              var r = Y.get(t),
                i = G(r.observationTargets, e),
                n = 1 === r.observationTargets.length;
              i >= 0 && (n && f.splice(f.indexOf(r), 1), r.observationTargets.splice(i, 1), $(-1));
            }),
            (t.disconnect = function (t) {
              var e = this,
                r = Y.get(t);
              r.observationTargets.slice().forEach(function (r) {
                return e.unobserve(t, r.target);
              }),
                r.activeTargets.splice(0, r.activeTargets.length);
            }),
            t
          );
        })(),
        J = (function () {
          function t(t) {
            if (0 === arguments.length)
              throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
            if ('function' != typeof t)
              throw new TypeError(
                "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.",
              );
            K.connect(this, t);
          }
          return (
            (t.prototype.observe = function (t, e) {
              if (0 === arguments.length)
                throw new TypeError(
                  "Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.",
                );
              if (!w(t))
                throw new TypeError(
                  "Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element",
                );
              K.observe(this, t, e);
            }),
            (t.prototype.unobserve = function (t) {
              if (0 === arguments.length)
                throw new TypeError(
                  "Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.",
                );
              if (!w(t))
                throw new TypeError(
                  "Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element",
                );
              K.unobserve(this, t);
            }),
            (t.prototype.disconnect = function () {
              K.disconnect(this);
            }),
            (t.toString = function () {
              return 'function ResizeObserver () { [polyfill code] }';
            }),
            t
          );
        })(),
        Q =
          (r(2712),
          r(7495),
          r(1761),
          r(2010),
          r(5440),
          function (t) {
            return Array.prototype.reduce.call(
              t,
              function (t, e) {
                var r = e.name.match(/data-simplebar-(.+)/);
                if (r) {
                  var i = r[1].replace(/\W+(.)/g, function (t, e) {
                    return e.toUpperCase();
                  });
                  switch (e.value) {
                    case 'true':
                      t[i] = !0;
                      break;
                    case 'false':
                      t[i] = !1;
                      break;
                    case void 0:
                      t[i] = !0;
                      break;
                    default:
                      t[i] = e.value;
                  }
                }
                return t;
              },
              {},
            );
          });
      function Z(t) {
        return t && t.ownerDocument && t.ownerDocument.defaultView ? t.ownerDocument.defaultView : window;
      }
      function tt(t) {
        return t && t.ownerDocument ? t.ownerDocument : document;
      }
      var et = null,
        rt = null;
      function it(t) {
        if (null === et) {
          var e = tt(t);
          if (void 0 === e) return (et = 0);
          var r = e.body,
            i = e.createElement('div');
          i.classList.add('simplebar-hide-scrollbar'), r.appendChild(i);
          var n = i.getBoundingClientRect().right;
          r.removeChild(i), (et = n);
        }
        return et;
      }
      o() &&
        window.addEventListener('resize', function () {
          rt !== window.devicePixelRatio && ((rt = window.devicePixelRatio), (et = null));
        });
      var nt = (function () {
        function t(e, r) {
          var i = this;
          (this.onScroll = function () {
            var t = Z(i.el);
            i.scrollXTicking || (t.requestAnimationFrame(i.scrollX), (i.scrollXTicking = !0)),
              i.scrollYTicking || (t.requestAnimationFrame(i.scrollY), (i.scrollYTicking = !0));
          }),
            (this.scrollX = function () {
              i.axis.x.isOverflowing && (i.showScrollbar('x'), i.positionScrollbar('x')), (i.scrollXTicking = !1);
            }),
            (this.scrollY = function () {
              i.axis.y.isOverflowing && (i.showScrollbar('y'), i.positionScrollbar('y')), (i.scrollYTicking = !1);
            }),
            (this.onMouseEnter = function () {
              i.showScrollbar('x'), i.showScrollbar('y');
            }),
            (this.onMouseMove = function (t) {
              (i.mouseX = t.clientX),
                (i.mouseY = t.clientY),
                (i.axis.x.isOverflowing || i.axis.x.forceVisible) && i.onMouseMoveForAxis('x'),
                (i.axis.y.isOverflowing || i.axis.y.forceVisible) && i.onMouseMoveForAxis('y');
            }),
            (this.onMouseLeave = function () {
              i.onMouseMove.cancel(),
                (i.axis.x.isOverflowing || i.axis.x.forceVisible) && i.onMouseLeaveForAxis('x'),
                (i.axis.y.isOverflowing || i.axis.y.forceVisible) && i.onMouseLeaveForAxis('y'),
                (i.mouseX = -1),
                (i.mouseY = -1);
            }),
            (this.onWindowResize = function () {
              (i.scrollbarWidth = i.getScrollbarWidth()), i.hideNativeScrollbar();
            }),
            (this.hideScrollbars = function () {
              (i.axis.x.track.rect = i.axis.x.track.el.getBoundingClientRect()),
                (i.axis.y.track.rect = i.axis.y.track.el.getBoundingClientRect()),
                i.isWithinBounds(i.axis.y.track.rect) ||
                  (i.axis.y.scrollbar.el.classList.remove(i.classNames.visible), (i.axis.y.isVisible = !1)),
                i.isWithinBounds(i.axis.x.track.rect) ||
                  (i.axis.x.scrollbar.el.classList.remove(i.classNames.visible), (i.axis.x.isVisible = !1));
            }),
            (this.onPointerEvent = function (t) {
              var e, r;
              (i.axis.x.track.rect = i.axis.x.track.el.getBoundingClientRect()),
                (i.axis.y.track.rect = i.axis.y.track.el.getBoundingClientRect()),
                (i.axis.x.isOverflowing || i.axis.x.forceVisible) && (e = i.isWithinBounds(i.axis.x.track.rect)),
                (i.axis.y.isOverflowing || i.axis.y.forceVisible) && (r = i.isWithinBounds(i.axis.y.track.rect)),
                (e || r) &&
                  (t.preventDefault(),
                  t.stopPropagation(),
                  'mousedown' === t.type &&
                    (e &&
                      ((i.axis.x.scrollbar.rect = i.axis.x.scrollbar.el.getBoundingClientRect()),
                      i.isWithinBounds(i.axis.x.scrollbar.rect) ? i.onDragStart(t, 'x') : i.onTrackClick(t, 'x')),
                    r &&
                      ((i.axis.y.scrollbar.rect = i.axis.y.scrollbar.el.getBoundingClientRect()),
                      i.isWithinBounds(i.axis.y.scrollbar.rect) ? i.onDragStart(t, 'y') : i.onTrackClick(t, 'y'))));
            }),
            (this.drag = function (e) {
              var r = i.axis[i.draggedAxis].track,
                n = r.rect[i.axis[i.draggedAxis].sizeAttr],
                o = i.axis[i.draggedAxis].scrollbar,
                s = i.contentWrapperEl[i.axis[i.draggedAxis].scrollSizeAttr],
                a = parseInt(i.elStyles[i.axis[i.draggedAxis].sizeAttr], 10);
              e.preventDefault(), e.stopPropagation();
              var c =
                ((('y' === i.draggedAxis ? e.pageY : e.pageX) -
                  r.rect[i.axis[i.draggedAxis].offsetAttr] -
                  i.axis[i.draggedAxis].dragOffset) /
                  (n - o.size)) *
                (s - a);
              'x' === i.draggedAxis &&
                ((c = i.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? c - (n + o.size) : c),
                (c = i.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -c : c)),
                (i.contentWrapperEl[i.axis[i.draggedAxis].scrollOffsetAttr] = c);
            }),
            (this.onEndDrag = function (t) {
              var e = tt(i.el),
                r = Z(i.el);
              t.preventDefault(),
                t.stopPropagation(),
                i.el.classList.remove(i.classNames.dragging),
                e.removeEventListener('mousemove', i.drag, !0),
                e.removeEventListener('mouseup', i.onEndDrag, !0),
                (i.removePreventClickId = r.setTimeout(function () {
                  e.removeEventListener('click', i.preventClick, !0),
                    e.removeEventListener('dblclick', i.preventClick, !0),
                    (i.removePreventClickId = null);
                }));
            }),
            (this.preventClick = function (t) {
              t.preventDefault(), t.stopPropagation();
            }),
            (this.el = e),
            (this.minScrollbarWidth = 20),
            (this.options = Object.assign({}, t.defaultOptions, r)),
            (this.classNames = Object.assign({}, t.defaultOptions.classNames, this.options.classNames)),
            (this.axis = {
              x: {
                scrollOffsetAttr: 'scrollLeft',
                sizeAttr: 'width',
                scrollSizeAttr: 'scrollWidth',
                offsetSizeAttr: 'offsetWidth',
                offsetAttr: 'left',
                overflowAttr: 'overflowX',
                dragOffset: 0,
                isOverflowing: !0,
                isVisible: !1,
                forceVisible: !1,
                track: {},
                scrollbar: {},
              },
              y: {
                scrollOffsetAttr: 'scrollTop',
                sizeAttr: 'height',
                scrollSizeAttr: 'scrollHeight',
                offsetSizeAttr: 'offsetHeight',
                offsetAttr: 'top',
                overflowAttr: 'overflowY',
                dragOffset: 0,
                isOverflowing: !0,
                isVisible: !1,
                forceVisible: !1,
                track: {},
                scrollbar: {},
              },
            }),
            (this.removePreventClickId = null),
            t.instances.has(this.el) ||
              ((this.recalculate = a()(this.recalculate.bind(this), 64)),
              (this.onMouseMove = a()(this.onMouseMove.bind(this), 64)),
              (this.hideScrollbars = l()(this.hideScrollbars.bind(this), this.options.timeout)),
              (this.onWindowResize = l()(this.onWindowResize.bind(this), 64, { leading: !0 })),
              (t.getRtlHelpers = h()(t.getRtlHelpers)),
              this.init());
        }
        (t.getRtlHelpers = function () {
          var e = document.createElement('div');
          e.innerHTML =
            '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
          var r = e.firstElementChild;
          document.body.appendChild(r);
          var i = r.firstElementChild;
          r.scrollLeft = 0;
          var n = t.getOffset(r),
            o = t.getOffset(i);
          r.scrollLeft = 999;
          var s = t.getOffset(i);
          return {
            isRtlScrollingInverted: n.left !== o.left && o.left - s.left !== 0,
            isRtlScrollbarInverted: n.left !== o.left,
          };
        }),
          (t.getOffset = function (t) {
            var e = t.getBoundingClientRect(),
              r = tt(t),
              i = Z(t);
            return {
              top: e.top + (i.pageYOffset || r.documentElement.scrollTop),
              left: e.left + (i.pageXOffset || r.documentElement.scrollLeft),
            };
          });
        var e = t.prototype;
        return (
          (e.init = function () {
            t.instances.set(this.el, this),
              o() &&
                (this.initDOM(),
                this.setAccessibilityAttributes(),
                (this.scrollbarWidth = this.getScrollbarWidth()),
                this.recalculate(),
                this.initListeners());
          }),
          (e.initDOM = function () {
            var t = this;
            if (
              Array.prototype.filter.call(this.el.children, function (e) {
                return e.classList.contains(t.classNames.wrapper);
              }).length
            )
              (this.wrapperEl = this.el.querySelector('.' + this.classNames.wrapper)),
                (this.contentWrapperEl =
                  this.options.scrollableNode || this.el.querySelector('.' + this.classNames.contentWrapper)),
                (this.contentEl = this.options.contentNode || this.el.querySelector('.' + this.classNames.contentEl)),
                (this.offsetEl = this.el.querySelector('.' + this.classNames.offset)),
                (this.maskEl = this.el.querySelector('.' + this.classNames.mask)),
                (this.placeholderEl = this.findChild(this.wrapperEl, '.' + this.classNames.placeholder)),
                (this.heightAutoObserverWrapperEl = this.el.querySelector(
                  '.' + this.classNames.heightAutoObserverWrapperEl,
                )),
                (this.heightAutoObserverEl = this.el.querySelector('.' + this.classNames.heightAutoObserverEl)),
                (this.axis.x.track.el = this.findChild(
                  this.el,
                  '.' + this.classNames.track + '.' + this.classNames.horizontal,
                )),
                (this.axis.y.track.el = this.findChild(
                  this.el,
                  '.' + this.classNames.track + '.' + this.classNames.vertical,
                ));
            else {
              for (
                this.wrapperEl = document.createElement('div'),
                  this.contentWrapperEl = document.createElement('div'),
                  this.offsetEl = document.createElement('div'),
                  this.maskEl = document.createElement('div'),
                  this.contentEl = document.createElement('div'),
                  this.placeholderEl = document.createElement('div'),
                  this.heightAutoObserverWrapperEl = document.createElement('div'),
                  this.heightAutoObserverEl = document.createElement('div'),
                  this.wrapperEl.classList.add(this.classNames.wrapper),
                  this.contentWrapperEl.classList.add(this.classNames.contentWrapper),
                  this.offsetEl.classList.add(this.classNames.offset),
                  this.maskEl.classList.add(this.classNames.mask),
                  this.contentEl.classList.add(this.classNames.contentEl),
                  this.placeholderEl.classList.add(this.classNames.placeholder),
                  this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl),
                  this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl);
                this.el.firstChild;

              )
                this.contentEl.appendChild(this.el.firstChild);
              this.contentWrapperEl.appendChild(this.contentEl),
                this.offsetEl.appendChild(this.contentWrapperEl),
                this.maskEl.appendChild(this.offsetEl),
                this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl),
                this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
                this.wrapperEl.appendChild(this.maskEl),
                this.wrapperEl.appendChild(this.placeholderEl),
                this.el.appendChild(this.wrapperEl);
            }
            if (!this.axis.x.track.el || !this.axis.y.track.el) {
              var e = document.createElement('div'),
                r = document.createElement('div');
              e.classList.add(this.classNames.track),
                r.classList.add(this.classNames.scrollbar),
                e.appendChild(r),
                (this.axis.x.track.el = e.cloneNode(!0)),
                this.axis.x.track.el.classList.add(this.classNames.horizontal),
                (this.axis.y.track.el = e.cloneNode(!0)),
                this.axis.y.track.el.classList.add(this.classNames.vertical),
                this.el.appendChild(this.axis.x.track.el),
                this.el.appendChild(this.axis.y.track.el);
            }
            (this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector('.' + this.classNames.scrollbar)),
              (this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector('.' + this.classNames.scrollbar)),
              this.options.autoHide ||
                (this.axis.x.scrollbar.el.classList.add(this.classNames.visible),
                this.axis.y.scrollbar.el.classList.add(this.classNames.visible)),
              this.el.setAttribute('data-simplebar', 'init');
          }),
          (e.setAccessibilityAttributes = function () {
            var t = this.options.ariaLabel || 'scrollable content';
            this.contentWrapperEl.setAttribute('tabindex', '0'),
              this.contentWrapperEl.setAttribute('role', 'region'),
              this.contentWrapperEl.setAttribute('aria-label', t);
          }),
          (e.initListeners = function () {
            var t = this,
              e = Z(this.el);
            this.options.autoHide && this.el.addEventListener('mouseenter', this.onMouseEnter),
              ['mousedown', 'click', 'dblclick'].forEach(function (e) {
                t.el.addEventListener(e, t.onPointerEvent, !0);
              }),
              ['touchstart', 'touchend', 'touchmove'].forEach(function (e) {
                t.el.addEventListener(e, t.onPointerEvent, { capture: !0, passive: !0 });
              }),
              this.el.addEventListener('mousemove', this.onMouseMove),
              this.el.addEventListener('mouseleave', this.onMouseLeave),
              this.contentWrapperEl.addEventListener('scroll', this.onScroll),
              e.addEventListener('resize', this.onWindowResize);
            var r = !1,
              i = null,
              n = e.ResizeObserver || J;
            (this.resizeObserver = new n(function () {
              r &&
                null === i &&
                (i = e.requestAnimationFrame(function () {
                  t.recalculate(), (i = null);
                }));
            })),
              this.resizeObserver.observe(this.el),
              this.resizeObserver.observe(this.contentEl),
              e.requestAnimationFrame(function () {
                r = !0;
              }),
              (this.mutationObserver = new e.MutationObserver(this.recalculate)),
              this.mutationObserver.observe(this.contentEl, { childList: !0, subtree: !0, characterData: !0 });
          }),
          (e.recalculate = function () {
            var t = Z(this.el);
            (this.elStyles = t.getComputedStyle(this.el)), (this.isRtl = 'rtl' === this.elStyles.direction);
            var e = this.heightAutoObserverEl.offsetHeight <= 1,
              r = this.heightAutoObserverEl.offsetWidth <= 1,
              i = this.contentEl.offsetWidth,
              n = this.contentWrapperEl.offsetWidth,
              o = this.elStyles.overflowX,
              s = this.elStyles.overflowY;
            (this.contentEl.style.padding =
              this.elStyles.paddingTop +
              ' ' +
              this.elStyles.paddingRight +
              ' ' +
              this.elStyles.paddingBottom +
              ' ' +
              this.elStyles.paddingLeft),
              (this.wrapperEl.style.margin =
                '-' +
                this.elStyles.paddingTop +
                ' -' +
                this.elStyles.paddingRight +
                ' -' +
                this.elStyles.paddingBottom +
                ' -' +
                this.elStyles.paddingLeft);
            var a = this.contentEl.scrollHeight,
              c = this.contentEl.scrollWidth;
            (this.contentWrapperEl.style.height = e ? 'auto' : '100%'),
              (this.placeholderEl.style.width = r ? i + 'px' : 'auto'),
              (this.placeholderEl.style.height = a + 'px');
            var l = this.contentWrapperEl.offsetHeight;
            (this.axis.x.isOverflowing = c > i),
              (this.axis.y.isOverflowing = a > l),
              (this.axis.x.isOverflowing = 'hidden' !== o && this.axis.x.isOverflowing),
              (this.axis.y.isOverflowing = 'hidden' !== s && this.axis.y.isOverflowing),
              (this.axis.x.forceVisible = 'x' === this.options.forceVisible || !0 === this.options.forceVisible),
              (this.axis.y.forceVisible = 'y' === this.options.forceVisible || !0 === this.options.forceVisible),
              this.hideNativeScrollbar();
            var u = this.axis.x.isOverflowing ? this.scrollbarWidth : 0,
              h = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
            (this.axis.x.isOverflowing = this.axis.x.isOverflowing && c > n - h),
              (this.axis.y.isOverflowing = this.axis.y.isOverflowing && a > l - u),
              (this.axis.x.scrollbar.size = this.getScrollbarSize('x')),
              (this.axis.y.scrollbar.size = this.getScrollbarSize('y')),
              (this.axis.x.scrollbar.el.style.width = this.axis.x.scrollbar.size + 'px'),
              (this.axis.y.scrollbar.el.style.height = this.axis.y.scrollbar.size + 'px'),
              this.positionScrollbar('x'),
              this.positionScrollbar('y'),
              this.toggleTrackVisibility('x'),
              this.toggleTrackVisibility('y');
          }),
          (e.getScrollbarSize = function (t) {
            if ((void 0 === t && (t = 'y'), !this.axis[t].isOverflowing)) return 0;
            var e,
              r = this.contentEl[this.axis[t].scrollSizeAttr],
              i = this.axis[t].track.el[this.axis[t].offsetSizeAttr],
              n = i / r;
            return (
              (e = Math.max(~~(n * i), this.options.scrollbarMinSize)),
              this.options.scrollbarMaxSize && (e = Math.min(e, this.options.scrollbarMaxSize)),
              e
            );
          }),
          (e.positionScrollbar = function (e) {
            if ((void 0 === e && (e = 'y'), this.axis[e].isOverflowing)) {
              var r = this.contentWrapperEl[this.axis[e].scrollSizeAttr],
                i = this.axis[e].track.el[this.axis[e].offsetSizeAttr],
                n = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
                o = this.axis[e].scrollbar,
                s = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
                a = (s = 'x' === e && this.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -s : s) / (r - n),
                c = ~~((i - o.size) * a);
              (c = 'x' === e && this.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? c + (i - o.size) : c),
                (o.el.style.transform =
                  'x' === e ? 'translate3d(' + c + 'px, 0, 0)' : 'translate3d(0, ' + c + 'px, 0)');
            }
          }),
          (e.toggleTrackVisibility = function (t) {
            void 0 === t && (t = 'y');
            var e = this.axis[t].track.el,
              r = this.axis[t].scrollbar.el;
            this.axis[t].isOverflowing || this.axis[t].forceVisible
              ? ((e.style.visibility = 'visible'), (this.contentWrapperEl.style[this.axis[t].overflowAttr] = 'scroll'))
              : ((e.style.visibility = 'hidden'), (this.contentWrapperEl.style[this.axis[t].overflowAttr] = 'hidden')),
              this.axis[t].isOverflowing ? (r.style.display = 'block') : (r.style.display = 'none');
          }),
          (e.hideNativeScrollbar = function () {
            (this.offsetEl.style[this.isRtl ? 'left' : 'right'] =
              this.axis.y.isOverflowing || this.axis.y.forceVisible ? '-' + this.scrollbarWidth + 'px' : 0),
              (this.offsetEl.style.bottom =
                this.axis.x.isOverflowing || this.axis.x.forceVisible ? '-' + this.scrollbarWidth + 'px' : 0);
          }),
          (e.onMouseMoveForAxis = function (t) {
            void 0 === t && (t = 'y'),
              (this.axis[t].track.rect = this.axis[t].track.el.getBoundingClientRect()),
              (this.axis[t].scrollbar.rect = this.axis[t].scrollbar.el.getBoundingClientRect()),
              this.isWithinBounds(this.axis[t].scrollbar.rect)
                ? this.axis[t].scrollbar.el.classList.add(this.classNames.hover)
                : this.axis[t].scrollbar.el.classList.remove(this.classNames.hover),
              this.isWithinBounds(this.axis[t].track.rect)
                ? (this.showScrollbar(t), this.axis[t].track.el.classList.add(this.classNames.hover))
                : this.axis[t].track.el.classList.remove(this.classNames.hover);
          }),
          (e.onMouseLeaveForAxis = function (t) {
            void 0 === t && (t = 'y'),
              this.axis[t].track.el.classList.remove(this.classNames.hover),
              this.axis[t].scrollbar.el.classList.remove(this.classNames.hover);
          }),
          (e.showScrollbar = function (t) {
            void 0 === t && (t = 'y');
            var e = this.axis[t].scrollbar.el;
            this.axis[t].isVisible || (e.classList.add(this.classNames.visible), (this.axis[t].isVisible = !0)),
              this.options.autoHide && this.hideScrollbars();
          }),
          (e.onDragStart = function (t, e) {
            void 0 === e && (e = 'y');
            var r = tt(this.el),
              i = Z(this.el),
              n = this.axis[e].scrollbar,
              o = 'y' === e ? t.pageY : t.pageX;
            (this.axis[e].dragOffset = o - n.rect[this.axis[e].offsetAttr]),
              (this.draggedAxis = e),
              this.el.classList.add(this.classNames.dragging),
              r.addEventListener('mousemove', this.drag, !0),
              r.addEventListener('mouseup', this.onEndDrag, !0),
              null === this.removePreventClickId
                ? (r.addEventListener('click', this.preventClick, !0),
                  r.addEventListener('dblclick', this.preventClick, !0))
                : (i.clearTimeout(this.removePreventClickId), (this.removePreventClickId = null));
          }),
          (e.onTrackClick = function (t, e) {
            var r = this;
            if ((void 0 === e && (e = 'y'), this.options.clickOnTrack)) {
              var i = Z(this.el);
              this.axis[e].scrollbar.rect = this.axis[e].scrollbar.el.getBoundingClientRect();
              var n = this.axis[e].scrollbar.rect[this.axis[e].offsetAttr],
                o = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
                s = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
                a = ('y' === e ? this.mouseY - n : this.mouseX - n) < 0 ? -1 : 1,
                c = -1 === a ? s - o : s + o;
              !(function t() {
                var n, o;
                -1 === a
                  ? s > c &&
                    ((s -= r.options.clickOnTrackSpeed),
                    r.contentWrapperEl.scrollTo((((n = {})[r.axis[e].offsetAttr] = s), n)),
                    i.requestAnimationFrame(t))
                  : s < c &&
                    ((s += r.options.clickOnTrackSpeed),
                    r.contentWrapperEl.scrollTo((((o = {})[r.axis[e].offsetAttr] = s), o)),
                    i.requestAnimationFrame(t));
              })();
            }
          }),
          (e.getContentElement = function () {
            return this.contentEl;
          }),
          (e.getScrollElement = function () {
            return this.contentWrapperEl;
          }),
          (e.getScrollbarWidth = function () {
            try {
              return 'none' === getComputedStyle(this.contentWrapperEl, '::-webkit-scrollbar').display ||
                'scrollbarWidth' in document.documentElement.style ||
                '-ms-overflow-style' in document.documentElement.style
                ? 0
                : it(this.el);
            } catch (t) {
              return it(this.el);
            }
          }),
          (e.removeListeners = function () {
            var t = this,
              e = Z(this.el);
            this.options.autoHide && this.el.removeEventListener('mouseenter', this.onMouseEnter),
              ['mousedown', 'click', 'dblclick'].forEach(function (e) {
                t.el.removeEventListener(e, t.onPointerEvent, !0);
              }),
              ['touchstart', 'touchend', 'touchmove'].forEach(function (e) {
                t.el.removeEventListener(e, t.onPointerEvent, { capture: !0, passive: !0 });
              }),
              this.el.removeEventListener('mousemove', this.onMouseMove),
              this.el.removeEventListener('mouseleave', this.onMouseLeave),
              this.contentWrapperEl && this.contentWrapperEl.removeEventListener('scroll', this.onScroll),
              e.removeEventListener('resize', this.onWindowResize),
              this.mutationObserver && this.mutationObserver.disconnect(),
              this.resizeObserver && this.resizeObserver.disconnect(),
              this.recalculate.cancel(),
              this.onMouseMove.cancel(),
              this.hideScrollbars.cancel(),
              this.onWindowResize.cancel();
          }),
          (e.unMount = function () {
            this.removeListeners(), t.instances.delete(this.el);
          }),
          (e.isWithinBounds = function (t) {
            return (
              this.mouseX >= t.left &&
              this.mouseX <= t.left + t.width &&
              this.mouseY >= t.top &&
              this.mouseY <= t.top + t.height
            );
          }),
          (e.findChild = function (t, e) {
            var r = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector;
            return Array.prototype.filter.call(t.children, function (t) {
              return r.call(t, e);
            })[0];
          }),
          t
        );
      })();
      (nt.defaultOptions = {
        autoHide: !0,
        forceVisible: !1,
        clickOnTrack: !0,
        clickOnTrackSpeed: 40,
        classNames: {
          contentEl: 'simplebar-content',
          contentWrapper: 'simplebar-content-wrapper',
          offset: 'simplebar-offset',
          mask: 'simplebar-mask',
          wrapper: 'simplebar-wrapper',
          placeholder: 'simplebar-placeholder',
          scrollbar: 'simplebar-scrollbar',
          track: 'simplebar-track',
          heightAutoObserverWrapperEl: 'simplebar-height-auto-observer-wrapper',
          heightAutoObserverEl: 'simplebar-height-auto-observer',
          visible: 'simplebar-visible',
          horizontal: 'simplebar-horizontal',
          vertical: 'simplebar-vertical',
          hover: 'simplebar-hover',
          dragging: 'simplebar-dragging',
        },
        scrollbarMinSize: 25,
        scrollbarMaxSize: 0,
        timeout: 1e3,
      }),
        (nt.instances = new WeakMap()),
        (nt.initDOMLoadedElements = function () {
          document.removeEventListener('DOMContentLoaded', this.initDOMLoadedElements),
            window.removeEventListener('load', this.initDOMLoadedElements),
            Array.prototype.forEach.call(document.querySelectorAll('[data-simplebar]'), function (t) {
              'init' === t.getAttribute('data-simplebar') || nt.instances.has(t) || new nt(t, Q(t.attributes));
            });
        }),
        (nt.removeObserver = function () {
          this.globalObserver.disconnect();
        }),
        (nt.initHtmlApi = function () {
          (this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this)),
            'undefined' != typeof MutationObserver &&
              ((this.globalObserver = new MutationObserver(nt.handleMutations)),
              this.globalObserver.observe(document, { childList: !0, subtree: !0 })),
            'complete' === document.readyState ||
            ('loading' !== document.readyState && !document.documentElement.doScroll)
              ? window.setTimeout(this.initDOMLoadedElements)
              : (document.addEventListener('DOMContentLoaded', this.initDOMLoadedElements),
                window.addEventListener('load', this.initDOMLoadedElements));
        }),
        (nt.handleMutations = function (t) {
          t.forEach(function (t) {
            Array.prototype.forEach.call(t.addedNodes, function (t) {
              1 === t.nodeType &&
                (t.hasAttribute('data-simplebar')
                  ? !nt.instances.has(t) && document.documentElement.contains(t) && new nt(t, Q(t.attributes))
                  : Array.prototype.forEach.call(t.querySelectorAll('[data-simplebar]'), function (t) {
                      'init' !== t.getAttribute('data-simplebar') &&
                        !nt.instances.has(t) &&
                        document.documentElement.contains(t) &&
                        new nt(t, Q(t.attributes));
                    }));
            }),
              Array.prototype.forEach.call(t.removedNodes, function (t) {
                1 === t.nodeType &&
                  ('init' === t.getAttribute('data-simplebar')
                    ? nt.instances.has(t) && !document.documentElement.contains(t) && nt.instances.get(t).unMount()
                    : Array.prototype.forEach.call(t.querySelectorAll('[data-simplebar="init"]'), function (t) {
                        nt.instances.has(t) && !document.documentElement.contains(t) && nt.instances.get(t).unMount();
                      }));
              });
          });
        }),
        (nt.getOptions = Q),
        o() && nt.initHtmlApi();
      const ot = nt;
      for (var st = document.querySelectorAll('.scroller-x'), at = 0; at < st.length; at++) {
        new ot(st[at], { autoHide: !1 });
      }
      var ct = new (i())({
          solidClassnameArray: [
            { logo: 'logo--contrast-lg', pager: 'pager--contrast-lg', language: 'language--contrast-lg' },
            { pager: 'pager--contrast-only-md', menu: 'menu--contrast', about: 'about--contrast' },
            { logo: 'logo--contrast-lg', pager: 'pager--contrast-lg', language: 'language--contrast-lg' },
            {
              logo: 'logo--contrast-only-md',
              pager: 'pager--contrast-only-md',
              language: 'language--contrast-only-md',
              menu: 'menu--contrast',
              about: 'about--contrast',
            },
            { logo: 'logo--contrast-lg', pager: 'pager--contrast-lg', language: 'language--contrast-lg' },
          ],
          fromViewportWidth: 1024,
          pagerLinkActiveClassname: 'pager__link--active',
          scrollAdjustThreshold: 50,
          scrollAdjustDelay: 600,
          onInit: function (t) {
            (window.imm = t), console.log('onInit', t);
          },
          onBind: function (t) {
            console.log('onBind', t);
          },
          onUnbind: function (t) {
            console.log('onUnbind', t);
          },
          onDestroy: function (t) {
            console.log('onDestroy', t);
          },
          onActiveLayerChange: function (t, e) {
            console.log('onActiveLayerChange', t, e);
          },
        }),
        lt = document.querySelectorAll('[data-highlighter]'),
        ut = 'highlighter-animation-active';
      function ht(t) {
        return function () {
          if (ct.isBound)
            for (
              var e = t.dataset.highlighter,
                r = document.querySelectorAll(e),
                i = function () {
                  var t = r[n];
                  if (!t.isHighlighting) {
                    (t.isHighlighting = !0), t.classList.add(ut);
                    var e = setTimeout(function () {
                      t.classList.remove(ut), clearTimeout(e), (t.isHighlighting = !1);
                    }, 1500);
                  }
                },
                n = 0;
              n < r.length;
              n++
            )
              i();
        };
      }
      for (var ft = 0; ft < lt.length; ft++) {
        var dt = lt[ft];
        dt.addEventListener('mouseover', ht(dt)), dt.addEventListener('click', ht(dt));
      }
      for (
        var pt = document.querySelectorAll('[data-emoji-animating]'),
          vt = function () {
            var t = pt[gt];
            t.addEventListener('click', function () {
              'false' === t.dataset.emojiAnimating &&
                ((t.dataset.emojiAnimating = 'true'),
                setTimeout(function () {
                  t.dataset.emojiAnimating = 'false';
                }, 620));
            });
          },
          gt = 0;
        gt < pt.length;
        gt++
      )
        vt();
      var yt = document.getElementById('rulers');
      document.addEventListener('keydown', function (t) {
        var e = t.altKey,
          r = t.code,
          i = t.keyCode;
        e && ('KeyR' === r || 82 === i) && yt.classList.toggle('rulers--active');
      }),
        console.log('welcome here, fella. Press Alt+R to see vertical rhythm'),
        (window.immerserInstance = ct);
    })();
})();
//# sourceMappingURL=main.js.map

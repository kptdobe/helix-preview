var diffDOM = function (e) {
    "use strict";

    function t(e, o, n) {
        var s;
        return "#text" === e.nodeName ? s = n.document.createTextNode(e.data) : "#comment" === e.nodeName ? s = n.document.createComment(e.data) : ("svg" === e.nodeName || o ? (s = n.document.createElementNS("http://www.w3.org/2000/svg", e.nodeName), o = !0) : s = n.document.createElement(e.nodeName), e.attributes && Object.entries(e.attributes).forEach(function (e) {
            var t = e[0],
                o = e[1];
            return s.setAttribute(t, o)
        }), e.childNodes && e.childNodes.forEach(function (e) {
            return s.appendChild(t(e, o, n))
        }), n.valueDiffing && (e.value && (s.value = e.value), e.checked && (s.checked = e.checked), e.selected && (s.selected = e.selected))), s
    }

    function o(e, t) {
        for (t = t.slice(); t.length > 0;) {
            if (!e.childNodes) return !1;
            var o = t.splice(0, 1)[0];
            e = e.childNodes[o]
        }
        return e
    }

    function n(e, n, s) {
        var i, a, l, c, r = o(e, n[s._const.route]),
            u = {
                diff: n,
                node: r
            };
        if (s.preDiffApply(u)) return !0;
        switch (n[s._const.action]) {
            case s._const.addAttribute:
                if (!r || !r.setAttribute) return !1;
                r.setAttribute(n[s._const.name], n[s._const.value]);
                break;
            case s._const.modifyAttribute:
                if (!r || !r.setAttribute) return !1;
                r.setAttribute(n[s._const.name], n[s._const.newValue]), "INPUT" === r.nodeName && "value" === n[s._const.name] && (r.value = n[s._const.oldValue]);
                break;
            case s._const.removeAttribute:
                if (!r || !r.removeAttribute) return !1;
                r.removeAttribute(n[s._const.name]);
                break;
            case s._const.modifyTextElement:
                if (!r || 3 !== r.nodeType) return !1;
                s.textDiff(r, r.data, n[s._const.oldValue], n[s._const.newValue]);
                break;
            case s._const.modifyValue:
                if (!r || void 0 === r.value) return !1;
                r.value = n[s._const.newValue];
                break;
            case s._const.modifyComment:
                if (!r || void 0 === r.data) return !1;
                s.textDiff(r, r.data, n[s._const.oldValue], n[s._const.newValue]);
                break;
            case s._const.modifyChecked:
                if (!r || void 0 === r.checked) return !1;
                r.checked = n[s._const.newValue];
                break;
            case s._const.modifySelected:
                if (!r || void 0 === r.selected) return !1;
                r.selected = n[s._const.newValue];
                break;
            case s._const.replaceElement:
                r.parentNode.replaceChild(t(n[s._const.newValue], "http://www.w3.org/2000/svg" === r.namespaceURI, s), r);
                break;
            case s._const.relocateGroup:
                Array.apply(void 0, new Array(n.groupLength)).map(function () {
                    return r.removeChild(r.childNodes[n[s._const.from]])
                }).forEach(function (e, t) {
                    0 === t && (a = r.childNodes[n[s._const.to]]), r.insertBefore(e, a || null)
                });
                break;
            case s._const.removeElement:
                r.parentNode.removeChild(r);
                break;
            case s._const.addElement:
                c = (l = n[s._const.route].slice()).splice(l.length - 1, 1)[0], (r = o(e, l)).insertBefore(t(n[s._const.element], "http://www.w3.org/2000/svg" === r.namespaceURI, s), r.childNodes[c] || null);
                break;
            case s._const.removeTextElement:
                if (!r || 3 !== r.nodeType) return !1;
                r.parentNode.removeChild(r);
                break;
            case s._const.addTextElement:
                if (c = (l = n[s._const.route].slice()).splice(l.length - 1, 1)[0], i = s.document.createTextNode(n[s._const.value]), !(r = o(e, l)) || !r.childNodes) return !1;
                r.insertBefore(i, r.childNodes[c] || null);
                break;
            default:
                console.log("unknown action")
        }
        return u.newNode = i, s.postDiffApply(u), !0
    }

    function s(e, t, o) {
        var n = e[t];
        e[t] = e[o], e[o] = n
    }

    function i(e, t, o) {
        t.length || (t = [t]), (t = t.slice()).reverse(), t.forEach(function (t) {
            ! function (e, t, o) {
                switch (t[o._const.action]) {
                    case o._const.addAttribute:
                        t[o._const.action] = o._const.removeAttribute, n(e, t, o);
                        break;
                    case o._const.modifyAttribute:
                        s(t, o._const.oldValue, o._const.newValue), n(e, t, o);
                        break;
                    case o._const.removeAttribute:
                        t[o._const.action] = o._const.addAttribute, n(e, t, o);
                        break;
                    case o._const.modifyTextElement:
                    case o._const.modifyValue:
                    case o._const.modifyComment:
                    case o._const.modifyChecked:
                    case o._const.modifySelected:
                    case o._const.replaceElement:
                        s(t, o._const.oldValue, o._const.newValue), n(e, t, o);
                        break;
                    case o._const.relocateGroup:
                        s(t, o._const.from, o._const.to), n(e, t, o);
                        break;
                    case o._const.removeElement:
                        t[o._const.action] = o._const.addElement, n(e, t, o);
                        break;
                    case o._const.addElement:
                        t[o._const.action] = o._const.removeElement, n(e, t, o);
                        break;
                    case o._const.removeTextElement:
                        t[o._const.action] = o._const.addTextElement, n(e, t, o);
                        break;
                    case o._const.addTextElement:
                        t[o._const.action] = o._const.removeTextElement, n(e, t, o);
                        break;
                    default:
                        console.log("unknown action")
                }
            }(e, t, o)
        })
    }
    var a = function (e) {
        var t = this;
        void 0 === e && (e = {}), Object.entries(e).forEach(function (e) {
            var o = e[0],
                n = e[1];
            return t[o] = n
        })
    };

    function l(e) {
        var t = [];
        return "#text" !== e.nodeName && "#comment" !== e.nodeName && (t.push(e.nodeName), e.attributes && (e.attributes.class && t.push(e.nodeName + "." + e.attributes.class.replace(/ /g, ".")), e.attributes.id && t.push(e.nodeName + "#" + e.attributes.id))), t
    }

    function c(e) {
        var t = {},
            o = {};
        return e.forEach(function (e) {
            l(e).forEach(function (e) {
                var n = e in t;
                n || e in o ? n && (delete t[e], o[e] = !0) : t[e] = !0
            })
        }), t
    }

    function r(e, t) {
        var o = c(e),
            n = c(t),
            s = {};
        return Object.keys(o).forEach(function (e) {
            n[e] && (s[e] = !0)
        }), s
    }

    function u(e) {
        return delete e.outerDone, delete e.innerDone, delete e.valueDone, !e.childNodes || e.childNodes.every(u)
    }

    function d(e, t) {
        if (!["nodeName", "value", "checked", "selected", "data"].every(function (o) {
                return e[o] === t[o]
            })) return !1;
        if (Boolean(e.attributes) !== Boolean(t.attributes)) return !1;
        if (Boolean(e.childNodes) !== Boolean(t.childNodes)) return !1;
        if (e.attributes) {
            var o = Object.keys(e.attributes),
                n = Object.keys(t.attributes);
            if (o.length !== n.length) return !1;
            if (!o.every(function (o) {
                    return e.attributes[o] === t.attributes[o]
                })) return !1
        }
        if (e.childNodes) {
            if (e.childNodes.length !== t.childNodes.length) return !1;
            if (!e.childNodes.every(function (e, o) {
                    return d(e, t.childNodes[o])
                })) return !1
        }
        return !0
    }

    function h(e, t, o, n, s) {
        if (!e || !t) return !1;
        if (e.nodeName !== t.nodeName) return !1;
        if ("#text" === e.nodeName) return !!s || e.data === t.data;
        if (e.nodeName in o) return !0;
        if (e.attributes && t.attributes) {
            if (e.attributes.id) {
                if (e.attributes.id !== t.attributes.id) return !1;
                if (e.nodeName + "#" + e.attributes.id in o) return !0
            }
            if (e.attributes.class && e.attributes.class === t.attributes.class)
                if (e.nodeName + "." + e.attributes.class.replace(/ /g, ".") in o) return !0
        }
        if (n) return !0;
        var i = e.childNodes ? e.childNodes.slice().reverse() : [],
            a = t.childNodes ? t.childNodes.slice().reverse() : [];
        if (i.length !== a.length) return !1;
        if (s) return i.every(function (e, t) {
            return e.nodeName === a[t].nodeName
        });
        var l = r(i, a);
        return i.every(function (e, t) {
            return h(e, a[t], l, !0, !0)
        })
    }

    function f(e) {
        return JSON.parse(JSON.stringify(e))
    }

    function p(e, t, o, n) {
        var s = 0,
            i = [],
            a = e.length,
            c = t.length,
            u = Array.apply(void 0, new Array(a + 1)).map(function () {
                return []
            }),
            d = r(e, t),
            f = a === c;
        f && e.some(function (e, o) {
            var n = l(e),
                s = l(t[o]);
            return n.length !== s.length ? (f = !1, !0) : (n.some(function (e, t) {
                if (e !== s[t]) return f = !1, !0
            }), !f || void 0)
        });
        for (var p = 0; p < a; p++)
            for (var m = e[p], _ = 0; _ < c; _++) {
                var V = t[_];
                o[p] || n[_] || !h(m, V, d, f) ? u[p + 1][_ + 1] = 0 : (u[p + 1][_ + 1] = u[p][_] ? u[p][_] + 1 : 1, u[p + 1][_ + 1] >= s && (s = u[p + 1][_ + 1], i = [p + 1, _ + 1]))
            }
        return 0 !== s && {
            oldValue: i[0] - s,
            newValue: i[1] - s,
            length: s
        }
    }

    function m(e, t) {
        return Array.apply(void 0, new Array(e)).map(function () {
            return t
        })
    }
    a.prototype.toString = function () {
        return JSON.stringify(this)
    }, a.prototype.setValue = function (e, t) {
        return this[e] = t, this
    };
    var _ = function () {
        this.list = []
    };

    function V(e, t) {
        var o, n, s = e;
        for (t = t.slice(); t.length > 0;) {
            if (!s.childNodes) return !1;
            n = t.splice(0, 1)[0], o = s, s = s.childNodes[n]
        }
        return {
            node: s,
            parentNode: o,
            nodeIndex: n
        }
    }

    function g(e, t, o) {
        return t.forEach(function (t) {
            ! function (e, t, o) {
                var n, s, i, a = V(e, t[o._const.route]),
                    l = a.node,
                    c = a.parentNode,
                    r = a.nodeIndex,
                    u = [],
                    d = {
                        diff: t,
                        node: l
                    };
                if (o.preDiffApply(d)) return !0;
                switch (t[o._const.action]) {
                    case o._const.addAttribute:
                        l.attributes || (l.attributes = {}), l.attributes[t[o._const.name]] = t[o._const.value], "checked" === t[o._const.name] ? l.checked = !0 : "selected" === t[o._const.name] ? l.selected = !0 : "INPUT" === l.nodeName && "value" === t[o._const.name] && (l.value = t[o._const.value]);
                        break;
                    case o._const.modifyAttribute:
                        l.attributes[t[o._const.name]] = t[o._const.newValue];
                        break;
                    case o._const.removeAttribute:
                        delete l.attributes[t[o._const.name]], 0 === Object.keys(l.attributes).length && delete l.attributes, "checked" === t[o._const.name] ? l.checked = !1 : "selected" === t[o._const.name] ? delete l.selected : "INPUT" === l.nodeName && "value" === t[o._const.name] && delete l.value;
                        break;
                    case o._const.modifyTextElement:
                        l.data = t[o._const.newValue];
                        break;
                    case o._const.modifyValue:
                        l.value = t[o._const.newValue];
                        break;
                    case o._const.modifyComment:
                        l.data = t[o._const.newValue];
                        break;
                    case o._const.modifyChecked:
                        l.checked = t[o._const.newValue];
                        break;
                    case o._const.modifySelected:
                        l.selected = t[o._const.newValue];
                        break;
                    case o._const.replaceElement:
                        (n = f(t[o._const.newValue])).outerDone = !0, n.innerDone = !0, n.valueDone = !0, c.childNodes[r] = n;
                        break;
                    case o._const.relocateGroup:
                        l.childNodes.splice(t[o._const.from], t.groupLength).reverse().forEach(function (e) {
                            return l.childNodes.splice(t[o._const.to], 0, e)
                        }), l.subsets && l.subsets.forEach(function (e) {
                            if (t[o._const.from] < t[o._const.to] && e.oldValue <= t[o._const.to] && e.oldValue > t[o._const.from]) {
                                e.oldValue -= t.groupLength;
                                var n = e.oldValue + e.length - t[o._const.to];
                                n > 0 && (u.push({
                                    oldValue: t[o._const.to] + t.groupLength,
                                    newValue: e.newValue + e.length - n,
                                    length: n
                                }), e.length -= n)
                            } else if (t[o._const.from] > t[o._const.to] && e.oldValue > t[o._const.to] && e.oldValue < t[o._const.from]) {
                                e.oldValue += t.groupLength;
                                var s = e.oldValue + e.length - t[o._const.to];
                                s > 0 && (u.push({
                                    oldValue: t[o._const.to] + t.groupLength,
                                    newValue: e.newValue + e.length - s,
                                    length: s
                                }), e.length -= s)
                            } else e.oldValue === t[o._const.from] && (e.oldValue = t[o._const.to])
                        });
                        break;
                    case o._const.removeElement:
                        c.childNodes.splice(r, 1), c.subsets && c.subsets.forEach(function (e) {
                            e.oldValue > r ? e.oldValue -= 1 : e.oldValue === r ? e.delete = !0 : e.oldValue < r && e.oldValue + e.length > r && (e.oldValue + e.length - 1 === r ? e.length-- : (u.push({
                                newValue: e.newValue + r - e.oldValue,
                                oldValue: r,
                                length: e.length - r + e.oldValue - 1
                            }), e.length = r - e.oldValue))
                        }), l = c;
                        break;
                    case o._const.addElement:
                        s = t[o._const.route].slice(), i = s.splice(s.length - 1, 1)[0], l = V(e, s).node, (n = f(t[o._const.element])).outerDone = !0, n.innerDone = !0, n.valueDone = !0, l.childNodes || (l.childNodes = []), i >= l.childNodes.length ? l.childNodes.push(n) : l.childNodes.splice(i, 0, n), l.subsets && l.subsets.forEach(function (e) {
                            if (e.oldValue >= i) e.oldValue += 1;
                            else if (e.oldValue < i && e.oldValue + e.length > i) {
                                var t = e.oldValue + e.length - i;
                                u.push({
                                    newValue: e.newValue + e.length - t,
                                    oldValue: i + 1,
                                    length: t
                                }), e.length -= t
                            }
                        });
                        break;
                    case o._const.removeTextElement:
                        c.childNodes.splice(r, 1), "TEXTAREA" === c.nodeName && delete c.value, c.subsets && c.subsets.forEach(function (e) {
                            e.oldValue > r ? e.oldValue -= 1 : e.oldValue === r ? e.delete = !0 : e.oldValue < r && e.oldValue + e.length > r && (e.oldValue + e.length - 1 === r ? e.length-- : (u.push({
                                newValue: e.newValue + r - e.oldValue,
                                oldValue: r,
                                length: e.length - r + e.oldValue - 1
                            }), e.length = r - e.oldValue))
                        }), l = c;
                        break;
                    case o._const.addTextElement:
                        s = t[o._const.route].slice(), i = s.splice(s.length - 1, 1)[0], (n = {}).nodeName = "#text", n.data = t[o._const.value], (l = V(e, s).node).childNodes || (l.childNodes = []), i >= l.childNodes.length ? l.childNodes.push(n) : l.childNodes.splice(i, 0, n), "TEXTAREA" === l.nodeName && (l.value = t[o._const.newValue]), l.subsets && l.subsets.forEach(function (e) {
                            if (e.oldValue >= i && (e.oldValue += 1), e.oldValue < i && e.oldValue + e.length > i) {
                                var t = e.oldValue + e.length - i;
                                u.push({
                                    newValue: e.newValue + e.length - t,
                                    oldValue: i + 1,
                                    length: t
                                }), e.length -= t
                            }
                        });
                        break;
                    default:
                        console.log("unknown action")
                }
                l.subsets && (l.subsets = l.subsets.filter(function (e) {
                    return !e.delete && e.oldValue !== e.newValue
                }), u.length && (l.subsets = l.subsets.concat(u))), d.newNode = n, o.postDiffApply(d)
            }(e, t, o)
        }), !0
    }

    function v(e, t) {
        var o = {};
        if (o.nodeName = e.nodeName, "#text" === o.nodeName || "#comment" === o.nodeName) o.data = e.data;
        else {
            if (e.attributes && e.attributes.length > 0) o.attributes = {}, Array.prototype.slice.call(e.attributes).forEach(function (e) {
                return o.attributes[e.name] = e.value
            });
            if ("TEXTAREA" === o.nodeName) o.value = e.value;
            else if (e.childNodes && e.childNodes.length > 0) {
                o.childNodes = [], Array.prototype.slice.call(e.childNodes).forEach(function (e) {
                    return o.childNodes.push(v(e, t))
                })
            }
            t.valueDiffing && (void 0 !== e.checked && e.type && ["radio", "checkbox"].includes(e.type.toLowerCase()) ? o.checked = e.checked : void 0 !== e.value && (o.value = e.value), void 0 !== e.selected && (o.selected = e.selected))
        }
        return o
    }
    _.prototype.add = function (e) {
        var t;
        (t = this.list).push.apply(t, e)
    }, _.prototype.forEach = function (e) {
        this.list.forEach(function (t) {
            return e(t)
        })
    };
    var N = function (e, t, o) {
        this.options = o, this.t1 = v(e, this.options), this.t2 = v(t, this.options), this.diffcount = 0, this.foundAll = !1, this.debug && (this.t1Orig = v(e, this.options), this.t2Orig = v(t, this.options)), this.tracker = new _
    };
    N.prototype.init = function () {
        return this.findDiffs(this.t1, this.t2)
    }, N.prototype.findDiffs = function (e, t) {
        var o;
        do {
            if (this.options.debug && (this.diffcount += 1, this.diffcount > this.options.diffcap)) throw window.diffError = [this.t1Orig, this.t2Orig], new Error("surpassed diffcap:" + JSON.stringify(this.t1Orig) + " -> " + JSON.stringify(this.t2Orig));
            0 === (o = this.findNextDiff(e, t, [])).length && (d(e, t) || (this.foundAll ? (console.error("Could not find remaining diffs!"), console.log({
                t1: e,
                t2: t
            })) : (this.foundAll = !0, u(e), o = this.findNextDiff(e, t, [])))), o.length > 0 && (this.foundAll = !1, this.tracker.add(o), g(e, o, this.options))
        } while (o.length > 0);
        return this.tracker.list
    }, N.prototype.findNextDiff = function (e, t, o) {
        var n, s;
        if (this.options.maxDepth && o.length > this.options.maxDepth) return [];
        if (!e.outerDone) {
            if (n = this.findOuterDiff(e, t, o), this.filterOuterDiff && (s = this.filterOuterDiff(e, t, n)) && (n = s), n.length > 0) return e.outerDone = !0, n;
            e.outerDone = !0
        }
        if (!e.innerDone) {
            if ((n = this.findInnerDiff(e, t, o)).length > 0) return n;
            e.innerDone = !0
        }
        if (this.options.valueDiffing && !e.valueDone) {
            if ((n = this.findValueDiff(e, t, o)).length > 0) return e.valueDone = !0, n;
            e.valueDone = !0
        }
        return []
    }, N.prototype.findOuterDiff = function (e, t, o) {
        var n, s, i, l, c, r, u = [];
        if (e.nodeName !== t.nodeName) return [(new a).setValue(this.options._const.action, this.options._const.replaceElement).setValue(this.options._const.oldValue, f(e)).setValue(this.options._const.newValue, f(t)).setValue(this.options._const.route, o)];
        if (o.length && this.options.maxChildCount && e.childNodes && t.childNodes && e.childNodes.length > this.options.maxChildCount && t.childNodes.length > this.options.maxChildCount) {
            for (var h = e.childNodes.length < t.childNodes.length ? e.childNodes.length : t.childNodes.length, p = 0, m = 0; p < this.options.maxChildDiffCount && m < h;) d(e.childNodes[m], t.childNodes[m]) || p++, m++;
            if (p === this.options.maxChildDiffCount) return [(new a).setValue(this.options._const.action, this.options._const.replaceElement).setValue(this.options._const.oldValue, f(e)).setValue(this.options._const.newValue, f(t)).setValue(this.options._const.route, o)]
        }
        if (e.data !== t.data) return "#text" === e.nodeName ? [(new a).setValue(this.options._const.action, this.options._const.modifyTextElement).setValue(this.options._const.route, o).setValue(this.options._const.oldValue, e.data).setValue(this.options._const.newValue, t.data)] : [(new a).setValue(this.options._const.action, this.options._const.modifyComment).setValue(this.options._const.route, o).setValue(this.options._const.oldValue, e.data).setValue(this.options._const.newValue, t.data)];
        for (s = e.attributes ? Object.keys(e.attributes).sort() : [], i = t.attributes ? Object.keys(t.attributes).sort() : [], l = s.length, r = 0; r < l; r++) n = s[r], -1 === (c = i.indexOf(n)) ? u.push((new a).setValue(this.options._const.action, this.options._const.removeAttribute).setValue(this.options._const.route, o).setValue(this.options._const.name, n).setValue(this.options._const.value, e.attributes[n])) : (i.splice(c, 1), e.attributes[n] !== t.attributes[n] && u.push((new a).setValue(this.options._const.action, this.options._const.modifyAttribute).setValue(this.options._const.route, o).setValue(this.options._const.name, n).setValue(this.options._const.oldValue, e.attributes[n]).setValue(this.options._const.newValue, t.attributes[n])));
        for (l = i.length, r = 0; r < l; r++) n = i[r], u.push((new a).setValue(this.options._const.action, this.options._const.addAttribute).setValue(this.options._const.route, o).setValue(this.options._const.name, n).setValue(this.options._const.value, t.attributes[n]));
        return u
    }, N.prototype.findInnerDiff = function (e, t, o) {
        var n, s = e.subsets && e.subsetsAge-- ? e.subsets : e.childNodes && t.childNodes ? function (e, t) {
                for (var o = e.childNodes ? e.childNodes : [], n = t.childNodes ? t.childNodes : [], s = m(o.length, !1), i = m(n.length, !1), a = [], l = !0, c = function () {
                        return arguments[1]
                    }; l;)(l = p(o, n, s, i)) && (a.push(l), Array.apply(void 0, new Array(l.length)).map(c).forEach(function (e) {
                    return t = e, s[l.oldValue + t] = !0, void(i[l.newValue + t] = !0);
                    var t
                }));
                return e.subsets = a, e.subsetsAge = 100, a
            }(e, t) : [],
            i = e.childNodes ? e.childNodes : [],
            l = t.childNodes ? t.childNodes : [],
            c = [],
            r = 0;
        if (s.length > 0 && (c = this.attemptGroupRelocation(e, t, s, o)).length > 0) return c;
        var u = Math.max(i.length, l.length);
        i.length !== l.length && (n = !0);
        for (var d = 0; d < u; d += 1) {
            var h = i[d],
                _ = l[d];
            n && (h && !_ ? "#text" === h.nodeName ? (c.push((new a).setValue(this.options._const.action, this.options._const.removeTextElement).setValue(this.options._const.route, o.concat(r)).setValue(this.options._const.value, h.data)), r -= 1) : (c.push((new a).setValue(this.options._const.action, this.options._const.removeElement).setValue(this.options._const.route, o.concat(r)).setValue(this.options._const.element, f(h))), r -= 1) : _ && !h && ("#text" === _.nodeName ? c.push((new a).setValue(this.options._const.action, this.options._const.addTextElement).setValue(this.options._const.route, o.concat(r)).setValue(this.options._const.value, _.data)) : c.push((new a).setValue(this.options._const.action, this.options._const.addElement).setValue(this.options._const.route, o.concat(r)).setValue(this.options._const.element, f(_))))), h && _ && (c = c.concat(this.findNextDiff(h, _, o.concat(r)))), r += 1
        }
        return e.innerDone = !0, c
    }, N.prototype.attemptGroupRelocation = function (e, t, o, n) {
        for (var s, i, l, c, r, u, d = function (e, t, o) {
                var n = e.childNodes ? m(e.childNodes.length, !0) : [],
                    s = t.childNodes ? m(t.childNodes.length, !0) : [],
                    i = 0;
                return o.forEach(function (e) {
                    for (var t = e.oldValue + e.length, o = e.newValue + e.length, a = e.oldValue; a < t; a += 1) n[a] = i;
                    for (var l = e.newValue; l < o; l += 1) s[l] = i;
                    i += 1
                }), {
                    gaps1: n,
                    gaps2: s
                }
            }(e, t, o), p = d.gaps1, _ = d.gaps2, V = Math.min(p.length, _.length), g = [], v = 0, N = 0; v < V; N += 1, v += 1)
            if (!0 === p[v])
                if ("#text" === (c = e.childNodes[N]).nodeName) {
                    if ("#text" === t.childNodes[v].nodeName && c.data !== t.childNodes[v].data) {
                        for (u = N; e.childNodes.length > u + 1 && "#text" === e.childNodes[u + 1].nodeName;)
                            if (u += 1, t.childNodes[v].data === e.childNodes[u].data) {
                                r = !0;
                                break
                            } if (!r) return g.push((new a).setValue(this.options._const.action, this.options._const.modifyTextElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.oldValue, c.data).setValue(this.options._const.newValue, t.childNodes[v].data)), g
                    }
                    g.push((new a).setValue(this.options._const.action, this.options._const.removeTextElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.value, c.data)), p.splice(v, 1), V = Math.min(p.length, _.length), v -= 1
                } else g.push((new a).setValue(this.options._const.action, this.options._const.removeElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.element, f(c))), p.splice(v, 1), V = Math.min(p.length, _.length), v -= 1;
        else if (!0 === _[v]) "#text" === (c = t.childNodes[v]).nodeName ? (g.push((new a).setValue(this.options._const.action, this.options._const.addTextElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.value, c.data)), p.splice(v, 0, !0), V = Math.min(p.length, _.length), N -= 1) : (g.push((new a).setValue(this.options._const.action, this.options._const.addElement).setValue(this.options._const.route, n.concat(v)).setValue(this.options._const.element, f(c))), p.splice(v, 0, !0), V = Math.min(p.length, _.length), N -= 1);
        else if (p[v] !== _[v]) {
            if (g.length > 0) return g;
            if (l = o[p[v]], (i = Math.min(l.newValue, e.childNodes.length - l.length)) !== l.oldValue) {
                s = !1;
                for (var b = 0; b < l.length; b += 1) h(e.childNodes[i + b], e.childNodes[l.oldValue + b], [], !1, !0) || (s = !0);
                if (s) return [(new a).setValue(this.options._const.action, this.options._const.relocateGroup).setValue("groupLength", l.length).setValue(this.options._const.from, l.oldValue).setValue(this.options._const.to, i).setValue(this.options._const.route, n)]
            }
        }
        return g
    }, N.prototype.findValueDiff = function (e, t, o) {
        var n = [];
        return e.selected !== t.selected && n.push((new a).setValue(this.options._const.action, this.options._const.modifySelected).setValue(this.options._const.oldValue, e.selected).setValue(this.options._const.newValue, t.selected).setValue(this.options._const.route, o)), (e.value || t.value) && e.value !== t.value && "OPTION" !== e.nodeName && n.push((new a).setValue(this.options._const.action, this.options._const.modifyValue).setValue(this.options._const.oldValue, e.value || "").setValue(this.options._const.newValue, t.value || "").setValue(this.options._const.route, o)), e.checked !== t.checked && n.push((new a).setValue(this.options._const.action, this.options._const.modifyChecked).setValue(this.options._const.oldValue, e.checked).setValue(this.options._const.newValue, t.checked).setValue(this.options._const.route, o)), n
    };
    var b = {
            debug: !1,
            diffcap: 10,
            maxDepth: !1,
            maxChildCount: 50,
            maxChildDiffCount: 3,
            valueDiffing: !0,
            textDiff: function (e, t, o, n) {
                e.data = n
            },
            preVirtualDiffApply: function () {},
            postVirtualDiffApply: function () {},
            preDiffApply: function () {},
            postDiffApply: function () {},
            filterOuterDiff: null,
            compress: !1,
            _const: !1,
            document: !(!window || !window.document) && window.document
        },
        y = function (e) {
            var t = this;
            if (void 0 === e && (e = {}), this.options = e, Object.entries(b).forEach(function (e) {
                    var o = e[0],
                        n = e[1];
                    Object.prototype.hasOwnProperty.call(t.options, o) || (t.options[o] = n)
                }), !this.options._const) {
                var o = ["addAttribute", "modifyAttribute", "removeAttribute", "modifyTextElement", "relocateGroup", "removeElement", "addElement", "removeTextElement", "addTextElement", "replaceElement", "modifyValue", "modifyChecked", "modifySelected", "modifyComment", "action", "route", "oldValue", "newValue", "element", "group", "from", "to", "name", "value", "data", "attributes", "nodeName", "childNodes", "checked", "selected"];
                this.options._const = {}, this.options.compress ? o.forEach(function (e, o) {
                    return t.options._const[e] = o
                }) : o.forEach(function (e) {
                    return t.options._const[e] = e
                })
            }
            this.DiffFinder = N
        };
    y.prototype.apply = function (e, t) {
        return function (e, t, o) {
            return t.every(function (t) {
                return n(e, t, o)
            })
        }(e, t, this.options)
    }, y.prototype.undo = function (e, t) {
        return i(e, t, this.options)
    }, y.prototype.diff = function (e, t) {
        return new this.DiffFinder(e, t, this.options).init()
    };
    var w = function (e) {
        var t = this;
        void 0 === e && (e = {}), this.pad = "│   ", this.padding = "", this.tick = 1, this.messages = [];
        var o = function (e, o) {
            var n = e[o];
            e[o] = function () {
                for (var s = [], i = arguments.length; i--;) s[i] = arguments[i];
                t.fin(o, Array.prototype.slice.call(s));
                var a = n.apply(e, s);
                return t.fout(o, a), a
            }
        };
        for (var n in e) "function" == typeof e[n] && o(e, n);
        this.log("┌ TRACELOG START")
    };
    return w.prototype.fin = function (e, t) {
        this.padding += this.pad, this.log("├─> entering " + e, t)
    }, w.prototype.fout = function (e, t) {
        this.log("│<──┘ generated return value", t), this.padding = this.padding.substring(0, this.padding.length - this.pad.length)
    }, w.prototype.format = function (e, t) {
        return function (e) {
            for (e = "" + e; e.length < 4;) e = "0" + e;
            return e
        }(t) + "> " + this.padding + e
    }, w.prototype.log = function () {
        var e = Array.prototype.slice.call(arguments),
            t = function (e) {
                return e ? "string" == typeof e ? e : e instanceof HTMLElement ? e.outerHTML || "<empty>" : e instanceof Array ? "[" + e.map(t).join(",") + "]" : e.toString() || e.valueOf() || "<unknown>" : "<falsey>"
            };
        e = e.map(t).join(", "), this.messages.push(this.format(e, this.tick++))
    }, w.prototype.toString = function () {
        for (var e = "└───"; e.length <= this.padding.length + this.pad.length;) e += "×   ";
        var t = this.padding;
        return this.padding = "", e = this.format(e, this.tick), this.padding = t, this.messages.join("\n") + "\n" + e
    }, e.DiffDOM = y, e.TraceLogger = w, e
}({});
//# sourceMappingURL=diffDOM.js.map

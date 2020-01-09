/*
 *  /MathJax/jax/output/SVG/jax.js
 *
 *  Copyright (c) 2009-2017 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function(h, d, e, a) {
  var g;
  var f = MathJax.Object.isArray;
  var b = "http://www.w3.org/2000/svg";
  var j = "http://www.w3.org/1999/xlink";
  var c =
    document.getElementsByTagName("base").length === 0
      ? ""
      : String(document.location).replace(/#.*$/, "");
  a.Augment({
    HFUZZ: 2,
    DFUZZ: 2,
    config: {
      styles: {
        ".MathJax_SVG": {
          display: "inline",
          "font-style": "normal",
          "font-weight": "normal",
          "line-height": "normal",
          "font-size": "100%",
          "font-size-adjust": "none",
          "text-indent": 0,
          "text-align": "left",
          "text-transform": "none",
          "letter-spacing": "normal",
          "word-spacing": "normal",
          "word-wrap": "normal",
          "white-space": "nowrap",
          float: "none",
          direction: "ltr",
          "max-width": "none",
          "max-height": "none",
          "min-width": 0,
          "min-height": 0,
          border: 0,
          padding: 0,
          margin: 0
        },
        ".MathJax_SVG_Display": {
          position: "relative",
          display: "block!important",
          "text-indent": 0,
          "max-width": "none",
          "max-height": "none",
          "min-width": 0,
          "min-height": 0,
          width: "100%"
        },
        ".MathJax_SVG *": {
          transition: "none",
          "-webkit-transition": "none",
          "-moz-transition": "none",
          "-ms-transition": "none",
          "-o-transition": "none"
        },
        ".mjx-svg-href": { fill: "blue", stroke: "blue" },
        ".MathJax_SVG_Processing": {
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
          display: "block!important"
        },
        ".MathJax_SVG_Processed": { display: "none!important" },
        ".MathJax_SVG_ExBox": {
          display: "block!important",
          overflow: "hidden",
          width: "1px",
          height: "60ex",
          "min-height": 0,
          "max-height": "none",
          padding: 0,
          border: 0,
          margin: 0
        },
        ".MathJax_SVG_LineBox": { display: "table!important" },
        ".MathJax_SVG_LineBox span": {
          display: "table-cell!important",
          width: "10000em!important",
          "min-width": 0,
          "max-width": "none",
          padding: 0,
          border: 0,
          margin: 0
        },
        "#MathJax_SVG_Tooltip": {
          position: "absolute",
          left: 0,
          top: 0,
          width: "auto",
          height: "auto",
          display: "none"
        }
      }
    },
    hideProcessedMath: true,
    fontNames: [
      "TeX",
      "STIX",
      "STIX-Web",
      "Asana-Math",
      "Gyre-Termes",
      "Gyre-Pagella",
      "Latin-Modern",
      "Neo-Euler"
    ],
    Config: function() {
      this.SUPER(arguments).Config.apply(this, arguments);
      var m = d.config.menuSettings,
        l = this.config,
        k = m.font;
      if (m.scale) {
        l.scale = m.scale;
      }
      if (k && k !== "Auto") {
        k = k.replace(/(Local|Web|Image)$/i, "");
        k = k.replace(/([a-z])([A-Z])/, "$1-$2");
        this.fontInUse = k;
      } else {
        this.fontInUse = l.font || "TeX";
      }
      if (this.fontNames.indexOf(this.fontInUse) < 0) {
        this.fontInUse = "TeX";
      }
      this.fontDir += "/" + this.fontInUse;
      if (!this.require) {
        this.require = [];
      }
      this.require.push(this.fontDir + "/fontdata.js");
      this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
    },
    Startup: function() {
      EVENT = MathJax.Extension.MathEvents.Event;
      TOUCH = MathJax.Extension.MathEvents.Touch;
      HOVER = MathJax.Extension.MathEvents.Hover;
      this.ContextMenu = EVENT.ContextMenu;
      this.Mousedown = EVENT.AltContextMenu;
      this.Mouseover = HOVER.Mouseover;
      this.Mouseout = HOVER.Mouseout;
      this.Mousemove = HOVER.Mousemove;
      this.hiddenDiv = e.Element("div", {
        style: {
          visibility: "hidden",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          height: "1px",
          width: "auto",
          padding: 0,
          border: 0,
          margin: 0,
          textAlign: "left",
          textIndent: 0,
          textTransform: "none",
          lineHeight: "normal",
          letterSpacing: "normal",
          wordSpacing: "normal"
        }
      });
      if (!document.body.firstChild) {
        document.body.appendChild(this.hiddenDiv);
      } else {
        document.body.insertBefore(this.hiddenDiv, document.body.firstChild);
      }
      this.hiddenDiv = e.addElement(this.hiddenDiv, "div", {
        id: "MathJax_SVG_Hidden"
      });
      var k = e.addElement(this.hiddenDiv, "div", { style: { width: "5in" } });
      this.pxPerInch = k.offsetWidth / 5;
      this.hiddenDiv.removeChild(k);
      this.textSVG = this.Element("svg");
      i.GLYPH.defs = this.addElement(
        this.addElement(this.hiddenDiv.parentNode, "svg"),
        "defs",
        { id: "MathJax_SVG_glyphs" }
      );
      this.ExSpan = e.Element(
        "span",
        { style: { position: "absolute", "font-size-adjust": "none" } },
        [["span", { className: "MathJax_SVG_ExBox" }]]
      );
      this.linebreakSpan = e.Element(
        "span",
        { className: "MathJax_SVG_LineBox" },
        [["span"]]
      );
      return h.Styles(this.config.styles, ["InitializeSVG", this]);
    },
    InitializeSVG: function() {
      document.body.appendChild(this.ExSpan);
      document.body.appendChild(this.linebreakSpan);
      this.defaultEx = this.ExSpan.firstChild.offsetHeight / 60;
      this.defaultWidth = this.linebreakSpan.firstChild.offsetWidth;
      document.body.removeChild(this.linebreakSpan);
      document.body.removeChild(this.ExSpan);
    },
    preTranslate: function(q) {
      var p = q.jax[this.id],
        B,
        x = p.length,
        w,
        E,
        u,
        A,
        s,
        C,
        l,
        D,
        k,
        t,
        r = false,
        y,
        o = this.config.linebreaks.automatic,
        v = this.config.linebreaks.width;
      if (o) {
        r = v.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/) != null;
        if (r) {
          v = v.replace(/\s*container\s*/, "");
        } else {
          t = this.defaultWidth;
        }
        if (v === "") {
          v = "100%";
        }
      } else {
        t = 100000;
      }
      for (B = 0; B < x; B++) {
        E = p[B];
        if (!E.parentNode) {
          continue;
        }
        u = E.previousSibling;
        if (
          u &&
          String(u.className).match(
            /^MathJax(_SVG)?(_Display)?( MathJax(_SVG)?_Process(ing|ed))?$/
          )
        ) {
          u.parentNode.removeChild(u);
        }
        if (E.MathJax.preview) {
          E.MathJax.preview.style.display = "none";
        }
        l = E.MathJax.elementJax;
        if (!l) {
          continue;
        }
        l.SVG = {
          display: l.root.Get("display") === "block",
          preview: (l.SVG || {}).preview
        };
        A = s = e.Element("span", {
          style: {
            "font-size": this.config.scale + "%",
            display: "inline-block"
          },
          className: "MathJax_SVG",
          id: l.inputID + "-Frame",
          isMathJax: true,
          jaxID: this.id,
          oncontextmenu: EVENT.Menu,
          onmousedown: EVENT.Mousedown,
          onmouseover: EVENT.Mouseover,
          onmouseout: EVENT.Mouseout,
          onmousemove: EVENT.Mousemove,
          onclick: EVENT.Click,
          ondblclick: EVENT.DblClick,
          onkeydown: EVENT.Keydown,
          tabIndex: d.getTabOrder(l)
        });
        if (d.Browser.noContextMenu) {
          A.ontouchstart = TOUCH.start;
          A.ontouchend = TOUCH.end;
        }
        if (l.SVG.display) {
          s = e.Element("div", { className: "MathJax_SVG_Display" });
          s.appendChild(A);
        }
        s.className += " MathJax_SVG_Processing";
        E.parentNode.insertBefore(s, E);
        E.parentNode.insertBefore(this.ExSpan.cloneNode(true), E);
        s.parentNode.insertBefore(this.linebreakSpan.cloneNode(true), s);
      }
      var z = [];
      for (B = 0; B < x; B++) {
        E = p[B];
        if (!E.parentNode) {
          continue;
        }
        C = E.previousSibling;
        s = C.previousSibling;
        l = E.MathJax.elementJax;
        if (!l) {
          continue;
        }
        D = C.firstChild.offsetHeight / 60;
        y = Math.max(
          0,
          ((s.previousSibling.firstChild.offsetWidth - 2) / this.config.scale) *
            100
        );
        if (D === 0 || D === "NaN") {
          z.push(s);
          l.SVG.isHidden = true;
          D = this.defaultEx;
          y = this.defaultWidth;
        }
        if (r) {
          t = y;
        }
        l.SVG.ex = D;
        l.SVG.em = k = (D / a.TeX.x_height) * 1000;
        l.SVG.cwidth = (y / k) * 1000;
        l.SVG.lineWidth = o ? this.length2em(v, 1, (t / k) * 1000) : a.BIGDIMEN;
      }
      for (B = 0, w = z.length; B < w; B++) {
        this.hiddenDiv.appendChild(z[B]);
        this.addElement(this.hiddenDiv, "br");
      }
      for (B = 0; B < x; B++) {
        E = p[B];
        if (!E.parentNode) {
          continue;
        }
        C = p[B].previousSibling;
        A = C.previousSibling;
        l = p[B].MathJax.elementJax;
        if (!l) {
          continue;
        }
        if (!l.SVG.isHidden) {
          A = A.previousSibling;
        }
        A.parentNode.removeChild(A);
        C.parentNode.removeChild(C);
        if (E.MathJax.preview) {
          E.MathJax.preview.style.display = "";
        }
      }
      q.SVGeqn = q.SVGlast = 0;
      q.SVGi = -1;
      q.SVGchunk = this.config.EqnChunk;
      q.SVGdelay = false;
    },
    Translate: function(l, p) {
      if (!l.parentNode) {
        return;
      }
      if (p.SVGdelay) {
        p.SVGdelay = false;
        d.RestartAfter(MathJax.Callback.Delay(this.config.EqnChunkDelay));
      }
      var k = l.MathJax.elementJax,
        o = k.root,
        r,
        m,
        q = a.config.useFontCache && !a.config.useGlobalCache;
      if (k.SVG.isHidden) {
        m = document.getElementById(k.inputID + "-Frame");
        r = k.SVG.display ? m.parentElement : m;
      } else {
        r = l.previousSibling;
        m = k.SVG.display ? (r || {}).firstChild || r : r;
      }
      if (!r) {
        return;
      }
      this.em = g.mbase.prototype.em = k.SVG.em;
      this.ex = k.SVG.ex;
      this.linebreakWidth = k.SVG.lineWidth;
      this.cwidth = k.SVG.cwidth;
      this.mathDiv = r;
      m.appendChild(this.textSVG);
      if (q) {
        a.resetGlyphs();
      }
      this.initSVG(o, m);
      o.setTeXclass();
      try {
        o.toSVG(m, r);
      } catch (n) {
        if (n.restart) {
          while (m.firstChild) {
            m.removeChild(m.firstChild);
          }
        }
        if (q) {
          i.GLYPH.n--;
        }
        throw n;
      }
      m.removeChild(this.textSVG);
      if (k.SVG.isHidden) {
        l.parentNode.insertBefore(r, l);
      }
      r.className = r.className.split(/ /)[0];
      if (this.hideProcessedMath) {
        r.className += " MathJax_SVG_Processed";
        if (l.MathJax.preview) {
          k.SVG.preview = l.MathJax.preview;
          delete l.MathJax.preview;
        }
        p.SVGeqn += p.i - p.SVGi;
        p.SVGi = p.i;
        if (p.SVGeqn >= p.SVGlast + p.SVGchunk) {
          this.postTranslate(p, true);
          p.SVGchunk = Math.floor(p.SVGchunk * this.config.EqnChunkFactor);
          p.SVGdelay = true;
        }
      }
    },
    postTranslate: function(r, o) {
      var l = r.jax[this.id];
      if (!this.hideProcessedMath) {
        return;
      }
      for (var p = r.SVGlast, k = r.SVGeqn; p < k; p++) {
        var n = l[p];
        if (n && n.MathJax.elementJax) {
          n.previousSibling.className = n.previousSibling.className.split(
            / /
          )[0];
          var q = n.MathJax.elementJax.SVG;
          if (q.preview) {
            q.preview.innerHTML = "";
            q.preview.style.display = "none";
            n.MathJax.preview = q.preview;
            delete q.preview;
          }
        }
      }
      r.SVGlast = r.SVGeqn;
    },
    resetGlyphs: function(l) {
      if (this.config.useFontCache) {
        var k = i.GLYPH;
        if (this.config.useGlobalCache) {
          k.defs = document.getElementById("MathJax_SVG_glyphs");
          k.defs.innerHTML = "";
        } else {
          k.defs = this.Element("defs");
          k.n++;
        }
        k.glyphs = {};
        if (l) {
          k.n = 0;
        }
      }
    },
    hashCheck: function(k) {
      if (k && k.nodeName.toLowerCase() === "g") {
        do {
          k = k.parentNode;
        } while (k && k.firstChild.nodeName !== "svg");
      }
      return k;
    },
    getJaxFromMath: function(k) {
      if (k.parentNode.className.match(/MathJax_SVG_Display/)) {
        k = k.parentNode;
      }
      do {
        k = k.nextSibling;
      } while (k && k.nodeName.toLowerCase() !== "script");
      return d.getJaxFor(k);
    },
    getHoverSpan: function(k, l) {
      l.style.position = "relative";
      return l.firstChild;
    },
    getHoverBBox: function(k, l, m) {
      var n = EVENT.getBBox(l.parentNode);
      n.h += 2;
      n.d -= 2;
      return n;
    },
    Zoom: function(l, u, t, k, r) {
      u.className = "MathJax_SVG";
      var w = u.appendChild(this.ExSpan.cloneNode(true));
      var q = w.firstChild.offsetHeight / 60;
      this.em = g.mbase.prototype.em = (q / a.TeX.x_height) * 1000;
      this.ex = q;
      this.linebreakWidth = l.SVG.lineWidth;
      this.cwidth = l.SVG.cwidth;
      w.parentNode.removeChild(w);
      u.appendChild(this.textSVG);
      this.mathDIV = u;
      this.zoomScale = parseInt(d.config.menuSettings.zscale) / 100;
      var p = l.root.data[0].SVGdata.tw;
      if (p && p < this.cwidth) {
        this.cwidth = p;
      }
      this.idPostfix = "-zoom";
      l.root.toSVG(u, u);
      this.idPostfix = "";
      this.zoomScale = 1;
      u.removeChild(this.textSVG);
      var o = u.getElementsByTagName("svg")[0].style;
      o.marginTop = o.marginRight = o.marginLeft = 0;
      if (o.marginBottom.charAt(0) === "-") {
        u.style.marginBottom = o.marginBottom.substr(1);
      }
      if (this.operaZoomRefresh) {
        setTimeout(function() {
          u.firstChild.style.border = "1px solid transparent";
        }, 1);
      }
      if (u.offsetWidth < u.firstChild.offsetWidth) {
        u.style.minWidth = u.firstChild.offsetWidth + "px";
        t.style.minWidth = t.firstChild.offsetWidth + "px";
      }
      u.style.position = t.style.position = "absolute";
      var s = u.offsetWidth,
        n = u.offsetHeight,
        v = t.offsetHeight,
        m = t.offsetWidth;
      u.style.position = t.style.position = "";
      return { Y: -EVENT.getBBox(u).h, mW: m, mH: v, zW: s, zH: n };
    },
    initSVG: function(l, k) {},
    Remove: function(k) {
      var l = document.getElementById(k.inputID + "-Frame");
      if (l) {
        if (k.SVG.display) {
          l = l.parentNode;
        }
        l.parentNode.removeChild(l);
      }
      delete k.SVG;
    },
    Em: function(k) {
      if (Math.abs(k) < 0.0006) {
        return "0";
      }
      return k.toFixed(3).replace(/\.?0+$/, "") + "em";
    },
    Ex: function(k) {
      k = k / this.TeX.x_height;
      if (Math.abs(k) < 0.0006) {
        return "0";
      }
      return k.toFixed(3).replace(/\.?0+$/, "") + "ex";
    },
    Percent: function(k) {
      return (100 * k).toFixed(1).replace(/\.?0+$/, "") + "%";
    },
    Fixed: function(k, l) {
      if (Math.abs(k) < 0.0006) {
        return "0";
      }
      return k.toFixed(l || 3).replace(/\.?0+$/, "");
    },
    length2em: function(q, l, o) {
      if (typeof q !== "string") {
        q = q.toString();
      }
      if (q === "") {
        return "";
      }
      if (q === g.SIZE.NORMAL) {
        return 1000;
      }
      if (q === g.SIZE.BIG) {
        return 2000;
      }
      if (q === g.SIZE.SMALL) {
        return 710;
      }
      if (q === "infinity") {
        return a.BIGDIMEN;
      }
      if (q.match(/mathspace$/)) {
        return 1000 * a.MATHSPACE[q];
      }
      var r = (this.zoomScale || 1) / a.em;
      var n = q.match(
        /^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/
      );
      var k = parseFloat(n[1] || "1") * 1000,
        p = n[2];
      if (o == null) {
        o = 1000;
      }
      if (l == null) {
        l = 1;
      }
      if (p === "em") {
        return k;
      }
      if (p === "ex") {
        return (k * a.TeX.x_height) / 1000;
      }
      if (p === "%") {
        return ((k / 100) * o) / 1000;
      }
      if (p === "px") {
        return k * r;
      }
      if (p === "pt") {
        return k / 10;
      }
      if (p === "pc") {
        return k * 1.2;
      }
      if (p === "in") {
        return k * this.pxPerInch * r;
      }
      if (p === "cm") {
        return (k * this.pxPerInch * r) / 2.54;
      }
      if (p === "mm") {
        return (k * this.pxPerInch * r) / 25.4;
      }
      if (p === "mu") {
        return (k / 18) * l;
      }
      return (k * o) / 1000;
    },
    thickness2em: function(l, k) {
      var m = a.TeX.rule_thickness;
      if (l === g.LINETHICKNESS.MEDIUM) {
        return m;
      }
      if (l === g.LINETHICKNESS.THIN) {
        return 0.67 * m;
      }
      if (l === g.LINETHICKNESS.THICK) {
        return 1.67 * m;
      }
      return this.length2em(l, k, m);
    },
    getPadding: function(l) {
      var n = { top: 0, right: 0, bottom: 0, left: 0 },
        k = false;
      for (var o in n) {
        if (n.hasOwnProperty(o)) {
          var m = l["padding" + o.charAt(0).toUpperCase() + o.substr(1)];
          if (m) {
            n[o] = this.length2em(m);
            k = true;
          }
        }
      }
      return k ? n : false;
    },
    getBorders: function(o) {
      var m = { top: 0, right: 0, bottom: 0, left: 0 },
        l = false;
      for (var p in m) {
        if (m.hasOwnProperty(p)) {
          var k = "border" + p.charAt(0).toUpperCase() + p.substr(1);
          var n = o[k + "Style"];
          if (n && n !== "none") {
            l = true;
            m[p] = this.length2em(o[k + "Width"]);
            m[p + "Style"] = o[k + "Style"];
            m[p + "Color"] = o[k + "Color"];
            if (m[p + "Color"] === "initial") {
              m[p + "Color"] = "";
            }
          } else {
            delete m[p];
          }
        }
      }
      return l ? m : false;
    },
    Element: function(k, l) {
      var m = typeof k === "string" ? document.createElementNS(b, k) : k;
      m.isMathJax = true;
      if (l) {
        for (var n in l) {
          if (l.hasOwnProperty(n)) {
            m.setAttribute(n, l[n].toString());
          }
        }
      }
      return m;
    },
    addElement: function(l, k, m) {
      return l.appendChild(this.Element(k, m));
    },
    TextNode: e.TextNode,
    addText: e.addText,
    ucMatch: e.ucMatch,
    HandleVariant: function(s, r, B) {
      var v = i.G();
      var o, x, z, p, A, t, q, l, y, k;
      if (!s) {
        s = this.FONTDATA.VARIANT[g.VARIANT.NORMAL];
      }
      if (s.forceFamily) {
        B = i.TEXT(r, B, s.font);
        if (s.h != null) {
          B.h = s.h;
        }
        if (s.d != null) {
          B.d = s.d;
        }
        v.Add(B);
        B = "";
      }
      A = s;
      for (t = 0, q = B.length; t < q; t++) {
        s = A;
        o = B.charCodeAt(t);
        z = B.charAt(t);
        if (o >= 55296 && o < 56319) {
          t++;
          o = ((o - 55296) << 10) + (B.charCodeAt(t) - 56320) + 65536;
          if (this.FONTDATA.RemapPlane1) {
            var w = this.FONTDATA.RemapPlane1(o, s);
            o = w.n;
            s = w.variant;
          }
        } else {
          k = this.FONTDATA.RANGES;
          for (l = 0, y = k.length; l < y; l++) {
            if (k[l].name === "alpha" && s.noLowerCase) {
              continue;
            }
            x = s["offset" + k[l].offset];
            if (x && o >= k[l].low && o <= k[l].high) {
              if (k[l].remap && k[l].remap[o]) {
                o = x + k[l].remap[o];
              } else {
                o = o - k[l].low + x;
                if (k[l].add) {
                  o += k[l].add;
                }
              }
              if (s["variant" + k[l].offset]) {
                s = this.FONTDATA.VARIANT[s["variant" + k[l].offset]];
              }
              break;
            }
          }
        }
        if (s.remap && s.remap[o]) {
          o = s.remap[o];
          if (s.remap.variant) {
            s = this.FONTDATA.VARIANT[s.remap.variant];
          }
        } else {
          if (this.FONTDATA.REMAP[o] && !s.noRemap) {
            o = this.FONTDATA.REMAP[o];
          }
        }
        if (f(o)) {
          s = this.FONTDATA.VARIANT[o[1]];
          o = o[0];
        }
        if (typeof o === "string") {
          B = o + B.substr(t + 1);
          q = B.length;
          t = -1;
          continue;
        }
        p = this.lookupChar(s, o);
        z = p[o];
        if (z) {
          if ((z[5] && z[5].space) || (z[5] === "" && z[0] + z[1] === 0)) {
            v.w += z[2];
          } else {
            z = [r, p.id + "-" + o.toString(16).toUpperCase()].concat(z);
            v.Add(i.GLYPH.apply(i, z), v.w, 0);
          }
        } else {
          if (this.FONTDATA.DELIMITERS[o]) {
            z = this.createDelimiter(o, 0, 1, p);
            v.Add(z, v.w, this.FONTDATA.DELIMITERS[o].dir === "V" ? z.d : 0);
          } else {
            if (o <= 65535) {
              z = String.fromCharCode(o);
            } else {
              x = o - 65536;
              z =
                String.fromCharCode((x >> 10) + 55296) +
                String.fromCharCode((x & 1023) + 56320);
            }
            var u = i.TEXT((r * 100) / a.config.scale, z, {
              "font-family": s.defaultFamily || a.config.undefinedFamily,
              "font-style": s.italic ? "italic" : "",
              "font-weight": s.bold ? "bold" : ""
            });
            if (s.h != null) {
              u.h = s.h;
            }
            if (s.d != null) {
              u.d = s.d;
            }
            z = i.G();
            z.Add(u);
            v.Add(z, v.w, 0);
            d.signal.Post(["SVG Jax - unknown char", o, s]);
          }
        }
      }
      if (B.length == 1 && p.skew && p.skew[o]) {
        v.skew = p.skew[o] * 1000;
      }
      if (
        v.element.childNodes.length === 1 &&
        !v.element.firstChild.getAttribute("x")
      ) {
        v.element = v.element.firstChild;
        v.removeable = false;
        v.scale = r;
      }
      return v;
    },
    lookupChar: function(p, s) {
      var o, k;
      if (!p.FONTS) {
        var r = this.FONTDATA.FONTS;
        var q = p.fonts || this.FONTDATA.VARIANT.normal.fonts;
        if (!(q instanceof Array)) {
          q = [q];
        }
        if (p.fonts != q) {
          p.fonts = q;
        }
        p.FONTS = [];
        for (o = 0, k = q.length; o < k; o++) {
          if (r[q[o]]) {
            p.FONTS.push(r[q[o]]);
          }
        }
      }
      for (o = 0, k = p.FONTS.length; o < k; o++) {
        var l = p.FONTS[o];
        if (typeof l === "string") {
          delete p.FONTS;
          this.loadFont(l);
        }
        if (l[s]) {
          return l;
        } else {
          this.findBlock(l, s);
        }
      }
      return { id: "unknown" };
    },
    findBlock: function(l, q) {
      if (l.Ranges) {
        for (var p = 0, k = l.Ranges.length; p < k; p++) {
          if (q < l.Ranges[p][0]) {
            return;
          }
          if (q <= l.Ranges[p][1]) {
            var o = l.Ranges[p][2];
            for (var n = l.Ranges.length - 1; n >= 0; n--) {
              if (l.Ranges[n][2] == o) {
                l.Ranges.splice(n, 1);
              }
            }
            this.loadFont(l.directory + "/" + o + ".js");
          }
        }
      }
    },
    loadFont: function(k) {
      d.RestartAfter(h.Require(this.fontDir + "/" + k));
    },
    createDelimiter: function(k, n, q, o) {
      if (!q) {
        q = 1;
      }
      var s = i.G();
      if (!k) {
        s.Clean();
        delete s.element;
        s.w = s.r = this.TeX.nulldelimiterspace * q;
        return s;
      }
      if (!(n instanceof Array)) {
        n = [n, n];
      }
      var t = n[1];
      n = n[0];
      var l = { alias: k };
      while (l.alias) {
        k = l.alias;
        l = this.FONTDATA.DELIMITERS[k];
        if (!l) {
          l = { HW: [0, this.FONTDATA.VARIANT[g.VARIANT.NORMAL]] };
        }
      }
      if (l.load) {
        d.RestartAfter(h.Require(this.fontDir + "/fontdata-" + l.load + ".js"));
      }
      for (var r = 0, p = l.HW.length; r < p; r++) {
        if (
          l.HW[r][0] * q >= n - 10 - a.config.blacker ||
          (r == p - 1 && !l.stretch)
        ) {
          if (l.HW[r][2]) {
            q *= l.HW[r][2];
          }
          if (l.HW[r][3]) {
            k = l.HW[r][3];
          }
          return this.createChar(q, [k, l.HW[r][1]], o).With({
            stretched: true
          });
        }
      }
      if (l.stretch) {
        this["extendDelimiter" + l.dir](s, t, l.stretch, q, o);
      }
      return s;
    },
    createChar: function(s, q, n) {
      var r = "",
        p = { fonts: [q[1]], noRemap: true };
      if (n && n === g.VARIANT.BOLD) {
        p.fonts = [q[1] + "-bold", q[1]];
      }
      if (typeof q[1] !== "string") {
        p = q[1];
      }
      if (q[0] instanceof Array) {
        for (var o = 0, k = q[0].length; o < k; o++) {
          r += String.fromCharCode(q[0][o]);
        }
      } else {
        r = String.fromCharCode(q[0]);
      }
      if (q[4]) {
        s = s * q[4];
      }
      var l = this.HandleVariant(p, s, r);
      if (q[2]) {
        l.x = q[2] * 1000;
      }
      if (q[3]) {
        l.y = q[3] * 1000;
      }
      if (q[5]) {
        l.h += q[5] * 1000;
      }
      if (q[6]) {
        l.d += q[6] * 1000;
      }
      return l;
    },
    extendDelimiterV: function(r, A, m, o, n) {
      var x = this.createChar(o, m.top || m.ext, n);
      var u = this.createChar(o, m.bot || m.ext, n);
      var q = x.h + x.d + u.h + u.d;
      var w = -x.h;
      r.Add(x, 0, w);
      w -= x.d;
      if (m.mid) {
        var z = this.createChar(o, m.mid, n);
        q += z.h + z.d;
      }
      if (m.min && A < q * m.min) {
        A = q * m.min;
      }
      if (A > q) {
        var l = this.createChar(o, m.ext, n);
        var p = m.mid ? 2 : 1,
          v = (A - q) / p,
          B = (v + 100) / (l.h + l.d);
        while (p-- > 0) {
          var t = a.Element("g", {
            transform:
              "translate(" +
              l.y +
              "," +
              (w - B * l.h + 50 + l.y) +
              ") scale(1," +
              B +
              ")"
          });
          t.appendChild(l.element.cloneNode(false));
          r.element.appendChild(t);
          w -= v;
          if (m.mid && p) {
            r.Add(z, 0, w - z.h);
            w -= z.h + z.d;
          }
        }
      } else {
        if (m.mid) {
          w += (q - A) / 2;
          r.Add(z, 0, w - z.h);
          w += -(z.h + z.d) + (q - A) / 2;
        } else {
          w += q - A;
        }
      }
      r.Add(u, 0, w - u.h);
      r.Clean();
      r.scale = o;
      r.isMultiChar = true;
    },
    extendDelimiterH: function(t, o, m, q, n) {
      var p = this.createChar(q, m.left || m.rep, n);
      var C = this.createChar(q, m.right || m.rep, n);
      t.Add(p, -p.l, 0);
      var B = p.r - p.l + (C.r - C.l),
        z = p.r - p.l;
      if (m.mid) {
        var A = this.createChar(q, m.mid, n);
        B += A.w;
      }
      if (m.min && o < B * m.min) {
        o = B * m.min;
      }
      if (o > B) {
        var y = this.createChar(q, m.rep, n),
          l = m.fuzz || 0;
        var r = m.mid ? 2 : 1,
          v = (o - B) / r,
          D = (v + l) / (y.r - y.l);
        while (r-- > 0) {
          var u = a.Element("g", {
            transform:
              "translate(" +
              (z - l / 2 - D * y.l + y.x) +
              "," +
              y.y +
              ") scale(" +
              D +
              ",1)"
          });
          u.appendChild(y.element.cloneNode(false));
          t.element.appendChild(u);
          z += v;
          if (m.mid && r) {
            t.Add(A, z, 0);
            z += A.w;
          }
        }
      } else {
        if (m.mid) {
          z -= (B - o) / 2;
          t.Add(A, z, 0);
          z += A.w - (B - o) / 2;
        } else {
          z -= B - o;
        }
      }
      t.Add(C, z - C.l, 0);
      t.Clean();
      t.scale = q;
      t.isMultiChar = true;
    },
    MATHSPACE: {
      veryverythinmathspace: 1 / 18,
      verythinmathspace: 2 / 18,
      thinmathspace: 3 / 18,
      mediummathspace: 4 / 18,
      thickmathspace: 5 / 18,
      verythickmathspace: 6 / 18,
      veryverythickmathspace: 7 / 18,
      negativeveryverythinmathspace: -1 / 18,
      negativeverythinmathspace: -2 / 18,
      negativethinmathspace: -3 / 18,
      negativemediummathspace: -4 / 18,
      negativethickmathspace: -5 / 18,
      negativeverythickmathspace: -6 / 18,
      negativeveryverythickmathspace: -7 / 18
    },
    TeX: {
      x_height: 430.554,
      quad: 1000,
      num1: 676.508,
      num2: 393.732,
      num3: 443.73,
      denom1: 685.951,
      denom2: 344.841,
      sup1: 412.892,
      sup2: 362.892,
      sup3: 288.888,
      sub1: 150,
      sub2: 247.217,
      sup_drop: 386.108,
      sub_drop: 50,
      delim1: 2390,
      delim2: 1000,
      axis_height: 250,
      rule_thickness: 60,
      big_op_spacing1: 111.111,
      big_op_spacing2: 166.666,
      big_op_spacing3: 200,
      big_op_spacing4: 600,
      big_op_spacing5: 100,
      scriptspace: 100,
      nulldelimiterspace: 120,
      delimiterfactor: 901,
      delimitershortfall: 300,
      min_rule_thickness: 1.25,
      min_root_space: 1.5
    },
    BIGDIMEN: 10000000,
    NBSP: "\u00A0"
  });
  var i = (a.BBOX = MathJax.Object.Subclass({
    type: "g",
    removeable: true,
    Init: function(k) {
      this.h = this.d = -a.BIGDIMEN;
      this.H = this.D = 0;
      this.w = this.r = 0;
      this.l = a.BIGDIMEN;
      this.x = this.y = 0;
      this.scale = 1;
      this.n = 0;
      if (this.type) {
        this.element = a.Element(this.type, k);
      }
    },
    With: function(k) {
      return d.Insert(this, k);
    },
    Add: function(n, t, s, k, r) {
      if (t) {
        n.x += t;
      }
      if (s) {
        n.y += s;
      }
      if (n.element) {
        if (n.removeable && n.element.childNodes.length === 1 && n.n === 1) {
          var l = n.element.firstChild,
            p = l.nodeName.toLowerCase();
          if (p === "use" || p === "rect") {
            n.element = l;
            n.scale = n.childScale;
            var q = n.childX,
              o = n.childY;
            n.x += q;
            n.y += o;
            n.h -= o;
            n.d += o;
            n.H -= o;
            n.D += o;
            n.w -= q;
            n.r -= q;
            n.l += q;
            n.removeable = false;
            l.setAttribute("x", Math.floor(n.x / n.scale));
            l.setAttribute("y", Math.floor(n.y / n.scale));
          }
        }
        if (Math.abs(n.x) < 1 && Math.abs(n.y) < 1) {
          n.remove = n.removeable;
        } else {
          p = n.element.nodeName.toLowerCase();
          if (p === "g") {
            if (!n.element.firstChild) {
              n.remove = n.removeable;
            } else {
              n.element.setAttribute(
                "transform",
                "translate(" + Math.floor(n.x) + "," + Math.floor(n.y) + ")"
              );
            }
          } else {
            if (p === "line" || p === "polygon" || p === "path" || p === "a") {
              var m = n.element.getAttribute("transform") || "";
              if (m) {
                m = " " + m;
              }
              m =
                "translate(" +
                Math.floor(n.x) +
                "," +
                Math.floor(n.y) +
                ")" +
                m;
              n.element.setAttribute("transform", m);
            } else {
              n.element.setAttribute("x", Math.floor(n.x / n.scale));
              n.element.setAttribute("y", Math.floor(n.y / n.scale));
            }
          }
        }
        if (n.remove) {
          this.n += n.n;
          while (n.element.firstChild) {
            if (r && this.element.firstChild) {
              this.element.insertBefore(
                n.element.firstChild,
                this.element.firstChild
              );
            } else {
              this.element.appendChild(n.element.firstChild);
            }
          }
        } else {
          if (r) {
            this.element.insertBefore(n.element, this.element.firstChild);
          } else {
            this.element.appendChild(n.element);
          }
        }
        delete n.element;
      }
      if (n.hasIndent) {
        this.hasIndent = n.hasIndent;
      }
      if (n.tw != null) {
        this.tw = n.tw;
      }
      if (n.d - n.y > this.d) {
        this.d = n.d - n.y;
        if (this.d > this.D) {
          this.D = this.d;
        }
      }
      if (n.y + n.h > this.h) {
        this.h = n.y + n.h;
        if (this.h > this.H) {
          this.H = this.h;
        }
      }
      if (n.D - n.y > this.D) {
        this.D = n.D - n.y;
      }
      if (n.y + n.H > this.H) {
        this.H = n.y + n.H;
      }
      if (n.x + n.l < this.l) {
        this.l = n.x + n.l;
      }
      if (n.x + n.r > this.r) {
        this.r = n.x + n.r;
      }
      if (k || n.x + n.w + (n.X || 0) > this.w) {
        this.w = n.x + n.w + (n.X || 0);
      }
      this.childScale = n.scale;
      this.childX = n.x;
      this.childY = n.y;
      this.n++;
      return n;
    },
    Align: function(o, p, n, m, l) {
      n =
        { left: n, center: (this.w - o.w) / 2, right: this.w - o.w - n }[p] ||
        0;
      var k = this.w;
      this.Add(o, n + (l || 0), m);
      this.w = k;
    },
    Clean: function() {
      if (this.h === -a.BIGDIMEN) {
        this.h = this.d = this.l = 0;
      }
      return this;
    }
  }));
  i.ROW = i.Subclass({
    Init: function() {
      this.SUPER(arguments).Init.call(this);
      this.svg = [];
      this.sh = this.sd = 0;
    },
    Check: function(l) {
      var k = l.toSVG();
      this.svg.push(k);
      if (l.SVGcanStretch("Vertical")) {
        k.mml = l;
      }
      if (k.h > this.sh) {
        this.sh = k.h;
      }
      if (k.d > this.sd) {
        this.sd = k.d;
      }
    },
    Stretch: function() {
      for (var o = 0, k = this.svg.length; o < k; o++) {
        var l = this.svg[o],
          n = l.mml;
        if (n) {
          if (
            n.forceStretch ||
            n.SVGdata.h !== this.sh ||
            n.SVGdata.d !== this.sd
          ) {
            l = n.SVGstretchV(this.sh, this.sd);
          }
          n.SVGdata.HW = this.sh;
          n.SVGdata.D = this.sd;
        }
        if (l.ic) {
          this.ic = l.ic;
        } else {
          delete this.ic;
        }
        this.Add(l, this.w, 0, true);
      }
      delete this.svg;
    }
  });
  i.RECT = i.Subclass({
    type: "rect",
    removeable: false,
    Init: function(l, n, k, m) {
      if (m == null) {
        m = { stroke: "none" };
      }
      m.width = Math.floor(k);
      m.height = Math.floor(l + n);
      this.SUPER(arguments).Init.call(this, m);
      this.w = this.r = k;
      this.h = this.H = l + n;
      this.d = this.D = this.l = 0;
      this.y = -n;
    }
  });
  i.FRAME = i.Subclass({
    type: "rect",
    removeable: false,
    Init: function(n, q, k, m, p, l, o) {
      if (o == null) {
        o = {};
      }
      o.fill = "none";
      o["stroke-width"] = a.Fixed(m, 2);
      o.width = Math.floor(k - m);
      o.height = Math.floor(n + q - m);
      o.transform =
        "translate(" + Math.floor(m / 2) + "," + Math.floor(-q + m / 2) + ")";
      if (p === "dashed") {
        o["stroke-dasharray"] = [
          Math.floor(6 * a.em),
          Math.floor(6 * a.em)
        ].join(" ");
      }
      this.SUPER(arguments).Init.call(this, o);
      this.w = this.r = k;
      this.h = this.H = n;
      this.d = this.D = q;
      this.l = 0;
    }
  });
  i.HLINE = i.Subclass({
    type: "line",
    removeable: false,
    Init: function(l, p, r, o, q) {
      if (q == null) {
        q = { "stroke-linecap": "square" };
      }
      if (o && o !== "") {
        q.stroke = o;
      }
      q["stroke-width"] = a.Fixed(p, 2);
      q.x1 = q.y1 = q.y2 = Math.floor(p / 2);
      q.x2 = Math.floor(l - p / 2);
      if (r === "dashed") {
        var s = Math.floor(Math.max(0, l - p) / (6 * p)),
          k = Math.floor(Math.max(0, l - p) / (2 * s + 1));
        q["stroke-dasharray"] = k + " " + k;
      }
      if (r === "dotted") {
        q["stroke-dasharray"] = [1, Math.max(150, Math.floor(2 * p))].join(" ");
        q["stroke-linecap"] = "round";
      }
      this.SUPER(arguments).Init.call(this, q);
      this.w = this.r = l;
      this.l = 0;
      this.h = this.H = p;
      this.d = this.D = 0;
    }
  });
  i.VLINE = i.Subclass({
    type: "line",
    removeable: false,
    Init: function(p, o, r, l, q) {
      if (q == null) {
        q = { "stroke-linecap": "square" };
      }
      if (l && l !== "") {
        q.stroke = l;
      }
      q["stroke-width"] = a.Fixed(o, 2);
      q.x1 = q.x2 = q.y1 = Math.floor(o / 2);
      q.y2 = Math.floor(p - o / 2);
      if (r === "dashed") {
        var s = Math.floor(Math.max(0, p - o) / (6 * o)),
          k = Math.floor(Math.max(0, p - o) / (2 * s + 1));
        q["stroke-dasharray"] = k + " " + k;
      }
      if (r === "dotted") {
        q["stroke-dasharray"] = [1, Math.max(150, Math.floor(2 * o))].join(" ");
        q["stroke-linecap"] = "round";
      }
      this.SUPER(arguments).Init.call(this, q);
      this.w = this.r = o;
      this.l = 0;
      this.h = this.H = p;
      this.d = this.D = 0;
    }
  });
  i.TEXT = i.Subclass({
    type: "text",
    removeable: false,
    Init: function(n, m, k) {
      if (!k) {
        k = {};
      }
      k.stroke = "none";
      if (k["font-style"] === "") {
        delete k["font-style"];
      }
      if (k["font-weight"] === "") {
        delete k["font-weight"];
      }
      this.SUPER(arguments).Init.call(this, k);
      a.addText(this.element, m);
      a.textSVG.appendChild(this.element);
      var l = this.element.getBBox();
      a.textSVG.removeChild(this.element);
      n *= 1000 / a.em;
      this.element.setAttribute(
        "transform",
        "scale(" + a.Fixed(n) + ") matrix(1 0 0 -1 0 0)"
      );
      this.w = this.r = l.width * n;
      this.l = 0;
      this.h = this.H = -l.y * n;
      this.d = this.D = (l.height + l.y) * n;
    }
  });
  i.G = i;
  i.NULL = i.Subclass({
    Init: function() {
      this.SUPER(arguments).Init.apply(this, arguments);
      this.Clean();
    }
  });
  i.GLYPH = i.Subclass(
    {
      type: "path",
      removeable: false,
      Init: function(u, n, y, z, A, v, m, o) {
        var q,
          B = a.config.blacker,
          x = i.GLYPH;
        var k = a.config.useFontCache;
        var s = u === 1 ? null : "scale(" + a.Fixed(u) + ")";
        if (k && !a.config.useGlobalCache) {
          n = "E" + x.n + "-" + n;
        }
        if (!k || !x.glyphs[n]) {
          q = { "stroke-width": B };
          if (k) {
            q.id = n;
          } else {
            if (s) {
              q.transform = s;
            }
          }
          q.d = o ? "M" + o + "Z" : "";
          this.SUPER(arguments).Init.call(this, q);
          if (k) {
            x.defs.appendChild(this.element);
            x.glyphs[n] = true;
          }
        }
        if (k) {
          q = {};
          if (s) {
            q.transform = s;
          }
          this.element = a.Element("use", q);
          this.element.setAttributeNS(j, "href", c + "#" + n);
        }
        this.h = (y + B) * u;
        this.d = (z + B) * u;
        this.w = (A + B / 2) * u;
        this.l = (v + B / 2) * u;
        this.r = (m + B / 2) * u;
        this.H = Math.max(0, this.h);
        this.D = Math.max(0, this.d);
        this.x = this.y = 0;
        this.scale = u;
      }
    },
    { glyphs: {}, defs: null, n: 0 }
  );
  d.Register.StartupHook("mml Jax Ready", function() {
    g = MathJax.ElementJax.mml;
    g.mbase.Augment(
      {
        SVG: i,
        toSVG: function() {
          this.SVGgetStyles();
          var o = this.SVGgetVariant();
          var l = this.SVG();
          this.SVGgetScale(l);
          this.SVGhandleSpace(l);
          for (var n = 0, k = this.data.length; n < k; n++) {
            if (this.data[n]) {
              var q = l.Add(this.data[n].toSVG(o, l.scale), l.w, 0, true);
              if (q.skew) {
                l.skew = q.skew;
              }
            }
          }
          l.Clean();
          var p = this.data.join("");
          if (l.skew && p.length !== 1) {
            delete l.skew;
          }
          if (l.r > l.w && p.length === 1 && !o.noIC) {
            l.ic = l.r - l.w;
            l.w = l.r;
          }
          this.SVGhandleColor(l);
          this.SVGsaveData(l);
          return l;
        },
        SVGchildSVG: function(k) {
          return this.data[k] ? this.data[k].toSVG() : i();
        },
        SVGdataStretched: function(l, k, m) {
          this.SVGdata = { HW: k, D: m };
          if (!this.data[l]) {
            return i();
          }
          if (m != null) {
            return this.data[l].SVGstretchV(k, m);
          }
          if (k != null) {
            return this.data[l].SVGstretchH(k);
          }
          return this.data[l].toSVG();
        },
        SVGsaveData: function(k) {
          if (!this.SVGdata) {
            this.SVGdata = {};
          }
          (this.SVGdata.w = k.w), (this.SVGdata.x = k.x);
          (this.SVGdata.h = k.h), (this.SVGdata.d = k.d);
          if (k.y) {
            this.SVGdata.h += k.y;
            this.SVGdata.d -= k.y;
          }
          if (k.X != null) {
            this.SVGdata.X = k.X;
          }
          if (k.tw != null) {
            this.SVGdata.tw = k.tw;
          }
          if (k.skew) {
            this.SVGdata.skew = k.skew;
          }
          if (k.ic) {
            this.SVGdata.ic = k.ic;
          }
          if (this["class"]) {
            k.removeable = false;
            a.Element(k.element, { class: this["class"] });
          }
          if (this.id) {
            k.removeable = false;
            a.Element(k.element, { id: this.id });
          }
          if (this.href) {
            this.SVGaddHref(k);
          }
          if (a.config.addMMLclasses) {
            this.SVGaddClass(k.element, "mjx-svg-" + this.type);
            k.removeable = false;
          }
          var l = this.style;
          if (l && k.element) {
            k.element.style.cssText = l;
            if (k.element.style.fontSize) {
              k.element.style.fontSize = "";
            }
            k.element.style.border = k.element.style.padding = "";
            if (k.removeable) {
              k.removeable = k.element.style.cssText === "";
            }
          }
          this.SVGaddAttributes(k);
        },
        SVGaddClass: function(m, k) {
          var l = m.getAttribute("class");
          m.setAttribute("class", (l ? l + " " : "") + k);
        },
        SVGaddAttributes: function(l) {
          if (this.attrNames) {
            var s = this.attrNames,
              o = g.nocopyAttributes,
              r = d.config.ignoreMMLattributes;
            var p =
              this.type === "mstyle"
                ? g.math.prototype.defaults
                : this.defaults;
            for (var n = 0, k = s.length; n < k; n++) {
              var q = s[n];
              if (
                r[q] == false ||
                (!o[q] &&
                  !r[q] &&
                  p[q] == null &&
                  typeof l.element[q] === "undefined")
              ) {
                l.element.setAttribute(q, this.attr[q]);
                l.removeable = false;
              }
            }
          }
        },
        SVGaddHref: function(l) {
          var k = a.Element("a", { class: "mjx-svg-href" });
          k.setAttributeNS(j, "href", this.href);
          k.onclick = this.SVGlink;
          a.addElement(k, "rect", {
            width: l.w,
            height: l.h + l.d,
            y: -l.d,
            fill: "none",
            stroke: "none",
            "pointer-events": "all"
          });
          if (l.type === "svg") {
            var m = l.element.firstChild;
            while (m.firstChild) {
              k.appendChild(m.firstChild);
            }
            m.appendChild(k);
          } else {
            k.appendChild(l.element);
            l.element = k;
          }
          l.removeable = false;
        },
        SVGlink: function() {
          var k = this.href.animVal;
          if (k.charAt(0) === "#") {
            var l = a.hashCheck(document.getElementById(k.substr(1)));
            if (l && l.scrollIntoView) {
              setTimeout(function() {
                l.parentNode.scrollIntoView(true);
              }, 1);
            }
          }
          document.location = k;
        },
        SVGgetStyles: function() {
          if (this.style) {
            var k = e.Element("span");
            k.style.cssText = this.style;
            this.styles = this.SVGprocessStyles(k.style);
          }
        },
        SVGprocessStyles: function(k) {
          var l = { border: a.getBorders(k), padding: a.getPadding(k) };
          if (!l.border) {
            delete l.border;
          }
          if (!l.padding) {
            delete l.padding;
          }
          if (k.fontSize) {
            l.fontSize = k.fontSize;
          }
          if (k.color) {
            l.color = k.color;
          }
          if (k.backgroundColor) {
            l.background = k.backgroundColor;
          }
          if (k.fontStyle) {
            l.fontStyle = k.fontStyle;
          }
          if (k.fontWeight) {
            l.fontWeight = k.fontWeight;
          }
          if (k.fontFamily) {
            l.fontFamily = k.fontFamily;
          }
          if (l.fontWeight && l.fontWeight.match(/^\d+$/)) {
            l.fontWeight = parseInt(l.fontWeight) > 600 ? "bold" : "normal";
          }
          return l;
        },
        SVGhandleSpace: function(n) {
          if (this.useMMLspacing) {
            if (this.type !== "mo") {
              return;
            }
            var m = this.getValues("scriptlevel", "lspace", "rspace");
            if (
              m.scriptlevel <= 0 ||
              this.hasValue("lspace") ||
              this.hasValue("rspace")
            ) {
              var l = this.SVGgetMu(n);
              m.lspace = Math.max(0, a.length2em(m.lspace, l));
              m.rspace = Math.max(0, a.length2em(m.rspace, l));
              var k = this,
                o = this.Parent();
              while (o && o.isEmbellished() && o.Core() === k) {
                k = o;
                o = o.Parent();
              }
              if (m.lspace) {
                n.x += m.lspace;
              }
              if (m.rspace) {
                n.X = m.rspace;
              }
            }
          } else {
            var p = this.texSpacing();
            this.SVGgetScale();
            if (p !== "") {
              n.x += a.length2em(p, this.scale) * this.mscale;
            }
          }
        },
        SVGhandleColor: function(o) {
          var x = this.getValues("mathcolor", "color");
          if (this.styles && this.styles.color && !x.color) {
            x.color = this.styles.color;
          }
          if (x.color && !this.mathcolor) {
            x.mathcolor = x.color;
          }
          if (x.mathcolor) {
            a.Element(o.element, { fill: x.mathcolor, stroke: x.mathcolor });
            o.removeable = false;
          }
          var s = (this.styles || {}).border,
            v = (this.styles || {}).padding,
            t = (s || {}).left || 0,
            q = (v || {}).left || 0,
            k;
          x.background =
            this.mathbackground ||
            this.background ||
            (this.styles || {}).background ||
            g.COLOR.TRANSPARENT;
          if (t + q) {
            var l = i();
            for (k in o) {
              if (o.hasOwnProperty(k)) {
                l[k] = o[k];
              }
            }
            l.x = 0;
            l.y = 0;
            o.element = a.Element("g");
            o.removeable = true;
            o.Add(l, t + q, 0);
          }
          if (v) {
            o.w += v.right || 0;
            o.h += v.top || 0;
            o.d += v.bottom || 0;
          }
          if (s) {
            o.w += s.right || 0;
            o.h += s.top || 0;
            o.d += s.bottom || 0;
          }
          if (x.background !== g.COLOR.TRANSPARENT) {
            var u = o.element.nodeName.toLowerCase();
            if (u !== "g" && u !== "svg") {
              var p = a.Element("g");
              p.appendChild(o.element);
              o.element = p;
              o.removeable = true;
            }
            o.Add(
              i.RECT(o.h, o.d, o.w, { fill: x.background, stroke: "none" }),
              0,
              0,
              false,
              true
            );
          }
          if (s) {
            var w = 5;
            var m = {
              left: ["V", o.h + o.d, -w, -o.d],
              right: ["V", o.h + o.d, o.w - s.right + w, -o.d],
              top: ["H", o.w, 0, o.h - s.top + w],
              bottom: ["H", o.w, 0, -o.d - w]
            };
            for (k in m) {
              if (m.hasOwnProperty(k)) {
                if (s[k]) {
                  var r = m[k],
                    n = i[r[0] + "LINE"];
                  o.Add(
                    n(r[1], s[k], s[k + "Style"], s[k + "Color"]),
                    r[2],
                    r[3]
                  );
                }
              }
            }
          }
        },
        SVGhandleVariant: function(k, m, l) {
          return a.HandleVariant(k, m, l);
        },
        SVGgetVariant: function() {
          var k = this.getValues(
            "mathvariant",
            "fontfamily",
            "fontweight",
            "fontstyle"
          );
          var l = k.mathvariant;
          if (this.variantForm) {
            l = "-" + a.fontInUse + "-variant";
          }
          k.hasVariant = this.Get("mathvariant", true);
          if (!k.hasVariant) {
            k.family = k.fontfamily;
            k.weight = k.fontweight;
            k.style = k.fontstyle;
          }
          if (this.styles) {
            if (!k.style && this.styles.fontStyle) {
              k.style = this.styles.fontStyle;
            }
            if (!k.weight && this.styles.fontWeight) {
              k.weight = this.styles.fontWeight;
            }
            if (!k.family && this.styles.fontFamily) {
              k.family = this.styles.fontFamily;
            }
          }
          if (k.family && !k.hasVariant) {
            if (!k.weight && k.mathvariant.match(/bold/)) {
              k.weight = "bold";
            }
            if (!k.style && k.mathvariant.match(/italic/)) {
              k.style = "italic";
            }
            l = { forceFamily: true, font: { "font-family": k.family } };
            if (k.style) {
              l.font["font-style"] = k.style;
            }
            if (k.weight) {
              l.font["font-weight"] = k.weight;
            }
            return l;
          }
          if (k.weight === "bold") {
            l =
              {
                normal: g.VARIANT.BOLD,
                italic: g.VARIANT.BOLDITALIC,
                fraktur: g.VARIANT.BOLDFRAKTUR,
                script: g.VARIANT.BOLDSCRIPT,
                "sans-serif": g.VARIANT.BOLDSANSSERIF,
                "sans-serif-italic": g.VARIANT.SANSSERIFBOLDITALIC
              }[l] || l;
          } else {
            if (k.weight === "normal") {
              l =
                {
                  bold: g.VARIANT.normal,
                  "bold-italic": g.VARIANT.ITALIC,
                  "bold-fraktur": g.VARIANT.FRAKTUR,
                  "bold-script": g.VARIANT.SCRIPT,
                  "bold-sans-serif": g.VARIANT.SANSSERIF,
                  "sans-serif-bold-italic": g.VARIANT.SANSSERIFITALIC
                }[l] || l;
            }
          }
          if (k.style === "italic") {
            l =
              {
                normal: g.VARIANT.ITALIC,
                bold: g.VARIANT.BOLDITALIC,
                "sans-serif": g.VARIANT.SANSSERIFITALIC,
                "bold-sans-serif": g.VARIANT.SANSSERIFBOLDITALIC
              }[l] || l;
          } else {
            if (k.style === "normal") {
              l =
                {
                  italic: g.VARIANT.NORMAL,
                  "bold-italic": g.VARIANT.BOLD,
                  "sans-serif-italic": g.VARIANT.SANSSERIF,
                  "sans-serif-bold-italic": g.VARIANT.BOLDSANSSERIF
                }[l] || l;
            }
          }
          if (!(l in a.FONTDATA.VARIANT)) {
            l = "normal";
          }
          return a.FONTDATA.VARIANT[l];
        },
        SVGgetScale: function(l) {
          var m = 1;
          if (this.mscale) {
            m = this.scale;
          } else {
            var k = this.getValues("scriptlevel", "fontsize");
            k.mathsize = (this.isToken ? this : this.Parent()).Get("mathsize");
            if ((this.styles || {}).fontSize && !k.fontsize) {
              k.fontsize = this.styles.fontSize;
            }
            if (k.fontsize && !this.mathsize) {
              k.mathsize = k.fontsize;
            }
            if (k.scriptlevel !== 0) {
              if (k.scriptlevel > 2) {
                k.scriptlevel = 2;
              }
              m = Math.pow(this.Get("scriptsizemultiplier"), k.scriptlevel);
              k.scriptminsize = a.length2em(this.Get("scriptminsize")) / 1000;
              if (m < k.scriptminsize) {
                m = k.scriptminsize;
              }
            }
            this.scale = m;
            this.mscale = a.length2em(k.mathsize) / 1000;
          }
          if (l) {
            l.scale = m;
            if (this.isToken) {
              l.scale *= this.mscale;
            }
          }
          return m * this.mscale;
        },
        SVGgetMu: function(m) {
          var k = 1,
            l = this.getValues("scriptlevel", "scriptsizemultiplier");
          if (m.scale && m.scale !== 1) {
            k = 1 / m.scale;
          }
          if (l.scriptlevel !== 0) {
            if (l.scriptlevel > 2) {
              l.scriptlevel = 2;
            }
            k = Math.sqrt(Math.pow(l.scriptsizemultiplier, l.scriptlevel));
          }
          return k;
        },
        SVGnotEmpty: function(k) {
          while (k) {
            if (
              (k.type !== "mrow" && k.type !== "texatom") ||
              k.data.length > 1
            ) {
              return true;
            }
            k = k.data[0];
          }
          return false;
        },
        SVGcanStretch: function(m) {
          var l = false;
          if (this.isEmbellished()) {
            var k = this.Core();
            if (k && k !== this) {
              l = k.SVGcanStretch(m);
              if (l && k.forceStretch) {
                this.forceStretch = true;
              }
            }
          }
          return l;
        },
        SVGstretchV: function(k, l) {
          return this.toSVG(k, l);
        },
        SVGstretchH: function(k) {
          return this.toSVG(k);
        },
        SVGlineBreaks: function() {
          return false;
        }
      },
      {
        SVGemptySVG: function() {
          var k = this.SVG();
          k.Clean();
          this.SVGsaveData(k);
          return k;
        },
        SVGautoload: function() {
          var k = a.autoloadDir + "/" + this.type + ".js";
          d.RestartAfter(h.Require(k));
        },
        SVGautoloadFile: function(k) {
          var l = a.autoloadDir + "/" + k + ".js";
          d.RestartAfter(h.Require(l));
        }
      }
    );
    g.chars.Augment({
      toSVG: function(l, o, k, m) {
        var n = this.data.join("").replace(/[\u2061-\u2064]/g, "");
        if (k) {
          n = k(n, m);
        }
        return this.SVGhandleVariant(l, o, n);
      }
    });
    g.entity.Augment({
      toSVG: function(l, o, k, m) {
        var n = this.toString().replace(/[\u2061-\u2064]/g, "");
        if (k) {
          n = k(n, m);
        }
        return this.SVGhandleVariant(l, o, n);
      }
    });
    g.mo.Augment({
      toSVG: function(l, k) {
        this.SVGgetStyles();
        var t = (this.svg = this.SVG());
        var p = this.SVGgetScale(t);
        this.SVGhandleSpace(t);
        if (this.data.length == 0) {
          t.Clean();
          this.SVGsaveData(t);
          return t;
        }
        if (k != null) {
          return this.SVGstretchV(l, k);
        } else {
          if (l != null) {
            return this.SVG.strechH(l);
          }
        }
        var r = this.SVGgetVariant();
        var z = this.getValues("largeop", "displaystyle");
        if (z.largeop) {
          r = a.FONTDATA.VARIANT[z.displaystyle ? "-largeOp" : "-smallOp"];
        }
        var y = this.CoreParent(),
          q = y && y.isa(g.msubsup) && this !== y.data[0],
          n = q ? this.remapChars : null;
        if (
          this.data.join("").length === 1 &&
          y &&
          y.isa(g.munderover) &&
          this.CoreText(y.data[y.base]).length === 1
        ) {
          var u = y.data[y.over],
            w = y.data[y.under];
          if (u && this === u.CoreMO() && y.Get("accent")) {
            n = a.FONTDATA.REMAPACCENT;
          } else {
            if (w && this === w.CoreMO() && y.Get("accentunder")) {
              n = a.FONTDATA.REMAPACCENTUNDER;
            }
          }
        }
        if (q && this.data.join("").match(/['`"\u00B4\u2032-\u2037\u2057]/)) {
          r = a.FONTDATA.VARIANT["-" + a.fontInUse + "-variant"];
        }
        for (var s = 0, o = this.data.length; s < o; s++) {
          if (this.data[s]) {
            var A = this.data[s].toSVG(r, p, this.remap, n),
              v = t.w;
            if (v === 0 && -A.l > 10 * A.w) {
              v += -A.l;
            }
            t.Add(A, v, 0, true);
            if (A.skew) {
              t.skew = A.skew;
            }
          }
        }
        t.Clean();
        if (this.data.join("").length !== 1) {
          delete t.skew;
        }
        if (z.largeop) {
          t.y = a.TeX.axis_height - (t.h - t.d) / 2 / p;
          if (t.r > t.w) {
            t.ic = t.r - t.w;
            t.w = t.r;
          }
        }
        this.SVGhandleColor(t);
        this.SVGsaveData(t);
        return t;
      },
      SVGcanStretch: function(o) {
        if (!this.Get("stretchy")) {
          return false;
        }
        var p = this.data.join("");
        if (p.length > 1) {
          return false;
        }
        var l = this.CoreParent();
        if (
          l &&
          l.isa(g.munderover) &&
          this.CoreText(l.data[l.base]).length === 1
        ) {
          var n = l.data[l.over],
            k = l.data[l.under];
          if (n && this === n.CoreMO() && l.Get("accent")) {
            p = a.FONTDATA.REMAPACCENT[p] || p;
          } else {
            if (k && this === k.CoreMO() && l.Get("accentunder")) {
              p = a.FONTDATA.REMAPACCENTUNDER[p] || p;
            }
          }
        }
        p = a.FONTDATA.DELIMITERS[p.charCodeAt(0)];
        var m = p && p.dir == o.substr(0, 1);
        if (!m) {
          delete this.svg;
        }
        this.forceStretch =
          m && (this.Get("minsize", true) || this.Get("maxsize", true));
        return m;
      },
      SVGstretchV: function(p, q) {
        var m = this.svg || this.toSVG();
        var l = this.getValues("symmetric", "maxsize", "minsize");
        var o = a.TeX.axis_height * m.scale,
          k = this.SVGgetMu(m),
          n;
        if (l.symmetric) {
          n = 2 * Math.max(p - o, q + o);
        } else {
          n = p + q;
        }
        l.maxsize = a.length2em(l.maxsize, k, m.h + m.d);
        l.minsize = a.length2em(l.minsize, k, m.h + m.d);
        n = Math.max(l.minsize, Math.min(l.maxsize, n));
        if (n != l.minsize) {
          n = [
            Math.max(
              (n * a.TeX.delimiterfactor) / 1000,
              n - a.TeX.delimitershortfall
            ),
            n
          ];
        }
        m = a.createDelimiter(this.data.join("").charCodeAt(0), n, m.scale);
        if (l.symmetric) {
          n = (m.h + m.d) / 2 + o;
        } else {
          n = ((m.h + m.d) * p) / (p + q);
        }
        m.y = n - m.h;
        this.SVGhandleSpace(m);
        this.SVGhandleColor(m);
        delete this.svg.element;
        this.SVGsaveData(m);
        m.stretched = true;
        return m;
      },
      SVGstretchH: function(l) {
        var n = this.svg || this.toSVG(),
          k = this.SVGgetMu(n);
        var m = this.getValues(
          "maxsize",
          "minsize",
          "mathvariant",
          "fontweight"
        );
        if (
          (m.fontweight === "bold" || parseInt(m.fontweight) >= 600) &&
          !this.Get("mathvariant", true)
        ) {
          m.mathvariant = g.VARIANT.BOLD;
        }
        m.maxsize = a.length2em(m.maxsize, k, n.w);
        m.minsize = a.length2em(m.minsize, k, n.w);
        l = Math.max(m.minsize, Math.min(m.maxsize, l));
        n = a.createDelimiter(
          this.data.join("").charCodeAt(0),
          l,
          n.scale,
          m.mathvariant
        );
        this.SVGhandleSpace(n);
        this.SVGhandleColor(n);
        delete this.svg.element;
        this.SVGsaveData(n);
        n.stretched = true;
        return n;
      }
    });
    g.mn.Augment({
      SVGremapMinus: function(k) {
        return k.replace(/^-/, "\u2212");
      },
      toSVG: function() {
        this.SVGgetStyles();
        var p = this.SVGgetVariant();
        var l = this.SVG();
        this.SVGgetScale(l);
        this.SVGhandleSpace(l);
        var o = this.SVGremapMinus;
        for (var n = 0, k = this.data.length; n < k; n++) {
          if (this.data[n]) {
            var r = l.Add(this.data[n].toSVG(p, l.scale, o), l.w, 0, true);
            if (r.skew) {
              l.skew = r.skew;
            }
            o = null;
          }
        }
        l.Clean();
        var q = this.data.join("");
        if (l.skew && q.length !== 1) {
          delete l.skew;
        }
        if (l.r > l.w && q.length === 1 && !p.noIC) {
          l.ic = l.r - l.w;
          l.w = l.r;
        }
        this.SVGhandleColor(l);
        this.SVGsaveData(l);
        return l;
      }
    }),
      g.mtext.Augment({
        toSVG: function() {
          if (a.config.mtextFontInherit || this.Parent().type === "merror") {
            this.SVGgetStyles();
            var k = this.SVG(),
              n = this.SVGgetScale(k);
            this.SVGhandleSpace(k);
            var l = this.SVGgetVariant(),
              m = { direction: this.Get("dir") };
            if (l.bold) {
              m["font-weight"] = "bold";
            }
            if (l.italic) {
              m["font-style"] = "italic";
            }
            l = this.Get("mathvariant");
            if (l === "monospace") {
              m["class"] = "MJX-monospace";
            } else {
              if (l.match(/sans-serif/)) {
                m["class"] = "MJX-sans-serif";
              }
            }
            k.Add(i.TEXT((n * 100) / a.config.scale, this.data.join(""), m));
            k.Clean();
            this.SVGhandleColor(k);
            this.SVGsaveData(k);
            return k;
          } else {
            return this.SUPER(arguments).toSVG.call(this);
          }
        }
      });
    g.merror.Augment({
      toSVG: function(n, k) {
        this.SVGgetStyles();
        var r = this.SVG(),
          p = a.length2em(this.styles.fontSize || 1) / 1000;
        this.SVGhandleSpace(r);
        var l = p !== 1 ? { transform: "scale(" + a.Fixed(p) + ")" } : {};
        var t = i(l);
        t.Add(this.SVGchildSVG(0));
        t.Clean();
        if (p !== 1) {
          t.removeable = false;
          var s = ["w", "h", "d", "l", "r", "D", "H"];
          for (var q = 0, o = s.length; q < o; q++) {
            t[s[q]] *= p;
          }
        }
        r.Add(t);
        r.Clean();
        this.SVGhandleColor(r);
        this.SVGsaveData(r);
        return r;
      },
      SVGgetStyles: function() {
        var k = e.Element("span", { style: a.config.merrorStyle });
        this.styles = this.SVGprocessStyles(k.style);
        if (this.style) {
          k.style.cssText = this.style;
          d.Insert(this.styles, this.SVGprocessStyles(k.style));
        }
      }
    });
    g.ms.Augment({ toSVG: g.mbase.SVGautoload });
    g.mglyph.Augment({ toSVG: g.mbase.SVGautoload });
    g.mspace.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var m = this.getValues("height", "depth", "width");
        m.mathbackground = this.mathbackground;
        if (this.background && !this.mathbackground) {
          m.mathbackground = this.background;
        }
        var l = this.SVG();
        this.SVGgetScale(l);
        var n = this.mscale,
          k = this.SVGgetMu(l);
        l.h = a.length2em(m.height, k) * n;
        l.d = a.length2em(m.depth, k) * n;
        l.w = l.r = a.length2em(m.width, k) * n;
        if (l.w < 0) {
          l.x = l.w;
          l.w = l.r = 0;
        }
        if (l.h < -l.d) {
          l.d = -l.h;
        }
        l.l = 0;
        l.Clean();
        this.SVGhandleColor(l);
        this.SVGsaveData(l);
        return l;
      }
    });
    g.mphantom.Augment({
      toSVG: function(k, m) {
        this.SVGgetStyles();
        var l = this.SVG();
        this.SVGgetScale(l);
        if (this.data[0] != null) {
          this.SVGhandleSpace(l);
          l.Add(this.SVGdataStretched(0, k, m));
          l.Clean();
          while (l.element.firstChild) {
            l.element.removeChild(l.element.firstChild);
          }
        }
        this.SVGhandleColor(l);
        this.SVGsaveData(l);
        if (l.removeable && !l.element.firstChild) {
          delete l.element;
        }
        return l;
      }
    });
    g.mpadded.Augment({
      toSVG: function(n, k) {
        this.SVGgetStyles();
        var q = this.SVG();
        if (this.data[0] != null) {
          this.SVGgetScale(q);
          this.SVGhandleSpace(q);
          var o = this.SVGdataStretched(0, n, k),
            v = this.SVGgetMu(q);
          var u = this.getValues(
              "height",
              "depth",
              "width",
              "lspace",
              "voffset"
            ),
            m = 0,
            l = 0;
          if (u.lspace) {
            m = this.SVGlength2em(o, u.lspace, v);
          }
          if (u.voffset) {
            l = this.SVGlength2em(o, u.voffset, v);
          }
          var p = o.h,
            r = o.d,
            t = o.w,
            s = o.y;
          q.Add(o, m, l);
          q.Clean();
          q.h = p + s;
          q.d = r - s;
          q.w = t;
          q.removeable = false;
          if (u.height !== "") {
            q.h = this.SVGlength2em(q, u.height, v, "h", 0);
          }
          if (u.depth !== "") {
            q.d = this.SVGlength2em(q, u.depth, v, "d", 0);
          }
          if (u.width !== "") {
            q.w = this.SVGlength2em(q, u.width, v, "w", 0);
          }
          if (q.h > q.H) {
            q.H = q.h;
          }
          if (q.d > q.D) {
            q.D = q.d;
          }
        }
        this.SVGhandleColor(q);
        this.SVGsaveData(q);
        return q;
      },
      SVGlength2em: function(o, r, l, s, k) {
        if (k == null) {
          k = -a.BIGDIMEN;
        }
        var p = String(r).match(/width|height|depth/);
        var q = p ? o[p[0].charAt(0)] : s ? o[s] : 0;
        var n = a.length2em(r, l, q / this.mscale) * this.mscale;
        if (s && String(r).match(/^\s*[-+]/)) {
          return Math.max(k, o[s] + n);
        } else {
          return n;
        }
      }
    });
    g.mrow.Augment({
      SVG: i.ROW,
      toSVG: function(o, q) {
        this.SVGgetStyles();
        var l = this.SVG();
        this.SVGhandleSpace(l);
        if (q != null) {
          l.sh = o;
          l.sd = q;
        }
        for (var n = 0, k = this.data.length; n < k; n++) {
          if (this.data[n]) {
            l.Check(this.data[n]);
          }
        }
        l.Stretch();
        l.Clean();
        if (this.data.length === 1 && this.data[0]) {
          var p = this.data[0].SVGdata;
          if (p.skew) {
            l.skew = p.skew;
          }
        }
        if (this.SVGlineBreaks(l)) {
          l = this.SVGmultiline(l);
        }
        this.SVGhandleColor(l);
        this.SVGsaveData(l);
        return l;
      },
      SVGlineBreaks: function(k) {
        if (!this.parent.linebreakContainer) {
          return false;
        }
        return (
          (a.config.linebreaks.automatic && k.w > a.linebreakWidth) ||
          this.hasNewline()
        );
      },
      SVGmultiline: function(k) {
        g.mbase.SVGautoloadFile("multiline");
      },
      SVGstretchH: function(l) {
        var n = this.SVG();
        this.SVGhandleSpace(n);
        for (var o = 0, k = this.data.length; o < k; o++) {
          n.Add(this.SVGdataStretched(o, l), n.w, 0);
        }
        n.Clean();
        this.SVGhandleColor(n);
        this.SVGsaveData(n);
        return n;
      }
    });
    g.mstyle.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var k = this.SVG();
        if (this.data[0] != null) {
          this.SVGhandleSpace(k);
          var l = k.Add(this.data[0].toSVG());
          k.Clean();
          if (l.ic) {
            k.ic = l.ic;
          }
          this.SVGhandleColor(k);
        }
        this.SVGsaveData(k);
        return k;
      },
      SVGstretchH: function(k) {
        return this.data[0] != null ? this.data[0].SVGstretchH(k) : i.NULL();
      },
      SVGstretchV: function(k, l) {
        return this.data[0] != null ? this.data[0].SVGstretchV(k, l) : i.NULL();
      }
    });
    g.mfrac.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var y = this.SVG(),
          G = this.SVGgetScale(y);
        var m = i();
        m.scale = y.scale;
        this.SVGhandleSpace(m);
        var o = this.SVGchildSVG(0),
          n = this.SVGchildSVG(1);
        var k = this.getValues(
          "displaystyle",
          "linethickness",
          "numalign",
          "denomalign",
          "bevelled"
        );
        var C = k.displaystyle;
        var F = a.TeX.axis_height * G;
        if (k.bevelled) {
          var E = C ? 400 : 150;
          var r = Math.max(o.h + o.d, n.h + n.d) + 2 * E;
          var D = a.createDelimiter(47, r);
          m.Add(o, 0, (o.d - o.h) / 2 + F + E);
          m.Add(D, o.w - E / 2, (D.d - D.h) / 2 + F);
          m.Add(n, o.w + D.w - E, (n.d - n.h) / 2 + F - E);
        } else {
          var l = Math.max(o.w, n.w);
          var x = a.thickness2em(k.linethickness, this.scale) * this.mscale,
            A,
            z,
            w,
            s;
          var B = (a.TeX.min_rule_thickness / a.em) * 1000;
          if (C) {
            w = a.TeX.num1;
            s = a.TeX.denom1;
          } else {
            w = x === 0 ? a.TeX.num3 : a.TeX.num2;
            s = a.TeX.denom2;
          }
          w *= G;
          s *= G;
          if (x === 0) {
            A = Math.max((C ? 7 : 3) * a.TeX.rule_thickness, 2 * B);
            z = w - o.d - (n.h - s);
            if (z < A) {
              w += (A - z) / 2;
              s += (A - z) / 2;
            }
            m.w = l;
            x = 0;
          } else {
            A = Math.max((C ? 2 : 0) * B + x, x / 2 + 1.5 * B);
            z = w - o.d - (F + x / 2);
            if (z < A) {
              w += A - z;
            }
            z = F - x / 2 - (n.h - s);
            if (z < A) {
              s += A - z;
            }
            m.Add(i.RECT(x / 2, x / 2, l + 2 * x), 0, F);
          }
          m.Align(o, k.numalign, x, w);
          m.Align(n, k.denomalign, x, -s);
        }
        m.Clean();
        y.Add(m, 0, 0);
        y.Clean();
        this.SVGhandleColor(y);
        this.SVGsaveData(y);
        return y;
      },
      SVGcanStretch: function(k) {
        return false;
      },
      SVGhandleSpace: function(k) {
        if (!this.texWithDelims && !this.useMMLspacing) {
          k.x = k.X = a.TeX.nulldelimiterspace * this.mscale;
        }
        this.SUPER(arguments).SVGhandleSpace.call(this, k);
      }
    });
    g.msqrt.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var r = this.SVG(),
          n = this.SVGgetScale(r);
        this.SVGhandleSpace(r);
        var m = this.SVGchildSVG(0),
          s,
          o;
        var w = a.TeX.rule_thickness * n,
          l,
          k,
          v,
          u = 0;
        if (this.Get("displaystyle")) {
          l = a.TeX.x_height * n;
        } else {
          l = w;
        }
        k = Math.max(w + l / 4, (1000 * a.TeX.min_root_space) / a.em);
        v = m.h + m.d + k + w;
        o = a.createDelimiter(8730, v, n);
        if (o.h + o.d > v) {
          k = (o.h + o.d - (v - w)) / 2;
        }
        s = i.RECT(w, 0, m.w);
        v = m.h + k + w;
        u = this.SVGaddRoot(r, o, u, o.h + o.d - v, n);
        r.Add(o, u, v - o.h);
        r.Add(s, u + o.w, v - s.h);
        r.Add(m, u + o.w, 0);
        r.Clean();
        r.h += w;
        r.H += w;
        this.SVGhandleColor(r);
        this.SVGsaveData(r);
        return r;
      },
      SVGaddRoot: function(l, m, k, o, n) {
        return k;
      }
    });
    g.mroot.Augment({
      toSVG: g.msqrt.prototype.toSVG,
      SVGaddRoot: function(n, l, q, o, k) {
        var s = (l.isMultiChar ? 0.55 : 0.65) * l.w;
        if (this.data[1]) {
          var p = this.data[1].toSVG();
          p.x = 0;
          var m = this.SVGrootHeight(l.h + l.d, k, p) - o;
          var r = Math.min(p.w, p.r);
          q = Math.max(r, s);
          n.Add(p, q - r, m);
        } else {
          s = q;
        }
        return q - s;
      },
      SVGrootHeight: function(m, l, k) {
        return 0.45 * (m - 900 * l) + 600 * l + Math.max(0, k.d - 75);
      }
    });
    g.mfenced.Augment({
      SVG: i.ROW,
      toSVG: function() {
        this.SVGgetStyles();
        var l = this.SVG();
        this.SVGhandleSpace(l);
        if (this.data.open) {
          l.Check(this.data.open);
        }
        if (this.data[0] != null) {
          l.Check(this.data[0]);
        }
        for (var n = 1, k = this.data.length; n < k; n++) {
          if (this.data[n]) {
            if (this.data["sep" + n]) {
              l.Check(this.data["sep" + n]);
            }
            l.Check(this.data[n]);
          }
        }
        if (this.data.close) {
          l.Check(this.data.close);
        }
        l.Stretch();
        l.Clean();
        this.SVGhandleColor(l);
        this.SVGsaveData(l);
        return l;
      }
    });
    g.menclose.Augment({ toSVG: g.mbase.SVGautoload });
    g.maction.Augment({ toSVG: g.mbase.SVGautoload });
    g.semantics.Augment({
      toSVG: function() {
        this.SVGgetStyles();
        var k = this.SVG();
        if (this.data[0] != null) {
          this.SVGhandleSpace(k);
          k.Add(this.data[0].toSVG());
          k.Clean();
        } else {
          k.Clean();
        }
        this.SVGsaveData(k);
        return k;
      },
      SVGstretchH: function(k) {
        return this.data[0] != null ? this.data[0].SVGstretchH(k) : i.NULL();
      },
      SVGstretchV: function(k, l) {
        return this.data[0] != null ? this.data[0].SVGstretchV(k, l) : i.NULL();
      }
    });
    g.munderover.Augment({
      toSVG: function(F, C) {
        this.SVGgetStyles();
        var l = this.getValues(
          "displaystyle",
          "accent",
          "accentunder",
          "align"
        );
        var o = this.data[this.base];
        if (
          !l.displaystyle &&
          o != null &&
          (o.movablelimits || o.CoreMO().Get("movablelimits"))
        ) {
          return g.msubsup.prototype.toSVG.call(this);
        }
        var E = this.SVG(),
          M = this.SVGgetScale(E);
        this.SVGhandleSpace(E);
        var p = [],
          K = [],
          u,
          J,
          G,
          n = -a.BIGDIMEN,
          I = n;
        for (J = 0, G = this.data.length; J < G; J++) {
          if (this.data[J] != null) {
            if (J == this.base) {
              p[J] = this.SVGdataStretched(J, F, C);
              K[J] =
                (C != null || F == null) &&
                this.data[J].SVGcanStretch("Horizontal");
            } else {
              p[J] = this.data[J].toSVG();
              p[J].x = 0;
              delete p[J].X;
              K[J] = this.data[J].SVGcanStretch("Horizontal");
            }
            if (p[J].w > I) {
              I = p[J].w;
            }
            if (!K[J] && I > n) {
              n = I;
            }
          }
        }
        if (C == null && F != null) {
          n = F;
        } else {
          if (n == -a.BIGDIMEN) {
            n = I;
          }
        }
        for (J = I = 0, G = this.data.length; J < G; J++) {
          if (this.data[J]) {
            if (K[J]) {
              p[J] = this.data[J].SVGstretchH(n);
              if (J !== this.base) {
                p[J].x = 0;
                delete p[J].X;
              }
            }
            if (p[J].w > I) {
              I = p[J].w;
            }
          }
        }
        var B = a.TeX.rule_thickness * this.mscale;
        var s,
          q,
          w,
          v,
          r,
          A,
          H,
          L = 0;
        o = p[this.base] || {
          w: 0,
          h: 0,
          d: 0,
          H: 0,
          D: 0,
          l: 0,
          r: 0,
          y: 0,
          scale: M
        };
        if (o.ic) {
          L = 1.3 * o.ic + 0.05;
        }
        for (J = 0, G = this.data.length; J < G; J++) {
          if (this.data[J] != null) {
            u = p[J];
            r = a.TeX.big_op_spacing5 * M;
            var z = J != this.base && l[this.ACCENTS[J]];
            if (z && u.w <= 1) {
              u.x = -u.l;
              p[J] = i.G().With({ removeable: false });
              p[J].Add(u);
              p[J].Clean();
              p[J].w = -u.l;
              u = p[J];
            }
            A = { left: 0, center: (I - u.w) / 2, right: I - u.w }[l.align];
            s = A;
            q = 0;
            if (J == this.over) {
              if (z) {
                H = B * M;
                r = 0;
                if (o.skew) {
                  s += o.skew;
                  E.skew = o.skew;
                  if (s + u.w > I) {
                    E.skew += (I - u.w - s) / 2;
                  }
                }
              } else {
                w = a.TeX.big_op_spacing1 * M;
                v = a.TeX.big_op_spacing3 * M;
                H = Math.max(w, v - Math.max(0, u.d));
              }
              H = Math.max(H, 1500 / a.em);
              s += L / 2;
              q = o.y + o.h + u.d + H;
              u.h += r;
              if (u.h > u.H) {
                u.H = u.h;
              }
            } else {
              if (J == this.under) {
                if (z) {
                  H = 3 * B * M;
                  r = 0;
                } else {
                  w = a.TeX.big_op_spacing2 * M;
                  v = a.TeX.big_op_spacing4 * M;
                  H = Math.max(w, v - u.h);
                }
                H = Math.max(H, 1500 / a.em);
                s -= L / 2;
                q = o.y - (o.d + u.h + H);
                u.d += r;
                if (u.d > u.D) {
                  u.D = u.d;
                }
              }
            }
            E.Add(u, s, q);
          }
        }
        E.Clean();
        this.SVGhandleColor(E);
        this.SVGsaveData(E);
        return E;
      }
    });
    g.msubsup.Augment({
      toSVG: function(I, B) {
        this.SVGgetStyles();
        var E = this.SVG(),
          M = this.SVGgetScale(E);
        this.SVGhandleSpace(E);
        var G = this.SVGgetMu(E);
        var m = E.Add(this.SVGdataStretched(this.base, I, B));
        var l = (
          this.data[this.sup] ||
          this.data[this.sub] ||
          this
        ).SVGgetScale();
        var K = a.TeX.x_height * M,
          A = a.TeX.scriptspace * M;
        var k, n;
        if (this.SVGnotEmpty(this.data[this.sup])) {
          k = this.data[this.sup].toSVG();
          k.w += A;
          k.r = Math.max(k.w, k.r);
        }
        if (this.SVGnotEmpty(this.data[this.sub])) {
          n = this.data[this.sub].toSVG();
          n.w += A;
          n.r = Math.max(n.w, n.r);
        }
        var F = a.TeX.sup_drop * l,
          C = a.TeX.sub_drop * l;
        var y = m.h + (m.y || 0) - F,
          w = m.d - (m.y || 0) + C,
          L = 0,
          H;
        if (m.ic) {
          m.w -= m.ic;
          L = 1.3 * m.ic + 0.05;
        }
        if (
          this.data[this.base] &&
          (this.data[this.base].type === "mi" ||
            this.data[this.base].type === "mo")
        ) {
          if (
            this.data[this.base].data.join("").length === 1 &&
            m.scale === 1 &&
            !m.stretched &&
            !this.data[this.base].Get("largeop")
          ) {
            y = w = 0;
          }
        }
        var J = this.getValues("subscriptshift", "superscriptshift");
        J.subscriptshift =
          J.subscriptshift === "" ? 0 : a.length2em(J.subscriptshift, G);
        J.superscriptshift =
          J.superscriptshift === "" ? 0 : a.length2em(J.superscriptshift, G);
        var o = m.w + m.x;
        if (!k) {
          if (n) {
            w = Math.max(
              w,
              a.TeX.sub1 * M,
              n.h - (4 / 5) * K,
              J.subscriptshift
            );
            E.Add(n, o, -w);
            this.data[this.sub].SVGdata.dy = -w;
          }
        } else {
          if (!n) {
            values = this.getValues("displaystyle", "texprimestyle");
            H =
              a.TeX[
                values.displaystyle
                  ? "sup1"
                  : values.texprimestyle
                  ? "sup3"
                  : "sup2"
              ];
            y = Math.max(y, H * M, k.d + (1 / 4) * K, J.superscriptshift);
            E.Add(k, o + L, y);
            this.data[this.sup].SVGdata.dx = L;
            this.data[this.sup].SVGdata.dy = y;
          } else {
            w = Math.max(w, a.TeX.sub2 * M);
            var z = a.TeX.rule_thickness * M;
            if (y - k.d - (n.h - w) < 3 * z) {
              w = 3 * z - y + k.d + n.h;
              F = (4 / 5) * K - (y - k.d);
              if (F > 0) {
                y += F;
                w -= F;
              }
            }
            E.Add(k, o + L, Math.max(y, J.superscriptshift));
            E.Add(n, o, -Math.max(w, J.subscriptshift));
            this.data[this.sup].SVGdata.dx = L;
            this.data[this.sup].SVGdata.dy = Math.max(y, J.superscriptshift);
            this.data[this.sub].SVGdata.dy = -Math.max(w, J.subscriptshift);
          }
        }
        E.Clean();
        this.SVGhandleColor(E);
        this.SVGsaveData(E);
        return E;
      }
    });
    g.mmultiscripts.Augment({ toSVG: g.mbase.SVGautoload });
    g.mtable.Augment({ toSVG: g.mbase.SVGautoload });
    g["annotation-xml"].Augment({ toSVG: g.mbase.SVGautoload });
    g.math.Augment({
      SVG: i.Subclass({ type: "svg", removeable: false }),
      toSVG: function(z, n) {
        var C = a.config;
        if (this.data[0]) {
          this.SVGgetStyles();
          g.mbase.prototype.displayAlign = d.config.displayAlign;
          g.mbase.prototype.displayIndent = d.config.displayIndent;
          if (String(d.config.displayIndent).match(/^0($|[a-z%])/i)) {
            g.mbase.prototype.displayIndent = "0";
          }
          var t = i.G();
          t.Add(this.data[0].toSVG(), 0, 0, true);
          t.Clean();
          this.SVGhandleColor(t);
          a.Element(t.element, {
            stroke: "currentColor",
            fill: "currentColor",
            "stroke-width": 0,
            transform: "matrix(1 0 0 -1 0 0)"
          });
          t.removeable = false;
          var u = this.SVG();
          u.element.setAttribute("xmlns:xlink", j);
          if (C.useFontCache && !C.useGlobalCache) {
            u.element.appendChild(i.GLYPH.defs);
          }
          u.Add(t);
          u.Clean();
          this.SVGsaveData(u);
          if (!z) {
            u.element = u.element.firstChild;
            u.element.removeAttribute("transform");
            u.removable = true;
            return u;
          }
          var s = Math.max(-u.l, 0),
            m = Math.max(u.r - u.w, 0);
          var o = u.element.style,
            y = a.TeX.x_height / a.ex;
          var B = (Math.ceil(u.H / y) + 1) * y + a.HFUZZ,
            k = (Math.ceil(u.D / y) + 1) * y + a.DFUZZ;
          var x = s + u.w + m;
          u.element.setAttribute("width", a.Ex(x));
          u.element.setAttribute("height", a.Ex(B + k));
          o.verticalAlign = a.Ex(-k);
          if (s) {
            o.marginLeft = a.Ex(-s);
          }
          if (m) {
            o.marginRight = a.Ex(-m);
          }
          u.element.setAttribute(
            "viewBox",
            a.Fixed(-s, 1) +
              " " +
              a.Fixed(-B, 1) +
              " " +
              a.Fixed(x, 1) +
              " " +
              a.Fixed(B + k, 1)
          );
          if (u.H > u.h) {
            o.marginTop = a.Ex(u.h - B);
          }
          if (u.D > u.d) {
            o.marginBottom = a.Ex(u.d - k);
            o.verticalAlign = a.Ex(-u.d);
          }
          if (Math.abs(x - a.cwidth) < 10) {
            o.maxWidth = a.Fixed((a.cwidth * a.em) / 1000);
          }
          var v = this.Get("alttext");
          if (v && !u.element.getAttribute("aria-label")) {
            u.element.setAttribute("aria-label", v);
          }
          if (!u.element.getAttribute("role")) {
            u.element.setAttribute("role", "img");
          }
          u.element.setAttribute("focusable", "false");
          z.appendChild(u.element);
          u.element = null;
          if (
            !this.isMultiline &&
            this.Get("display") === "block" &&
            !u.hasIndent
          ) {
            var A = this.getValues(
              "indentalignfirst",
              "indentshiftfirst",
              "indentalign",
              "indentshift"
            );
            if (A.indentalignfirst !== g.INDENTALIGN.INDENTALIGN) {
              A.indentalign = A.indentalignfirst;
            }
            if (A.indentalign === g.INDENTALIGN.AUTO) {
              A.indentalign = this.displayAlign;
            }
            if (A.indentshiftfirst !== g.INDENTSHIFT.INDENTSHIFT) {
              A.indentshift = A.indentshiftfirst;
            }
            if (A.indentshift === "auto") {
              A.indentshift = "0";
            }
            var p = a.length2em(A.indentshift, 1, a.cwidth);
            if (this.displayIndent !== "0") {
              var q = a.length2em(this.displayIndent, 1, a.cwidth);
              p += A.indentalign === g.INDENTALIGN.RIGHT ? -q : q;
            }
            n.style.textAlign = A.indentalign;
            if (p) {
              d.Insert(
                o,
                {
                  left: { marginLeft: a.Ex(p) },
                  right: {
                    marginRight: a.Ex(-p),
                    marginLeft: a.Ex(Math.max(0, p - x))
                  },
                  center: { marginLeft: a.Ex(p), marginRight: a.Ex(-p) }
                }[A.indentalign]
              );
            }
          }
        }
        return z;
      }
    });
    g.TeXAtom.Augment({
      toSVG: function(k, n) {
        this.SVGgetStyles();
        var l = this.SVG();
        this.SVGhandleSpace(l);
        if (this.data[0] != null) {
          var m = this.SVGdataStretched(0, k, n),
            o = 0;
          if (this.texClass === g.TEXCLASS.VCENTER) {
            o = a.TeX.axis_height - (m.h + m.d) / 2 + m.d;
          }
          l.Add(m, 0, o);
          l.ic = m.ic;
          l.skew = m.skew;
        }
        this.SVGhandleColor(l);
        this.SVGsaveData(l);
        return l;
      }
    });
    g.maligngroup.Augment({ toSVG: g.mbase.SVGemptySVG });
    g.malignmark.Augment({ toSVG: g.mbase.SVGemptySVG });
    g.mprescripts.Augment({ toSVG: g.mbase.SVGemptySVG });
    g.none.Augment({ toSVG: g.mbase.SVGemptySVG });
    d.Register.StartupHook("onLoad", function() {
      setTimeout(MathJax.Callback(["loadComplete", a, "jax.js"]), 0);
    });
  });
  d.Browser.Select({
    Opera: function(k) {
      a.Augment({ operaZoomRefresh: true });
    }
  });
  d.Register.StartupHook("End Cookie", function() {
    if (d.config.menuSettings.zoom !== "None") {
      h.Require("[MathJax]/extensions/MathZoom.js");
    }
  });
  if (!document.createElementNS) {
    if (!document.namespaces.svg) {
      document.namespaces.add("svg", b);
    }
    a.Augment({
      Element: function(k, l) {
        var m = typeof k === "string" ? document.createElement("svg:" + k) : k;
        m.isMathJax = true;
        if (l) {
          for (var n in l) {
            if (l.hasOwnProperty(n)) {
              m.setAttribute(n, l[n].toString());
            }
          }
        }
        return m;
      }
    });
  }
})(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.SVG);
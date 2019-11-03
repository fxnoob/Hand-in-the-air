import * as jQuery from "jquery";
/*
 * throwable
 * JQuery plugin
 */

/**------------------------------------**/
//              CREDITS
/**------------------------------------**/
/*
 - Mr. Doobs :: http://mrdoob.com/92/Google_Gravity
 - Alex Arnell's inheritance.js :: http://code.google.com/p/inheritance/
 - Box2Djs :: http://box2d-js.sourceforge.net/
*/

/**
 * JQuery throwable plugin
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @param {type} undefined
 * @returns {undefined}
 */
(function($, window, document, undefined) {
  /********* libraries *********/

  /* Based on Alex Arnell's inheritance implementation. */
  let WebKit;
  function $A(e) {
    if (!e) return [];
    if (e.toArray) return e.toArray();
    var t = e.length || 0,
      n = new Array(t);
    while (t--) n[t] = e[t];
    return n;
  }
  var Class = {
    create: function() {
      function n() {
        this.initialize.apply(this, arguments);
      }
      var e = null,
        t = $A(arguments);
      if ($.isFunction(t[0])) e = t.shift();
      Object.extend(n, Class.Methods);
      n.superclass = e;
      n.subclasses = [];
      if (e) {
        var r = function() {};
        r.prototype = e.prototype;
        n.prototype = new r();
        e.subclasses.push(n);
      }
      for (var i = 0; i < t.length; i++) n.addMethods(t[i]);
      if (!n.prototype.initialize) n.prototype.initialize = this.emptyFunction;
      n.prototype.constructor = n;
      return n;
    },
    emptyFunction: function() {}
  };
  Class.Methods = {
    addMethods: function(e) {
      var t = this.superclass && this.superclass.prototype;
      var n = Object.keys(e);
      if (!Object.keys({ toString: true }).length)
        n.push("toString", "valueOf");
      for (var r = 0, i = n.length; r < i; r++) {
        var s = n[r],
          o = e[s];
        if (t && $.isFunction(o) && o.argumentNames().first() == "$super") {
          var u = o,
            o = Object.extend(
              (function(e) {
                return function() {
                  return t[e].apply(this, arguments);
                };
              })(s).wrap(u),
              {
                valueOf: function() {
                  return u;
                },
                toString: function() {
                  return u.toString();
                }
              }
            );
        }
        this.prototype[s] = o;
      }
      return this;
    }
  };
  Object.extend = function(e, t) {
    for (var n in t) e[n] = t[n];
    return e;
  };
  Object.extend(Object, {
    inspect: function(e) {
      try {
        if (Object.isUndefined(e)) return "undefined";
        if (e === null) return "null";
        return e.inspect ? e.inspect() : String(e);
      } catch (t) {
        if (t instanceof RangeError) return "...";
        throw t;
      }
    },
    toJSON: function(e) {
      var t = typeof e;
      switch (t) {
        case "undefined":
        case "function":
        case "unknown":
          return;
        case "boolean":
          return e.toString();
      }
      if (e === null) return "null";
      if (e.toJSON) return e.toJSON();
      if (Object.isElement(e)) return;
      var n = [];
      for (var r in e) {
        var i = Object.toJSON(e[r]);
        if (!Object.isUndefined(i)) n.push(r.toJSON() + ": " + i);
      }
      return "{" + n.join(", ") + "}";
    },
    toQueryString: function(e) {
      return $H(e).toQueryString();
    },
    toHTML: function(e) {
      return e && e.toHTML ? e.toHTML() : String.interpret(e);
    },
    keys: function(e) {
      var t = [];
      for (var n in e) t.push(n);
      return t;
    },
    values: function(e) {
      var t = [];
      for (var n in e) t.push(e[n]);
      return t;
    },
    clone: function(e) {
      return Object.extend({}, e);
    },
    isElement: function(e) {
      return e && e.nodeType == 1;
    },
    isHash: function(e) {
      return e instanceof Hash;
    },
    isString: function(e) {
      return typeof e == "string";
    },
    isUndefined: function(e) {
      return typeof e == "undefined";
    }
  });

  if ((WebKit = navigator.userAgent.indexOf("AppleWebKit/index.html") > -1)) {
    $A = function(iterable) {
      if (!iterable) return [];
      if (
        !($.isFunction(iterable) && iterable == "[object NodeList]") &&
        iterable.toArray
      )
        return iterable.toArray();
      var length = iterable.length || 0,
        results = new Array(length);
      while (length--) results[length] = iterable[length];
      return results;
    };
  }

  ///==============================================================================================
  /*
   * Box2Djs
   * Minified version
   */
  var b2Settings = Class.create();
  b2Settings.prototype = { initialize: function() {} };
  b2Settings.USHRT_MAX = 65535;
  b2Settings.b2_pi = Math.PI;
  b2Settings.b2_massUnitsPerKilogram = 1;
  b2Settings.b2_timeUnitsPerSecond = 1;
  b2Settings.b2_lengthUnitsPerMeter = 30;
  b2Settings.b2_maxManifoldPoints = 2;
  b2Settings.b2_maxShapesPerBody = 64;
  b2Settings.b2_maxPolyVertices = 8;
  b2Settings.b2_maxProxies = 1024;
  b2Settings.b2_maxPairs = 8 * b2Settings.b2_maxProxies;
  b2Settings.b2_linearSlop = 0.005 * b2Settings.b2_lengthUnitsPerMeter;
  b2Settings.b2_angularSlop = (2 / 180) * b2Settings.b2_pi;
  b2Settings.b2_velocityThreshold =
    (1 * b2Settings.b2_lengthUnitsPerMeter) / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2_maxLinearCorrection = 0.2 * b2Settings.b2_lengthUnitsPerMeter;
  b2Settings.b2_maxAngularCorrection = (8 / 180) * b2Settings.b2_pi;
  b2Settings.b2_contactBaumgarte = 0.2;
  b2Settings.b2_timeToSleep = 0.5 * b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2_linearSleepTolerance =
    (0.01 * b2Settings.b2_lengthUnitsPerMeter) /
    b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2_angularSleepTolerance =
    2 / 180 / b2Settings.b2_timeUnitsPerSecond;
  b2Settings.b2Assert = function(e) {
    if (!e) {
      var t;
      t.x++;
    }
  };
  var b2Vec2 = Class.create();
  b2Vec2.prototype = {
    initialize: function(e, t) {
      this.x = e;
      this.y = t;
    },
    SetZero: function() {
      this.x = 0;
      this.y = 0;
    },
    Set: function(e, t) {
      this.x = e;
      this.y = t;
    },
    SetV: function(e) {
      this.x = e.x;
      this.y = e.y;
    },
    Negative: function() {
      return new b2Vec2(-this.x, -this.y);
    },
    Copy: function() {
      return new b2Vec2(this.x, this.y);
    },
    Add: function(e) {
      this.x += e.x;
      this.y += e.y;
    },
    Subtract: function(e) {
      this.x -= e.x;
      this.y -= e.y;
    },
    Multiply: function(e) {
      this.x *= e;
      this.y *= e;
    },
    MulM: function(e) {
      var t = this.x;
      this.x = e.col1.x * t + e.col2.x * this.y;
      this.y = e.col1.y * t + e.col2.y * this.y;
    },
    MulTM: function(e) {
      var t = b2Math.b2Dot(this, e.col1);
      this.y = b2Math.b2Dot(this, e.col2);
      this.x = t;
    },
    CrossVF: function(e) {
      var t = this.x;
      this.x = e * this.y;
      this.y = -e * t;
    },
    CrossFV: function(e) {
      var t = this.x;
      this.x = -e * this.y;
      this.y = e * t;
    },
    MinV: function(e) {
      this.x = this.x < e.x ? this.x : e.x;
      this.y = this.y < e.y ? this.y : e.y;
    },
    MaxV: function(e) {
      this.x = this.x > e.x ? this.x : e.x;
      this.y = this.y > e.y ? this.y : e.y;
    },
    Abs: function() {
      this.x = Math.abs(this.x);
      this.y = Math.abs(this.y);
    },
    Length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    Normalize: function() {
      var e = this.Length();
      if (e < Number.MIN_VALUE) {
        return 0;
      }
      var t = 1 / e;
      this.x *= t;
      this.y *= t;
      return e;
    },
    IsValid: function() {
      return b2Math.b2IsValid(this.x) && b2Math.b2IsValid(this.y);
    },
    x: null,
    y: null
  };
  b2Vec2.Make = function(e, t) {
    return new b2Vec2(e, t);
  };
  var b2Mat22 = Class.create();
  b2Mat22.prototype = {
    initialize: function(e, t, n) {
      if (e == null) e = 0;
      this.col1 = new b2Vec2();
      this.col2 = new b2Vec2();
      if (t != null && n != null) {
        this.col1.SetV(t);
        this.col2.SetV(n);
      } else {
        var r = Math.cos(e);
        var i = Math.sin(e);
        this.col1.x = r;
        this.col2.x = -i;
        this.col1.y = i;
        this.col2.y = r;
      }
    },
    Set: function(e) {
      var t = Math.cos(e);
      var n = Math.sin(e);
      this.col1.x = t;
      this.col2.x = -n;
      this.col1.y = n;
      this.col2.y = t;
    },
    SetVV: function(e, t) {
      this.col1.SetV(e);
      this.col2.SetV(t);
    },
    Copy: function() {
      return new b2Mat22(0, this.col1, this.col2);
    },
    SetM: function(e) {
      this.col1.SetV(e.col1);
      this.col2.SetV(e.col2);
    },
    AddM: function(e) {
      this.col1.x += e.col1.x;
      this.col1.y += e.col1.y;
      this.col2.x += e.col2.x;
      this.col2.y += e.col2.y;
    },
    SetIdentity: function() {
      this.col1.x = 1;
      this.col2.x = 0;
      this.col1.y = 0;
      this.col2.y = 1;
    },
    SetZero: function() {
      this.col1.x = 0;
      this.col2.x = 0;
      this.col1.y = 0;
      this.col2.y = 0;
    },
    Invert: function(e) {
      var t = this.col1.x;
      var n = this.col2.x;
      var r = this.col1.y;
      var i = this.col2.y;
      var s = t * i - n * r;
      s = 1 / s;
      e.col1.x = s * i;
      e.col2.x = -s * n;
      e.col1.y = -s * r;
      e.col2.y = s * t;
      return e;
    },
    Solve: function(e, t, n) {
      var r = this.col1.x;
      var i = this.col2.x;
      var s = this.col1.y;
      var o = this.col2.y;
      var u = r * o - i * s;
      u = 1 / u;
      e.x = u * (o * t - i * n);
      e.y = u * (r * n - s * t);
      return e;
    },
    Abs: function() {
      this.col1.Abs();
      this.col2.Abs();
    },
    col1: new b2Vec2(),
    col2: new b2Vec2()
  };
  var b2Math = Class.create();
  b2Math.prototype = { initialize: function() {} };
  b2Math.b2IsValid = function(e) {
    return isFinite(e);
  };
  b2Math.b2Dot = function(e, t) {
    return e.x * t.x + e.y * t.y;
  };
  b2Math.b2CrossVV = function(e, t) {
    return e.x * t.y - e.y * t.x;
  };
  b2Math.b2CrossVF = function(e, t) {
    var n = new b2Vec2(t * e.y, -t * e.x);
    return n;
  };
  b2Math.b2CrossFV = function(e, t) {
    var n = new b2Vec2(-e * t.y, e * t.x);
    return n;
  };
  b2Math.b2MulMV = function(e, t) {
    var n = new b2Vec2(
      e.col1.x * t.x + e.col2.x * t.y,
      e.col1.y * t.x + e.col2.y * t.y
    );
    return n;
  };
  b2Math.b2MulTMV = function(e, t) {
    var n = new b2Vec2(b2Math.b2Dot(t, e.col1), b2Math.b2Dot(t, e.col2));
    return n;
  };
  b2Math.AddVV = function(e, t) {
    var n = new b2Vec2(e.x + t.x, e.y + t.y);
    return n;
  };
  b2Math.SubtractVV = function(e, t) {
    var n = new b2Vec2(e.x - t.x, e.y - t.y);
    return n;
  };
  b2Math.MulFV = function(e, t) {
    var n = new b2Vec2(e * t.x, e * t.y);
    return n;
  };
  b2Math.AddMM = function(e, t) {
    var n = new b2Mat22(
      0,
      b2Math.AddVV(e.col1, t.col1),
      b2Math.AddVV(e.col2, t.col2)
    );
    return n;
  };
  b2Math.b2MulMM = function(e, t) {
    var n = new b2Mat22(
      0,
      b2Math.b2MulMV(e, t.col1),
      b2Math.b2MulMV(e, t.col2)
    );
    return n;
  };
  b2Math.b2MulTMM = function(e, t) {
    var n = new b2Vec2(
      b2Math.b2Dot(e.col1, t.col1),
      b2Math.b2Dot(e.col2, t.col1)
    );
    var r = new b2Vec2(
      b2Math.b2Dot(e.col1, t.col2),
      b2Math.b2Dot(e.col2, t.col2)
    );
    var i = new b2Mat22(0, n, r);
    return i;
  };
  b2Math.b2Abs = function(e) {
    return e > 0 ? e : -e;
  };
  b2Math.b2AbsV = function(e) {
    var t = new b2Vec2(b2Math.b2Abs(e.x), b2Math.b2Abs(e.y));
    return t;
  };
  b2Math.b2AbsM = function(e) {
    var t = new b2Mat22(0, b2Math.b2AbsV(e.col1), b2Math.b2AbsV(e.col2));
    return t;
  };
  b2Math.b2Min = function(e, t) {
    return e < t ? e : t;
  };
  b2Math.b2MinV = function(e, t) {
    var n = new b2Vec2(b2Math.b2Min(e.x, t.x), b2Math.b2Min(e.y, t.y));
    return n;
  };
  b2Math.b2Max = function(e, t) {
    return e > t ? e : t;
  };
  b2Math.b2MaxV = function(e, t) {
    var n = new b2Vec2(b2Math.b2Max(e.x, t.x), b2Math.b2Max(e.y, t.y));
    return n;
  };
  b2Math.b2Clamp = function(e, t, n) {
    return b2Math.b2Max(t, b2Math.b2Min(e, n));
  };
  b2Math.b2ClampV = function(e, t, n) {
    return b2Math.b2MaxV(t, b2Math.b2MinV(e, n));
  };
  b2Math.b2Swap = function(e, t) {
    var n = e[0];
    e[0] = t[0];
    t[0] = n;
  };
  b2Math.b2Random = function() {
    return Math.random() * 2 - 1;
  };
  b2Math.b2NextPowerOfTwo = function(e) {
    e |= (e >> 1) & 2147483647;
    e |= (e >> 2) & 1073741823;
    e |= (e >> 4) & 268435455;
    e |= (e >> 8) & 16777215;
    e |= (e >> 16) & 65535;
    return e + 1;
  };
  b2Math.b2IsPowerOfTwo = function(e) {
    var t = e > 0 && (e & (e - 1)) == 0;
    return t;
  };
  b2Math.tempVec2 = new b2Vec2();
  b2Math.tempVec3 = new b2Vec2();
  b2Math.tempVec4 = new b2Vec2();
  b2Math.tempVec5 = new b2Vec2();
  b2Math.tempMat = new b2Mat22();
  var b2AABB = Class.create();
  b2AABB.prototype = {
    IsValid: function() {
      var e = this.maxVertex.x;
      var t = this.maxVertex.y;
      e = this.maxVertex.x;
      t = this.maxVertex.y;
      e -= this.minVertex.x;
      t -= this.minVertex.y;
      var n = e >= 0 && t >= 0;
      n = n && this.minVertex.IsValid() && this.maxVertex.IsValid();
      return n;
    },
    minVertex: new b2Vec2(),
    maxVertex: new b2Vec2(),
    initialize: function() {
      this.minVertex = new b2Vec2();
      this.maxVertex = new b2Vec2();
    }
  };
  var b2Bound = Class.create();
  b2Bound.prototype = {
    IsLower: function() {
      return (this.value & 1) == 0;
    },
    IsUpper: function() {
      return (this.value & 1) == 1;
    },
    Swap: function(e) {
      var t = this.value;
      var n = this.proxyId;
      var r = this.stabbingCount;
      this.value = e.value;
      this.proxyId = e.proxyId;
      this.stabbingCount = e.stabbingCount;
      e.value = t;
      e.proxyId = n;
      e.stabbingCount = r;
    },
    value: 0,
    proxyId: 0,
    stabbingCount: 0,
    initialize: function() {}
  };
  var b2BoundValues = Class.create();
  b2BoundValues.prototype = {
    lowerValues: [0, 0],
    upperValues: [0, 0],
    initialize: function() {
      this.lowerValues = [0, 0];
      this.upperValues = [0, 0];
    }
  };
  var b2Pair = Class.create();
  b2Pair.prototype = {
    SetBuffered: function() {
      this.status |= b2Pair.e_pairBuffered;
    },
    ClearBuffered: function() {
      this.status &= ~b2Pair.e_pairBuffered;
    },
    IsBuffered: function() {
      return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered;
    },
    SetRemoved: function() {
      this.status |= b2Pair.e_pairRemoved;
    },
    ClearRemoved: function() {
      this.status &= ~b2Pair.e_pairRemoved;
    },
    IsRemoved: function() {
      return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved;
    },
    SetFinal: function() {
      this.status |= b2Pair.e_pairFinal;
    },
    IsFinal: function() {
      return (this.status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal;
    },
    userData: null,
    proxyId1: 0,
    proxyId2: 0,
    next: 0,
    status: 0,
    initialize: function() {}
  };
  b2Pair.b2_nullPair = b2Settings.USHRT_MAX;
  b2Pair.b2_nullProxy = b2Settings.USHRT_MAX;
  b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs;
  b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1;
  b2Pair.e_pairBuffered = 1;
  b2Pair.e_pairRemoved = 2;
  b2Pair.e_pairFinal = 4;
  var b2PairCallback = Class.create();
  b2PairCallback.prototype = {
    PairAdded: function(e, t) {
      return null;
    },
    PairRemoved: function(e, t, n) {},
    initialize: function() {}
  };
  var b2BufferedPair = Class.create();
  b2BufferedPair.prototype = {
    proxyId1: 0,
    proxyId2: 0,
    initialize: function() {}
  };
  var b2PairManager = Class.create();
  b2PairManager.prototype = {
    initialize: function() {
      var e = 0;
      this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
      for (e = 0; e < b2Pair.b2_tableCapacity; ++e) {
        this.m_hashTable[e] = b2Pair.b2_nullPair;
      }
      this.m_pairs = new Array(b2Settings.b2_maxPairs);
      for (e = 0; e < b2Settings.b2_maxPairs; ++e) {
        this.m_pairs[e] = new b2Pair();
      }
      this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
      for (e = 0; e < b2Settings.b2_maxPairs; ++e) {
        this.m_pairBuffer[e] = new b2BufferedPair();
      }
      for (e = 0; e < b2Settings.b2_maxPairs; ++e) {
        this.m_pairs[e].proxyId1 = b2Pair.b2_nullProxy;
        this.m_pairs[e].proxyId2 = b2Pair.b2_nullProxy;
        this.m_pairs[e].userData = null;
        this.m_pairs[e].status = 0;
        this.m_pairs[e].next = e + 1;
      }
      this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
      this.m_pairCount = 0;
    },
    Initialize: function(e, t) {
      this.m_broadPhase = e;
      this.m_callback = t;
    },
    AddBufferedPair: function(e, t) {
      var n = this.AddPair(e, t);
      if (n.IsBuffered() == false) {
        n.SetBuffered();
        this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = n.proxyId1;
        this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = n.proxyId2;
        ++this.m_pairBufferCount;
      }
      n.ClearRemoved();
      if (b2BroadPhase.s_validate) {
        this.ValidateBuffer();
      }
    },
    RemoveBufferedPair: function(e, t) {
      var n = this.Find(e, t);
      if (n == null) {
        return;
      }
      if (n.IsBuffered() == false) {
        n.SetBuffered();
        this.m_pairBuffer[this.m_pairBufferCount].proxyId1 = n.proxyId1;
        this.m_pairBuffer[this.m_pairBufferCount].proxyId2 = n.proxyId2;
        ++this.m_pairBufferCount;
      }
      n.SetRemoved();
      if (b2BroadPhase.s_validate) {
        this.ValidateBuffer();
      }
    },
    Commit: function() {
      var e = 0;
      var t = 0;
      var n = this.m_broadPhase.m_proxyPool;
      for (e = 0; e < this.m_pairBufferCount; ++e) {
        var r = this.Find(
          this.m_pairBuffer[e].proxyId1,
          this.m_pairBuffer[e].proxyId2
        );
        r.ClearBuffered();
        var i = n[r.proxyId1];
        var s = n[r.proxyId2];
        if (r.IsRemoved()) {
          if (r.IsFinal() == true) {
            this.m_callback.PairRemoved(i.userData, s.userData, r.userData);
          }
          this.m_pairBuffer[t].proxyId1 = r.proxyId1;
          this.m_pairBuffer[t].proxyId2 = r.proxyId2;
          ++t;
        } else {
          if (r.IsFinal() == false) {
            r.userData = this.m_callback.PairAdded(i.userData, s.userData);
            r.SetFinal();
          }
        }
      }
      for (e = 0; e < t; ++e) {
        this.RemovePair(
          this.m_pairBuffer[e].proxyId1,
          this.m_pairBuffer[e].proxyId2
        );
      }
      this.m_pairBufferCount = 0;
      if (b2BroadPhase.s_validate) {
        this.ValidateTable();
      }
    },
    AddPair: function(e, t) {
      if (e > t) {
        var n = e;
        e = t;
        t = n;
      }
      var r = b2PairManager.Hash(e, t) & b2Pair.b2_tableMask;
      var i = (i = this.FindHash(e, t, r));
      if (i != null) {
        return i;
      }
      var s = this.m_freePair;
      i = this.m_pairs[s];
      this.m_freePair = i.next;
      i.proxyId1 = e;
      i.proxyId2 = t;
      i.status = 0;
      i.userData = null;
      i.next = this.m_hashTable[r];
      this.m_hashTable[r] = s;
      ++this.m_pairCount;
      return i;
    },
    RemovePair: function(e, t) {
      if (e > t) {
        var n = e;
        e = t;
        t = n;
      }
      var r = b2PairManager.Hash(e, t) & b2Pair.b2_tableMask;
      var i = this.m_hashTable[r];
      var s = null;
      while (i != b2Pair.b2_nullPair) {
        if (b2PairManager.Equals(this.m_pairs[i], e, t)) {
          var o = i;
          if (s) {
            s.next = this.m_pairs[i].next;
          } else {
            this.m_hashTable[r] = this.m_pairs[i].next;
          }
          var u = this.m_pairs[o];
          var a = u.userData;
          u.next = this.m_freePair;
          u.proxyId1 = b2Pair.b2_nullProxy;
          u.proxyId2 = b2Pair.b2_nullProxy;
          u.userData = null;
          u.status = 0;
          this.m_freePair = o;
          --this.m_pairCount;
          return a;
        } else {
          s = this.m_pairs[i];
          i = s.next;
        }
      }
      return null;
    },
    Find: function(e, t) {
      if (e > t) {
        var n = e;
        e = t;
        t = n;
      }
      var r = b2PairManager.Hash(e, t) & b2Pair.b2_tableMask;
      return this.FindHash(e, t, r);
    },
    FindHash: function(e, t, n) {
      var r = this.m_hashTable[n];
      while (
        r != b2Pair.b2_nullPair &&
        b2PairManager.Equals(this.m_pairs[r], e, t) == false
      ) {
        r = this.m_pairs[r].next;
      }
      if (r == b2Pair.b2_nullPair) {
        return null;
      }
      return this.m_pairs[r];
    },
    ValidateBuffer: function() {},
    ValidateTable: function() {},
    m_broadPhase: null,
    m_callback: null,
    m_pairs: null,
    m_freePair: 0,
    m_pairCount: 0,
    m_pairBuffer: null,
    m_pairBufferCount: 0,
    m_hashTable: null
  };
  b2PairManager.Hash = function(e, t) {
    var n = ((t << 16) & 4294901760) | e;
    n = ~n + ((n << 15) & 4294934528);
    n = n ^ ((n >> 12) & 1048575);
    n = n + ((n << 2) & 4294967292);
    n = n ^ ((n >> 4) & 268435455);
    n = n * 2057;
    n = n ^ ((n >> 16) & 65535);
    return n;
  };
  b2PairManager.Equals = function(e, t, n) {
    return e.proxyId1 == t && e.proxyId2 == n;
  };
  b2PairManager.EqualsPair = function(e, t) {
    return e.proxyId1 == t.proxyId1 && e.proxyId2 == t.proxyId2;
  };
  var b2BroadPhase = Class.create();
  b2BroadPhase.prototype = {
    initialize: function(e, t) {
      this.m_pairManager = new b2PairManager();
      this.m_proxyPool = new Array(b2Settings.b2_maxPairs);
      this.m_bounds = new Array(2 * b2Settings.b2_maxProxies);
      this.m_queryResults = new Array(b2Settings.b2_maxProxies);
      this.m_quantizationFactor = new b2Vec2();
      var n = 0;
      this.m_pairManager.Initialize(this, t);
      this.m_worldAABB = e;
      this.m_proxyCount = 0;
      for (n = 0; n < b2Settings.b2_maxProxies; n++) {
        this.m_queryResults[n] = 0;
      }
      this.m_bounds = new Array(2);
      for (n = 0; n < 2; n++) {
        this.m_bounds[n] = new Array(2 * b2Settings.b2_maxProxies);
        for (var r = 0; r < 2 * b2Settings.b2_maxProxies; r++) {
          this.m_bounds[n][r] = new b2Bound();
        }
      }
      var i = e.maxVertex.x;
      var s = e.maxVertex.y;
      i -= e.minVertex.x;
      s -= e.minVertex.y;
      this.m_quantizationFactor.x = b2Settings.USHRT_MAX / i;
      this.m_quantizationFactor.y = b2Settings.USHRT_MAX / s;
      var o;
      for (n = 0; n < b2Settings.b2_maxProxies - 1; ++n) {
        o = new b2Proxy();
        this.m_proxyPool[n] = o;
        o.SetNext(n + 1);
        o.timeStamp = 0;
        o.overlapCount = b2BroadPhase.b2_invalid;
        o.userData = null;
      }
      o = new b2Proxy();
      this.m_proxyPool[b2Settings.b2_maxProxies - 1] = o;
      o.SetNext(b2Pair.b2_nullProxy);
      o.timeStamp = 0;
      o.overlapCount = b2BroadPhase.b2_invalid;
      o.userData = null;
      this.m_freeProxy = 0;
      this.m_timeStamp = 1;
      this.m_queryResultCount = 0;
    },
    InRange: function(e) {
      var t;
      var n;
      var r;
      var i;
      t = e.minVertex.x;
      n = e.minVertex.y;
      t -= this.m_worldAABB.maxVertex.x;
      n -= this.m_worldAABB.maxVertex.y;
      r = this.m_worldAABB.minVertex.x;
      i = this.m_worldAABB.minVertex.y;
      r -= e.maxVertex.x;
      i -= e.maxVertex.y;
      t = b2Math.b2Max(t, r);
      n = b2Math.b2Max(n, i);
      return b2Math.b2Max(t, n) < 0;
    },
    GetProxy: function(e) {
      if (e == b2Pair.b2_nullProxy || this.m_proxyPool[e].IsValid() == false) {
        return null;
      }
      return this.m_proxyPool[e];
    },
    CreateProxy: function(e, t) {
      var n = 0;
      var r;
      var i = this.m_freeProxy;
      r = this.m_proxyPool[i];
      this.m_freeProxy = r.GetNext();
      r.overlapCount = 0;
      r.userData = t;
      var s = 2 * this.m_proxyCount;
      var o = new Array();
      var u = new Array();
      this.ComputeBounds(o, u, e);
      for (var a = 0; a < 2; ++a) {
        var f = this.m_bounds[a];
        var l = 0;
        var c = 0;
        var h = [l];
        var p = [c];
        this.Query(h, p, o[a], u[a], f, s, a);
        l = h[0];
        c = p[0];
        var d = new Array();
        var v = 0;
        var m = s - c;
        var g;
        var y;
        for (v = 0; v < m; v++) {
          d[v] = new b2Bound();
          g = d[v];
          y = f[c + v];
          g.value = y.value;
          g.proxyId = y.proxyId;
          g.stabbingCount = y.stabbingCount;
        }
        m = d.length;
        var b = c + 2;
        for (v = 0; v < m; v++) {
          y = d[v];
          g = f[b + v];
          g.value = y.value;
          g.proxyId = y.proxyId;
          g.stabbingCount = y.stabbingCount;
        }
        d = new Array();
        m = c - l;
        for (v = 0; v < m; v++) {
          d[v] = new b2Bound();
          g = d[v];
          y = f[l + v];
          g.value = y.value;
          g.proxyId = y.proxyId;
          g.stabbingCount = y.stabbingCount;
        }
        m = d.length;
        b = l + 1;
        for (v = 0; v < m; v++) {
          y = d[v];
          g = f[b + v];
          g.value = y.value;
          g.proxyId = y.proxyId;
          g.stabbingCount = y.stabbingCount;
        }
        ++c;
        f[l].value = o[a];
        f[l].proxyId = i;
        f[c].value = u[a];
        f[c].proxyId = i;
        f[l].stabbingCount = l == 0 ? 0 : f[l - 1].stabbingCount;
        f[c].stabbingCount = f[c - 1].stabbingCount;
        for (n = l; n < c; ++n) {
          f[n].stabbingCount++;
        }
        for (n = l; n < s + 2; ++n) {
          var w = this.m_proxyPool[f[n].proxyId];
          if (f[n].IsLower()) {
            w.lowerBounds[a] = n;
          } else {
            w.upperBounds[a] = n;
          }
        }
      }
      ++this.m_proxyCount;
      for (var E = 0; E < this.m_queryResultCount; ++E) {
        this.m_pairManager.AddBufferedPair(i, this.m_queryResults[E]);
      }
      this.m_pairManager.Commit();
      this.m_queryResultCount = 0;
      this.IncrementTimeStamp();
      return i;
    },
    DestroyProxy: function(e) {
      var t = this.m_proxyPool[e];
      var n = 2 * this.m_proxyCount;
      for (var r = 0; r < 2; ++r) {
        var i = this.m_bounds[r];
        var s = t.lowerBounds[r];
        var o = t.upperBounds[r];
        var u = i[s].value;
        var a = i[o].value;
        var f = new Array();
        var l = 0;
        var c = o - s - 1;
        var h;
        var p;
        for (l = 0; l < c; l++) {
          f[l] = new b2Bound();
          h = f[l];
          p = i[s + 1 + l];
          h.value = p.value;
          h.proxyId = p.proxyId;
          h.stabbingCount = p.stabbingCount;
        }
        c = f.length;
        var d = s;
        for (l = 0; l < c; l++) {
          p = f[l];
          h = i[d + l];
          h.value = p.value;
          h.proxyId = p.proxyId;
          h.stabbingCount = p.stabbingCount;
        }
        f = new Array();
        c = n - o - 1;
        for (l = 0; l < c; l++) {
          f[l] = new b2Bound();
          h = f[l];
          p = i[o + 1 + l];
          h.value = p.value;
          h.proxyId = p.proxyId;
          h.stabbingCount = p.stabbingCount;
        }
        c = f.length;
        d = o - 1;
        for (l = 0; l < c; l++) {
          p = f[l];
          h = i[d + l];
          h.value = p.value;
          h.proxyId = p.proxyId;
          h.stabbingCount = p.stabbingCount;
        }
        c = n - 2;
        for (var v = s; v < c; ++v) {
          var m = this.m_proxyPool[i[v].proxyId];
          if (i[v].IsLower()) {
            m.lowerBounds[r] = v;
          } else {
            m.upperBounds[r] = v;
          }
        }
        c = o - 1;
        for (var g = s; g < c; ++g) {
          i[g].stabbingCount--;
        }
        this.Query([0], [0], u, a, i, n - 2, r);
      }
      for (var y = 0; y < this.m_queryResultCount; ++y) {
        this.m_pairManager.RemoveBufferedPair(e, this.m_queryResults[y]);
      }
      this.m_pairManager.Commit();
      this.m_queryResultCount = 0;
      this.IncrementTimeStamp();
      t.userData = null;
      t.overlapCount = b2BroadPhase.b2_invalid;
      t.lowerBounds[0] = b2BroadPhase.b2_invalid;
      t.lowerBounds[1] = b2BroadPhase.b2_invalid;
      t.upperBounds[0] = b2BroadPhase.b2_invalid;
      t.upperBounds[1] = b2BroadPhase.b2_invalid;
      t.SetNext(this.m_freeProxy);
      this.m_freeProxy = e;
      --this.m_proxyCount;
    },
    MoveProxy: function(e, t) {
      var n = 0;
      var r = 0;
      var i;
      var s;
      var o;
      var u = 0;
      var a;
      if (e == b2Pair.b2_nullProxy || b2Settings.b2_maxProxies <= e) {
        return;
      }
      if (t.IsValid() == false) {
        return;
      }
      var f = 2 * this.m_proxyCount;
      var l = this.m_proxyPool[e];
      var c = new b2BoundValues();
      this.ComputeBounds(c.lowerValues, c.upperValues, t);
      var h = new b2BoundValues();
      for (n = 0; n < 2; ++n) {
        h.lowerValues[n] = this.m_bounds[n][l.lowerBounds[n]].value;
        h.upperValues[n] = this.m_bounds[n][l.upperBounds[n]].value;
      }
      for (n = 0; n < 2; ++n) {
        var p = this.m_bounds[n];
        var d = l.lowerBounds[n];
        var v = l.upperBounds[n];
        var m = c.lowerValues[n];
        var g = c.upperValues[n];
        var y = m - p[d].value;
        var b = g - p[v].value;
        p[d].value = m;
        p[v].value = g;
        if (y < 0) {
          r = d;
          while (r > 0 && m < p[r - 1].value) {
            i = p[r];
            s = p[r - 1];
            var w = s.proxyId;
            var E = this.m_proxyPool[s.proxyId];
            s.stabbingCount++;
            if (s.IsUpper() == true) {
              if (this.TestOverlap(c, E)) {
                this.m_pairManager.AddBufferedPair(e, w);
              }
              E.upperBounds[n]++;
              i.stabbingCount++;
            } else {
              E.lowerBounds[n]++;
              i.stabbingCount--;
            }
            l.lowerBounds[n]--;
            i.Swap(s);
            --r;
          }
        }
        if (b > 0) {
          r = v;
          while (r < f - 1 && p[r + 1].value <= g) {
            i = p[r];
            o = p[r + 1];
            u = o.proxyId;
            a = this.m_proxyPool[u];
            o.stabbingCount++;
            if (o.IsLower() == true) {
              if (this.TestOverlap(c, a)) {
                this.m_pairManager.AddBufferedPair(e, u);
              }
              a.lowerBounds[n]--;
              i.stabbingCount++;
            } else {
              a.upperBounds[n]--;
              i.stabbingCount--;
            }
            l.upperBounds[n]++;
            i.Swap(o);
            r++;
          }
        }
        if (y > 0) {
          r = d;
          while (r < f - 1 && p[r + 1].value <= m) {
            i = p[r];
            o = p[r + 1];
            u = o.proxyId;
            a = this.m_proxyPool[u];
            o.stabbingCount--;
            if (o.IsUpper()) {
              if (this.TestOverlap(h, a)) {
                this.m_pairManager.RemoveBufferedPair(e, u);
              }
              a.upperBounds[n]--;
              i.stabbingCount--;
            } else {
              a.lowerBounds[n]--;
              i.stabbingCount++;
            }
            l.lowerBounds[n]++;
            i.Swap(o);
            r++;
          }
        }
        if (b < 0) {
          r = v;
          while (r > 0 && g < p[r - 1].value) {
            i = p[r];
            s = p[r - 1];
            w = s.proxyId;
            E = this.m_proxyPool[w];
            s.stabbingCount--;
            if (s.IsLower() == true) {
              if (this.TestOverlap(h, E)) {
                this.m_pairManager.RemoveBufferedPair(e, w);
              }
              E.lowerBounds[n]++;
              i.stabbingCount--;
            } else {
              E.upperBounds[n]++;
              i.stabbingCount++;
            }
            l.upperBounds[n]--;
            i.Swap(s);
            r--;
          }
        }
      }
    },
    Commit: function() {
      this.m_pairManager.Commit();
    },
    QueryAABB: function(e, t, n) {
      var r = new Array();
      var i = new Array();
      this.ComputeBounds(r, i, e);
      var s = 0;
      var o = 0;
      var u = [s];
      var a = [o];
      this.Query(u, a, r[0], i[0], this.m_bounds[0], 2 * this.m_proxyCount, 0);
      this.Query(u, a, r[1], i[1], this.m_bounds[1], 2 * this.m_proxyCount, 1);
      var f = 0;
      for (var l = 0; l < this.m_queryResultCount && f < n; ++l, ++f) {
        var c = this.m_proxyPool[this.m_queryResults[l]];
        t[l] = c.userData;
      }
      this.m_queryResultCount = 0;
      this.IncrementTimeStamp();
      return f;
    },
    Validate: function() {
      var e;
      var t;
      var n;
      var r;
      for (var i = 0; i < 2; ++i) {
        var s = this.m_bounds[i];
        var o = 2 * this.m_proxyCount;
        var u = 0;
        for (var a = 0; a < o; ++a) {
          var f = s[a];
          if (f.IsLower() == true) {
            u++;
          } else {
            u--;
          }
        }
      }
    },
    ComputeBounds: function(e, t, n) {
      var r = n.minVertex.x;
      var i = n.minVertex.y;
      r = b2Math.b2Min(r, this.m_worldAABB.maxVertex.x);
      i = b2Math.b2Min(i, this.m_worldAABB.maxVertex.y);
      r = b2Math.b2Max(r, this.m_worldAABB.minVertex.x);
      i = b2Math.b2Max(i, this.m_worldAABB.minVertex.y);
      var s = n.maxVertex.x;
      var o = n.maxVertex.y;
      s = b2Math.b2Min(s, this.m_worldAABB.maxVertex.x);
      o = b2Math.b2Min(o, this.m_worldAABB.maxVertex.y);
      s = b2Math.b2Max(s, this.m_worldAABB.minVertex.x);
      o = b2Math.b2Max(o, this.m_worldAABB.minVertex.y);
      e[0] =
        (this.m_quantizationFactor.x * (r - this.m_worldAABB.minVertex.x)) &
        (b2Settings.USHRT_MAX - 1);
      t[0] =
        ((this.m_quantizationFactor.x * (s - this.m_worldAABB.minVertex.x)) &
          65535) |
        1;
      e[1] =
        (this.m_quantizationFactor.y * (i - this.m_worldAABB.minVertex.y)) &
        (b2Settings.USHRT_MAX - 1);
      t[1] =
        ((this.m_quantizationFactor.y * (o - this.m_worldAABB.minVertex.y)) &
          65535) |
        1;
    },
    TestOverlapValidate: function(e, t) {
      for (var n = 0; n < 2; ++n) {
        var r = this.m_bounds[n];
        if (r[e.lowerBounds[n]].value > r[t.upperBounds[n]].value) return false;
        if (r[e.upperBounds[n]].value < r[t.lowerBounds[n]].value) return false;
      }
      return true;
    },
    TestOverlap: function(e, t) {
      for (var n = 0; n < 2; ++n) {
        var r = this.m_bounds[n];
        if (e.lowerValues[n] > r[t.upperBounds[n]].value) return false;
        if (e.upperValues[n] < r[t.lowerBounds[n]].value) return false;
      }
      return true;
    },
    Query: function(e, t, n, r, i, s, o) {
      var u = b2BroadPhase.BinarySearch(i, s, n);
      var a = b2BroadPhase.BinarySearch(i, s, r);
      for (var f = u; f < a; ++f) {
        if (i[f].IsLower()) {
          this.IncrementOverlapCount(i[f].proxyId);
        }
      }
      if (u > 0) {
        var l = u - 1;
        var c = i[l].stabbingCount;
        while (c) {
          if (i[l].IsLower()) {
            var h = this.m_proxyPool[i[l].proxyId];
            if (u <= h.upperBounds[o]) {
              this.IncrementOverlapCount(i[l].proxyId);
              --c;
            }
          }
          --l;
        }
      }
      e[0] = u;
      t[0] = a;
    },
    IncrementOverlapCount: function(e) {
      var t = this.m_proxyPool[e];
      if (t.timeStamp < this.m_timeStamp) {
        t.timeStamp = this.m_timeStamp;
        t.overlapCount = 1;
      } else {
        t.overlapCount = 2;
        this.m_queryResults[this.m_queryResultCount] = e;
        ++this.m_queryResultCount;
      }
    },
    IncrementTimeStamp: function() {
      if (this.m_timeStamp == b2Settings.USHRT_MAX) {
        for (var e = 0; e < b2Settings.b2_maxProxies; ++e) {
          this.m_proxyPool[e].timeStamp = 0;
        }
        this.m_timeStamp = 1;
      } else {
        ++this.m_timeStamp;
      }
    },
    m_pairManager: new b2PairManager(),
    m_proxyPool: new Array(b2Settings.b2_maxPairs),
    m_freeProxy: 0,
    m_bounds: new Array(2 * b2Settings.b2_maxProxies),
    m_queryResults: new Array(b2Settings.b2_maxProxies),
    m_queryResultCount: 0,
    m_worldAABB: null,
    m_quantizationFactor: new b2Vec2(),
    m_proxyCount: 0,
    m_timeStamp: 0
  };
  b2BroadPhase.s_validate = false;
  b2BroadPhase.b2_invalid = b2Settings.USHRT_MAX;
  b2BroadPhase.b2_nullEdge = b2Settings.USHRT_MAX;
  b2BroadPhase.BinarySearch = function(e, t, n) {
    var r = 0;
    var i = t - 1;
    while (r <= i) {
      var s = Math.floor((r + i) / 2);
      if (e[s].value > n) {
        i = s - 1;
      } else if (e[s].value < n) {
        r = s + 1;
      } else {
        return s;
      }
    }
    return r;
  };
  var b2Collision = Class.create();
  b2Collision.prototype = { initialize: function() {} };
  b2Collision.b2_nullFeature = 255;
  b2Collision.ClipSegmentToLine = function(e, t, n, r) {
    var i = 0;
    var s = t[0].v;
    var o = t[1].v;
    var u = b2Math.b2Dot(n, t[0].v) - r;
    var a = b2Math.b2Dot(n, t[1].v) - r;
    if (u <= 0) e[i++] = t[0];
    if (a <= 0) e[i++] = t[1];
    if (u * a < 0) {
      var f = u / (u - a);
      var l = e[i].v;
      l.x = s.x + f * (o.x - s.x);
      l.y = s.y + f * (o.y - s.y);
      if (u > 0) {
        e[i].id = t[0].id;
      } else {
        e[i].id = t[1].id;
      }
      ++i;
    }
    return i;
  };
  b2Collision.EdgeSeparation = function(e, t, n) {
    var r = e.m_vertices;
    var i = n.m_vertexCount;
    var s = n.m_vertices;
    var o = e.m_normals[t].x;
    var u = e.m_normals[t].y;
    var a = o;
    var f = e.m_R;
    o = f.col1.x * a + f.col2.x * u;
    u = f.col1.y * a + f.col2.y * u;
    var l = o;
    var c = u;
    f = n.m_R;
    a = l * f.col1.x + c * f.col1.y;
    c = l * f.col2.x + c * f.col2.y;
    l = a;
    var h = 0;
    var p = Number.MAX_VALUE;
    for (var d = 0; d < i; ++d) {
      var v = s[d];
      var m = v.x * l + v.y * c;
      if (m < p) {
        p = m;
        h = d;
      }
    }
    f = e.m_R;
    var g = e.m_position.x + (f.col1.x * r[t].x + f.col2.x * r[t].y);
    var y = e.m_position.y + (f.col1.y * r[t].x + f.col2.y * r[t].y);
    f = n.m_R;
    var b = n.m_position.x + (f.col1.x * s[h].x + f.col2.x * s[h].y);
    var w = n.m_position.y + (f.col1.y * s[h].x + f.col2.y * s[h].y);
    b -= g;
    w -= y;
    var E = b * o + w * u;
    return E;
  };
  b2Collision.FindMaxSeparation = function(e, t, n, r) {
    var i = t.m_vertexCount;
    var s = n.m_position.x - t.m_position.x;
    var o = n.m_position.y - t.m_position.y;
    var u = s * t.m_R.col1.x + o * t.m_R.col1.y;
    var a = s * t.m_R.col2.x + o * t.m_R.col2.y;
    var f = 0;
    var l = -Number.MAX_VALUE;
    for (var c = 0; c < i; ++c) {
      var h = t.m_normals[c].x * u + t.m_normals[c].y * a;
      if (h > l) {
        l = h;
        f = c;
      }
    }
    var p = b2Collision.EdgeSeparation(t, f, n);
    if (p > 0 && r == false) {
      return p;
    }
    var d = f - 1 >= 0 ? f - 1 : i - 1;
    var v = b2Collision.EdgeSeparation(t, d, n);
    if (v > 0 && r == false) {
      return v;
    }
    var m = f + 1 < i ? f + 1 : 0;
    var g = b2Collision.EdgeSeparation(t, m, n);
    if (g > 0 && r == false) {
      return g;
    }
    var y = 0;
    var b;
    var w = 0;
    if (v > p && v > g) {
      w = -1;
      y = d;
      b = v;
    } else if (g > p) {
      w = 1;
      y = m;
      b = g;
    } else {
      e[0] = f;
      return p;
    }
    while (true) {
      if (w == -1) f = y - 1 >= 0 ? y - 1 : i - 1;
      else f = y + 1 < i ? y + 1 : 0;
      p = b2Collision.EdgeSeparation(t, f, n);
      if (p > 0 && r == false) {
        return p;
      }
      if (p > b) {
        y = f;
        b = p;
      } else {
        break;
      }
    }
    e[0] = y;
    return b;
  };
  b2Collision.FindIncidentEdge = function(e, t, n, r) {
    var i = t.m_vertexCount;
    var s = t.m_vertices;
    var o = r.m_vertexCount;
    var u = r.m_vertices;
    var a = n;
    var f = n + 1 == i ? 0 : n + 1;
    var l = s[f];
    var c = l.x;
    var h = l.y;
    l = s[a];
    c -= l.x;
    h -= l.y;
    var p = c;
    c = h;
    h = -p;
    var d = 1 / Math.sqrt(c * c + h * h);
    c *= d;
    h *= d;
    var v = c;
    var m = h;
    p = v;
    var g = t.m_R;
    v = g.col1.x * p + g.col2.x * m;
    m = g.col1.y * p + g.col2.y * m;
    var y = v;
    var b = m;
    g = r.m_R;
    p = y * g.col1.x + b * g.col1.y;
    b = y * g.col2.x + b * g.col2.y;
    y = p;
    var w = 0;
    var E = 0;
    var S = Number.MAX_VALUE;
    for (var x = 0; x < o; ++x) {
      var T = x;
      var N = x + 1 < o ? x + 1 : 0;
      l = u[N];
      var C = l.x;
      var k = l.y;
      l = u[T];
      C -= l.x;
      k -= l.y;
      p = C;
      C = k;
      k = -p;
      d = 1 / Math.sqrt(C * C + k * k);
      C *= d;
      k *= d;
      var L = C * y + k * b;
      if (L < S) {
        S = L;
        w = T;
        E = N;
      }
    }
    var A;
    A = e[0];
    l = A.v;
    l.SetV(u[w]);
    l.MulM(r.m_R);
    l.Add(r.m_position);
    A.id.features.referenceFace = n;
    A.id.features.incidentEdge = w;
    A.id.features.incidentVertex = w;
    A = e[1];
    l = A.v;
    l.SetV(u[E]);
    l.MulM(r.m_R);
    l.Add(r.m_position);
    A.id.features.referenceFace = n;
    A.id.features.incidentEdge = w;
    A.id.features.incidentVertex = E;
  };
  b2Collision.b2CollidePolyTempVec = new b2Vec2();
  b2Collision.b2CollidePoly = function(e, t, n, r) {
    e.pointCount = 0;
    var i = 0;
    var s = [i];
    var o = b2Collision.FindMaxSeparation(s, t, n, r);
    i = s[0];
    if (o > 0 && r == false) return;
    var u = 0;
    var a = [u];
    var f = b2Collision.FindMaxSeparation(a, n, t, r);
    u = a[0];
    if (f > 0 && r == false) return;
    var l;
    var c;
    var h = 0;
    var p = 0;
    var d = 0.98;
    var v = 0.001;
    if (f > d * o + v) {
      l = n;
      c = t;
      h = u;
      p = 1;
    } else {
      l = t;
      c = n;
      h = i;
      p = 0;
    }
    var m = [new ClipVertex(), new ClipVertex()];
    b2Collision.FindIncidentEdge(m, l, h, c);
    var g = l.m_vertexCount;
    var y = l.m_vertices;
    var b = y[h];
    var w = h + 1 < g ? y[h + 1] : y[0];
    var E = w.x - b.x;
    var S = w.y - b.y;
    var x = w.x - b.x;
    var T = w.y - b.y;
    var N = x;
    var C = l.m_R;
    x = C.col1.x * N + C.col2.x * T;
    T = C.col1.y * N + C.col2.y * T;
    var k = 1 / Math.sqrt(x * x + T * T);
    x *= k;
    T *= k;
    var L = x;
    var A = T;
    N = L;
    L = A;
    A = -N;
    var O = b.x;
    var M = b.y;
    N = O;
    C = l.m_R;
    O = C.col1.x * N + C.col2.x * M;
    M = C.col1.y * N + C.col2.y * M;
    O += l.m_position.x;
    M += l.m_position.y;
    var _ = w.x;
    var D = w.y;
    N = _;
    C = l.m_R;
    _ = C.col1.x * N + C.col2.x * D;
    D = C.col1.y * N + C.col2.y * D;
    _ += l.m_position.x;
    D += l.m_position.y;
    var P = L * O + A * M;
    var H = -(x * O + T * M);
    var B = x * _ + T * D;
    var j = [new ClipVertex(), new ClipVertex()];
    var F = [new ClipVertex(), new ClipVertex()];
    var I = 0;
    b2Collision.b2CollidePolyTempVec.Set(-x, -T);
    I = b2Collision.ClipSegmentToLine(
      j,
      m,
      b2Collision.b2CollidePolyTempVec,
      H
    );
    if (I < 2) return;
    b2Collision.b2CollidePolyTempVec.Set(x, T);
    I = b2Collision.ClipSegmentToLine(
      F,
      j,
      b2Collision.b2CollidePolyTempVec,
      B
    );
    if (I < 2) return;
    if (p) {
      e.normal.Set(-L, -A);
    } else {
      e.normal.Set(L, A);
    }
    var q = 0;
    for (var R = 0; R < b2Settings.b2_maxManifoldPoints; ++R) {
      var U = F[R].v;
      var z = L * U.x + A * U.y - P;
      if (z <= 0 || r == true) {
        var W = e.points[q];
        W.separation = z;
        W.position.SetV(F[R].v);
        W.id.Set(F[R].id);
        W.id.features.flip = p;
        ++q;
      }
    }
    e.pointCount = q;
  };
  b2Collision.b2CollideCircle = function(e, t, n, r) {
    e.pointCount = 0;
    var i = n.m_position.x - t.m_position.x;
    var s = n.m_position.y - t.m_position.y;
    var o = i * i + s * s;
    var u = t.m_radius + n.m_radius;
    if (o > u * u && r == false) {
      return;
    }
    var a;
    if (o < Number.MIN_VALUE) {
      a = -u;
      e.normal.Set(0, 1);
    } else {
      var f = Math.sqrt(o);
      a = f - u;
      var l = 1 / f;
      e.normal.x = l * i;
      e.normal.y = l * s;
    }
    e.pointCount = 1;
    var c = e.points[0];
    c.id.set_key(0);
    c.separation = a;
    c.position.x = n.m_position.x - n.m_radius * e.normal.x;
    c.position.y = n.m_position.y - n.m_radius * e.normal.y;
  };
  b2Collision.b2CollidePolyAndCircle = function(e, t, n, r) {
    e.pointCount = 0;
    var i;
    var s;
    var o;
    var u = n.m_position.x - t.m_position.x;
    var a = n.m_position.y - t.m_position.y;
    var f = t.m_R;
    var l = u * f.col1.x + a * f.col1.y;
    a = u * f.col2.x + a * f.col2.y;
    u = l;
    var c;
    var h = 0;
    var p = -Number.MAX_VALUE;
    var d = n.m_radius;
    for (var v = 0; v < t.m_vertexCount; ++v) {
      var m =
        t.m_normals[v].x * (u - t.m_vertices[v].x) +
        t.m_normals[v].y * (a - t.m_vertices[v].y);
      if (m > d) {
        return;
      }
      if (m > p) {
        p = m;
        h = v;
      }
    }
    if (p < Number.MIN_VALUE) {
      e.pointCount = 1;
      var g = t.m_normals[h];
      e.normal.x = f.col1.x * g.x + f.col2.x * g.y;
      e.normal.y = f.col1.y * g.x + f.col2.y * g.y;
      i = e.points[0];
      i.id.features.incidentEdge = h;
      i.id.features.incidentVertex = b2Collision.b2_nullFeature;
      i.id.features.referenceFace = b2Collision.b2_nullFeature;
      i.id.features.flip = 0;
      i.position.x = n.m_position.x - d * e.normal.x;
      i.position.y = n.m_position.y - d * e.normal.y;
      i.separation = p - d;
      return;
    }
    var y = h;
    var b = y + 1 < t.m_vertexCount ? y + 1 : 0;
    var w = t.m_vertices[b].x - t.m_vertices[y].x;
    var E = t.m_vertices[b].y - t.m_vertices[y].y;
    var S = Math.sqrt(w * w + E * E);
    w /= S;
    E /= S;
    if (S < Number.MIN_VALUE) {
      s = u - t.m_vertices[y].x;
      o = a - t.m_vertices[y].y;
      c = Math.sqrt(s * s + o * o);
      s /= c;
      o /= c;
      if (c > d) {
        return;
      }
      e.pointCount = 1;
      e.normal.Set(f.col1.x * s + f.col2.x * o, f.col1.y * s + f.col2.y * o);
      i = e.points[0];
      i.id.features.incidentEdge = b2Collision.b2_nullFeature;
      i.id.features.incidentVertex = y;
      i.id.features.referenceFace = b2Collision.b2_nullFeature;
      i.id.features.flip = 0;
      i.position.x = n.m_position.x - d * e.normal.x;
      i.position.y = n.m_position.y - d * e.normal.y;
      i.separation = c - d;
      return;
    }
    var x = (u - t.m_vertices[y].x) * w + (a - t.m_vertices[y].y) * E;
    i = e.points[0];
    i.id.features.incidentEdge = b2Collision.b2_nullFeature;
    i.id.features.incidentVertex = b2Collision.b2_nullFeature;
    i.id.features.referenceFace = b2Collision.b2_nullFeature;
    i.id.features.flip = 0;
    var T, N;
    if (x <= 0) {
      T = t.m_vertices[y].x;
      N = t.m_vertices[y].y;
      i.id.features.incidentVertex = y;
    } else if (x >= S) {
      T = t.m_vertices[b].x;
      N = t.m_vertices[b].y;
      i.id.features.incidentVertex = b;
    } else {
      T = w * x + t.m_vertices[y].x;
      N = E * x + t.m_vertices[y].y;
      i.id.features.incidentEdge = y;
    }
    s = u - T;
    o = a - N;
    c = Math.sqrt(s * s + o * o);
    s /= c;
    o /= c;
    if (c > d) {
      return;
    }
    e.pointCount = 1;
    e.normal.Set(f.col1.x * s + f.col2.x * o, f.col1.y * s + f.col2.y * o);
    i.position.x = n.m_position.x - d * e.normal.x;
    i.position.y = n.m_position.y - d * e.normal.y;
    i.separation = c - d;
  };
  b2Collision.b2TestOverlap = function(e, t) {
    var n = t.minVertex;
    var r = e.maxVertex;
    var i = n.x - r.x;
    var s = n.y - r.y;
    n = e.minVertex;
    r = t.maxVertex;
    var o = n.x - r.x;
    var u = n.y - r.y;
    if (i > 0 || s > 0) return false;
    if (o > 0 || u > 0) return false;
    return true;
  };
  var Features = Class.create();
  Features.prototype = {
    set_referenceFace: function(e) {
      this._referenceFace = e;
      this._m_id._key =
        (this._m_id._key & 4294967040) | (this._referenceFace & 255);
    },
    get_referenceFace: function() {
      return this._referenceFace;
    },
    _referenceFace: 0,
    set_incidentEdge: function(e) {
      this._incidentEdge = e;
      this._m_id._key =
        (this._m_id._key & 4294902015) | ((this._incidentEdge << 8) & 65280);
    },
    get_incidentEdge: function() {
      return this._incidentEdge;
    },
    _incidentEdge: 0,
    set_incidentVertex: function(e) {
      this._incidentVertex = e;
      this._m_id._key =
        (this._m_id._key & 4278255615) |
        ((this._incidentVertex << 16) & 16711680);
    },
    get_incidentVertex: function() {
      return this._incidentVertex;
    },
    _incidentVertex: 0,
    set_flip: function(e) {
      this._flip = e;
      this._m_id._key =
        (this._m_id._key & 16777215) | ((this._flip << 24) & 4278190080);
    },
    get_flip: function() {
      return this._flip;
    },
    _flip: 0,
    _m_id: null,
    initialize: function() {}
  };
  var b2ContactID = Class.create();
  b2ContactID.prototype = {
    initialize: function() {
      this.features = new Features();
      this.features._m_id = this;
    },
    Set: function(e) {
      this.set_key(e._key);
    },
    Copy: function() {
      var e = new b2ContactID();
      e.set_key(this._key);
      return e;
    },
    get_key: function() {
      return this._key;
    },
    set_key: function(e) {
      this._key = e;
      this.features._referenceFace = this._key & 255;
      this.features._incidentEdge = ((this._key & 65280) >> 8) & 255;
      this.features._incidentVertex = ((this._key & 16711680) >> 16) & 255;
      this.features._flip = ((this._key & 4278190080) >> 24) & 255;
    },
    features: new Features(),
    _key: 0
  };
  var b2ContactPoint = Class.create();
  b2ContactPoint.prototype = {
    position: new b2Vec2(),
    separation: null,
    normalImpulse: null,
    tangentImpulse: null,
    id: new b2ContactID(),
    initialize: function() {
      this.position = new b2Vec2();
      this.id = new b2ContactID();
    }
  };
  var b2Distance = Class.create();
  b2Distance.prototype = { initialize: function() {} };
  b2Distance.ProcessTwo = function(e, t, n, r, i) {
    var s = -i[1].x;
    var o = -i[1].y;
    var u = i[0].x - i[1].x;
    var a = i[0].y - i[1].y;
    var f = Math.sqrt(u * u + a * a);
    u /= f;
    a /= f;
    var l = s * u + o * a;
    if (l <= 0 || f < Number.MIN_VALUE) {
      e.SetV(n[1]);
      t.SetV(r[1]);
      n[0].SetV(n[1]);
      r[0].SetV(r[1]);
      i[0].SetV(i[1]);
      return 1;
    }
    l /= f;
    e.x = n[1].x + l * (n[0].x - n[1].x);
    e.y = n[1].y + l * (n[0].y - n[1].y);
    t.x = r[1].x + l * (r[0].x - r[1].x);
    t.y = r[1].y + l * (r[0].y - r[1].y);
    return 2;
  };
  b2Distance.ProcessThree = function(e, t, n, r, i) {
    var s = i[0].x;
    var o = i[0].y;
    var u = i[1].x;
    var a = i[1].y;
    var f = i[2].x;
    var l = i[2].y;
    var c = u - s;
    var h = a - o;
    var p = f - s;
    var d = l - o;
    var v = f - u;
    var m = l - a;
    var g = -(s * c + o * h);
    var y = u * c + a * h;
    var b = -(s * p + o * d);
    var w = f * p + l * d;
    var E = -(u * v + a * m);
    var S = f * v + l * m;
    if (w <= 0 && S <= 0) {
      e.SetV(n[2]);
      t.SetV(r[2]);
      n[0].SetV(n[2]);
      r[0].SetV(r[2]);
      i[0].SetV(i[2]);
      return 1;
    }
    var x = c * d - h * p;
    var T = x * (s * a - o * u);
    var N = x * (u * l - a * f);
    if (N <= 0 && E >= 0 && S >= 0) {
      var C = E / (E + S);
      e.x = n[1].x + C * (n[2].x - n[1].x);
      e.y = n[1].y + C * (n[2].y - n[1].y);
      t.x = r[1].x + C * (r[2].x - r[1].x);
      t.y = r[1].y + C * (r[2].y - r[1].y);
      n[0].SetV(n[2]);
      r[0].SetV(r[2]);
      i[0].SetV(i[2]);
      return 2;
    }
    var k = x * (f * o - l * s);
    if (k <= 0 && b >= 0 && w >= 0) {
      var C = b / (b + w);
      e.x = n[0].x + C * (n[2].x - n[0].x);
      e.y = n[0].y + C * (n[2].y - n[0].y);
      t.x = r[0].x + C * (r[2].x - r[0].x);
      t.y = r[0].y + C * (r[2].y - r[0].y);
      n[1].SetV(n[2]);
      r[1].SetV(r[2]);
      i[1].SetV(i[2]);
      return 2;
    }
    var L = N + k + T;
    L = 1 / L;
    var A = N * L;
    var O = k * L;
    var M = 1 - A - O;
    e.x = A * n[0].x + O * n[1].x + M * n[2].x;
    e.y = A * n[0].y + O * n[1].y + M * n[2].y;
    t.x = A * r[0].x + O * r[1].x + M * r[2].x;
    t.y = A * r[0].y + O * r[1].y + M * r[2].y;
    return 3;
  };
  b2Distance.InPoinsts = function(e, t, n) {
    for (var r = 0; r < n; ++r) {
      if (e.x == t[r].x && e.y == t[r].y) {
        return true;
      }
    }
    return false;
  };
  b2Distance.Distance = function(e, t, n, r) {
    var i = new Array(3);
    var s = new Array(3);
    var o = new Array(3);
    var u = 0;
    e.SetV(n.m_position);
    t.SetV(r.m_position);
    var a = 0;
    var f = 20;
    for (var l = 0; l < f; ++l) {
      var c = t.x - e.x;
      var h = t.y - e.y;
      var p = n.Support(c, h);
      var d = r.Support(-c, -h);
      a = c * c + h * h;
      var v = d.x - p.x;
      var m = d.y - p.y;
      var g = c * v + h * m;
      if (a - b2Dot(c * v + h * m) <= 0.01 * a) {
        if (u == 0) {
          e.SetV(p);
          t.SetV(d);
        }
        b2Distance.g_GJK_Iterations = l;
        return Math.sqrt(a);
      }
      switch (u) {
        case 0:
          i[0].SetV(p);
          s[0].SetV(d);
          o[0] = w;
          e.SetV(i[0]);
          t.SetV(s[0]);
          ++u;
          break;
        case 1:
          i[1].SetV(p);
          s[1].SetV(d);
          o[1].x = v;
          o[1].y = m;
          u = b2Distance.ProcessTwo(e, t, i, s, o);
          break;
        case 2:
          i[2].SetV(p);
          s[2].SetV(d);
          o[2].x = v;
          o[2].y = m;
          u = b2Distance.ProcessThree(e, t, i, s, o);
          break;
      }
      if (u == 3) {
        b2Distance.g_GJK_Iterations = l;
        return 0;
      }
      var y = -Number.MAX_VALUE;
      for (var b = 0; b < u; ++b) {
        y = b2Math.b2Max(y, o[b].x * o[b].x + o[b].y * o[b].y);
      }
      if (u == 3 || a <= 100 * Number.MIN_VALUE * y) {
        b2Distance.g_GJK_Iterations = l;
        return Math.sqrt(a);
      }
    }
    b2Distance.g_GJK_Iterations = f;
    return Math.sqrt(a);
  };
  b2Distance.g_GJK_Iterations = 0;
  var b2Manifold = Class.create();
  b2Manifold.prototype = {
    initialize: function() {
      this.points = new Array(b2Settings.b2_maxManifoldPoints);
      for (var e = 0; e < b2Settings.b2_maxManifoldPoints; e++) {
        this.points[e] = new b2ContactPoint();
      }
      this.normal = new b2Vec2();
    },
    points: null,
    normal: null,
    pointCount: 0
  };
  var b2OBB = Class.create();
  b2OBB.prototype = {
    R: new b2Mat22(),
    center: new b2Vec2(),
    extents: new b2Vec2(),
    initialize: function() {
      this.R = new b2Mat22();
      this.center = new b2Vec2();
      this.extents = new b2Vec2();
    }
  };
  var b2Proxy = Class.create();
  b2Proxy.prototype = {
    GetNext: function() {
      return this.lowerBounds[0];
    },
    SetNext: function(e) {
      this.lowerBounds[0] = e;
    },
    IsValid: function() {
      return this.overlapCount != b2BroadPhase.b2_invalid;
    },
    lowerBounds: [0, 0],
    upperBounds: [0, 0],
    overlapCount: 0,
    timeStamp: 0,
    userData: null,
    initialize: function() {
      this.lowerBounds = [0, 0];
      this.upperBounds = [0, 0];
    }
  };
  var ClipVertex = Class.create();
  ClipVertex.prototype = {
    v: new b2Vec2(),
    id: new b2ContactID(),
    initialize: function() {
      this.v = new b2Vec2();
      this.id = new b2ContactID();
    }
  };
  var b2Shape = Class.create();
  b2Shape.prototype = {
    TestPoint: function(e) {
      return false;
    },
    GetUserData: function() {
      return this.m_userData;
    },
    GetType: function() {
      return this.m_type;
    },
    GetBody: function() {
      return this.m_body;
    },
    GetPosition: function() {
      return this.m_position;
    },
    GetRotationMatrix: function() {
      return this.m_R;
    },
    ResetProxy: function(e) {},
    GetNext: function() {
      return this.m_next;
    },
    initialize: function(e, t) {
      this.m_R = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_userData = e.userData;
      this.m_friction = e.friction;
      this.m_restitution = e.restitution;
      this.m_body = t;
      this.m_proxyId = b2Pair.b2_nullProxy;
      this.m_maxRadius = 0;
      this.m_categoryBits = e.categoryBits;
      this.m_maskBits = e.maskBits;
      this.m_groupIndex = e.groupIndex;
    },
    DestroyProxy: function() {
      if (this.m_proxyId != b2Pair.b2_nullProxy) {
        this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId);
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
    },
    Synchronize: function(e, t, n, r) {},
    QuickSync: function(e, t) {},
    Support: function(e, t, n) {},
    GetMaxRadius: function() {
      return this.m_maxRadius;
    },
    m_next: null,
    m_R: new b2Mat22(),
    m_position: new b2Vec2(),
    m_type: 0,
    m_userData: null,
    m_body: null,
    m_friction: null,
    m_restitution: null,
    m_maxRadius: null,
    m_proxyId: 0,
    m_categoryBits: 0,
    m_maskBits: 0,
    m_groupIndex: 0
  };
  b2Shape.Create = function(e, t, n) {
    switch (e.type) {
      case b2Shape.e_circleShape: {
        return new b2CircleShape(e, t, n);
      }
      case b2Shape.e_boxShape:
      case b2Shape.e_polyShape: {
        return new b2PolyShape(e, t, n);
      }
    }
    return null;
  };
  b2Shape.Destroy = function(e) {
    if (e.m_proxyId != b2Pair.b2_nullProxy)
      e.m_body.m_world.m_broadPhase.DestroyProxy(e.m_proxyId);
  };
  b2Shape.e_unknownShape = -1;
  b2Shape.e_circleShape = 0;
  b2Shape.e_boxShape = 1;
  b2Shape.e_polyShape = 2;
  b2Shape.e_meshShape = 3;
  b2Shape.e_shapeTypeCount = 4;
  b2Shape.PolyMass = function(e, t, n, r) {
    var i = new b2Vec2();
    i.SetZero();
    var s = 0;
    var o = 0;
    var u = new b2Vec2(0, 0);
    var a = 1 / 3;
    for (var f = 0; f < n; ++f) {
      var l = u;
      var c = t[f];
      var h = f + 1 < n ? t[f + 1] : t[0];
      var p = b2Math.SubtractVV(c, l);
      var d = b2Math.SubtractVV(h, l);
      var v = b2Math.b2CrossVV(p, d);
      var m = 0.5 * v;
      s += m;
      var g = new b2Vec2();
      g.SetV(l);
      g.Add(c);
      g.Add(h);
      g.Multiply(a * m);
      i.Add(g);
      var y = l.x;
      var b = l.y;
      var w = p.x;
      var E = p.y;
      var S = d.x;
      var x = d.y;
      var T =
        a * (0.25 * (w * w + S * w + S * S) + (y * w + y * S)) + 0.5 * y * y;
      var N =
        a * (0.25 * (E * E + x * E + x * x) + (b * E + b * x)) + 0.5 * b * b;
      o += v * (T + N);
    }
    e.mass = r * s;
    i.Multiply(1 / s);
    e.center = i;
    o = r * (o - s * b2Math.b2Dot(i, i));
    e.I = o;
  };
  b2Shape.PolyCentroid = function(e, t, n) {
    var r = 0;
    var i = 0;
    var s = 0;
    var o = 0;
    var u = 0;
    var a = 1 / 3;
    for (var f = 0; f < t; ++f) {
      var l = o;
      var c = u;
      var h = e[f].x;
      var p = e[f].y;
      var d = f + 1 < t ? e[f + 1].x : e[0].x;
      var v = f + 1 < t ? e[f + 1].y : e[0].y;
      var m = h - l;
      var g = p - c;
      var y = d - l;
      var b = v - c;
      var w = m * b - g * y;
      var E = 0.5 * w;
      s += E;
      r += E * a * (l + h + d);
      i += E * a * (c + p + v);
    }
    r *= 1 / s;
    i *= 1 / s;
    n.Set(r, i);
  };
  var b2ShapeDef = Class.create();
  b2ShapeDef.prototype = {
    initialize: function() {
      this.type = b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new b2Vec2(0, 0);
      this.localRotation = 0;
      this.friction = 0.2;
      this.restitution = 0;
      this.density = 0;
      this.categoryBits = 1;
      this.maskBits = 65535;
      this.groupIndex = 0;
    },
    ComputeMass: function(e) {
      e.center = new b2Vec2(0, 0);
      if (this.density == 0) {
        e.mass = 0;
        e.center.Set(0, 0);
        e.I = 0;
      }
      switch (this.type) {
        case b2Shape.e_circleShape:
          {
            var t = this;
            e.mass = this.density * b2Settings.b2_pi * t.radius * t.radius;
            e.center.Set(0, 0);
            e.I = 0.5 * e.mass * t.radius * t.radius;
          }
          break;
        case b2Shape.e_boxShape:
          {
            var n = this;
            e.mass = 4 * this.density * n.extents.x * n.extents.y;
            e.center.Set(0, 0);
            e.I = (e.mass / 3) * b2Math.b2Dot(n.extents, n.extents);
          }
          break;
        case b2Shape.e_polyShape:
          {
            var r = this;
            b2Shape.PolyMass(e, r.vertices, r.vertexCount, this.density);
          }
          break;
        default:
          e.mass = 0;
          e.center.Set(0, 0);
          e.I = 0;
          break;
      }
    },
    type: 0,
    userData: null,
    localPosition: null,
    localRotation: null,
    friction: null,
    restitution: null,
    density: null,
    categoryBits: 0,
    maskBits: 0,
    groupIndex: 0
  };
  var b2BoxDef = Class.create();
  Object.extend(b2BoxDef.prototype, b2ShapeDef.prototype);
  Object.extend(b2BoxDef.prototype, {
    initialize: function() {
      this.type = b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new b2Vec2(0, 0);
      this.localRotation = 0;
      this.friction = 0.2;
      this.restitution = 0;
      this.density = 0;
      this.categoryBits = 1;
      this.maskBits = 65535;
      this.groupIndex = 0;
      this.type = b2Shape.e_boxShape;
      this.extents = new b2Vec2(1, 1);
    },
    extents: null
  });
  var b2CircleDef = Class.create();
  Object.extend(b2CircleDef.prototype, b2ShapeDef.prototype);
  Object.extend(b2CircleDef.prototype, {
    initialize: function() {
      this.type = b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new b2Vec2(0, 0);
      this.localRotation = 0;
      this.friction = 0.2;
      this.restitution = 0;
      this.density = 0;
      this.categoryBits = 1;
      this.maskBits = 65535;
      this.groupIndex = 0;
      this.type = b2Shape.e_circleShape;
      this.radius = 1;
    },
    radius: null
  });
  var b2CircleShape = Class.create();
  Object.extend(b2CircleShape.prototype, b2Shape.prototype);
  Object.extend(b2CircleShape.prototype, {
    TestPoint: function(e) {
      var t = new b2Vec2();
      t.SetV(e);
      t.Subtract(this.m_position);
      return b2Math.b2Dot(t, t) <= this.m_radius * this.m_radius;
    },
    initialize: function(e, t, n) {
      this.m_R = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_userData = e.userData;
      this.m_friction = e.friction;
      this.m_restitution = e.restitution;
      this.m_body = t;
      this.m_proxyId = b2Pair.b2_nullProxy;
      this.m_maxRadius = 0;
      this.m_categoryBits = e.categoryBits;
      this.m_maskBits = e.maskBits;
      this.m_groupIndex = e.groupIndex;
      this.m_localPosition = new b2Vec2();
      var r = e;
      this.m_localPosition.Set(
        e.localPosition.x - n.x,
        e.localPosition.y - n.y
      );
      this.m_type = b2Shape.e_circleShape;
      this.m_radius = r.radius;
      this.m_R.SetM(this.m_body.m_R);
      var i =
        this.m_R.col1.x * this.m_localPosition.x +
        this.m_R.col2.x * this.m_localPosition.y;
      var s =
        this.m_R.col1.y * this.m_localPosition.x +
        this.m_R.col2.y * this.m_localPosition.y;
      this.m_position.x = this.m_body.m_position.x + i;
      this.m_position.y = this.m_body.m_position.y + s;
      this.m_maxRadius = Math.sqrt(i * i + s * s) + this.m_radius;
      var o = new b2AABB();
      o.minVertex.Set(
        this.m_position.x - this.m_radius,
        this.m_position.y - this.m_radius
      );
      o.maxVertex.Set(
        this.m_position.x + this.m_radius,
        this.m_position.y + this.m_radius
      );
      var u = this.m_body.m_world.m_broadPhase;
      if (u.InRange(o)) {
        this.m_proxyId = u.CreateProxy(o, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        this.m_body.Freeze();
      }
    },
    Synchronize: function(e, t, n, r) {
      this.m_R.SetM(r);
      this.m_position.x =
        r.col1.x * this.m_localPosition.x +
        r.col2.x * this.m_localPosition.y +
        n.x;
      this.m_position.y =
        r.col1.y * this.m_localPosition.x +
        r.col2.y * this.m_localPosition.y +
        n.y;
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        return;
      }
      var i =
        e.x +
        (t.col1.x * this.m_localPosition.x + t.col2.x * this.m_localPosition.y);
      var s =
        e.y +
        (t.col1.y * this.m_localPosition.x + t.col2.y * this.m_localPosition.y);
      var o = Math.min(i, this.m_position.x);
      var u = Math.min(s, this.m_position.y);
      var a = Math.max(i, this.m_position.x);
      var f = Math.max(s, this.m_position.y);
      var l = new b2AABB();
      l.minVertex.Set(o - this.m_radius, u - this.m_radius);
      l.maxVertex.Set(a + this.m_radius, f + this.m_radius);
      var c = this.m_body.m_world.m_broadPhase;
      if (c.InRange(l)) {
        c.MoveProxy(this.m_proxyId, l);
      } else {
        this.m_body.Freeze();
      }
    },
    QuickSync: function(e, t) {
      this.m_R.SetM(t);
      this.m_position.x =
        t.col1.x * this.m_localPosition.x +
        t.col2.x * this.m_localPosition.y +
        e.x;
      this.m_position.y =
        t.col1.y * this.m_localPosition.x +
        t.col2.y * this.m_localPosition.y +
        e.y;
    },
    ResetProxy: function(e) {
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        return;
      }
      var t = e.GetProxy(this.m_proxyId);
      e.DestroyProxy(this.m_proxyId);
      t = null;
      var n = new b2AABB();
      n.minVertex.Set(
        this.m_position.x - this.m_radius,
        this.m_position.y - this.m_radius
      );
      n.maxVertex.Set(
        this.m_position.x + this.m_radius,
        this.m_position.y + this.m_radius
      );
      if (e.InRange(n)) {
        this.m_proxyId = e.CreateProxy(n, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        this.m_body.Freeze();
      }
    },
    Support: function(e, t, n) {
      var r = Math.sqrt(e * e + t * t);
      e /= r;
      t /= r;
      n.Set(
        this.m_position.x + this.m_radius * e,
        this.m_position.y + this.m_radius * t
      );
    },
    m_localPosition: new b2Vec2(),
    m_radius: null
  });
  var b2MassData = Class.create();
  b2MassData.prototype = {
    mass: 0,
    center: new b2Vec2(0, 0),
    I: 0,
    initialize: function() {
      this.center = new b2Vec2(0, 0);
    }
  };
  var b2PolyDef = Class.create();
  Object.extend(b2PolyDef.prototype, b2ShapeDef.prototype);
  Object.extend(b2PolyDef.prototype, {
    initialize: function() {
      this.type = b2Shape.e_unknownShape;
      this.userData = null;
      this.localPosition = new b2Vec2(0, 0);
      this.localRotation = 0;
      this.friction = 0.2;
      this.restitution = 0;
      this.density = 0;
      this.categoryBits = 1;
      this.maskBits = 65535;
      this.groupIndex = 0;
      this.vertices = new Array(b2Settings.b2_maxPolyVertices);
      this.type = b2Shape.e_polyShape;
      this.vertexCount = 0;
      for (var e = 0; e < b2Settings.b2_maxPolyVertices; e++) {
        this.vertices[e] = new b2Vec2();
      }
    },
    vertices: new Array(b2Settings.b2_maxPolyVertices),
    vertexCount: 0
  });
  var b2PolyShape = Class.create();
  Object.extend(b2PolyShape.prototype, b2Shape.prototype);
  Object.extend(b2PolyShape.prototype, {
    TestPoint: function(e) {
      var t = new b2Vec2();
      t.SetV(e);
      t.Subtract(this.m_position);
      t.MulTM(this.m_R);
      for (var n = 0; n < this.m_vertexCount; ++n) {
        var r = new b2Vec2();
        r.SetV(t);
        r.Subtract(this.m_vertices[n]);
        var i = b2Math.b2Dot(this.m_normals[n], r);
        if (i > 0) {
          return false;
        }
      }
      return true;
    },
    initialize: function(e, t, n) {
      this.m_R = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_userData = e.userData;
      this.m_friction = e.friction;
      this.m_restitution = e.restitution;
      this.m_body = t;
      this.m_proxyId = b2Pair.b2_nullProxy;
      this.m_maxRadius = 0;
      this.m_categoryBits = e.categoryBits;
      this.m_maskBits = e.maskBits;
      this.m_groupIndex = e.groupIndex;
      this.syncAABB = new b2AABB();
      this.syncMat = new b2Mat22();
      this.m_localCentroid = new b2Vec2();
      this.m_localOBB = new b2OBB();
      var r = 0;
      var i;
      var s;
      var o;
      var u = new b2AABB();
      this.m_vertices = new Array(b2Settings.b2_maxPolyVertices);
      this.m_coreVertices = new Array(b2Settings.b2_maxPolyVertices);
      this.m_normals = new Array(b2Settings.b2_maxPolyVertices);
      this.m_type = b2Shape.e_polyShape;
      var a = new b2Mat22(e.localRotation);
      if (e.type == b2Shape.e_boxShape) {
        this.m_localCentroid.x = e.localPosition.x - n.x;
        this.m_localCentroid.y = e.localPosition.y - n.y;
        var f = e;
        this.m_vertexCount = 4;
        i = f.extents.x;
        s = f.extents.y;
        var l = Math.max(0, i - 2 * b2Settings.b2_linearSlop);
        var c = Math.max(0, s - 2 * b2Settings.b2_linearSlop);
        o = this.m_vertices[0] = new b2Vec2();
        o.x = a.col1.x * i + a.col2.x * s;
        o.y = a.col1.y * i + a.col2.y * s;
        o = this.m_vertices[1] = new b2Vec2();
        o.x = a.col1.x * -i + a.col2.x * s;
        o.y = a.col1.y * -i + a.col2.y * s;
        o = this.m_vertices[2] = new b2Vec2();
        o.x = a.col1.x * -i + a.col2.x * -s;
        o.y = a.col1.y * -i + a.col2.y * -s;
        o = this.m_vertices[3] = new b2Vec2();
        o.x = a.col1.x * i + a.col2.x * -s;
        o.y = a.col1.y * i + a.col2.y * -s;
        o = this.m_coreVertices[0] = new b2Vec2();
        o.x = a.col1.x * l + a.col2.x * c;
        o.y = a.col1.y * l + a.col2.y * c;
        o = this.m_coreVertices[1] = new b2Vec2();
        o.x = a.col1.x * -l + a.col2.x * c;
        o.y = a.col1.y * -l + a.col2.y * c;
        o = this.m_coreVertices[2] = new b2Vec2();
        o.x = a.col1.x * -l + a.col2.x * -c;
        o.y = a.col1.y * -l + a.col2.y * -c;
        o = this.m_coreVertices[3] = new b2Vec2();
        o.x = a.col1.x * l + a.col2.x * -c;
        o.y = a.col1.y * l + a.col2.y * -c;
      } else {
        var h = e;
        this.m_vertexCount = h.vertexCount;
        b2Shape.PolyCentroid(h.vertices, h.vertexCount, b2PolyShape.tempVec);
        var p = b2PolyShape.tempVec.x;
        var d = b2PolyShape.tempVec.y;
        this.m_localCentroid.x =
          e.localPosition.x + (a.col1.x * p + a.col2.x * d) - n.x;
        this.m_localCentroid.y =
          e.localPosition.y + (a.col1.y * p + a.col2.y * d) - n.y;
        for (r = 0; r < this.m_vertexCount; ++r) {
          this.m_vertices[r] = new b2Vec2();
          this.m_coreVertices[r] = new b2Vec2();
          i = h.vertices[r].x - p;
          s = h.vertices[r].y - d;
          this.m_vertices[r].x = a.col1.x * i + a.col2.x * s;
          this.m_vertices[r].y = a.col1.y * i + a.col2.y * s;
          var v = this.m_vertices[r].x;
          var m = this.m_vertices[r].y;
          var g = Math.sqrt(v * v + m * m);
          if (g > Number.MIN_VALUE) {
            v *= 1 / g;
            m *= 1 / g;
          }
          this.m_coreVertices[r].x =
            this.m_vertices[r].x - 2 * b2Settings.b2_linearSlop * v;
          this.m_coreVertices[r].y =
            this.m_vertices[r].y - 2 * b2Settings.b2_linearSlop * m;
        }
      }
      var y = Number.MAX_VALUE;
      var b = Number.MAX_VALUE;
      var w = -Number.MAX_VALUE;
      var E = -Number.MAX_VALUE;
      this.m_maxRadius = 0;
      for (r = 0; r < this.m_vertexCount; ++r) {
        var S = this.m_vertices[r];
        y = Math.min(y, S.x);
        b = Math.min(b, S.y);
        w = Math.max(w, S.x);
        E = Math.max(E, S.y);
        this.m_maxRadius = Math.max(this.m_maxRadius, S.Length());
      }
      this.m_localOBB.R.SetIdentity();
      this.m_localOBB.center.Set((y + w) * 0.5, (b + E) * 0.5);
      this.m_localOBB.extents.Set((w - y) * 0.5, (E - b) * 0.5);
      var x = 0;
      var T = 0;
      for (r = 0; r < this.m_vertexCount; ++r) {
        this.m_normals[r] = new b2Vec2();
        x = r;
        T = r + 1 < this.m_vertexCount ? r + 1 : 0;
        this.m_normals[r].x = this.m_vertices[T].y - this.m_vertices[x].y;
        this.m_normals[r].y = -(this.m_vertices[T].x - this.m_vertices[x].x);
        this.m_normals[r].Normalize();
      }
      for (r = 0; r < this.m_vertexCount; ++r) {
        x = r;
        T = r + 1 < this.m_vertexCount ? r + 1 : 0;
      }
      this.m_R.SetM(this.m_body.m_R);
      this.m_position.x =
        this.m_body.m_position.x +
        (this.m_R.col1.x * this.m_localCentroid.x +
          this.m_R.col2.x * this.m_localCentroid.y);
      this.m_position.y =
        this.m_body.m_position.y +
        (this.m_R.col1.y * this.m_localCentroid.x +
          this.m_R.col2.y * this.m_localCentroid.y);
      b2PolyShape.tAbsR.col1.x =
        this.m_R.col1.x * this.m_localOBB.R.col1.x +
        this.m_R.col2.x * this.m_localOBB.R.col1.y;
      b2PolyShape.tAbsR.col1.y =
        this.m_R.col1.y * this.m_localOBB.R.col1.x +
        this.m_R.col2.y * this.m_localOBB.R.col1.y;
      b2PolyShape.tAbsR.col2.x =
        this.m_R.col1.x * this.m_localOBB.R.col2.x +
        this.m_R.col2.x * this.m_localOBB.R.col2.y;
      b2PolyShape.tAbsR.col2.y =
        this.m_R.col1.y * this.m_localOBB.R.col2.x +
        this.m_R.col2.y * this.m_localOBB.R.col2.y;
      b2PolyShape.tAbsR.Abs();
      i =
        b2PolyShape.tAbsR.col1.x * this.m_localOBB.extents.x +
        b2PolyShape.tAbsR.col2.x * this.m_localOBB.extents.y;
      s =
        b2PolyShape.tAbsR.col1.y * this.m_localOBB.extents.x +
        b2PolyShape.tAbsR.col2.y * this.m_localOBB.extents.y;
      var N =
        this.m_position.x +
        (this.m_R.col1.x * this.m_localOBB.center.x +
          this.m_R.col2.x * this.m_localOBB.center.y);
      var C =
        this.m_position.y +
        (this.m_R.col1.y * this.m_localOBB.center.x +
          this.m_R.col2.y * this.m_localOBB.center.y);
      u.minVertex.x = N - i;
      u.minVertex.y = C - s;
      u.maxVertex.x = N + i;
      u.maxVertex.y = C + s;
      var k = this.m_body.m_world.m_broadPhase;
      if (k.InRange(u)) {
        this.m_proxyId = k.CreateProxy(u, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        this.m_body.Freeze();
      }
    },
    syncAABB: new b2AABB(),
    syncMat: new b2Mat22(),
    Synchronize: function(e, t, n, r) {
      this.m_R.SetM(r);
      this.m_position.x =
        this.m_body.m_position.x +
        (r.col1.x * this.m_localCentroid.x + r.col2.x * this.m_localCentroid.y);
      this.m_position.y =
        this.m_body.m_position.y +
        (r.col1.y * this.m_localCentroid.x + r.col2.y * this.m_localCentroid.y);
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        return;
      }
      var i;
      var s;
      var o = t.col1;
      var u = t.col2;
      var a = this.m_localOBB.R.col1;
      var f = this.m_localOBB.R.col2;
      this.syncMat.col1.x = o.x * a.x + u.x * a.y;
      this.syncMat.col1.y = o.y * a.x + u.y * a.y;
      this.syncMat.col2.x = o.x * f.x + u.x * f.y;
      this.syncMat.col2.y = o.y * f.x + u.y * f.y;
      this.syncMat.Abs();
      i = this.m_localCentroid.x + this.m_localOBB.center.x;
      s = this.m_localCentroid.y + this.m_localOBB.center.y;
      var l = e.x + (t.col1.x * i + t.col2.x * s);
      var c = e.y + (t.col1.y * i + t.col2.y * s);
      i =
        this.syncMat.col1.x * this.m_localOBB.extents.x +
        this.syncMat.col2.x * this.m_localOBB.extents.y;
      s =
        this.syncMat.col1.y * this.m_localOBB.extents.x +
        this.syncMat.col2.y * this.m_localOBB.extents.y;
      this.syncAABB.minVertex.x = l - i;
      this.syncAABB.minVertex.y = c - s;
      this.syncAABB.maxVertex.x = l + i;
      this.syncAABB.maxVertex.y = c + s;
      o = r.col1;
      u = r.col2;
      a = this.m_localOBB.R.col1;
      f = this.m_localOBB.R.col2;
      this.syncMat.col1.x = o.x * a.x + u.x * a.y;
      this.syncMat.col1.y = o.y * a.x + u.y * a.y;
      this.syncMat.col2.x = o.x * f.x + u.x * f.y;
      this.syncMat.col2.y = o.y * f.x + u.y * f.y;
      this.syncMat.Abs();
      i = this.m_localCentroid.x + this.m_localOBB.center.x;
      s = this.m_localCentroid.y + this.m_localOBB.center.y;
      l = n.x + (r.col1.x * i + r.col2.x * s);
      c = n.y + (r.col1.y * i + r.col2.y * s);
      i =
        this.syncMat.col1.x * this.m_localOBB.extents.x +
        this.syncMat.col2.x * this.m_localOBB.extents.y;
      s =
        this.syncMat.col1.y * this.m_localOBB.extents.x +
        this.syncMat.col2.y * this.m_localOBB.extents.y;
      this.syncAABB.minVertex.x = Math.min(this.syncAABB.minVertex.x, l - i);
      this.syncAABB.minVertex.y = Math.min(this.syncAABB.minVertex.y, c - s);
      this.syncAABB.maxVertex.x = Math.max(this.syncAABB.maxVertex.x, l + i);
      this.syncAABB.maxVertex.y = Math.max(this.syncAABB.maxVertex.y, c + s);
      var h = this.m_body.m_world.m_broadPhase;
      if (h.InRange(this.syncAABB)) {
        h.MoveProxy(this.m_proxyId, this.syncAABB);
      } else {
        this.m_body.Freeze();
      }
    },
    QuickSync: function(e, t) {
      this.m_R.SetM(t);
      this.m_position.x =
        e.x +
        (t.col1.x * this.m_localCentroid.x + t.col2.x * this.m_localCentroid.y);
      this.m_position.y =
        e.y +
        (t.col1.y * this.m_localCentroid.x + t.col2.y * this.m_localCentroid.y);
    },
    ResetProxy: function(e) {
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        return;
      }
      var t = e.GetProxy(this.m_proxyId);
      e.DestroyProxy(this.m_proxyId);
      t = null;
      var n = b2Math.b2MulMM(this.m_R, this.m_localOBB.R);
      var r = b2Math.b2AbsM(n);
      var i = b2Math.b2MulMV(r, this.m_localOBB.extents);
      var s = b2Math.b2MulMV(this.m_R, this.m_localOBB.center);
      s.Add(this.m_position);
      var o = new b2AABB();
      o.minVertex.SetV(s);
      o.minVertex.Subtract(i);
      o.maxVertex.SetV(s);
      o.maxVertex.Add(i);
      if (e.InRange(o)) {
        this.m_proxyId = e.CreateProxy(o, this);
      } else {
        this.m_proxyId = b2Pair.b2_nullProxy;
      }
      if (this.m_proxyId == b2Pair.b2_nullProxy) {
        this.m_body.Freeze();
      }
    },
    Support: function(e, t, n) {
      var r = e * this.m_R.col1.x + t * this.m_R.col1.y;
      var i = e * this.m_R.col2.x + t * this.m_R.col2.y;
      var s = 0;
      var o = this.m_coreVertices[0].x * r + this.m_coreVertices[0].y * i;
      for (var u = 1; u < this.m_vertexCount; ++u) {
        var a = this.m_coreVertices[u].x * r + this.m_coreVertices[u].y * i;
        if (a > o) {
          s = u;
          o = a;
        }
      }
      n.Set(
        this.m_position.x +
          (this.m_R.col1.x * this.m_coreVertices[s].x +
            this.m_R.col2.x * this.m_coreVertices[s].y),
        this.m_position.y +
          (this.m_R.col1.y * this.m_coreVertices[s].x +
            this.m_R.col2.y * this.m_coreVertices[s].y)
      );
    },
    m_localCentroid: new b2Vec2(),
    m_localOBB: new b2OBB(),
    m_vertices: null,
    m_coreVertices: null,
    m_vertexCount: 0,
    m_normals: null
  });
  b2PolyShape.tempVec = new b2Vec2();
  b2PolyShape.tAbsR = new b2Mat22();
  var b2Body = Class.create();
  b2Body.prototype = {
    SetOriginPosition: function(e, t) {
      if (this.IsFrozen()) {
        return;
      }
      this.m_rotation = t;
      this.m_R.Set(this.m_rotation);
      this.m_position = b2Math.AddVV(
        e,
        b2Math.b2MulMV(this.m_R, this.m_center)
      );
      this.m_position0.SetV(this.m_position);
      this.m_rotation0 = this.m_rotation;
      for (var n = this.m_shapeList; n != null; n = n.m_next) {
        n.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
      }
      this.m_world.m_broadPhase.Commit();
    },
    GetOriginPosition: function() {
      return b2Math.SubtractVV(
        this.m_position,
        b2Math.b2MulMV(this.m_R, this.m_center)
      );
    },
    SetCenterPosition: function(e, t) {
      if (this.IsFrozen()) {
        return;
      }
      this.m_rotation = t;
      this.m_R.Set(this.m_rotation);
      this.m_position.SetV(e);
      this.m_position0.SetV(this.m_position);
      this.m_rotation0 = this.m_rotation;
      for (var n = this.m_shapeList; n != null; n = n.m_next) {
        n.Synchronize(this.m_position, this.m_R, this.m_position, this.m_R);
      }
      this.m_world.m_broadPhase.Commit();
    },
    GetCenterPosition: function() {
      return this.m_position;
    },
    GetRotation: function() {
      return this.m_rotation;
    },
    GetRotationMatrix: function() {
      return this.m_R;
    },
    SetLinearVelocity: function(e) {
      this.m_linearVelocity.SetV(e);
    },
    GetLinearVelocity: function() {
      return this.m_linearVelocity;
    },
    SetAngularVelocity: function(e) {
      this.m_angularVelocity = e;
    },
    GetAngularVelocity: function() {
      return this.m_angularVelocity;
    },
    ApplyForce: function(e, t) {
      if (this.IsSleeping() == false) {
        this.m_force.Add(e);
        this.m_torque += b2Math.b2CrossVV(
          b2Math.SubtractVV(t, this.m_position),
          e
        );
      }
    },
    ApplyTorque: function(e) {
      if (this.IsSleeping() == false) {
        this.m_torque += e;
      }
    },
    ApplyImpulse: function(e, t) {
      if (this.IsSleeping() == false) {
        this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass, e));
        this.m_angularVelocity +=
          this.m_invI *
          b2Math.b2CrossVV(b2Math.SubtractVV(t, this.m_position), e);
      }
    },
    GetMass: function() {
      return this.m_mass;
    },
    GetInertia: function() {
      return this.m_I;
    },
    GetWorldPoint: function(e) {
      return b2Math.AddVV(this.m_position, b2Math.b2MulMV(this.m_R, e));
    },
    GetWorldVector: function(e) {
      return b2Math.b2MulMV(this.m_R, e);
    },
    GetLocalPoint: function(e) {
      return b2Math.b2MulTMV(this.m_R, b2Math.SubtractVV(e, this.m_position));
    },
    GetLocalVector: function(e) {
      return b2Math.b2MulTMV(this.m_R, e);
    },
    IsStatic: function() {
      return (this.m_flags & b2Body.e_staticFlag) == b2Body.e_staticFlag;
    },
    IsFrozen: function() {
      return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag;
    },
    IsSleeping: function() {
      return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag;
    },
    AllowSleeping: function(e) {
      if (e) {
        this.m_flags |= b2Body.e_allowSleepFlag;
      } else {
        this.m_flags &= ~b2Body.e_allowSleepFlag;
        this.WakeUp();
      }
    },
    WakeUp: function() {
      this.m_flags &= ~b2Body.e_sleepFlag;
      this.m_sleepTime = 0;
    },
    GetShapeList: function() {
      return this.m_shapeList;
    },
    GetContactList: function() {
      return this.m_contactList;
    },
    GetJointList: function() {
      return this.m_jointList;
    },
    GetNext: function() {
      return this.m_next;
    },
    GetUserData: function() {
      return this.m_userData;
    },
    initialize: function(e, t) {
      this.sMat0 = new b2Mat22();
      this.m_position = new b2Vec2();
      this.m_R = new b2Mat22(0);
      this.m_position0 = new b2Vec2();
      var n = 0;
      var r;
      var i;
      this.m_flags = 0;
      this.m_position.SetV(e.position);
      this.m_rotation = e.rotation;
      this.m_R.Set(this.m_rotation);
      this.m_position0.SetV(this.m_position);
      this.m_rotation0 = this.m_rotation;
      this.m_world = t;
      this.m_linearDamping = b2Math.b2Clamp(1 - e.linearDamping, 0, 1);
      this.m_angularDamping = b2Math.b2Clamp(1 - e.angularDamping, 0, 1);
      this.m_force = new b2Vec2(0, 0);
      this.m_torque = 0;
      this.m_mass = 0;
      var s = new Array(b2Settings.b2_maxShapesPerBody);
      for (n = 0; n < b2Settings.b2_maxShapesPerBody; n++) {
        s[n] = new b2MassData();
      }
      this.m_shapeCount = 0;
      this.m_center = new b2Vec2(0, 0);
      for (n = 0; n < b2Settings.b2_maxShapesPerBody; ++n) {
        r = e.shapes[n];
        if (r == null) break;
        i = s[n];
        r.ComputeMass(i);
        this.m_mass += i.mass;
        this.m_center.x += i.mass * (r.localPosition.x + i.center.x);
        this.m_center.y += i.mass * (r.localPosition.y + i.center.y);
        ++this.m_shapeCount;
      }
      if (this.m_mass > 0) {
        this.m_center.Multiply(1 / this.m_mass);
        this.m_position.Add(b2Math.b2MulMV(this.m_R, this.m_center));
      } else {
        this.m_flags |= b2Body.e_staticFlag;
      }
      this.m_I = 0;
      for (n = 0; n < this.m_shapeCount; ++n) {
        r = e.shapes[n];
        i = s[n];
        this.m_I += i.I;
        var o = b2Math.SubtractVV(
          b2Math.AddVV(r.localPosition, i.center),
          this.m_center
        );
        this.m_I += i.mass * b2Math.b2Dot(o, o);
      }
      if (this.m_mass > 0) {
        this.m_invMass = 1 / this.m_mass;
      } else {
        this.m_invMass = 0;
      }
      if (this.m_I > 0 && e.preventRotation == false) {
        this.m_invI = 1 / this.m_I;
      } else {
        this.m_I = 0;
        this.m_invI = 0;
      }
      this.m_linearVelocity = b2Math.AddVV(
        e.linearVelocity,
        b2Math.b2CrossFV(e.angularVelocity, this.m_center)
      );
      this.m_angularVelocity = e.angularVelocity;
      this.m_jointList = null;
      this.m_contactList = null;
      this.m_prev = null;
      this.m_next = null;
      this.m_shapeList = null;
      for (n = 0; n < this.m_shapeCount; ++n) {
        r = e.shapes[n];
        var u = b2Shape.Create(r, this, this.m_center);
        u.m_next = this.m_shapeList;
        this.m_shapeList = u;
      }
      this.m_sleepTime = 0;
      if (e.allowSleep) {
        this.m_flags |= b2Body.e_allowSleepFlag;
      }
      if (e.isSleeping) {
        this.m_flags |= b2Body.e_sleepFlag;
      }
      if (this.m_flags & b2Body.e_sleepFlag || this.m_invMass == 0) {
        this.m_linearVelocity.Set(0, 0);
        this.m_angularVelocity = 0;
      }
      this.m_userData = e.userData;
    },
    Destroy: function() {
      var e = this.m_shapeList;
      while (e) {
        var t = e;
        e = e.m_next;
        b2Shape.Destroy(t);
      }
    },
    sMat0: new b2Mat22(),
    SynchronizeShapes: function() {
      this.sMat0.Set(this.m_rotation0);
      for (var e = this.m_shapeList; e != null; e = e.m_next) {
        e.Synchronize(this.m_position0, this.sMat0, this.m_position, this.m_R);
      }
    },
    QuickSyncShapes: function() {
      for (var e = this.m_shapeList; e != null; e = e.m_next) {
        e.QuickSync(this.m_position, this.m_R);
      }
    },
    IsConnected: function(e) {
      for (var t = this.m_jointList; t != null; t = t.next) {
        if (t.other == e) return t.joint.m_collideConnected == false;
      }
      return false;
    },
    Freeze: function() {
      this.m_flags |= b2Body.e_frozenFlag;
      this.m_linearVelocity.SetZero();
      this.m_angularVelocity = 0;
      for (var e = this.m_shapeList; e != null; e = e.m_next) {
        e.DestroyProxy();
      }
    },
    m_flags: 0,
    m_position: new b2Vec2(),
    m_rotation: null,
    m_R: new b2Mat22(0),
    m_position0: new b2Vec2(),
    m_rotation0: null,
    m_linearVelocity: null,
    m_angularVelocity: null,
    m_force: null,
    m_torque: null,
    m_center: null,
    m_world: null,
    m_prev: null,
    m_next: null,
    m_shapeList: null,
    m_shapeCount: 0,
    m_jointList: null,
    m_contactList: null,
    m_mass: null,
    m_invMass: null,
    m_I: null,
    m_invI: null,
    m_linearDamping: null,
    m_angularDamping: null,
    m_sleepTime: null,
    m_userData: null
  };
  b2Body.e_staticFlag = 1;
  b2Body.e_frozenFlag = 2;
  b2Body.e_islandFlag = 4;
  b2Body.e_sleepFlag = 8;
  b2Body.e_allowSleepFlag = 16;
  b2Body.e_destroyFlag = 32;
  var b2BodyDef = Class.create();
  b2BodyDef.prototype = {
    initialize: function() {
      this.shapes = new Array();
      this.userData = null;
      for (var e = 0; e < b2Settings.b2_maxShapesPerBody; e++) {
        this.shapes[e] = null;
      }
      this.position = new b2Vec2(0, 0);
      this.rotation = 0;
      this.linearVelocity = new b2Vec2(0, 0);
      this.angularVelocity = 0;
      this.linearDamping = 0;
      this.angularDamping = 0;
      this.allowSleep = true;
      this.isSleeping = false;
      this.preventRotation = false;
    },
    userData: null,
    shapes: new Array(),
    position: null,
    rotation: null,
    linearVelocity: null,
    angularVelocity: null,
    linearDamping: null,
    angularDamping: null,
    allowSleep: null,
    isSleeping: null,
    preventRotation: null,
    AddShape: function(e) {
      for (var t = 0; t < b2Settings.b2_maxShapesPerBody; ++t) {
        if (this.shapes[t] == null) {
          this.shapes[t] = e;
          break;
        }
      }
    }
  };
  var b2CollisionFilter = Class.create();
  b2CollisionFilter.prototype = {
    ShouldCollide: function(e, t) {
      if (e.m_groupIndex == t.m_groupIndex && e.m_groupIndex != 0) {
        return e.m_groupIndex > 0;
      }
      var n =
        (e.m_maskBits & t.m_categoryBits) != 0 &&
        (e.m_categoryBits & t.m_maskBits) != 0;
      return n;
    },
    initialize: function() {}
  };
  b2CollisionFilter.b2_defaultFilter = new b2CollisionFilter();
  var b2Island = Class.create();
  b2Island.prototype = {
    initialize: function(e, t, n, r) {
      var i = 0;
      this.m_bodyCapacity = e;
      this.m_contactCapacity = t;
      this.m_jointCapacity = n;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_bodies = new Array(e);
      for (i = 0; i < e; i++) this.m_bodies[i] = null;
      this.m_contacts = new Array(t);
      for (i = 0; i < t; i++) this.m_contacts[i] = null;
      this.m_joints = new Array(n);
      for (i = 0; i < n; i++) this.m_joints[i] = null;
      this.m_allocator = r;
    },
    Clear: function() {
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
    },
    Solve: function(e, t) {
      var n = 0;
      var r;
      for (n = 0; n < this.m_bodyCount; ++n) {
        r = this.m_bodies[n];
        if (r.m_invMass == 0) continue;
        r.m_linearVelocity.Add(
          b2Math.MulFV(
            e.dt,
            b2Math.AddVV(t, b2Math.MulFV(r.m_invMass, r.m_force))
          )
        );
        r.m_angularVelocity += e.dt * r.m_invI * r.m_torque;
        r.m_linearVelocity.Multiply(r.m_linearDamping);
        r.m_angularVelocity *= r.m_angularDamping;
        r.m_position0.SetV(r.m_position);
        r.m_rotation0 = r.m_rotation;
      }
      var i = new b2ContactSolver(
        this.m_contacts,
        this.m_contactCount,
        this.m_allocator
      );
      i.PreSolve();
      for (n = 0; n < this.m_jointCount; ++n) {
        this.m_joints[n].PrepareVelocitySolver();
      }
      for (n = 0; n < e.iterations; ++n) {
        i.SolveVelocityConstraints();
        for (var s = 0; s < this.m_jointCount; ++s) {
          this.m_joints[s].SolveVelocityConstraints(e);
        }
      }
      for (n = 0; n < this.m_bodyCount; ++n) {
        r = this.m_bodies[n];
        if (r.m_invMass == 0) continue;
        r.m_position.x += e.dt * r.m_linearVelocity.x;
        r.m_position.y += e.dt * r.m_linearVelocity.y;
        r.m_rotation += e.dt * r.m_angularVelocity;
        r.m_R.Set(r.m_rotation);
      }
      for (n = 0; n < this.m_jointCount; ++n) {
        this.m_joints[n].PreparePositionSolver();
      }
      if (b2World.s_enablePositionCorrection) {
        for (
          b2Island.m_positionIterationCount = 0;
          b2Island.m_positionIterationCount < e.iterations;
          ++b2Island.m_positionIterationCount
        ) {
          var o = i.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
          var u = true;
          for (n = 0; n < this.m_jointCount; ++n) {
            var a = this.m_joints[n].SolvePositionConstraints();
            u = u && a;
          }
          if (o && u) {
            break;
          }
        }
      }
      i.PostSolve();
      for (n = 0; n < this.m_bodyCount; ++n) {
        r = this.m_bodies[n];
        if (r.m_invMass == 0) continue;
        r.m_R.Set(r.m_rotation);
        r.SynchronizeShapes();
        r.m_force.Set(0, 0);
        r.m_torque = 0;
      }
    },
    UpdateSleep: function(e) {
      var t = 0;
      var n;
      var r = Number.MAX_VALUE;
      var i =
        b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
      var s =
        b2Settings.b2_angularSleepTolerance *
        b2Settings.b2_angularSleepTolerance;
      for (t = 0; t < this.m_bodyCount; ++t) {
        n = this.m_bodies[t];
        if (n.m_invMass == 0) {
          continue;
        }
        if ((n.m_flags & b2Body.e_allowSleepFlag) == 0) {
          n.m_sleepTime = 0;
          r = 0;
        }
        if (
          (n.m_flags & b2Body.e_allowSleepFlag) == 0 ||
          n.m_angularVelocity * n.m_angularVelocity > s ||
          b2Math.b2Dot(n.m_linearVelocity, n.m_linearVelocity) > i
        ) {
          n.m_sleepTime = 0;
          r = 0;
        } else {
          n.m_sleepTime += e;
          r = b2Math.b2Min(r, n.m_sleepTime);
        }
      }
      if (r >= b2Settings.b2_timeToSleep) {
        for (t = 0; t < this.m_bodyCount; ++t) {
          n = this.m_bodies[t];
          n.m_flags |= b2Body.e_sleepFlag;
        }
      }
    },
    AddBody: function(e) {
      this.m_bodies[this.m_bodyCount++] = e;
    },
    AddContact: function(e) {
      this.m_contacts[this.m_contactCount++] = e;
    },
    AddJoint: function(e) {
      this.m_joints[this.m_jointCount++] = e;
    },
    m_allocator: null,
    m_bodies: null,
    m_contacts: null,
    m_joints: null,
    m_bodyCount: 0,
    m_jointCount: 0,
    m_contactCount: 0,
    m_bodyCapacity: 0,
    m_contactCapacity: 0,
    m_jointCapacity: 0,
    m_positionError: null
  };
  b2Island.m_positionIterationCount = 0;
  var b2TimeStep = Class.create();
  b2TimeStep.prototype = {
    dt: null,
    inv_dt: null,
    iterations: 0,
    initialize: function() {}
  };
  var b2ContactNode = Class.create();
  b2ContactNode.prototype = {
    other: null,
    contact: null,
    prev: null,
    next: null,
    initialize: function() {}
  };
  var b2Contact = Class.create();
  b2Contact.prototype = {
    GetManifolds: function() {
      return null;
    },
    GetManifoldCount: function() {
      return this.m_manifoldCount;
    },
    GetNext: function() {
      return this.m_next;
    },
    GetShape1: function() {
      return this.m_shape1;
    },
    GetShape2: function() {
      return this.m_shape2;
    },
    initialize: function(e, t) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!e || !t) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = e;
      this.m_shape2 = t;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(
        this.m_shape1.m_friction * this.m_shape2.m_friction
      );
      this.m_restitution = b2Math.b2Max(
        this.m_shape1.m_restitution,
        this.m_shape2.m_restitution
      );
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
    },
    Evaluate: function() {},
    m_flags: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2ContactNode(),
    m_node2: new b2ContactNode(),
    m_shape1: null,
    m_shape2: null,
    m_manifoldCount: 0,
    m_friction: null,
    m_restitution: null
  };
  b2Contact.e_islandFlag = 1;
  b2Contact.e_destroyFlag = 2;
  b2Contact.AddType = function(e, t, n, r) {
    b2Contact.s_registers[n][r].createFcn = e;
    b2Contact.s_registers[n][r].destroyFcn = t;
    b2Contact.s_registers[n][r].primary = true;
    if (n != r) {
      b2Contact.s_registers[r][n].createFcn = e;
      b2Contact.s_registers[r][n].destroyFcn = t;
      b2Contact.s_registers[r][n].primary = false;
    }
  };
  b2Contact.InitializeRegisters = function() {
    b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
    for (var e = 0; e < b2Shape.e_shapeTypeCount; e++) {
      b2Contact.s_registers[e] = new Array(b2Shape.e_shapeTypeCount);
      for (var t = 0; t < b2Shape.e_shapeTypeCount; t++) {
        b2Contact.s_registers[e][t] = new b2ContactRegister();
      }
    }
    b2Contact.AddType(
      b2CircleContact.Create,
      b2CircleContact.Destroy,
      b2Shape.e_circleShape,
      b2Shape.e_circleShape
    );
    b2Contact.AddType(
      b2PolyAndCircleContact.Create,
      b2PolyAndCircleContact.Destroy,
      b2Shape.e_polyShape,
      b2Shape.e_circleShape
    );
    b2Contact.AddType(
      b2PolyContact.Create,
      b2PolyContact.Destroy,
      b2Shape.e_polyShape,
      b2Shape.e_polyShape
    );
  };
  b2Contact.Create = function(e, t, n) {
    if (b2Contact.s_initialized == false) {
      b2Contact.InitializeRegisters();
      b2Contact.s_initialized = true;
    }
    var r = e.m_type;
    var i = t.m_type;
    var s = b2Contact.s_registers[r][i].createFcn;
    if (s) {
      if (b2Contact.s_registers[r][i].primary) {
        return s(e, t, n);
      } else {
        var o = s(t, e, n);
        for (var u = 0; u < o.GetManifoldCount(); ++u) {
          var a = o.GetManifolds()[u];
          a.normal = a.normal.Negative();
        }
        return o;
      }
    } else {
      return null;
    }
  };
  b2Contact.Destroy = function(e, t) {
    if (e.GetManifoldCount() > 0) {
      e.m_shape1.m_body.WakeUp();
      e.m_shape2.m_body.WakeUp();
    }
    var n = e.m_shape1.m_type;
    var r = e.m_shape2.m_type;
    var i = b2Contact.s_registers[n][r].destroyFcn;
    i(e, t);
  };
  b2Contact.s_registers = null;
  b2Contact.s_initialized = false;
  var b2ContactConstraint = Class.create();
  b2ContactConstraint.prototype = {
    initialize: function() {
      this.normal = new b2Vec2();
      this.points = new Array(b2Settings.b2_maxManifoldPoints);
      for (var e = 0; e < b2Settings.b2_maxManifoldPoints; e++) {
        this.points[e] = new b2ContactConstraintPoint();
      }
    },
    points: null,
    normal: new b2Vec2(),
    manifold: null,
    body1: null,
    body2: null,
    friction: null,
    restitution: null,
    pointCount: 0
  };
  var b2ContactConstraintPoint = Class.create();
  b2ContactConstraintPoint.prototype = {
    localAnchor1: new b2Vec2(),
    localAnchor2: new b2Vec2(),
    normalImpulse: null,
    tangentImpulse: null,
    positionImpulse: null,
    normalMass: null,
    tangentMass: null,
    separation: null,
    velocityBias: null,
    initialize: function() {
      this.localAnchor1 = new b2Vec2();
      this.localAnchor2 = new b2Vec2();
    }
  };
  var b2ContactRegister = Class.create();
  b2ContactRegister.prototype = {
    createFcn: null,
    destroyFcn: null,
    primary: null,
    initialize: function() {}
  };
  var b2ContactSolver = Class.create();
  b2ContactSolver.prototype = {
    initialize: function(e, t, n) {
      this.m_constraints = new Array();
      this.m_allocator = n;
      var r = 0;
      var i;
      var s;
      this.m_constraintCount = 0;
      for (r = 0; r < t; ++r) {
        this.m_constraintCount += e[r].GetManifoldCount();
      }
      for (r = 0; r < this.m_constraintCount; r++) {
        this.m_constraints[r] = new b2ContactConstraint();
      }
      var o = 0;
      for (r = 0; r < t; ++r) {
        var u = e[r];
        var a = u.m_shape1.m_body;
        var f = u.m_shape2.m_body;
        var l = u.GetManifoldCount();
        var c = u.GetManifolds();
        var h = u.m_friction;
        var p = u.m_restitution;
        var d = a.m_linearVelocity.x;
        var v = a.m_linearVelocity.y;
        var m = f.m_linearVelocity.x;
        var g = f.m_linearVelocity.y;
        var y = a.m_angularVelocity;
        var b = f.m_angularVelocity;
        for (var w = 0; w < l; ++w) {
          var E = c[w];
          var S = E.normal.x;
          var x = E.normal.y;
          var T = this.m_constraints[o];
          T.body1 = a;
          T.body2 = f;
          T.manifold = E;
          T.normal.x = S;
          T.normal.y = x;
          T.pointCount = E.pointCount;
          T.friction = h;
          T.restitution = p;
          for (var N = 0; N < T.pointCount; ++N) {
            var C = E.points[N];
            var k = T.points[N];
            k.normalImpulse = C.normalImpulse;
            k.tangentImpulse = C.tangentImpulse;
            k.separation = C.separation;
            var L = C.position.x - a.m_position.x;
            var A = C.position.y - a.m_position.y;
            var O = C.position.x - f.m_position.x;
            var M = C.position.y - f.m_position.y;
            i = k.localAnchor1;
            s = a.m_R;
            i.x = L * s.col1.x + A * s.col1.y;
            i.y = L * s.col2.x + A * s.col2.y;
            i = k.localAnchor2;
            s = f.m_R;
            i.x = O * s.col1.x + M * s.col1.y;
            i.y = O * s.col2.x + M * s.col2.y;
            var _ = L * L + A * A;
            var D = O * O + M * M;
            var P = L * S + A * x;
            var H = O * S + M * x;
            var B = a.m_invMass + f.m_invMass;
            B += a.m_invI * (_ - P * P) + f.m_invI * (D - H * H);
            k.normalMass = 1 / B;
            var j = x;
            var F = -S;
            var I = L * j + A * F;
            var q = O * j + M * F;
            var R = a.m_invMass + f.m_invMass;
            R += a.m_invI * (_ - I * I) + f.m_invI * (D - q * q);
            k.tangentMass = 1 / R;
            k.velocityBias = 0;
            if (k.separation > 0) {
              k.velocityBias = -60 * k.separation;
            }
            var U = m + -b * M - d - -y * A;
            var z = g + b * O - v - y * L;
            var W = T.normal.x * U + T.normal.y * z;
            if (W < -b2Settings.b2_velocityThreshold) {
              k.velocityBias += -T.restitution * W;
            }
          }
          ++o;
        }
      }
    },
    PreSolve: function() {
      var e;
      var t;
      var n;
      for (var r = 0; r < this.m_constraintCount; ++r) {
        var i = this.m_constraints[r];
        var s = i.body1;
        var o = i.body2;
        var u = s.m_invMass;
        var a = s.m_invI;
        var f = o.m_invMass;
        var l = o.m_invI;
        var c = i.normal.x;
        var h = i.normal.y;
        var p = h;
        var d = -c;
        var v = 0;
        var m = 0;
        if (b2World.s_enableWarmStarting) {
          m = i.pointCount;
          for (v = 0; v < m; ++v) {
            var g = i.points[v];
            var y = g.normalImpulse * c + g.tangentImpulse * p;
            var b = g.normalImpulse * h + g.tangentImpulse * d;
            n = s.m_R;
            e = g.localAnchor1;
            var w = n.col1.x * e.x + n.col2.x * e.y;
            var E = n.col1.y * e.x + n.col2.y * e.y;
            n = o.m_R;
            e = g.localAnchor2;
            var S = n.col1.x * e.x + n.col2.x * e.y;
            var x = n.col1.y * e.x + n.col2.y * e.y;
            s.m_angularVelocity -= a * (w * b - E * y);
            s.m_linearVelocity.x -= u * y;
            s.m_linearVelocity.y -= u * b;
            o.m_angularVelocity += l * (S * b - x * y);
            o.m_linearVelocity.x += f * y;
            o.m_linearVelocity.y += f * b;
            g.positionImpulse = 0;
          }
        } else {
          m = i.pointCount;
          for (v = 0; v < m; ++v) {
            var T = i.points[v];
            T.normalImpulse = 0;
            T.tangentImpulse = 0;
            T.positionImpulse = 0;
          }
        }
      }
    },
    SolveVelocityConstraints: function() {
      var e = 0;
      var t;
      var n;
      var r;
      var i;
      var s;
      var o;
      var u;
      var a;
      var f;
      var l;
      var c;
      var h;
      var p;
      for (var d = 0; d < this.m_constraintCount; ++d) {
        var v = this.m_constraints[d];
        var m = v.body1;
        var g = v.body2;
        var y = m.m_angularVelocity;
        var b = m.m_linearVelocity;
        var w = g.m_angularVelocity;
        var E = g.m_linearVelocity;
        var S = m.m_invMass;
        var x = m.m_invI;
        var T = g.m_invMass;
        var N = g.m_invI;
        var C = v.normal.x;
        var k = v.normal.y;
        var L = k;
        var A = -C;
        var O = v.pointCount;
        for (e = 0; e < O; ++e) {
          t = v.points[e];
          h = m.m_R;
          p = t.localAnchor1;
          n = h.col1.x * p.x + h.col2.x * p.y;
          r = h.col1.y * p.x + h.col2.y * p.y;
          h = g.m_R;
          p = t.localAnchor2;
          i = h.col1.x * p.x + h.col2.x * p.y;
          s = h.col1.y * p.x + h.col2.y * p.y;
          o = E.x + -w * s - b.x - -y * r;
          u = E.y + w * i - b.y - y * n;
          var M = o * C + u * k;
          a = -t.normalMass * (M - t.velocityBias);
          f = b2Math.b2Max(t.normalImpulse + a, 0);
          a = f - t.normalImpulse;
          l = a * C;
          c = a * k;
          b.x -= S * l;
          b.y -= S * c;
          y -= x * (n * c - r * l);
          E.x += T * l;
          E.y += T * c;
          w += N * (i * c - s * l);
          t.normalImpulse = f;
          o = E.x + -w * s - b.x - -y * r;
          u = E.y + w * i - b.y - y * n;
          var _ = o * L + u * A;
          a = t.tangentMass * -_;
          var D = v.friction * t.normalImpulse;
          f = b2Math.b2Clamp(t.tangentImpulse + a, -D, D);
          a = f - t.tangentImpulse;
          l = a * L;
          c = a * A;
          b.x -= S * l;
          b.y -= S * c;
          y -= x * (n * c - r * l);
          E.x += T * l;
          E.y += T * c;
          w += N * (i * c - s * l);
          t.tangentImpulse = f;
        }
        m.m_angularVelocity = y;
        g.m_angularVelocity = w;
      }
    },
    SolvePositionConstraints: function(e) {
      var t = 0;
      var n;
      var r;
      for (var i = 0; i < this.m_constraintCount; ++i) {
        var s = this.m_constraints[i];
        var o = s.body1;
        var u = s.body2;
        var a = o.m_position;
        var f = o.m_rotation;
        var l = u.m_position;
        var c = u.m_rotation;
        var h = o.m_invMass;
        var p = o.m_invI;
        var d = u.m_invMass;
        var v = u.m_invI;
        var m = s.normal.x;
        var g = s.normal.y;
        var y = g;
        var b = -m;
        var w = s.pointCount;
        for (var E = 0; E < w; ++E) {
          var S = s.points[E];
          n = o.m_R;
          r = S.localAnchor1;
          var x = n.col1.x * r.x + n.col2.x * r.y;
          var T = n.col1.y * r.x + n.col2.y * r.y;
          n = u.m_R;
          r = S.localAnchor2;
          var N = n.col1.x * r.x + n.col2.x * r.y;
          var C = n.col1.y * r.x + n.col2.y * r.y;
          var k = a.x + x;
          var L = a.y + T;
          var A = l.x + N;
          var O = l.y + C;
          var M = A - k;
          var _ = O - L;
          var D = M * m + _ * g + S.separation;
          t = b2Math.b2Min(t, D);
          var P =
            e *
            b2Math.b2Clamp(
              D + b2Settings.b2_linearSlop,
              -b2Settings.b2_maxLinearCorrection,
              0
            );
          var H = -S.normalMass * P;
          var B = S.positionImpulse;
          S.positionImpulse = b2Math.b2Max(B + H, 0);
          H = S.positionImpulse - B;
          var j = H * m;
          var F = H * g;
          a.x -= h * j;
          a.y -= h * F;
          f -= p * (x * F - T * j);
          o.m_R.Set(f);
          l.x += d * j;
          l.y += d * F;
          c += v * (N * F - C * j);
          u.m_R.Set(c);
        }
        o.m_rotation = f;
        u.m_rotation = c;
      }
      return t >= -b2Settings.b2_linearSlop;
    },
    PostSolve: function() {
      for (var e = 0; e < this.m_constraintCount; ++e) {
        var t = this.m_constraints[e];
        var n = t.manifold;
        for (var r = 0; r < t.pointCount; ++r) {
          var i = n.points[r];
          var s = t.points[r];
          i.normalImpulse = s.normalImpulse;
          i.tangentImpulse = s.tangentImpulse;
        }
      }
    },
    m_allocator: null,
    m_constraints: new Array(),
    m_constraintCount: 0
  };
  var b2CircleContact = Class.create();
  Object.extend(b2CircleContact.prototype, b2Contact.prototype);
  Object.extend(b2CircleContact.prototype, {
    initialize: function(e, t) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!e || !t) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = e;
      this.m_shape2 = t;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(
        this.m_shape1.m_friction * this.m_shape2.m_friction
      );
      this.m_restitution = b2Math.b2Max(
        this.m_shape1.m_restitution,
        this.m_shape2.m_restitution
      );
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
      this.m_manifold = [new b2Manifold()];
      this.m_manifold[0].pointCount = 0;
      this.m_manifold[0].points[0].normalImpulse = 0;
      this.m_manifold[0].points[0].tangentImpulse = 0;
    },
    Evaluate: function() {
      b2Collision.b2CollideCircle(
        this.m_manifold[0],
        this.m_shape1,
        this.m_shape2,
        false
      );
      if (this.m_manifold[0].pointCount > 0) {
        this.m_manifoldCount = 1;
      } else {
        this.m_manifoldCount = 0;
      }
    },
    GetManifolds: function() {
      return this.m_manifold;
    },
    m_manifold: [new b2Manifold()]
  });
  b2CircleContact.Create = function(e, t, n) {
    return new b2CircleContact(e, t);
  };
  b2CircleContact.Destroy = function(e, t) {};
  var b2Conservative = Class.create();
  b2Conservative.prototype = { initialize: function() {} };
  b2Conservative.R1 = new b2Mat22();
  b2Conservative.R2 = new b2Mat22();
  b2Conservative.x1 = new b2Vec2();
  b2Conservative.x2 = new b2Vec2();
  b2Conservative.Conservative = function(e, t) {
    var n = e.GetBody();
    var r = t.GetBody();
    var i = n.m_position.x - n.m_position0.x;
    var s = n.m_position.y - n.m_position0.y;
    var o = n.m_rotation - n.m_rotation0;
    var u = r.m_position.x - r.m_position0.x;
    var a = r.m_position.y - r.m_position0.y;
    var f = r.m_rotation - r.m_rotation0;
    var l = e.GetMaxRadius();
    var c = t.GetMaxRadius();
    var h = n.m_position0.x;
    var p = n.m_position0.y;
    var v = n.m_rotation0;
    var m = r.m_position0.x;
    var g = r.m_position0.y;
    var y = r.m_rotation0;
    var b = h;
    var w = p;
    var E = v;
    var S = m;
    var x = g;
    var T = y;
    b2Conservative.R1.Set(E);
    b2Conservative.R2.Set(T);
    e.QuickSync(p1, b2Conservative.R1);
    t.QuickSync(p2, b2Conservative.R2);
    var N = 0;
    var C = 10;
    var k;
    var L;
    var A = 0;
    var O = true;
    for (var M = 0; M < C; ++M) {
      var _ = b2Distance.Distance(b2Conservative.x1, b2Conservative.x2, e, t);
      if (_ < b2Settings.b2_linearSlop) {
        if (M == 0) {
          O = false;
        } else {
          O = true;
        }
        break;
      }
      if (M == 0) {
        k = b2Conservative.x2.x - b2Conservative.x1.x;
        L = b2Conservative.x2.y - b2Conservative.x1.y;
        var D = Math.sqrt(k * k + L * L);
        var P = k * (i - u) + L * (s - a) + Math.abs(o) * l + Math.abs(f) * c;
        if (Math.abs(P) < Number.MIN_VALUE) {
          O = false;
          break;
        }
        A = 1 / P;
      }
      var H = _ * A;
      var B = N + H;
      if (B < 0 || 1 < B) {
        O = false;
        break;
      }
      if (B < (1 + 100 * Number.MIN_VALUE) * N) {
        O = true;
        break;
      }
      N = B;
      b = h + N * v1.x;
      w = p + N * v1.y;
      E = v + N * o;
      S = m + N * v2.x;
      x = g + N * v2.y;
      T = y + N * f;
      b2Conservative.R1.Set(E);
      b2Conservative.R2.Set(T);
      e.QuickSync(p1, b2Conservative.R1);
      t.QuickSync(p2, b2Conservative.R2);
    }
    if (O) {
      k = b2Conservative.x2.x - b2Conservative.x1.x;
      L = b2Conservative.x2.y - b2Conservative.x1.y;
      var j = Math.sqrt(k * k + L * L);
      if (j > FLT_EPSILON) {
        d *= b2_linearSlop / j;
      }
      if (n.IsStatic()) {
        n.m_position.x = b;
        n.m_position.y = w;
      } else {
        n.m_position.x = b - k;
        n.m_position.y = w - L;
      }
      n.m_rotation = E;
      n.m_R.Set(E);
      n.QuickSyncShapes();
      if (r.IsStatic()) {
        r.m_position.x = S;
        r.m_position.y = x;
      } else {
        r.m_position.x = S + k;
        r.m_position.y = x + L;
      }
      r.m_position.x = S + k;
      r.m_position.y = x + L;
      r.m_rotation = T;
      r.m_R.Set(T);
      r.QuickSyncShapes();
      return true;
    }
    e.QuickSync(n.m_position, n.m_R);
    t.QuickSync(r.m_position, r.m_R);
    return false;
  };
  var b2NullContact = Class.create();
  Object.extend(b2NullContact.prototype, b2Contact.prototype);
  Object.extend(b2NullContact.prototype, {
    initialize: function(e, t) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!e || !t) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = e;
      this.m_shape2 = t;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(
        this.m_shape1.m_friction * this.m_shape2.m_friction
      );
      this.m_restitution = b2Math.b2Max(
        this.m_shape1.m_restitution,
        this.m_shape2.m_restitution
      );
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
    },
    Evaluate: function() {},
    GetManifolds: function() {
      return null;
    }
  });
  var b2PolyAndCircleContact = Class.create();
  Object.extend(b2PolyAndCircleContact.prototype, b2Contact.prototype);
  Object.extend(b2PolyAndCircleContact.prototype, {
    initialize: function(e, t) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!e || !t) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = e;
      this.m_shape2 = t;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(
        this.m_shape1.m_friction * this.m_shape2.m_friction
      );
      this.m_restitution = b2Math.b2Max(
        this.m_shape1.m_restitution,
        this.m_shape2.m_restitution
      );
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
      this.m_manifold = [new b2Manifold()];
      b2Settings.b2Assert(this.m_shape1.m_type == b2Shape.e_polyShape);
      b2Settings.b2Assert(this.m_shape2.m_type == b2Shape.e_circleShape);
      this.m_manifold[0].pointCount = 0;
      this.m_manifold[0].points[0].normalImpulse = 0;
      this.m_manifold[0].points[0].tangentImpulse = 0;
    },
    Evaluate: function() {
      b2Collision.b2CollidePolyAndCircle(
        this.m_manifold[0],
        this.m_shape1,
        this.m_shape2,
        false
      );
      if (this.m_manifold[0].pointCount > 0) {
        this.m_manifoldCount = 1;
      } else {
        this.m_manifoldCount = 0;
      }
    },
    GetManifolds: function() {
      return this.m_manifold;
    },
    m_manifold: [new b2Manifold()]
  });
  b2PolyAndCircleContact.Create = function(e, t, n) {
    return new b2PolyAndCircleContact(e, t);
  };
  b2PolyAndCircleContact.Destroy = function(e, t) {};
  var b2PolyContact = Class.create();
  Object.extend(b2PolyContact.prototype, b2Contact.prototype);
  Object.extend(b2PolyContact.prototype, {
    initialize: function(e, t) {
      this.m_node1 = new b2ContactNode();
      this.m_node2 = new b2ContactNode();
      this.m_flags = 0;
      if (!e || !t) {
        this.m_shape1 = null;
        this.m_shape2 = null;
        return;
      }
      this.m_shape1 = e;
      this.m_shape2 = t;
      this.m_manifoldCount = 0;
      this.m_friction = Math.sqrt(
        this.m_shape1.m_friction * this.m_shape2.m_friction
      );
      this.m_restitution = b2Math.b2Max(
        this.m_shape1.m_restitution,
        this.m_shape2.m_restitution
      );
      this.m_prev = null;
      this.m_next = null;
      this.m_node1.contact = null;
      this.m_node1.prev = null;
      this.m_node1.next = null;
      this.m_node1.other = null;
      this.m_node2.contact = null;
      this.m_node2.prev = null;
      this.m_node2.next = null;
      this.m_node2.other = null;
      this.m0 = new b2Manifold();
      this.m_manifold = [new b2Manifold()];
      this.m_manifold[0].pointCount = 0;
    },
    m0: new b2Manifold(),
    Evaluate: function() {
      var e = this.m_manifold[0];
      var t = this.m0.points;
      for (var n = 0; n < e.pointCount; n++) {
        var r = t[n];
        var i = e.points[n];
        r.normalImpulse = i.normalImpulse;
        r.tangentImpulse = i.tangentImpulse;
        r.id = i.id.Copy();
      }
      this.m0.pointCount = e.pointCount;
      b2Collision.b2CollidePoly(e, this.m_shape1, this.m_shape2, false);
      if (e.pointCount > 0) {
        var s = [false, false];
        for (var o = 0; o < e.pointCount; ++o) {
          var u = e.points[o];
          u.normalImpulse = 0;
          u.tangentImpulse = 0;
          var a = u.id.key;
          for (var f = 0; f < this.m0.pointCount; ++f) {
            if (s[f] == true) continue;
            var l = this.m0.points[f];
            var c = l.id;
            if (c.key == a) {
              s[f] = true;
              u.normalImpulse = l.normalImpulse;
              u.tangentImpulse = l.tangentImpulse;
              break;
            }
          }
        }
        this.m_manifoldCount = 1;
      } else {
        this.m_manifoldCount = 0;
      }
    },
    GetManifolds: function() {
      return this.m_manifold;
    },
    m_manifold: [new b2Manifold()]
  });
  b2PolyContact.Create = function(e, t, n) {
    return new b2PolyContact(e, t);
  };
  b2PolyContact.Destroy = function(e, t) {};
  var b2ContactManager = Class.create();
  Object.extend(b2ContactManager.prototype, b2PairCallback.prototype);
  Object.extend(b2ContactManager.prototype, {
    initialize: function() {
      this.m_nullContact = new b2NullContact();
      this.m_world = null;
      this.m_destroyImmediate = false;
    },
    PairAdded: function(e, t) {
      var n = e;
      var r = t;
      var i = n.m_body;
      var s = r.m_body;
      if (i.IsStatic() && s.IsStatic()) {
        return this.m_nullContact;
      }
      if (n.m_body == r.m_body) {
        return this.m_nullContact;
      }
      if (s.IsConnected(i)) {
        return this.m_nullContact;
      }
      if (
        this.m_world.m_filter != null &&
        this.m_world.m_filter.ShouldCollide(n, r) == false
      ) {
        return this.m_nullContact;
      }
      if (s.m_invMass == 0) {
        var o = n;
        n = r;
        r = o;
        var u = i;
        i = s;
        s = u;
      }
      var a = b2Contact.Create(n, r, this.m_world.m_blockAllocator);
      if (a == null) {
        return this.m_nullContact;
      } else {
        a.m_prev = null;
        a.m_next = this.m_world.m_contactList;
        if (this.m_world.m_contactList != null) {
          this.m_world.m_contactList.m_prev = a;
        }
        this.m_world.m_contactList = a;
        this.m_world.m_contactCount++;
      }
      return a;
    },
    PairRemoved: function(e, t, n) {
      if (n == null) {
        return;
      }
      var r = n;
      if (r != this.m_nullContact) {
        if (this.m_destroyImmediate == true) {
          this.DestroyContact(r);
          r = null;
        } else {
          r.m_flags |= b2Contact.e_destroyFlag;
        }
      }
    },
    DestroyContact: function(e) {
      if (e.m_prev) {
        e.m_prev.m_next = e.m_next;
      }
      if (e.m_next) {
        e.m_next.m_prev = e.m_prev;
      }
      if (e == this.m_world.m_contactList) {
        this.m_world.m_contactList = e.m_next;
      }
      if (e.GetManifoldCount() > 0) {
        var t = e.m_shape1.m_body;
        var n = e.m_shape2.m_body;
        var r = e.m_node1;
        var i = e.m_node2;
        t.WakeUp();
        n.WakeUp();
        if (r.prev) {
          r.prev.next = r.next;
        }
        if (r.next) {
          r.next.prev = r.prev;
        }
        if (r == t.m_contactList) {
          t.m_contactList = r.next;
        }
        r.prev = null;
        r.next = null;
        if (i.prev) {
          i.prev.next = i.next;
        }
        if (i.next) {
          i.next.prev = i.prev;
        }
        if (i == n.m_contactList) {
          n.m_contactList = i.next;
        }
        i.prev = null;
        i.next = null;
      }
      b2Contact.Destroy(e, this.m_world.m_blockAllocator);
      --this.m_world.m_contactCount;
    },
    CleanContactList: function() {
      var e = this.m_world.m_contactList;
      while (e != null) {
        var t = e;
        e = e.m_next;
        if (t.m_flags & b2Contact.e_destroyFlag) {
          this.DestroyContact(t);
          t = null;
        }
      }
    },
    Collide: function() {
      var e;
      var t;
      var n;
      var r;
      for (var i = this.m_world.m_contactList; i != null; i = i.m_next) {
        if (i.m_shape1.m_body.IsSleeping() && i.m_shape2.m_body.IsSleeping()) {
          continue;
        }
        var s = i.GetManifoldCount();
        i.Evaluate();
        var o = i.GetManifoldCount();
        if (s == 0 && o > 0) {
          e = i.m_shape1.m_body;
          t = i.m_shape2.m_body;
          n = i.m_node1;
          r = i.m_node2;
          n.contact = i;
          n.other = t;
          n.prev = null;
          n.next = e.m_contactList;
          if (n.next != null) {
            n.next.prev = i.m_node1;
          }
          e.m_contactList = i.m_node1;
          r.contact = i;
          r.other = e;
          r.prev = null;
          r.next = t.m_contactList;
          if (r.next != null) {
            r.next.prev = r;
          }
          t.m_contactList = r;
        } else if (s > 0 && o == 0) {
          e = i.m_shape1.m_body;
          t = i.m_shape2.m_body;
          n = i.m_node1;
          r = i.m_node2;
          if (n.prev) {
            n.prev.next = n.next;
          }
          if (n.next) {
            n.next.prev = n.prev;
          }
          if (n == e.m_contactList) {
            e.m_contactList = n.next;
          }
          n.prev = null;
          n.next = null;
          if (r.prev) {
            r.prev.next = r.next;
          }
          if (r.next) {
            r.next.prev = r.prev;
          }
          if (r == t.m_contactList) {
            t.m_contactList = r.next;
          }
          r.prev = null;
          r.next = null;
        }
      }
    },
    m_world: null,
    m_nullContact: new b2NullContact(),
    m_destroyImmediate: null
  });
  var b2World = Class.create();
  b2World.prototype = {
    initialize: function(e, t, n) {
      this.step = new b2TimeStep();
      this.m_contactManager = new b2ContactManager();
      this.m_listener = null;
      this.m_filter = b2CollisionFilter.b2_defaultFilter;
      this.m_bodyList = null;
      this.m_contactList = null;
      this.m_jointList = null;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_bodyDestroyList = null;
      this.m_allowSleep = n;
      this.m_gravity = t;
      this.m_contactManager.m_world = this;
      this.m_broadPhase = new b2BroadPhase(e, this.m_contactManager);
      var r = new b2BodyDef();
      this.m_groundBody = this.CreateBody(r);
    },
    SetListener: function(e) {
      this.m_listener = e;
    },
    SetFilter: function(e) {
      this.m_filter = e;
    },
    CreateBody: function(e) {
      var t = new b2Body(e, this);
      t.m_prev = null;
      t.m_next = this.m_bodyList;
      if (this.m_bodyList) {
        this.m_bodyList.m_prev = t;
      }
      this.m_bodyList = t;
      ++this.m_bodyCount;
      return t;
    },
    DestroyBody: function(e) {
      if (e.m_flags & b2Body.e_destroyFlag) {
        return;
      }
      if (e.m_prev) {
        e.m_prev.m_next = e.m_next;
      }
      if (e.m_next) {
        e.m_next.m_prev = e.m_prev;
      }
      if (e == this.m_bodyList) {
        this.m_bodyList = e.m_next;
      }
      e.m_flags |= b2Body.e_destroyFlag;
      --this.m_bodyCount;
      e.m_prev = null;
      e.m_next = this.m_bodyDestroyList;
      this.m_bodyDestroyList = e;
    },
    CleanBodyList: function() {
      this.m_contactManager.m_destroyImmediate = true;
      var e = this.m_bodyDestroyList;
      while (e) {
        var t = e;
        e = e.m_next;
        var n = t.m_jointList;
        while (n) {
          var r = n;
          n = n.next;
          if (this.m_listener) {
            this.m_listener.NotifyJointDestroyed(r.joint);
          }
          this.DestroyJoint(r.joint);
        }
        t.Destroy();
      }
      this.m_bodyDestroyList = null;
      this.m_contactManager.m_destroyImmediate = false;
    },
    CreateJoint: function(e) {
      var t = b2Joint.Create(e, this.m_blockAllocator);
      t.m_prev = null;
      t.m_next = this.m_jointList;
      if (this.m_jointList) {
        this.m_jointList.m_prev = t;
      }
      this.m_jointList = t;
      ++this.m_jointCount;
      t.m_node1.joint = t;
      t.m_node1.other = t.m_body2;
      t.m_node1.prev = null;
      t.m_node1.next = t.m_body1.m_jointList;
      if (t.m_body1.m_jointList) t.m_body1.m_jointList.prev = t.m_node1;
      t.m_body1.m_jointList = t.m_node1;
      t.m_node2.joint = t;
      t.m_node2.other = t.m_body1;
      t.m_node2.prev = null;
      t.m_node2.next = t.m_body2.m_jointList;
      if (t.m_body2.m_jointList) t.m_body2.m_jointList.prev = t.m_node2;
      t.m_body2.m_jointList = t.m_node2;
      if (e.collideConnected == false) {
        var n = e.body1.m_shapeCount < e.body2.m_shapeCount ? e.body1 : e.body2;
        for (var r = n.m_shapeList; r; r = r.m_next) {
          r.ResetProxy(this.m_broadPhase);
        }
      }
      return t;
    },
    DestroyJoint: function(e) {
      var t = e.m_collideConnected;
      if (e.m_prev) {
        e.m_prev.m_next = e.m_next;
      }
      if (e.m_next) {
        e.m_next.m_prev = e.m_prev;
      }
      if (e == this.m_jointList) {
        this.m_jointList = e.m_next;
      }
      var n = e.m_body1;
      var r = e.m_body2;
      n.WakeUp();
      r.WakeUp();
      if (e.m_node1.prev) {
        e.m_node1.prev.next = e.m_node1.next;
      }
      if (e.m_node1.next) {
        e.m_node1.next.prev = e.m_node1.prev;
      }
      if (e.m_node1 == n.m_jointList) {
        n.m_jointList = e.m_node1.next;
      }
      e.m_node1.prev = null;
      e.m_node1.next = null;
      if (e.m_node2.prev) {
        e.m_node2.prev.next = e.m_node2.next;
      }
      if (e.m_node2.next) {
        e.m_node2.next.prev = e.m_node2.prev;
      }
      if (e.m_node2 == r.m_jointList) {
        r.m_jointList = e.m_node2.next;
      }
      e.m_node2.prev = null;
      e.m_node2.next = null;
      b2Joint.Destroy(e, this.m_blockAllocator);
      --this.m_jointCount;
      if (t == false) {
        var i = n.m_shapeCount < r.m_shapeCount ? n : r;
        for (var s = i.m_shapeList; s; s = s.m_next) {
          s.ResetProxy(this.m_broadPhase);
        }
      }
    },
    GetGroundBody: function() {
      return this.m_groundBody;
    },
    step: new b2TimeStep(),
    Step: function(e, t) {
      var n;
      var r;
      this.step.dt = e;
      this.step.iterations = t;
      if (e > 0) {
        this.step.inv_dt = 1 / e;
      } else {
        this.step.inv_dt = 0;
      }
      this.m_positionIterationCount = 0;
      this.m_contactManager.CleanContactList();
      this.CleanBodyList();
      this.m_contactManager.Collide();
      var i = new b2Island(
        this.m_bodyCount,
        this.m_contactCount,
        this.m_jointCount,
        this.m_stackAllocator
      );
      for (n = this.m_bodyList; n != null; n = n.m_next) {
        n.m_flags &= ~b2Body.e_islandFlag;
      }
      for (var s = this.m_contactList; s != null; s = s.m_next) {
        s.m_flags &= ~b2Contact.e_islandFlag;
      }
      for (var o = this.m_jointList; o != null; o = o.m_next) {
        o.m_islandFlag = false;
      }
      var u = this.m_bodyCount;
      var a = new Array(this.m_bodyCount);
      for (var f = 0; f < this.m_bodyCount; f++) a[f] = null;
      for (var l = this.m_bodyList; l != null; l = l.m_next) {
        if (
          l.m_flags &
          (b2Body.e_staticFlag |
            b2Body.e_islandFlag |
            b2Body.e_sleepFlag |
            b2Body.e_frozenFlag)
        ) {
          continue;
        }
        i.Clear();
        var c = 0;
        a[c++] = l;
        l.m_flags |= b2Body.e_islandFlag;
        while (c > 0) {
          n = a[--c];
          i.AddBody(n);
          n.m_flags &= ~b2Body.e_sleepFlag;
          if (n.m_flags & b2Body.e_staticFlag) {
            continue;
          }
          for (var h = n.m_contactList; h != null; h = h.next) {
            if (h.contact.m_flags & b2Contact.e_islandFlag) {
              continue;
            }
            i.AddContact(h.contact);
            h.contact.m_flags |= b2Contact.e_islandFlag;
            r = h.other;
            if (r.m_flags & b2Body.e_islandFlag) {
              continue;
            }
            a[c++] = r;
            r.m_flags |= b2Body.e_islandFlag;
          }
          for (var p = n.m_jointList; p != null; p = p.next) {
            if (p.joint.m_islandFlag == true) {
              continue;
            }
            i.AddJoint(p.joint);
            p.joint.m_islandFlag = true;
            r = p.other;
            if (r.m_flags & b2Body.e_islandFlag) {
              continue;
            }
            a[c++] = r;
            r.m_flags |= b2Body.e_islandFlag;
          }
        }
        i.Solve(this.step, this.m_gravity);
        this.m_positionIterationCount = b2Math.b2Max(
          this.m_positionIterationCount,
          b2Island.m_positionIterationCount
        );
        if (this.m_allowSleep) {
          i.UpdateSleep(e);
        }
        for (var d = 0; d < i.m_bodyCount; ++d) {
          n = i.m_bodies[d];
          if (n.m_flags & b2Body.e_staticFlag) {
            n.m_flags &= ~b2Body.e_islandFlag;
          }
          if (n.IsFrozen() && this.m_listener) {
            var v = this.m_listener.NotifyBoundaryViolated(n);
            if (v == b2WorldListener.b2_destroyBody) {
              this.DestroyBody(n);
              n = null;
              i.m_bodies[d] = null;
            }
          }
        }
      }
      this.m_broadPhase.Commit();
    },
    Query: function(e, t, n) {
      var r = new Array();
      var i = this.m_broadPhase.QueryAABB(e, r, n);
      for (var s = 0; s < i; ++s) {
        t[s] = r[s];
      }
      return i;
    },
    GetBodyList: function() {
      return this.m_bodyList;
    },
    GetJointList: function() {
      return this.m_jointList;
    },
    GetContactList: function() {
      return this.m_contactList;
    },
    m_blockAllocator: null,
    m_stackAllocator: null,
    m_broadPhase: null,
    m_contactManager: new b2ContactManager(),
    m_bodyList: null,
    m_contactList: null,
    m_jointList: null,
    m_bodyCount: 0,
    m_contactCount: 0,
    m_jointCount: 0,
    m_bodyDestroyList: null,
    m_gravity: null,
    m_allowSleep: null,
    m_groundBody: null,
    m_listener: null,
    m_filter: null,
    m_positionIterationCount: 0
  };
  b2World.s_enablePositionCorrection = 1;
  b2World.s_enableWarmStarting = 1;
  var b2WorldListener = Class.create();
  b2WorldListener.prototype = {
    NotifyJointDestroyed: function(e) {},
    NotifyBoundaryViolated: function(e) {
      return b2WorldListener.b2_freezeBody;
    },
    initialize: function() {}
  };
  b2WorldListener.b2_freezeBody = 0;
  b2WorldListener.b2_destroyBody = 1;
  var b2JointNode = Class.create();
  b2JointNode.prototype = {
    other: null,
    joint: null,
    prev: null,
    next: null,
    initialize: function() {}
  };
  var b2Joint = Class.create();
  b2Joint.prototype = {
    GetType: function() {
      return this.m_type;
    },
    GetAnchor1: function() {
      return null;
    },
    GetAnchor2: function() {
      return null;
    },
    GetReactionForce: function(e) {
      return null;
    },
    GetReactionTorque: function(e) {
      return 0;
    },
    GetBody1: function() {
      return this.m_body1;
    },
    GetBody2: function() {
      return this.m_body2;
    },
    GetNext: function() {
      return this.m_next;
    },
    GetUserData: function() {
      return this.m_userData;
    },
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
    },
    PrepareVelocitySolver: function() {},
    SolveVelocityConstraints: function(e) {},
    PreparePositionSolver: function() {},
    SolvePositionConstraints: function() {
      return false;
    },
    m_type: 0,
    m_prev: null,
    m_next: null,
    m_node1: new b2JointNode(),
    m_node2: new b2JointNode(),
    m_body1: null,
    m_body2: null,
    m_islandFlag: null,
    m_collideConnected: null,
    m_userData: null
  };
  b2Joint.Create = function(e, t) {
    var n = null;
    switch (e.type) {
      case b2Joint.e_distanceJoint:
        {
          n = new b2DistanceJoint(e);
        }
        break;
      case b2Joint.e_mouseJoint:
        {
          n = new b2MouseJoint(e);
        }
        break;
      case b2Joint.e_prismaticJoint:
        {
          n = new b2PrismaticJoint(e);
        }
        break;
      case b2Joint.e_revoluteJoint:
        {
          n = new b2RevoluteJoint(e);
        }
        break;
      case b2Joint.e_pulleyJoint:
        {
          n = new b2PulleyJoint(e);
        }
        break;
      case b2Joint.e_gearJoint:
        {
          n = new b2GearJoint(e);
        }
        break;
      default:
        break;
    }
    return n;
  };
  b2Joint.Destroy = function(e, t) {};
  b2Joint.e_unknownJoint = 0;
  b2Joint.e_revoluteJoint = 1;
  b2Joint.e_prismaticJoint = 2;
  b2Joint.e_distanceJoint = 3;
  b2Joint.e_pulleyJoint = 4;
  b2Joint.e_mouseJoint = 5;
  b2Joint.e_gearJoint = 6;
  b2Joint.e_inactiveLimit = 0;
  b2Joint.e_atLowerLimit = 1;
  b2Joint.e_atUpperLimit = 2;
  b2Joint.e_equalLimits = 3;
  var b2JointDef = Class.create();
  b2JointDef.prototype = {
    initialize: function() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
    },
    type: 0,
    userData: null,
    body1: null,
    body2: null,
    collideConnected: null
  };
  var b2DistanceJoint = Class.create();
  Object.extend(b2DistanceJoint.prototype, b2Joint.prototype);
  Object.extend(b2DistanceJoint.prototype, {
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u = new b2Vec2();
      var t;
      var n;
      var r;
      t = this.m_body1.m_R;
      n = e.anchorPoint1.x - this.m_body1.m_position.x;
      r = e.anchorPoint1.y - this.m_body1.m_position.y;
      this.m_localAnchor1.x = n * t.col1.x + r * t.col1.y;
      this.m_localAnchor1.y = n * t.col2.x + r * t.col2.y;
      t = this.m_body2.m_R;
      n = e.anchorPoint2.x - this.m_body2.m_position.x;
      r = e.anchorPoint2.y - this.m_body2.m_position.y;
      this.m_localAnchor2.x = n * t.col1.x + r * t.col1.y;
      this.m_localAnchor2.y = n * t.col2.x + r * t.col2.y;
      n = e.anchorPoint2.x - e.anchorPoint1.x;
      r = e.anchorPoint2.y - e.anchorPoint1.y;
      this.m_length = Math.sqrt(n * n + r * r);
      this.m_impulse = 0;
    },
    PrepareVelocitySolver: function() {
      var e;
      e = this.m_body1.m_R;
      var t =
        e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y;
      var n =
        e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
      e = this.m_body2.m_R;
      var r =
        e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
      var i =
        e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
      this.m_u.x =
        this.m_body2.m_position.x + r - this.m_body1.m_position.x - t;
      this.m_u.y =
        this.m_body2.m_position.y + i - this.m_body1.m_position.y - n;
      var s = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
      if (s > b2Settings.b2_linearSlop) {
        this.m_u.Multiply(1 / s);
      } else {
        this.m_u.SetZero();
      }
      var o = t * this.m_u.y - n * this.m_u.x;
      var u = r * this.m_u.y - i * this.m_u.x;
      this.m_mass =
        this.m_body1.m_invMass +
        this.m_body1.m_invI * o * o +
        this.m_body2.m_invMass +
        this.m_body2.m_invI * u * u;
      this.m_mass = 1 / this.m_mass;
      if (b2World.s_enableWarmStarting) {
        var a = this.m_impulse * this.m_u.x;
        var f = this.m_impulse * this.m_u.y;
        this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * a;
        this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * f;
        this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (t * f - n * a);
        this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * a;
        this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * f;
        this.m_body2.m_angularVelocity += this.m_body2.m_invI * (r * f - i * a);
      } else {
        this.m_impulse = 0;
      }
    },
    SolveVelocityConstraints: function(e) {
      var t;
      t = this.m_body1.m_R;
      var n =
        t.col1.x * this.m_localAnchor1.x + t.col2.x * this.m_localAnchor1.y;
      var r =
        t.col1.y * this.m_localAnchor1.x + t.col2.y * this.m_localAnchor1.y;
      t = this.m_body2.m_R;
      var i =
        t.col1.x * this.m_localAnchor2.x + t.col2.x * this.m_localAnchor2.y;
      var s =
        t.col1.y * this.m_localAnchor2.x + t.col2.y * this.m_localAnchor2.y;
      var o =
        this.m_body1.m_linearVelocity.x + -this.m_body1.m_angularVelocity * r;
      var u =
        this.m_body1.m_linearVelocity.y + this.m_body1.m_angularVelocity * n;
      var a =
        this.m_body2.m_linearVelocity.x + -this.m_body2.m_angularVelocity * s;
      var f =
        this.m_body2.m_linearVelocity.y + this.m_body2.m_angularVelocity * i;
      var l = this.m_u.x * (a - o) + this.m_u.y * (f - u);
      var c = -this.m_mass * l;
      this.m_impulse += c;
      var h = c * this.m_u.x;
      var p = c * this.m_u.y;
      this.m_body1.m_linearVelocity.x -= this.m_body1.m_invMass * h;
      this.m_body1.m_linearVelocity.y -= this.m_body1.m_invMass * p;
      this.m_body1.m_angularVelocity -= this.m_body1.m_invI * (n * p - r * h);
      this.m_body2.m_linearVelocity.x += this.m_body2.m_invMass * h;
      this.m_body2.m_linearVelocity.y += this.m_body2.m_invMass * p;
      this.m_body2.m_angularVelocity += this.m_body2.m_invI * (i * p - s * h);
    },
    SolvePositionConstraints: function() {
      var e;
      e = this.m_body1.m_R;
      var t =
        e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y;
      var n =
        e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y;
      e = this.m_body2.m_R;
      var r =
        e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y;
      var i =
        e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y;
      var s = this.m_body2.m_position.x + r - this.m_body1.m_position.x - t;
      var o = this.m_body2.m_position.y + i - this.m_body1.m_position.y - n;
      var u = Math.sqrt(s * s + o * o);
      s /= u;
      o /= u;
      var a = u - this.m_length;
      a = b2Math.b2Clamp(
        a,
        -b2Settings.b2_maxLinearCorrection,
        b2Settings.b2_maxLinearCorrection
      );
      var f = -this.m_mass * a;
      this.m_u.Set(s, o);
      var l = f * this.m_u.x;
      var c = f * this.m_u.y;
      this.m_body1.m_position.x -= this.m_body1.m_invMass * l;
      this.m_body1.m_position.y -= this.m_body1.m_invMass * c;
      this.m_body1.m_rotation -= this.m_body1.m_invI * (t * c - n * l);
      this.m_body2.m_position.x += this.m_body2.m_invMass * l;
      this.m_body2.m_position.y += this.m_body2.m_invMass * c;
      this.m_body2.m_rotation += this.m_body2.m_invI * (r * c - i * l);
      this.m_body1.m_R.Set(this.m_body1.m_rotation);
      this.m_body2.m_R.Set(this.m_body2.m_rotation);
      return b2Math.b2Abs(a) < b2Settings.b2_linearSlop;
    },
    GetAnchor1: function() {
      return b2Math.AddVV(
        this.m_body1.m_position,
        b2Math.b2MulMV(this.m_body1.m_R, this.m_localAnchor1)
      );
    },
    GetAnchor2: function() {
      return b2Math.AddVV(
        this.m_body2.m_position,
        b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor2)
      );
    },
    GetReactionForce: function(e) {
      var t = new b2Vec2();
      t.SetV(this.m_u);
      t.Multiply(this.m_impulse * e);
      return t;
    },
    GetReactionTorque: function(e) {
      return 0;
    },
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_u: new b2Vec2(),
    m_impulse: null,
    m_mass: null,
    m_length: null
  });
  var b2DistanceJointDef = Class.create();
  Object.extend(b2DistanceJointDef.prototype, b2JointDef.prototype);
  Object.extend(b2DistanceJointDef.prototype, {
    initialize: function() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.anchorPoint1 = new b2Vec2();
      this.anchorPoint2 = new b2Vec2();
      this.type = b2Joint.e_distanceJoint;
    },
    anchorPoint1: new b2Vec2(),
    anchorPoint2: new b2Vec2()
  });
  var b2Jacobian = Class.create();
  b2Jacobian.prototype = {
    linear1: new b2Vec2(),
    angular1: null,
    linear2: new b2Vec2(),
    angular2: null,
    SetZero: function() {
      this.linear1.SetZero();
      this.angular1 = 0;
      this.linear2.SetZero();
      this.angular2 = 0;
    },
    Set: function(e, t, n, r) {
      this.linear1.SetV(e);
      this.angular1 = t;
      this.linear2.SetV(n);
      this.angular2 = r;
    },
    Compute: function(e, t, n, r) {
      return (
        this.linear1.x * e.x +
        this.linear1.y * e.y +
        this.angular1 * t +
        (this.linear2.x * n.x + this.linear2.y * n.y) +
        this.angular2 * r
      );
    },
    initialize: function() {
      this.linear1 = new b2Vec2();
      this.linear2 = new b2Vec2();
    }
  };
  var b2GearJoint = Class.create();
  Object.extend(b2GearJoint.prototype, b2Joint.prototype);
  Object.extend(b2GearJoint.prototype, {
    GetAnchor1: function() {
      var e = this.m_body1.m_R;
      return new b2Vec2(
        this.m_body1.m_position.x +
          (e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y),
        this.m_body1.m_position.y +
          (e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y)
      );
    },
    GetAnchor2: function() {
      var e = this.m_body2.m_R;
      return new b2Vec2(
        this.m_body2.m_position.x +
          (e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y),
        this.m_body2.m_position.y +
          (e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y)
      );
    },
    GetReactionForce: function(e) {
      return new b2Vec2();
    },
    GetReactionTorque: function(e) {
      return 0;
    },
    GetRatio: function() {
      return this.m_ratio;
    },
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_J = new b2Jacobian();
      this.m_revolute1 = null;
      this.m_prismatic1 = null;
      this.m_revolute2 = null;
      this.m_prismatic2 = null;
      var t;
      var n;
      this.m_ground1 = e.joint1.m_body1;
      this.m_body1 = e.joint1.m_body2;
      if (e.joint1.m_type == b2Joint.e_revoluteJoint) {
        this.m_revolute1 = e.joint1;
        this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
        this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
        t = this.m_revolute1.GetJointAngle();
      } else {
        this.m_prismatic1 = e.joint1;
        this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
        this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
        t = this.m_prismatic1.GetJointTranslation();
      }
      this.m_ground2 = e.joint2.m_body1;
      this.m_body2 = e.joint2.m_body2;
      if (e.joint2.m_type == b2Joint.e_revoluteJoint) {
        this.m_revolute2 = e.joint2;
        this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
        this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
        n = this.m_revolute2.GetJointAngle();
      } else {
        this.m_prismatic2 = e.joint2;
        this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
        this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
        n = this.m_prismatic2.GetJointTranslation();
      }
      this.m_ratio = e.ratio;
      this.m_constant = t + this.m_ratio * n;
      this.m_impulse = 0;
    },
    PrepareVelocitySolver: function() {
      var e = this.m_ground1;
      var t = this.m_ground2;
      var n = this.m_body1;
      var r = this.m_body2;
      var i;
      var s;
      var o;
      var u;
      var a;
      var f;
      var l;
      var c = 0;
      this.m_J.SetZero();
      if (this.m_revolute1) {
        this.m_J.angular1 = -1;
        c += n.m_invI;
      } else {
        a = e.m_R;
        f = this.m_prismatic1.m_localXAxis1;
        i = a.col1.x * f.x + a.col2.x * f.y;
        s = a.col1.y * f.x + a.col2.y * f.y;
        a = n.m_R;
        o = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y;
        u = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        l = o * s - u * i;
        this.m_J.linear1.Set(-i, -s);
        this.m_J.angular1 = -l;
        c += n.m_invMass + n.m_invI * l * l;
      }
      if (this.m_revolute2) {
        this.m_J.angular2 = -this.m_ratio;
        c += this.m_ratio * this.m_ratio * r.m_invI;
      } else {
        a = t.m_R;
        f = this.m_prismatic2.m_localXAxis1;
        i = a.col1.x * f.x + a.col2.x * f.y;
        s = a.col1.y * f.x + a.col2.y * f.y;
        a = r.m_R;
        o = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        u = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
        l = o * s - u * i;
        this.m_J.linear2.Set(-this.m_ratio * i, -this.m_ratio * s);
        this.m_J.angular2 = -this.m_ratio * l;
        c += this.m_ratio * this.m_ratio * (r.m_invMass + r.m_invI * l * l);
      }
      this.m_mass = 1 / c;
      n.m_linearVelocity.x += n.m_invMass * this.m_impulse * this.m_J.linear1.x;
      n.m_linearVelocity.y += n.m_invMass * this.m_impulse * this.m_J.linear1.y;
      n.m_angularVelocity += n.m_invI * this.m_impulse * this.m_J.angular1;
      r.m_linearVelocity.x += r.m_invMass * this.m_impulse * this.m_J.linear2.x;
      r.m_linearVelocity.y += r.m_invMass * this.m_impulse * this.m_J.linear2.y;
      r.m_angularVelocity += r.m_invI * this.m_impulse * this.m_J.angular2;
    },
    SolveVelocityConstraints: function(e) {
      var t = this.m_body1;
      var n = this.m_body2;
      var r = this.m_J.Compute(
        t.m_linearVelocity,
        t.m_angularVelocity,
        n.m_linearVelocity,
        n.m_angularVelocity
      );
      var i = -this.m_mass * r;
      this.m_impulse += i;
      t.m_linearVelocity.x += t.m_invMass * i * this.m_J.linear1.x;
      t.m_linearVelocity.y += t.m_invMass * i * this.m_J.linear1.y;
      t.m_angularVelocity += t.m_invI * i * this.m_J.angular1;
      n.m_linearVelocity.x += n.m_invMass * i * this.m_J.linear2.x;
      n.m_linearVelocity.y += n.m_invMass * i * this.m_J.linear2.y;
      n.m_angularVelocity += n.m_invI * i * this.m_J.angular2;
    },
    SolvePositionConstraints: function() {
      var e = 0;
      var t = this.m_body1;
      var n = this.m_body2;
      var r;
      var i;
      if (this.m_revolute1) {
        r = this.m_revolute1.GetJointAngle();
      } else {
        r = this.m_prismatic1.GetJointTranslation();
      }
      if (this.m_revolute2) {
        i = this.m_revolute2.GetJointAngle();
      } else {
        i = this.m_prismatic2.GetJointTranslation();
      }
      var s = this.m_constant - (r + this.m_ratio * i);
      var o = -this.m_mass * s;
      t.m_position.x += t.m_invMass * o * this.m_J.linear1.x;
      t.m_position.y += t.m_invMass * o * this.m_J.linear1.y;
      t.m_rotation += t.m_invI * o * this.m_J.angular1;
      n.m_position.x += n.m_invMass * o * this.m_J.linear2.x;
      n.m_position.y += n.m_invMass * o * this.m_J.linear2.y;
      n.m_rotation += n.m_invI * o * this.m_J.angular2;
      t.m_R.Set(t.m_rotation);
      n.m_R.Set(n.m_rotation);
      return e < b2Settings.b2_linearSlop;
    },
    m_ground1: null,
    m_ground2: null,
    m_revolute1: null,
    m_prismatic1: null,
    m_revolute2: null,
    m_prismatic2: null,
    m_groundAnchor1: new b2Vec2(),
    m_groundAnchor2: new b2Vec2(),
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_J: new b2Jacobian(),
    m_constant: null,
    m_ratio: null,
    m_mass: null,
    m_impulse: null
  });
  var b2GearJointDef = Class.create();
  Object.extend(b2GearJointDef.prototype, b2JointDef.prototype);
  Object.extend(b2GearJointDef.prototype, {
    initialize: function() {
      this.type = b2Joint.e_gearJoint;
      this.joint1 = null;
      this.joint2 = null;
      this.ratio = 1;
    },
    joint1: null,
    joint2: null,
    ratio: null
  });
  var b2MouseJoint = Class.create();
  Object.extend(b2MouseJoint.prototype, b2Joint.prototype);
  Object.extend(b2MouseJoint.prototype, {
    GetAnchor1: function() {
      return this.m_target;
    },
    GetAnchor2: function() {
      var e = b2Math.b2MulMV(this.m_body2.m_R, this.m_localAnchor);
      e.Add(this.m_body2.m_position);
      return e;
    },
    GetReactionForce: function(e) {
      var t = new b2Vec2();
      t.SetV(this.m_impulse);
      t.Multiply(e);
      return t;
    },
    GetReactionTorque: function(e) {
      return 0;
    },
    SetTarget: function(e) {
      this.m_body2.WakeUp();
      this.m_target = e;
    },
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.m_localAnchor = new b2Vec2();
      this.m_target = new b2Vec2();
      this.m_impulse = new b2Vec2();
      this.m_ptpMass = new b2Mat22();
      this.m_C = new b2Vec2();
      this.m_target.SetV(e.target);
      var t = this.m_target.x - this.m_body2.m_position.x;
      var n = this.m_target.y - this.m_body2.m_position.y;
      this.m_localAnchor.x =
        t * this.m_body2.m_R.col1.x + n * this.m_body2.m_R.col1.y;
      this.m_localAnchor.y =
        t * this.m_body2.m_R.col2.x + n * this.m_body2.m_R.col2.y;
      this.m_maxForce = e.maxForce;
      this.m_impulse.SetZero();
      var r = this.m_body2.m_mass;
      var i = 2 * b2Settings.b2_pi * e.frequencyHz;
      var s = 2 * r * e.dampingRatio * i;
      var o = r * i * i;
      this.m_gamma = 1 / (s + e.timeStep * o);
      this.m_beta = (e.timeStep * o) / (s + e.timeStep * o);
    },
    K: new b2Mat22(),
    K1: new b2Mat22(),
    K2: new b2Mat22(),
    PrepareVelocitySolver: function() {
      var e = this.m_body2;
      var t;
      t = e.m_R;
      var n = t.col1.x * this.m_localAnchor.x + t.col2.x * this.m_localAnchor.y;
      var r = t.col1.y * this.m_localAnchor.x + t.col2.y * this.m_localAnchor.y;
      var i = e.m_invMass;
      var s = e.m_invI;
      this.K1.col1.x = i;
      this.K1.col2.x = 0;
      this.K1.col1.y = 0;
      this.K1.col2.y = i;
      this.K2.col1.x = s * r * r;
      this.K2.col2.x = -s * n * r;
      this.K2.col1.y = -s * n * r;
      this.K2.col2.y = s * n * n;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.col1.x += this.m_gamma;
      this.K.col2.y += this.m_gamma;
      this.K.Invert(this.m_ptpMass);
      this.m_C.x = e.m_position.x + n - this.m_target.x;
      this.m_C.y = e.m_position.y + r - this.m_target.y;
      e.m_angularVelocity *= 0.98;
      var o = this.m_impulse.x;
      var u = this.m_impulse.y;
      e.m_linearVelocity.x += i * o;
      e.m_linearVelocity.y += i * u;
      e.m_angularVelocity += s * (n * u - r * o);
    },
    SolveVelocityConstraints: function(e) {
      var t = this.m_body2;
      var n;
      n = t.m_R;
      var r = n.col1.x * this.m_localAnchor.x + n.col2.x * this.m_localAnchor.y;
      var i = n.col1.y * this.m_localAnchor.x + n.col2.y * this.m_localAnchor.y;
      var s = t.m_linearVelocity.x + -t.m_angularVelocity * i;
      var o = t.m_linearVelocity.y + t.m_angularVelocity * r;
      n = this.m_ptpMass;
      var u =
        s +
        this.m_beta * e.inv_dt * this.m_C.x +
        this.m_gamma * this.m_impulse.x;
      var a =
        o +
        this.m_beta * e.inv_dt * this.m_C.y +
        this.m_gamma * this.m_impulse.y;
      var f = -(n.col1.x * u + n.col2.x * a);
      var l = -(n.col1.y * u + n.col2.y * a);
      var c = this.m_impulse.x;
      var h = this.m_impulse.y;
      this.m_impulse.x += f;
      this.m_impulse.y += l;
      var p = this.m_impulse.Length();
      if (p > e.dt * this.m_maxForce) {
        this.m_impulse.Multiply((e.dt * this.m_maxForce) / p);
      }
      f = this.m_impulse.x - c;
      l = this.m_impulse.y - h;
      t.m_linearVelocity.x += t.m_invMass * f;
      t.m_linearVelocity.y += t.m_invMass * l;
      t.m_angularVelocity += t.m_invI * (r * l - i * f);
    },
    SolvePositionConstraints: function() {
      return true;
    },
    m_localAnchor: new b2Vec2(),
    m_target: new b2Vec2(),
    m_impulse: new b2Vec2(),
    m_ptpMass: new b2Mat22(),
    m_C: new b2Vec2(),
    m_maxForce: null,
    m_beta: null,
    m_gamma: null
  });
  var b2MouseJointDef = Class.create();
  Object.extend(b2MouseJointDef.prototype, b2JointDef.prototype);
  Object.extend(b2MouseJointDef.prototype, {
    initialize: function() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.target = new b2Vec2();
      this.type = b2Joint.e_mouseJoint;
      this.maxForce = 0;
      this.frequencyHz = 5;
      this.dampingRatio = 0.7;
      this.timeStep = 1 / 60;
    },
    target: new b2Vec2(),
    maxForce: null,
    frequencyHz: null,
    dampingRatio: null,
    timeStep: null
  });
  var b2PrismaticJoint = Class.create();
  Object.extend(b2PrismaticJoint.prototype, b2Joint.prototype);
  Object.extend(b2PrismaticJoint.prototype, {
    GetAnchor1: function() {
      var e = this.m_body1;
      var t = new b2Vec2();
      t.SetV(this.m_localAnchor1);
      t.MulM(e.m_R);
      t.Add(e.m_position);
      return t;
    },
    GetAnchor2: function() {
      var e = this.m_body2;
      var t = new b2Vec2();
      t.SetV(this.m_localAnchor2);
      t.MulM(e.m_R);
      t.Add(e.m_position);
      return t;
    },
    GetJointTranslation: function() {
      var e = this.m_body1;
      var t = this.m_body2;
      var n;
      n = e.m_R;
      var r =
        n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
      var i =
        n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
      n = t.m_R;
      var s =
        n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
      var o =
        n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
      var u = e.m_position.x + r;
      var a = e.m_position.y + i;
      var f = t.m_position.x + s;
      var l = t.m_position.y + o;
      var c = f - u;
      var h = l - a;
      n = e.m_R;
      var p = n.col1.x * this.m_localXAxis1.x + n.col2.x * this.m_localXAxis1.y;
      var d = n.col1.y * this.m_localXAxis1.x + n.col2.y * this.m_localXAxis1.y;
      var v = p * c + d * h;
      return v;
    },
    GetJointSpeed: function() {
      var e = this.m_body1;
      var t = this.m_body2;
      var n;
      n = e.m_R;
      var r =
        n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
      var i =
        n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
      n = t.m_R;
      var s =
        n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
      var o =
        n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
      var u = e.m_position.x + r;
      var a = e.m_position.y + i;
      var f = t.m_position.x + s;
      var l = t.m_position.y + o;
      var c = f - u;
      var h = l - a;
      n = e.m_R;
      var p = n.col1.x * this.m_localXAxis1.x + n.col2.x * this.m_localXAxis1.y;
      var d = n.col1.y * this.m_localXAxis1.x + n.col2.y * this.m_localXAxis1.y;
      var v = e.m_linearVelocity;
      var m = t.m_linearVelocity;
      var g = e.m_angularVelocity;
      var y = t.m_angularVelocity;
      var b =
        c * -g * d +
        h * g * p +
        (p * (m.x + -y * o - v.x - -g * i) + d * (m.y + y * s - v.y - g * r));
      return b;
    },
    GetMotorForce: function(e) {
      return e * this.m_motorImpulse;
    },
    SetMotorSpeed: function(e) {
      this.m_motorSpeed = e;
    },
    SetMotorForce: function(e) {
      this.m_maxMotorForce = e;
    },
    GetReactionForce: function(e) {
      var t = e * this.m_limitImpulse;
      var n;
      n = this.m_body1.m_R;
      var r =
        t * (n.col1.x * this.m_localXAxis1.x + n.col2.x * this.m_localXAxis1.y);
      var i =
        t * (n.col1.y * this.m_localXAxis1.x + n.col2.y * this.m_localXAxis1.y);
      var s =
        t * (n.col1.x * this.m_localYAxis1.x + n.col2.x * this.m_localYAxis1.y);
      var o =
        t * (n.col1.y * this.m_localYAxis1.x + n.col2.y * this.m_localYAxis1.y);
      return new b2Vec2(r + s, i + o);
    },
    GetReactionTorque: function(e) {
      return e * this.m_angularImpulse;
    },
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_linearJacobian = new b2Jacobian();
      this.m_motorJacobian = new b2Jacobian();
      var t;
      var n;
      var r;
      t = this.m_body1.m_R;
      n = e.anchorPoint.x - this.m_body1.m_position.x;
      r = e.anchorPoint.y - this.m_body1.m_position.y;
      this.m_localAnchor1.Set(
        n * t.col1.x + r * t.col1.y,
        n * t.col2.x + r * t.col2.y
      );
      t = this.m_body2.m_R;
      n = e.anchorPoint.x - this.m_body2.m_position.x;
      r = e.anchorPoint.y - this.m_body2.m_position.y;
      this.m_localAnchor2.Set(
        n * t.col1.x + r * t.col1.y,
        n * t.col2.x + r * t.col2.y
      );
      t = this.m_body1.m_R;
      n = e.axis.x;
      r = e.axis.y;
      this.m_localXAxis1.Set(
        n * t.col1.x + r * t.col1.y,
        n * t.col2.x + r * t.col2.y
      );
      this.m_localYAxis1.x = -this.m_localXAxis1.y;
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_initialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
      this.m_linearJacobian.SetZero();
      this.m_linearMass = 0;
      this.m_linearImpulse = 0;
      this.m_angularMass = 0;
      this.m_angularImpulse = 0;
      this.m_motorJacobian.SetZero();
      this.m_motorMass = 0;
      this.m_motorImpulse = 0;
      this.m_limitImpulse = 0;
      this.m_limitPositionImpulse = 0;
      this.m_lowerTranslation = e.lowerTranslation;
      this.m_upperTranslation = e.upperTranslation;
      this.m_maxMotorForce = e.motorForce;
      this.m_motorSpeed = e.motorSpeed;
      this.m_enableLimit = e.enableLimit;
      this.m_enableMotor = e.enableMotor;
    },
    PrepareVelocitySolver: function() {
      var e = this.m_body1;
      var t = this.m_body2;
      var n;
      n = e.m_R;
      var r =
        n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
      var i =
        n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
      n = t.m_R;
      var s =
        n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
      var o =
        n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
      var u = e.m_invMass;
      var a = t.m_invMass;
      var f = e.m_invI;
      var l = t.m_invI;
      n = e.m_R;
      var c = n.col1.x * this.m_localYAxis1.x + n.col2.x * this.m_localYAxis1.y;
      var h = n.col1.y * this.m_localYAxis1.x + n.col2.y * this.m_localYAxis1.y;
      var p = t.m_position.x + s - e.m_position.x;
      var d = t.m_position.y + o - e.m_position.y;
      this.m_linearJacobian.linear1.x = -c;
      this.m_linearJacobian.linear1.y = -h;
      this.m_linearJacobian.linear2.x = c;
      this.m_linearJacobian.linear2.y = h;
      this.m_linearJacobian.angular1 = -(p * h - d * c);
      this.m_linearJacobian.angular2 = s * h - o * c;
      this.m_linearMass =
        u +
        f * this.m_linearJacobian.angular1 * this.m_linearJacobian.angular1 +
        a +
        l * this.m_linearJacobian.angular2 * this.m_linearJacobian.angular2;
      this.m_linearMass = 1 / this.m_linearMass;
      this.m_angularMass = 1 / (f + l);
      if (this.m_enableLimit || this.m_enableMotor) {
        n = e.m_R;
        var v =
          n.col1.x * this.m_localXAxis1.x + n.col2.x * this.m_localXAxis1.y;
        var m =
          n.col1.y * this.m_localXAxis1.x + n.col2.y * this.m_localXAxis1.y;
        this.m_motorJacobian.linear1.x = -v;
        this.m_motorJacobian.linear1.y = -m;
        this.m_motorJacobian.linear2.x = v;
        this.m_motorJacobian.linear2.y = m;
        this.m_motorJacobian.angular1 = -(p * m - d * v);
        this.m_motorJacobian.angular2 = s * m - o * v;
        this.m_motorMass =
          u +
          f * this.m_motorJacobian.angular1 * this.m_motorJacobian.angular1 +
          a +
          l * this.m_motorJacobian.angular2 * this.m_motorJacobian.angular2;
        this.m_motorMass = 1 / this.m_motorMass;
        if (this.m_enableLimit) {
          var g = p - r;
          var y = d - i;
          var b = v * g + m * y;
          if (
            b2Math.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) <
            2 * b2Settings.b2_linearSlop
          ) {
            this.m_limitState = b2Joint.e_equalLimits;
          } else if (b <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
              this.m_limitImpulse = 0;
            }
            this.m_limitState = b2Joint.e_atLowerLimit;
          } else if (b >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
              this.m_limitImpulse = 0;
            }
            this.m_limitState = b2Joint.e_atUpperLimit;
          } else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_limitImpulse = 0;
          }
        }
      }
      if (this.m_enableMotor == false) {
        this.m_motorImpulse = 0;
      }
      if (this.m_enableLimit == false) {
        this.m_limitImpulse = 0;
      }
      if (b2World.s_enableWarmStarting) {
        var w =
          this.m_linearImpulse * this.m_linearJacobian.linear1.x +
          (this.m_motorImpulse + this.m_limitImpulse) *
            this.m_motorJacobian.linear1.x;
        var E =
          this.m_linearImpulse * this.m_linearJacobian.linear1.y +
          (this.m_motorImpulse + this.m_limitImpulse) *
            this.m_motorJacobian.linear1.y;
        var S =
          this.m_linearImpulse * this.m_linearJacobian.linear2.x +
          (this.m_motorImpulse + this.m_limitImpulse) *
            this.m_motorJacobian.linear2.x;
        var x =
          this.m_linearImpulse * this.m_linearJacobian.linear2.y +
          (this.m_motorImpulse + this.m_limitImpulse) *
            this.m_motorJacobian.linear2.y;
        var T =
          this.m_linearImpulse * this.m_linearJacobian.angular1 -
          this.m_angularImpulse +
          (this.m_motorImpulse + this.m_limitImpulse) *
            this.m_motorJacobian.angular1;
        var N =
          this.m_linearImpulse * this.m_linearJacobian.angular2 +
          this.m_angularImpulse +
          (this.m_motorImpulse + this.m_limitImpulse) *
            this.m_motorJacobian.angular2;
        e.m_linearVelocity.x += u * w;
        e.m_linearVelocity.y += u * E;
        e.m_angularVelocity += f * T;
        t.m_linearVelocity.x += a * S;
        t.m_linearVelocity.y += a * x;
        t.m_angularVelocity += l * N;
      } else {
        this.m_linearImpulse = 0;
        this.m_angularImpulse = 0;
        this.m_limitImpulse = 0;
        this.m_motorImpulse = 0;
      }
      this.m_limitPositionImpulse = 0;
    },
    SolveVelocityConstraints: function(e) {
      var t = this.m_body1;
      var n = this.m_body2;
      var r = t.m_invMass;
      var i = n.m_invMass;
      var s = t.m_invI;
      var o = n.m_invI;
      var u;
      var a = this.m_linearJacobian.Compute(
        t.m_linearVelocity,
        t.m_angularVelocity,
        n.m_linearVelocity,
        n.m_angularVelocity
      );
      var f = -this.m_linearMass * a;
      this.m_linearImpulse += f;
      t.m_linearVelocity.x += r * f * this.m_linearJacobian.linear1.x;
      t.m_linearVelocity.y += r * f * this.m_linearJacobian.linear1.y;
      t.m_angularVelocity += s * f * this.m_linearJacobian.angular1;
      n.m_linearVelocity.x += i * f * this.m_linearJacobian.linear2.x;
      n.m_linearVelocity.y += i * f * this.m_linearJacobian.linear2.y;
      n.m_angularVelocity += o * f * this.m_linearJacobian.angular2;
      var l = n.m_angularVelocity - t.m_angularVelocity;
      var c = -this.m_angularMass * l;
      this.m_angularImpulse += c;
      t.m_angularVelocity -= s * c;
      n.m_angularVelocity += o * c;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
        var h =
          this.m_motorJacobian.Compute(
            t.m_linearVelocity,
            t.m_angularVelocity,
            n.m_linearVelocity,
            n.m_angularVelocity
          ) - this.m_motorSpeed;
        var p = -this.m_motorMass * h;
        var d = this.m_motorImpulse;
        this.m_motorImpulse = b2Math.b2Clamp(
          this.m_motorImpulse + p,
          -e.dt * this.m_maxMotorForce,
          e.dt * this.m_maxMotorForce
        );
        p = this.m_motorImpulse - d;
        t.m_linearVelocity.x += r * p * this.m_motorJacobian.linear1.x;
        t.m_linearVelocity.y += r * p * this.m_motorJacobian.linear1.y;
        t.m_angularVelocity += s * p * this.m_motorJacobian.angular1;
        n.m_linearVelocity.x += i * p * this.m_motorJacobian.linear2.x;
        n.m_linearVelocity.y += i * p * this.m_motorJacobian.linear2.y;
        n.m_angularVelocity += o * p * this.m_motorJacobian.angular2;
      }
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
        var v = this.m_motorJacobian.Compute(
          t.m_linearVelocity,
          t.m_angularVelocity,
          n.m_linearVelocity,
          n.m_angularVelocity
        );
        var m = -this.m_motorMass * v;
        if (this.m_limitState == b2Joint.e_equalLimits) {
          this.m_limitImpulse += m;
        } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
          u = this.m_limitImpulse;
          this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + m, 0);
          m = this.m_limitImpulse - u;
        } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
          u = this.m_limitImpulse;
          this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + m, 0);
          m = this.m_limitImpulse - u;
        }
        t.m_linearVelocity.x += r * m * this.m_motorJacobian.linear1.x;
        t.m_linearVelocity.y += r * m * this.m_motorJacobian.linear1.y;
        t.m_angularVelocity += s * m * this.m_motorJacobian.angular1;
        n.m_linearVelocity.x += i * m * this.m_motorJacobian.linear2.x;
        n.m_linearVelocity.y += i * m * this.m_motorJacobian.linear2.y;
        n.m_angularVelocity += o * m * this.m_motorJacobian.angular2;
      }
    },
    SolvePositionConstraints: function() {
      var e;
      var t;
      var n = this.m_body1;
      var r = this.m_body2;
      var i = n.m_invMass;
      var s = r.m_invMass;
      var o = n.m_invI;
      var u = r.m_invI;
      var a;
      a = n.m_R;
      var f =
        a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y;
      var l =
        a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
      a = r.m_R;
      var c =
        a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
      var h =
        a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
      var p = n.m_position.x + f;
      var d = n.m_position.y + l;
      var v = r.m_position.x + c;
      var m = r.m_position.y + h;
      var g = v - p;
      var y = m - d;
      a = n.m_R;
      var b = a.col1.x * this.m_localYAxis1.x + a.col2.x * this.m_localYAxis1.y;
      var w = a.col1.y * this.m_localYAxis1.x + a.col2.y * this.m_localYAxis1.y;
      var E = b * g + w * y;
      E = b2Math.b2Clamp(
        E,
        -b2Settings.b2_maxLinearCorrection,
        b2Settings.b2_maxLinearCorrection
      );
      var S = -this.m_linearMass * E;
      n.m_position.x += i * S * this.m_linearJacobian.linear1.x;
      n.m_position.y += i * S * this.m_linearJacobian.linear1.y;
      n.m_rotation += o * S * this.m_linearJacobian.angular1;
      r.m_position.x += s * S * this.m_linearJacobian.linear2.x;
      r.m_position.y += s * S * this.m_linearJacobian.linear2.y;
      r.m_rotation += u * S * this.m_linearJacobian.angular2;
      var x = b2Math.b2Abs(E);
      var T = r.m_rotation - n.m_rotation - this.m_initialAngle;
      T = b2Math.b2Clamp(
        T,
        -b2Settings.b2_maxAngularCorrection,
        b2Settings.b2_maxAngularCorrection
      );
      var N = -this.m_angularMass * T;
      n.m_rotation -= n.m_invI * N;
      n.m_R.Set(n.m_rotation);
      r.m_rotation += r.m_invI * N;
      r.m_R.Set(r.m_rotation);
      var C = b2Math.b2Abs(T);
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
        a = n.m_R;
        f = a.col1.x * this.m_localAnchor1.x + a.col2.x * this.m_localAnchor1.y;
        l = a.col1.y * this.m_localAnchor1.x + a.col2.y * this.m_localAnchor1.y;
        a = r.m_R;
        c = a.col1.x * this.m_localAnchor2.x + a.col2.x * this.m_localAnchor2.y;
        h = a.col1.y * this.m_localAnchor2.x + a.col2.y * this.m_localAnchor2.y;
        p = n.m_position.x + f;
        d = n.m_position.y + l;
        v = r.m_position.x + c;
        m = r.m_position.y + h;
        g = v - p;
        y = m - d;
        a = n.m_R;
        var k =
          a.col1.x * this.m_localXAxis1.x + a.col2.x * this.m_localXAxis1.y;
        var L =
          a.col1.y * this.m_localXAxis1.x + a.col2.y * this.m_localXAxis1.y;
        var A = k * g + L * y;
        var O = 0;
        if (this.m_limitState == b2Joint.e_equalLimits) {
          e = b2Math.b2Clamp(
            A,
            -b2Settings.b2_maxLinearCorrection,
            b2Settings.b2_maxLinearCorrection
          );
          O = -this.m_motorMass * e;
          x = b2Math.b2Max(x, b2Math.b2Abs(T));
        } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
          e = A - this.m_lowerTranslation;
          x = b2Math.b2Max(x, -e);
          e = b2Math.b2Clamp(
            e + b2Settings.b2_linearSlop,
            -b2Settings.b2_maxLinearCorrection,
            0
          );
          O = -this.m_motorMass * e;
          t = this.m_limitPositionImpulse;
          this.m_limitPositionImpulse = b2Math.b2Max(
            this.m_limitPositionImpulse + O,
            0
          );
          O = this.m_limitPositionImpulse - t;
        } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
          e = A - this.m_upperTranslation;
          x = b2Math.b2Max(x, e);
          e = b2Math.b2Clamp(
            e - b2Settings.b2_linearSlop,
            0,
            b2Settings.b2_maxLinearCorrection
          );
          O = -this.m_motorMass * e;
          t = this.m_limitPositionImpulse;
          this.m_limitPositionImpulse = b2Math.b2Min(
            this.m_limitPositionImpulse + O,
            0
          );
          O = this.m_limitPositionImpulse - t;
        }
        n.m_position.x += i * O * this.m_motorJacobian.linear1.x;
        n.m_position.y += i * O * this.m_motorJacobian.linear1.y;
        n.m_rotation += o * O * this.m_motorJacobian.angular1;
        n.m_R.Set(n.m_rotation);
        r.m_position.x += s * O * this.m_motorJacobian.linear2.x;
        r.m_position.y += s * O * this.m_motorJacobian.linear2.y;
        r.m_rotation += u * O * this.m_motorJacobian.angular2;
        r.m_R.Set(r.m_rotation);
      }
      return x <= b2Settings.b2_linearSlop && C <= b2Settings.b2_angularSlop;
    },
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_localXAxis1: new b2Vec2(),
    m_localYAxis1: new b2Vec2(),
    m_initialAngle: null,
    m_linearJacobian: new b2Jacobian(),
    m_linearMass: null,
    m_linearImpulse: null,
    m_angularMass: null,
    m_angularImpulse: null,
    m_motorJacobian: new b2Jacobian(),
    m_motorMass: null,
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_lowerTranslation: null,
    m_upperTranslation: null,
    m_maxMotorForce: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
  });
  var b2PrismaticJointDef = Class.create();
  Object.extend(b2PrismaticJointDef.prototype, b2JointDef.prototype);
  Object.extend(b2PrismaticJointDef.prototype, {
    initialize: function() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.type = b2Joint.e_prismaticJoint;
      this.anchorPoint = new b2Vec2(0, 0);
      this.axis = new b2Vec2(0, 0);
      this.lowerTranslation = 0;
      this.upperTranslation = 0;
      this.motorForce = 0;
      this.motorSpeed = 0;
      this.enableLimit = false;
      this.enableMotor = false;
    },
    anchorPoint: null,
    axis: null,
    lowerTranslation: null,
    upperTranslation: null,
    motorForce: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
  });
  var b2PulleyJoint = Class.create();
  Object.extend(b2PulleyJoint.prototype, b2Joint.prototype);
  Object.extend(b2PulleyJoint.prototype, {
    GetAnchor1: function() {
      var e = this.m_body1.m_R;
      return new b2Vec2(
        this.m_body1.m_position.x +
          (e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y),
        this.m_body1.m_position.y +
          (e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y)
      );
    },
    GetAnchor2: function() {
      var e = this.m_body2.m_R;
      return new b2Vec2(
        this.m_body2.m_position.x +
          (e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y),
        this.m_body2.m_position.y +
          (e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y)
      );
    },
    GetGroundPoint1: function() {
      return new b2Vec2(
        this.m_ground.m_position.x + this.m_groundAnchor1.x,
        this.m_ground.m_position.y + this.m_groundAnchor1.y
      );
    },
    GetGroundPoint2: function() {
      return new b2Vec2(
        this.m_ground.m_position.x + this.m_groundAnchor2.x,
        this.m_ground.m_position.y + this.m_groundAnchor2.y
      );
    },
    GetReactionForce: function(e) {
      return new b2Vec2();
    },
    GetReactionTorque: function(e) {
      return 0;
    },
    GetLength1: function() {
      var e;
      e = this.m_body1.m_R;
      var t =
        this.m_body1.m_position.x +
        (e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y);
      var n =
        this.m_body1.m_position.y +
        (e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y);
      var r = t - (this.m_ground.m_position.x + this.m_groundAnchor1.x);
      var i = n - (this.m_ground.m_position.y + this.m_groundAnchor1.y);
      return Math.sqrt(r * r + i * i);
    },
    GetLength2: function() {
      var e;
      e = this.m_body2.m_R;
      var t =
        this.m_body2.m_position.x +
        (e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y);
      var n =
        this.m_body2.m_position.y +
        (e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y);
      var r = t - (this.m_ground.m_position.x + this.m_groundAnchor2.x);
      var i = n - (this.m_ground.m_position.y + this.m_groundAnchor2.y);
      return Math.sqrt(r * r + i * i);
    },
    GetRatio: function() {
      return this.m_ratio;
    },
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u1 = new b2Vec2();
      this.m_u2 = new b2Vec2();
      var t;
      var n;
      var r;
      this.m_ground = this.m_body1.m_world.m_groundBody;
      this.m_groundAnchor1.x = e.groundPoint1.x - this.m_ground.m_position.x;
      this.m_groundAnchor1.y = e.groundPoint1.y - this.m_ground.m_position.y;
      this.m_groundAnchor2.x = e.groundPoint2.x - this.m_ground.m_position.x;
      this.m_groundAnchor2.y = e.groundPoint2.y - this.m_ground.m_position.y;
      t = this.m_body1.m_R;
      n = e.anchorPoint1.x - this.m_body1.m_position.x;
      r = e.anchorPoint1.y - this.m_body1.m_position.y;
      this.m_localAnchor1.x = n * t.col1.x + r * t.col1.y;
      this.m_localAnchor1.y = n * t.col2.x + r * t.col2.y;
      t = this.m_body2.m_R;
      n = e.anchorPoint2.x - this.m_body2.m_position.x;
      r = e.anchorPoint2.y - this.m_body2.m_position.y;
      this.m_localAnchor2.x = n * t.col1.x + r * t.col1.y;
      this.m_localAnchor2.y = n * t.col2.x + r * t.col2.y;
      this.m_ratio = e.ratio;
      n = e.groundPoint1.x - e.anchorPoint1.x;
      r = e.groundPoint1.y - e.anchorPoint1.y;
      var i = Math.sqrt(n * n + r * r);
      n = e.groundPoint2.x - e.anchorPoint2.x;
      r = e.groundPoint2.y - e.anchorPoint2.y;
      var s = Math.sqrt(n * n + r * r);
      var o = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, i);
      var u = b2Math.b2Max(0.5 * b2PulleyJoint.b2_minPulleyLength, s);
      this.m_constant = o + this.m_ratio * u;
      this.m_maxLength1 = b2Math.b2Clamp(
        e.maxLength1,
        o,
        this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength
      );
      this.m_maxLength2 = b2Math.b2Clamp(
        e.maxLength2,
        u,
        (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio
      );
      this.m_pulleyImpulse = 0;
      this.m_limitImpulse1 = 0;
      this.m_limitImpulse2 = 0;
    },
    PrepareVelocitySolver: function() {
      var e = this.m_body1;
      var t = this.m_body2;
      var n;
      n = e.m_R;
      var r =
        n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
      var i =
        n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
      n = t.m_R;
      var s =
        n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
      var o =
        n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
      var u = e.m_position.x + r;
      var a = e.m_position.y + i;
      var f = t.m_position.x + s;
      var l = t.m_position.y + o;
      var c = this.m_ground.m_position.x + this.m_groundAnchor1.x;
      var h = this.m_ground.m_position.y + this.m_groundAnchor1.y;
      var p = this.m_ground.m_position.x + this.m_groundAnchor2.x;
      var d = this.m_ground.m_position.y + this.m_groundAnchor2.y;
      this.m_u1.Set(u - c, a - h);
      this.m_u2.Set(f - p, l - d);
      var v = this.m_u1.Length();
      var m = this.m_u2.Length();
      if (v > b2Settings.b2_linearSlop) {
        this.m_u1.Multiply(1 / v);
      } else {
        this.m_u1.SetZero();
      }
      if (m > b2Settings.b2_linearSlop) {
        this.m_u2.Multiply(1 / m);
      } else {
        this.m_u2.SetZero();
      }
      if (v < this.m_maxLength1) {
        this.m_limitState1 = b2Joint.e_inactiveLimit;
        this.m_limitImpulse1 = 0;
      } else {
        this.m_limitState1 = b2Joint.e_atUpperLimit;
        this.m_limitPositionImpulse1 = 0;
      }
      if (m < this.m_maxLength2) {
        this.m_limitState2 = b2Joint.e_inactiveLimit;
        this.m_limitImpulse2 = 0;
      } else {
        this.m_limitState2 = b2Joint.e_atUpperLimit;
        this.m_limitPositionImpulse2 = 0;
      }
      var g = r * this.m_u1.y - i * this.m_u1.x;
      var y = s * this.m_u2.y - o * this.m_u2.x;
      this.m_limitMass1 = e.m_invMass + e.m_invI * g * g;
      this.m_limitMass2 = t.m_invMass + t.m_invI * y * y;
      this.m_pulleyMass =
        this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
      this.m_limitMass1 = 1 / this.m_limitMass1;
      this.m_limitMass2 = 1 / this.m_limitMass2;
      this.m_pulleyMass = 1 / this.m_pulleyMass;
      var b = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.x;
      var w = (-this.m_pulleyImpulse - this.m_limitImpulse1) * this.m_u1.y;
      var E =
        (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) *
        this.m_u2.x;
      var S =
        (-this.m_ratio * this.m_pulleyImpulse - this.m_limitImpulse2) *
        this.m_u2.y;
      e.m_linearVelocity.x += e.m_invMass * b;
      e.m_linearVelocity.y += e.m_invMass * w;
      e.m_angularVelocity += e.m_invI * (r * w - i * b);
      t.m_linearVelocity.x += t.m_invMass * E;
      t.m_linearVelocity.y += t.m_invMass * S;
      t.m_angularVelocity += t.m_invI * (s * S - o * E);
    },
    SolveVelocityConstraints: function(e) {
      var t = this.m_body1;
      var n = this.m_body2;
      var r;
      r = t.m_R;
      var i =
        r.col1.x * this.m_localAnchor1.x + r.col2.x * this.m_localAnchor1.y;
      var s =
        r.col1.y * this.m_localAnchor1.x + r.col2.y * this.m_localAnchor1.y;
      r = n.m_R;
      var o =
        r.col1.x * this.m_localAnchor2.x + r.col2.x * this.m_localAnchor2.y;
      var u =
        r.col1.y * this.m_localAnchor2.x + r.col2.y * this.m_localAnchor2.y;
      var a;
      var f;
      var l;
      var c;
      var h;
      var p;
      var d;
      var v;
      var m;
      var g;
      var y;
      a = t.m_linearVelocity.x + -t.m_angularVelocity * s;
      f = t.m_linearVelocity.y + t.m_angularVelocity * i;
      l = n.m_linearVelocity.x + -n.m_angularVelocity * u;
      c = n.m_linearVelocity.y + n.m_angularVelocity * o;
      m =
        -(this.m_u1.x * a + this.m_u1.y * f) -
        this.m_ratio * (this.m_u2.x * l + this.m_u2.y * c);
      g = -this.m_pulleyMass * m;
      this.m_pulleyImpulse += g;
      h = -g * this.m_u1.x;
      p = -g * this.m_u1.y;
      d = -this.m_ratio * g * this.m_u2.x;
      v = -this.m_ratio * g * this.m_u2.y;
      t.m_linearVelocity.x += t.m_invMass * h;
      t.m_linearVelocity.y += t.m_invMass * p;
      t.m_angularVelocity += t.m_invI * (i * p - s * h);
      n.m_linearVelocity.x += n.m_invMass * d;
      n.m_linearVelocity.y += n.m_invMass * v;
      n.m_angularVelocity += n.m_invI * (o * v - u * d);
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
        a = t.m_linearVelocity.x + -t.m_angularVelocity * s;
        f = t.m_linearVelocity.y + t.m_angularVelocity * i;
        m = -(this.m_u1.x * a + this.m_u1.y * f);
        g = -this.m_limitMass1 * m;
        y = this.m_limitImpulse1;
        this.m_limitImpulse1 = b2Math.b2Max(0, this.m_limitImpulse1 + g);
        g = this.m_limitImpulse1 - y;
        h = -g * this.m_u1.x;
        p = -g * this.m_u1.y;
        t.m_linearVelocity.x += t.m_invMass * h;
        t.m_linearVelocity.y += t.m_invMass * p;
        t.m_angularVelocity += t.m_invI * (i * p - s * h);
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
        l = n.m_linearVelocity.x + -n.m_angularVelocity * u;
        c = n.m_linearVelocity.y + n.m_angularVelocity * o;
        m = -(this.m_u2.x * l + this.m_u2.y * c);
        g = -this.m_limitMass2 * m;
        y = this.m_limitImpulse2;
        this.m_limitImpulse2 = b2Math.b2Max(0, this.m_limitImpulse2 + g);
        g = this.m_limitImpulse2 - y;
        d = -g * this.m_u2.x;
        v = -g * this.m_u2.y;
        n.m_linearVelocity.x += n.m_invMass * d;
        n.m_linearVelocity.y += n.m_invMass * v;
        n.m_angularVelocity += n.m_invI * (o * v - u * d);
      }
    },
    SolvePositionConstraints: function() {
      var e = this.m_body1;
      var t = this.m_body2;
      var n;
      var r = this.m_ground.m_position.x + this.m_groundAnchor1.x;
      var i = this.m_ground.m_position.y + this.m_groundAnchor1.y;
      var s = this.m_ground.m_position.x + this.m_groundAnchor2.x;
      var o = this.m_ground.m_position.y + this.m_groundAnchor2.y;
      var u;
      var a;
      var f;
      var l;
      var c;
      var h;
      var p;
      var d;
      var v;
      var m;
      var g;
      var y;
      var b;
      var w = 0;
      {
        n = e.m_R;
        u = n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
        a = n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
        n = t.m_R;
        f = n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
        l = n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
        c = e.m_position.x + u;
        h = e.m_position.y + a;
        p = t.m_position.x + f;
        d = t.m_position.y + l;
        this.m_u1.Set(c - r, h - i);
        this.m_u2.Set(p - s, d - o);
        v = this.m_u1.Length();
        m = this.m_u2.Length();
        if (v > b2Settings.b2_linearSlop) {
          this.m_u1.Multiply(1 / v);
        } else {
          this.m_u1.SetZero();
        }
        if (m > b2Settings.b2_linearSlop) {
          this.m_u2.Multiply(1 / m);
        } else {
          this.m_u2.SetZero();
        }
        g = this.m_constant - v - this.m_ratio * m;
        w = b2Math.b2Max(w, Math.abs(g));
        g = b2Math.b2Clamp(
          g,
          -b2Settings.b2_maxLinearCorrection,
          b2Settings.b2_maxLinearCorrection
        );
        y = -this.m_pulleyMass * g;
        c = -y * this.m_u1.x;
        h = -y * this.m_u1.y;
        p = -this.m_ratio * y * this.m_u2.x;
        d = -this.m_ratio * y * this.m_u2.y;
        e.m_position.x += e.m_invMass * c;
        e.m_position.y += e.m_invMass * h;
        e.m_rotation += e.m_invI * (u * h - a * c);
        t.m_position.x += t.m_invMass * p;
        t.m_position.y += t.m_invMass * d;
        t.m_rotation += t.m_invI * (f * d - l * p);
        e.m_R.Set(e.m_rotation);
        t.m_R.Set(t.m_rotation);
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
        n = e.m_R;
        u = n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
        a = n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
        c = e.m_position.x + u;
        h = e.m_position.y + a;
        this.m_u1.Set(c - r, h - i);
        v = this.m_u1.Length();
        if (v > b2Settings.b2_linearSlop) {
          this.m_u1.x *= 1 / v;
          this.m_u1.y *= 1 / v;
        } else {
          this.m_u1.SetZero();
        }
        g = this.m_maxLength1 - v;
        w = b2Math.b2Max(w, -g);
        g = b2Math.b2Clamp(
          g + b2Settings.b2_linearSlop,
          -b2Settings.b2_maxLinearCorrection,
          0
        );
        y = -this.m_limitMass1 * g;
        b = this.m_limitPositionImpulse1;
        this.m_limitPositionImpulse1 = b2Math.b2Max(
          0,
          this.m_limitPositionImpulse1 + y
        );
        y = this.m_limitPositionImpulse1 - b;
        c = -y * this.m_u1.x;
        h = -y * this.m_u1.y;
        e.m_position.x += e.m_invMass * c;
        e.m_position.y += e.m_invMass * h;
        e.m_rotation += e.m_invI * (u * h - a * c);
        e.m_R.Set(e.m_rotation);
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
        n = t.m_R;
        f = n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
        l = n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
        p = t.m_position.x + f;
        d = t.m_position.y + l;
        this.m_u2.Set(p - s, d - o);
        m = this.m_u2.Length();
        if (m > b2Settings.b2_linearSlop) {
          this.m_u2.x *= 1 / m;
          this.m_u2.y *= 1 / m;
        } else {
          this.m_u2.SetZero();
        }
        g = this.m_maxLength2 - m;
        w = b2Math.b2Max(w, -g);
        g = b2Math.b2Clamp(
          g + b2Settings.b2_linearSlop,
          -b2Settings.b2_maxLinearCorrection,
          0
        );
        y = -this.m_limitMass2 * g;
        b = this.m_limitPositionImpulse2;
        this.m_limitPositionImpulse2 = b2Math.b2Max(
          0,
          this.m_limitPositionImpulse2 + y
        );
        y = this.m_limitPositionImpulse2 - b;
        p = -y * this.m_u2.x;
        d = -y * this.m_u2.y;
        t.m_position.x += t.m_invMass * p;
        t.m_position.y += t.m_invMass * d;
        t.m_rotation += t.m_invI * (f * d - l * p);
        t.m_R.Set(t.m_rotation);
      }
      return w < b2Settings.b2_linearSlop;
    },
    m_ground: null,
    m_groundAnchor1: new b2Vec2(),
    m_groundAnchor2: new b2Vec2(),
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_u1: new b2Vec2(),
    m_u2: new b2Vec2(),
    m_constant: null,
    m_ratio: null,
    m_maxLength1: null,
    m_maxLength2: null,
    m_pulleyMass: null,
    m_limitMass1: null,
    m_limitMass2: null,
    m_pulleyImpulse: null,
    m_limitImpulse1: null,
    m_limitImpulse2: null,
    m_limitPositionImpulse1: null,
    m_limitPositionImpulse2: null,
    m_limitState1: 0,
    m_limitState2: 0
  });
  b2PulleyJoint.b2_minPulleyLength = b2Settings.b2_lengthUnitsPerMeter;
  var b2PulleyJointDef = Class.create();
  Object.extend(b2PulleyJointDef.prototype, b2JointDef.prototype);
  Object.extend(b2PulleyJointDef.prototype, {
    initialize: function() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.groundPoint1 = new b2Vec2();
      this.groundPoint2 = new b2Vec2();
      this.anchorPoint1 = new b2Vec2();
      this.anchorPoint2 = new b2Vec2();
      this.type = b2Joint.e_pulleyJoint;
      this.groundPoint1.Set(-1, 1);
      this.groundPoint2.Set(1, 1);
      this.anchorPoint1.Set(-1, 0);
      this.anchorPoint2.Set(1, 0);
      this.maxLength1 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
      this.maxLength2 = 0.5 * b2PulleyJoint.b2_minPulleyLength;
      this.ratio = 1;
      this.collideConnected = true;
    },
    groundPoint1: new b2Vec2(),
    groundPoint2: new b2Vec2(),
    anchorPoint1: new b2Vec2(),
    anchorPoint2: new b2Vec2(),
    maxLength1: null,
    maxLength2: null,
    ratio: null
  });
  var b2RevoluteJoint = Class.create();
  Object.extend(b2RevoluteJoint.prototype, b2Joint.prototype);
  Object.extend(b2RevoluteJoint.prototype, {
    GetAnchor1: function() {
      var e = this.m_body1.m_R;
      return new b2Vec2(
        this.m_body1.m_position.x +
          (e.col1.x * this.m_localAnchor1.x + e.col2.x * this.m_localAnchor1.y),
        this.m_body1.m_position.y +
          (e.col1.y * this.m_localAnchor1.x + e.col2.y * this.m_localAnchor1.y)
      );
    },
    GetAnchor2: function() {
      var e = this.m_body2.m_R;
      return new b2Vec2(
        this.m_body2.m_position.x +
          (e.col1.x * this.m_localAnchor2.x + e.col2.x * this.m_localAnchor2.y),
        this.m_body2.m_position.y +
          (e.col1.y * this.m_localAnchor2.x + e.col2.y * this.m_localAnchor2.y)
      );
    },
    GetJointAngle: function() {
      return this.m_body2.m_rotation - this.m_body1.m_rotation;
    },
    GetJointSpeed: function() {
      return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity;
    },
    GetMotorTorque: function(e) {
      return e * this.m_motorImpulse;
    },
    SetMotorSpeed: function(e) {
      this.m_motorSpeed = e;
    },
    SetMotorTorque: function(e) {
      this.m_maxMotorTorque = e;
    },
    GetReactionForce: function(e) {
      var t = this.m_ptpImpulse.Copy();
      t.Multiply(e);
      return t;
    },
    GetReactionTorque: function(e) {
      return e * this.m_limitImpulse;
    },
    initialize: function(e) {
      this.m_node1 = new b2JointNode();
      this.m_node2 = new b2JointNode();
      this.m_type = e.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_body1 = e.body1;
      this.m_body2 = e.body2;
      this.m_collideConnected = e.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = e.userData;
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.K3 = new b2Mat22();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_ptpImpulse = new b2Vec2();
      this.m_ptpMass = new b2Mat22();
      var t;
      var n;
      var r;
      t = this.m_body1.m_R;
      n = e.anchorPoint.x - this.m_body1.m_position.x;
      r = e.anchorPoint.y - this.m_body1.m_position.y;
      this.m_localAnchor1.x = n * t.col1.x + r * t.col1.y;
      this.m_localAnchor1.y = n * t.col2.x + r * t.col2.y;
      t = this.m_body2.m_R;
      n = e.anchorPoint.x - this.m_body2.m_position.x;
      r = e.anchorPoint.y - this.m_body2.m_position.y;
      this.m_localAnchor2.x = n * t.col1.x + r * t.col1.y;
      this.m_localAnchor2.y = n * t.col2.x + r * t.col2.y;
      this.m_intialAngle = this.m_body2.m_rotation - this.m_body1.m_rotation;
      this.m_ptpImpulse.Set(0, 0);
      this.m_motorImpulse = 0;
      this.m_limitImpulse = 0;
      this.m_limitPositionImpulse = 0;
      this.m_lowerAngle = e.lowerAngle;
      this.m_upperAngle = e.upperAngle;
      this.m_maxMotorTorque = e.motorTorque;
      this.m_motorSpeed = e.motorSpeed;
      this.m_enableLimit = e.enableLimit;
      this.m_enableMotor = e.enableMotor;
    },
    K: new b2Mat22(),
    K1: new b2Mat22(),
    K2: new b2Mat22(),
    K3: new b2Mat22(),
    PrepareVelocitySolver: function() {
      var e = this.m_body1;
      var t = this.m_body2;
      var n;
      n = e.m_R;
      var r =
        n.col1.x * this.m_localAnchor1.x + n.col2.x * this.m_localAnchor1.y;
      var i =
        n.col1.y * this.m_localAnchor1.x + n.col2.y * this.m_localAnchor1.y;
      n = t.m_R;
      var s =
        n.col1.x * this.m_localAnchor2.x + n.col2.x * this.m_localAnchor2.y;
      var o =
        n.col1.y * this.m_localAnchor2.x + n.col2.y * this.m_localAnchor2.y;
      var u = e.m_invMass;
      var a = t.m_invMass;
      var f = e.m_invI;
      var l = t.m_invI;
      this.K1.col1.x = u + a;
      this.K1.col2.x = 0;
      this.K1.col1.y = 0;
      this.K1.col2.y = u + a;
      this.K2.col1.x = f * i * i;
      this.K2.col2.x = -f * r * i;
      this.K2.col1.y = -f * r * i;
      this.K2.col2.y = f * r * r;
      this.K3.col1.x = l * o * o;
      this.K3.col2.x = -l * s * o;
      this.K3.col1.y = -l * s * o;
      this.K3.col2.y = l * s * s;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.AddM(this.K3);
      this.K.Invert(this.m_ptpMass);
      this.m_motorMass = 1 / (f + l);
      if (this.m_enableMotor == false) {
        this.m_motorImpulse = 0;
      }
      if (this.m_enableLimit) {
        var c = t.m_rotation - e.m_rotation - this.m_intialAngle;
        if (
          b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) <
          2 * b2Settings.b2_angularSlop
        ) {
          this.m_limitState = b2Joint.e_equalLimits;
        } else if (c <= this.m_lowerAngle) {
          if (this.m_limitState != b2Joint.e_atLowerLimit) {
            this.m_limitImpulse = 0;
          }
          this.m_limitState = b2Joint.e_atLowerLimit;
        } else if (c >= this.m_upperAngle) {
          if (this.m_limitState != b2Joint.e_atUpperLimit) {
            this.m_limitImpulse = 0;
          }
          this.m_limitState = b2Joint.e_atUpperLimit;
        } else {
          this.m_limitState = b2Joint.e_inactiveLimit;
          this.m_limitImpulse = 0;
        }
      } else {
        this.m_limitImpulse = 0;
      }
      if (b2World.s_enableWarmStarting) {
        e.m_linearVelocity.x -= u * this.m_ptpImpulse.x;
        e.m_linearVelocity.y -= u * this.m_ptpImpulse.y;
        e.m_angularVelocity -=
          f *
          (r * this.m_ptpImpulse.y -
            i * this.m_ptpImpulse.x +
            this.m_motorImpulse +
            this.m_limitImpulse);
        t.m_linearVelocity.x += a * this.m_ptpImpulse.x;
        t.m_linearVelocity.y += a * this.m_ptpImpulse.y;
        t.m_angularVelocity +=
          l *
          (s * this.m_ptpImpulse.y -
            o * this.m_ptpImpulse.x +
            this.m_motorImpulse +
            this.m_limitImpulse);
      } else {
        this.m_ptpImpulse.SetZero();
        this.m_motorImpulse = 0;
        this.m_limitImpulse = 0;
      }
      this.m_limitPositionImpulse = 0;
    },
    SolveVelocityConstraints: function(e) {
      var t = this.m_body1;
      var n = this.m_body2;
      var r;
      r = t.m_R;
      var i =
        r.col1.x * this.m_localAnchor1.x + r.col2.x * this.m_localAnchor1.y;
      var s =
        r.col1.y * this.m_localAnchor1.x + r.col2.y * this.m_localAnchor1.y;
      r = n.m_R;
      var o =
        r.col1.x * this.m_localAnchor2.x + r.col2.x * this.m_localAnchor2.y;
      var u =
        r.col1.y * this.m_localAnchor2.x + r.col2.y * this.m_localAnchor2.y;
      var a;
      var f =
        n.m_linearVelocity.x +
        -n.m_angularVelocity * u -
        t.m_linearVelocity.x -
        -t.m_angularVelocity * s;
      var l =
        n.m_linearVelocity.y +
        n.m_angularVelocity * o -
        t.m_linearVelocity.y -
        t.m_angularVelocity * i;
      var c = -(this.m_ptpMass.col1.x * f + this.m_ptpMass.col2.x * l);
      var h = -(this.m_ptpMass.col1.y * f + this.m_ptpMass.col2.y * l);
      this.m_ptpImpulse.x += c;
      this.m_ptpImpulse.y += h;
      t.m_linearVelocity.x -= t.m_invMass * c;
      t.m_linearVelocity.y -= t.m_invMass * h;
      t.m_angularVelocity -= t.m_invI * (i * h - s * c);
      n.m_linearVelocity.x += n.m_invMass * c;
      n.m_linearVelocity.y += n.m_invMass * h;
      n.m_angularVelocity += n.m_invI * (o * h - u * c);
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
        var p = n.m_angularVelocity - t.m_angularVelocity - this.m_motorSpeed;
        var d = -this.m_motorMass * p;
        var v = this.m_motorImpulse;
        this.m_motorImpulse = b2Math.b2Clamp(
          this.m_motorImpulse + d,
          -e.dt * this.m_maxMotorTorque,
          e.dt * this.m_maxMotorTorque
        );
        d = this.m_motorImpulse - v;
        t.m_angularVelocity -= t.m_invI * d;
        n.m_angularVelocity += n.m_invI * d;
      }
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
        var m = n.m_angularVelocity - t.m_angularVelocity;
        var g = -this.m_motorMass * m;
        if (this.m_limitState == b2Joint.e_equalLimits) {
          this.m_limitImpulse += g;
        } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
          a = this.m_limitImpulse;
          this.m_limitImpulse = b2Math.b2Max(this.m_limitImpulse + g, 0);
          g = this.m_limitImpulse - a;
        } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
          a = this.m_limitImpulse;
          this.m_limitImpulse = b2Math.b2Min(this.m_limitImpulse + g, 0);
          g = this.m_limitImpulse - a;
        }
        t.m_angularVelocity -= t.m_invI * g;
        n.m_angularVelocity += n.m_invI * g;
      }
    },
    SolvePositionConstraints: function() {
      var e;
      var t;
      var n = this.m_body1;
      var r = this.m_body2;
      var i = 0;
      var s;
      s = n.m_R;
      var o =
        s.col1.x * this.m_localAnchor1.x + s.col2.x * this.m_localAnchor1.y;
      var u =
        s.col1.y * this.m_localAnchor1.x + s.col2.y * this.m_localAnchor1.y;
      s = r.m_R;
      var a =
        s.col1.x * this.m_localAnchor2.x + s.col2.x * this.m_localAnchor2.y;
      var f =
        s.col1.y * this.m_localAnchor2.x + s.col2.y * this.m_localAnchor2.y;
      var l = n.m_position.x + o;
      var c = n.m_position.y + u;
      var h = r.m_position.x + a;
      var p = r.m_position.y + f;
      var d = h - l;
      var v = p - c;
      i = Math.sqrt(d * d + v * v);
      var m = n.m_invMass;
      var g = r.m_invMass;
      var y = n.m_invI;
      var b = r.m_invI;
      this.K1.col1.x = m + g;
      this.K1.col2.x = 0;
      this.K1.col1.y = 0;
      this.K1.col2.y = m + g;
      this.K2.col1.x = y * u * u;
      this.K2.col2.x = -y * o * u;
      this.K2.col1.y = -y * o * u;
      this.K2.col2.y = y * o * o;
      this.K3.col1.x = b * f * f;
      this.K3.col2.x = -b * a * f;
      this.K3.col1.y = -b * a * f;
      this.K3.col2.y = b * a * a;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.AddM(this.K3);
      this.K.Solve(b2RevoluteJoint.tImpulse, -d, -v);
      var w = b2RevoluteJoint.tImpulse.x;
      var E = b2RevoluteJoint.tImpulse.y;
      n.m_position.x -= n.m_invMass * w;
      n.m_position.y -= n.m_invMass * E;
      n.m_rotation -= n.m_invI * (o * E - u * w);
      n.m_R.Set(n.m_rotation);
      r.m_position.x += r.m_invMass * w;
      r.m_position.y += r.m_invMass * E;
      r.m_rotation += r.m_invI * (a * E - f * w);
      r.m_R.Set(r.m_rotation);
      var S = 0;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
        var x = r.m_rotation - n.m_rotation - this.m_intialAngle;
        var T = 0;
        if (this.m_limitState == b2Joint.e_equalLimits) {
          t = b2Math.b2Clamp(
            x,
            -b2Settings.b2_maxAngularCorrection,
            b2Settings.b2_maxAngularCorrection
          );
          T = -this.m_motorMass * t;
          S = b2Math.b2Abs(t);
        } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
          t = x - this.m_lowerAngle;
          S = b2Math.b2Max(0, -t);
          t = b2Math.b2Clamp(
            t + b2Settings.b2_angularSlop,
            -b2Settings.b2_maxAngularCorrection,
            0
          );
          T = -this.m_motorMass * t;
          e = this.m_limitPositionImpulse;
          this.m_limitPositionImpulse = b2Math.b2Max(
            this.m_limitPositionImpulse + T,
            0
          );
          T = this.m_limitPositionImpulse - e;
        } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
          t = x - this.m_upperAngle;
          S = b2Math.b2Max(0, t);
          t = b2Math.b2Clamp(
            t - b2Settings.b2_angularSlop,
            0,
            b2Settings.b2_maxAngularCorrection
          );
          T = -this.m_motorMass * t;
          e = this.m_limitPositionImpulse;
          this.m_limitPositionImpulse = b2Math.b2Min(
            this.m_limitPositionImpulse + T,
            0
          );
          T = this.m_limitPositionImpulse - e;
        }
        n.m_rotation -= n.m_invI * T;
        n.m_R.Set(n.m_rotation);
        r.m_rotation += r.m_invI * T;
        r.m_R.Set(r.m_rotation);
      }
      return i <= b2Settings.b2_linearSlop && S <= b2Settings.b2_angularSlop;
    },
    m_localAnchor1: new b2Vec2(),
    m_localAnchor2: new b2Vec2(),
    m_ptpImpulse: new b2Vec2(),
    m_motorImpulse: null,
    m_limitImpulse: null,
    m_limitPositionImpulse: null,
    m_ptpMass: new b2Mat22(),
    m_motorMass: null,
    m_intialAngle: null,
    m_lowerAngle: null,
    m_upperAngle: null,
    m_maxMotorTorque: null,
    m_motorSpeed: null,
    m_enableLimit: null,
    m_enableMotor: null,
    m_limitState: 0
  });
  b2RevoluteJoint.tImpulse = new b2Vec2();
  var b2RevoluteJointDef = Class.create();
  Object.extend(b2RevoluteJointDef.prototype, b2JointDef.prototype);
  Object.extend(b2RevoluteJointDef.prototype, {
    initialize: function() {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.body1 = null;
      this.body2 = null;
      this.collideConnected = false;
      this.type = b2Joint.e_revoluteJoint;
      this.anchorPoint = new b2Vec2(0, 0);
      this.lowerAngle = 0;
      this.upperAngle = 0;
      this.motorTorque = 0;
      this.motorSpeed = 0;
      this.enableLimit = false;
      this.enableMotor = false;
    },
    anchorPoint: null,
    lowerAngle: null,
    upperAngle: null,
    motorTorque: null,
    motorSpeed: null,
    enableLimit: null,
    enableMotor: null
  });
  ///==============================================================================================

  var worldAABB;
  var world;

  function init() {
    // init box2d
    worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-5000, -5000);
    worldAABB.maxVertex.Set(
      window.innerWidth + 5000,
      window.innerHeight + 5000
    );

    world = new b2World(worldAABB, new b2Vec2(0, 0), true);
  }

  function inArrays(elem, array) {
    var rt = -1;
    for (var i = 0; i < array.length; i++) {
      rt = $.inArray(elem, array[i].elements);
      if (rt !== -1) return { index: i, value: rt };
    }
    return rt;
  }

  function arrayIntersect(a, b) {
    var rt = a,
      i = 0;
    while (i < rt.length) {
      if ($.inArray(rt[i], b) === -1) rt.splice(i, 1);
      else i++;
    }
    return rt;
  }

  var bool = false;
  var wall_thickness = 100;
  var numInstance = 1;
  function throwable() {
    this.numInstance;
    this.delta = { X: 0, Y: 0 };
    this.stage = {
      X: window.screenX,
      Y: window.screenY,
      Width: window.innerWidth,
      Height: window.innerHeight
    };
    this.walls = { left: null, right: null, top: null, bottom: null };
    this.isRunning = false;
    this.isMouseDown = false;
    this.mouse = { x: 0, y: 0 };

    this.iterations = 1;

    this.wallsSetted = false;

    this.mouseJoint;

    this.elementsInArea = [];
    this.elements = [];
    this.bodies = [];
    this.properties = [];

    if (!bool) {
      $.extend(throwable.prototype, {
        defaults: {
          infinitX: false,
          gravity: { x: 0, y: 0 },
          timeStep: 1 / 40,
          bounce: 0, // value between 0 and 1
          containment: "window",
          shape: "box",
          impulse: null,
          fixed: false,
          drag: true,
          damping: 0,
          collisionDetection: false,
          areaDetection: []
        },
        /**
         * initElem initialize element
         */
        initElem: function(elem) {
          // Get box2d elements
          var property = this.getElementProperties(elem);
          this.properties.push(property);

          var element = elem;
          var $elem = $(element);
          $elem.css({
            position: "absolute",
            left: property.X + "px",
            top: property.Y + "px",
            width: property.Width + "px"
          });
          $(element).on("mousedown", function(event) {
            event.preventDefault();
          });
          $(element).on("mouseup", function(event) {
            event.preventDefault();
          });

          var body;
          if (this.defaults.shape === "box")
            body = this.createBox(
              world,
              $elem.position().left + ($elem.width() >> 1),
              $elem.position().top + ($elem.height() >> 1),
              $elem.width() / 2,
              $elem.height() / 2,
              false,
              numInstance,
              Math.pow(2, 50) - 1
            );
          else
            body = this.createCircle(
              world,
              $elem.position().left + ($elem.width() >> 1),
              $elem.position().top + ($elem.height() >> 1),
              Math.max($elem.width() / 2, $elem.height() / 2),
              false,
              numInstance,
              Math.pow(2, 50) - 1
            );

          if (this.defaults.impulse) {
            this.applyImpulse(body);
          }

          // Apply damping
          if (this.defaults.damping > 0) {
            body.m_linearDamping = 1000 / (1000 + this.defaults.damping);
            body.m_angularDamping = 1000 / (1000 + this.defaults.damping);
          }
          body.m_userData = elem;
          this.bodies.push(body);

          // Clean position dependencies
          $("body").append($elem);
          $("body").css({
            position: "static",
            margin: 0
          });
        },
        applyOptions: function(o, i) {
          this.defaults = $.extend({}, this.defaults, o);
          var body = this.bodies[i];
          if (this.defaults.impulse) {
            body.WakeUp();
            var f = this.defaults.impulse.f,
              p = this.defaults.impulse.p;
            var ant_gravity = new b2Vec2(
              f * p.x * body.GetMass(),
              f * p.y * body.GetMass()
            );
            body.ApplyImpulse(ant_gravity, body.GetCenterPosition());
          }
        },
        setEnv: function(elements, o) {
          var _this = this;
          numInstance *= 2;
          this.numInstance = numInstance;
          this.getBrowserDimensions();
          this.defaults = $.extend({}, this.defaults, o);
          if (this.defaults.containment !== "window") {
            var c = this.defaults.containment;
            if (c !== "parent")
              this.stage = { X: c[0], Y: c[1], Width: c[2], Height: c[3] };
            else {
              var p = $(elements).parent();
              if (!p.is("body")) {
                this.stage = {
                  X: p.offset().left,
                  Y: p.offset().top,
                  Width: p.offset().left + p.width(),
                  Height: p.offset().top + p.height()
                };
                this.defaults.containment = [
                  p.offset().left,
                  p.offset().top,
                  p.offset().left + p.width(),
                  p.offset().top + p.height()
                ];
              }
            }
          } else {
            $(window).scroll(function() {
              _this.handleScrollOrResize();
            });
            $(window).resize(function() {
              _this.handleScrollOrResize();
            });
          }

          this.elements = elements;

          this.addEventRemoveElement();
          // setwalls
          this.setWalls(numInstance);

          $(document).on("mousedown", function(event) {
            _this.isMouseDown = true;
          });
          $(document).on("mouseup", function(event) {
            _this.isMouseDown = false;
          });
          $(document).on("mousemove", function(event) {
            if (!_this.isRunning) _this.run();

            _this.mouse.x = event.clientX;
            _this.mouse.y = event.clientY;
          });

          $(document).on("touchstart", function(event) {
            if (event.touches.length == 1) {
              if (!_this.isRunning) {
                _this.run();
              }
              _this.mouse.x = event.touches[0].pageX;
              _this.mouse.y = event.touches[0].pageY;
              _this.isMouseDown = true;
            }
          });
          $(document).on("touchmove", function(event) {
            if (event.touches.length == 1) {
              event.preventDefault();
              _this.mouse.x = event.touches[0].pageX;
              _this.mouse.y = event.touches[0].pageY;
            }
          });
          $(document).on("touchend", function(event) {
            if (event.touches.length == 0) {
              _this.isMouseDown = false;
            }
          });

          $(window).on("deviceorientation", function(event) {
            if (event.beta) {
              this.defaults.gravity.x = Math.sin((event.gamma * Math.PI) / 180);
              this.defaults.gravity.y = Math.sin(
                Math.PI / 4 + (event.beta * Math.PI) / 180
              );
            }
          });
        },
        // init function
        loop: function() {
          this.applyGravity();

          this.delta.X += (0 - this.delta.X) * 0.5;
          this.delta.Y += (0 - this.delta.Y) * 0.5;

          if (this.defaults.drag) this.mouseDrag();
          world.Step(this.defaults.timeStep, this.iterations);

          for (var i = 0; i < this.elements.length; i++) {
            var body = this.bodies[i];
            var element = this.elements[i];
            var property = this.properties[i];
            if (!body || !element || !property) break;

            if (this.defaults.collisionDetection) this.collisionDetection();
            if (this.defaults.areaDetection.length > 0) this.areaDetection();

            element.style.left =
              body.m_position0.x - (property.Width >> 1) + "px";
            element.style.top =
              body.m_position0.y - (property.Height >> 1) + "px";
            if (i === 1) {
              //console.log($(element).position().left -(stage.Width - properties[i].Width ))
              //console.log(this.getProjectedHeight($(element)));
            }
            //if($(element).position().left $(document).width()) alert("out left");
            var style = "rotate(" + body.m_rotation0 * 57.2957795 + "deg)";

            element.style.transform = style;
            element.style.WebkitTransform = style + " translateZ(0)"; // Force HW Acceleration
            element.style.MozTransform = style;
            element.style.OTransform = style;
            element.style.msTransform = style;
          }
        },
        removeElement: function(index) {
          this.elements.splice(index, 1);
          this.bodies.splice(index, 1);
          this.properties.splice(index, 1);
        },
        addEventRemoveElement: function() {
          var event = new $.Event("removeElement");
          var initialremove = $.fn.remove;
          $.fn.remove = function() {
            var rt = initialremove.apply(this, arguments);
            $(document).trigger(event);
            return rt;
          };
          var _this = this;
          $(document).bind("removeElement", function() {
            _this.sync();
          });
        },
        sync: function() {
          this.elements = arrayIntersect(
            $(this.elements.selector),
            this.elements
          );
          var _this = this;
          var i = 0;
          this.bodies = $.grep(this.bodies, function(el) {
            if (el.m_userData === _this.elements[i]) {
              i++;
              return true;
            } else {
              _this.properties.splice(i, 1);
              el.Freeze();
              return false;
            }
          });
        },
        areaDetection: function() {
          var _this = this;
          var detectArea = function(i, c, elementsInArea) {
            var aabb = new b2AABB();
            aabb.minVertex.Set(c[0], c[1]);
            aabb.maxVertex.Set(c[2], c[3]);

            // Query the world for overlapping shapes.
            var k_maxCount = 100;
            var shapes = [];
            var count = world.Query(aabb, shapes, k_maxCount);
            var elements = [];
            for (var j = 0; j < shapes.length; j++) {
              var elem = shapes[j].m_body.m_userData;
              if (
                !$.isPlainObject(elem) &&
                $.inArray(elem, _this.elements) !== -1
              ) {
                elements.push(elem);
              }
            }

            var inArea = $(elements).not(_this.elementsInArea[i]);
            if (inArea.length !== 0) {
              $(document).trigger("inarea", [inArea]);
            } else {
              var outArea = $(_this.elementsInArea[i]).not(elements);
              if (outArea.length !== 0) {
                $(document).trigger("outarea", [outArea]);
              }
            }
            _this.elementsInArea[i] = elements;
          };

          var areas = this.defaults.areaDetection;
          for (var i = 0; i < areas.length; i++) {
            detectArea(i, areas[i], this.elementsInArea[i]);
          }
        },
        collisionDetection: function() {
          var _this = this;
          var contactList = world.m_contactList;
          var noCollision = true;

          var collision = function(shape1, shape2) {
            var e1 = shape1.m_body.m_userData,
              e2 = shape2.m_body.m_userData;
            if (!$.isPlainObject(e1) && !$.isPlainObject(e2)) {
              $(document).trigger("collision", [e1, e2]);
              noCollision = false;
            }
          };
          var limit = 0;
          // loop through all collisions
          while (contactList && limit < 100) {
            var shape1 = contactList.m_shape1,
              shape2 = contactList.m_shape2;

            collision(shape1, shape2);
            contactList = contactList.m_next;
            limit++;
          }

          if (noCollision) $(document).trigger("nocollision");
        },
        applyGravity: function() {
          var g = this.defaults.gravity;
          for (var i = 0; i < this.bodies.length; i++) {
            var ant_gravity = new b2Vec2(
              350.0 * g.x * this.bodies[i].GetMass(),
              350.0 * g.y * this.bodies[i].GetMass()
            );
            this.bodies[i].ApplyForce(
              ant_gravity,
              this.bodies[i].GetCenterPosition()
            );
          }
        },
        applyImpulse: function(body) {
          var f = this.defaults.impulse.f,
            p = this.defaults.impulse.p;
          var ant_gravity = new b2Vec2(
            f * p.x * body.GetMass(),
            f * p.y * body.GetMass()
          );
          body.ApplyImpulse(ant_gravity, body.GetCenterPosition());
        },
        handleScrollOrResize: function() {
          this.getBrowserDimensions();
          console.log(this.numInstance + "+");
          this.setWalls(this.numInstance);
        },
        getProjectedWidth: function(elem) {
          var rotationAngle = this.getRotation(elem);
          return (
            elem.width() * Math.cos(rotationAngle) +
            elem.height() * Math.sin(rotationAngle)
          );
        },
        getProjectedHeight: function(elem) {
          var rotationAngle = this.getRotation(elem);
          return (
            elem.width() * Math.sin(rotationAngle) +
            elem.height() * Math.cos(rotationAngle)
          );
        },
        getRotation: function(obj) {
          var matrix =
            obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
          var angle;
          if (matrix !== "none") {
            var values = matrix
              .split("(")[1]
              .split(")")[0]
              .split(",");
            var a = values[0];
            var b = values[1];
            angle = Math.atan2(b, a);
          } else {
            angle = 0;
          }
          return angle;
        },
        run: function() {
          var _this = this;
          this.isRunning = true;
          setInterval(function() {
            _this.loop();
          }, 25);
        },
        // Make box
        createBox: function(
          world,
          x,
          y,
          width,
          height,
          fixed,
          categoryBits,
          maskBits,
          element
        ) {
          if (typeof fixed === "undefined") fixed = true;

          var boxSd = new b2BoxDef();
          if (categoryBits && maskBits) {
            boxSd.categoryBits = categoryBits;
            boxSd.maskBits = maskBits;
          }

          if (!fixed) boxSd.density = 1.0;
          var bounce = this.defaults.bounce;
          if (bounce > 0) boxSd.restitution = Math.min(1, bounce);

          boxSd.extents.Set(width, height);

          var boxBd = new b2BodyDef();
          boxBd.AddShape(boxSd);
          boxBd.position.Set(x, y);
          boxBd.userData = { element: element };

          return world.CreateBody(boxBd);
        },
        // Make circle
        createCircle: function(
          world,
          x,
          y,
          radius,
          fixed,
          categoryBits,
          maskBits,
          element
        ) {
          if (typeof fixed === "undefined") fixed = true;

          var boxSd = new b2CircleDef();

          if (categoryBits && maskBits) {
            boxSd.categoryBits = categoryBits;
            boxSd.maskBits = maskBits;
          }

          if (!fixed) boxSd.density = 1.0;

          var bounce = this.defaults.bounce;
          if (bounce > 0) boxSd.restitution = Math.min(1, bounce);

          boxSd.radius = radius;

          var boxBd = new b2BodyDef();
          boxBd.AddShape(boxSd);
          boxBd.position.Set(x, y);
          boxBd.userData = { element: element };

          return world.CreateBody(boxBd);
        },
        mouseDrag: function() {
          // mouse press
          if (this.isMouseDown && !this.mouseJoint) {
            var body = this.getBodyAtMouse();

            if (body) {
              var md = new b2MouseJointDef();
              md.body1 = world.m_groundBody;
              md.body2 = body;
              md.target.Set(
                this.mouse.x + window.scrollX,
                this.mouse.y + window.scrollY
              );
              md.maxForce = 30000.0 * body.m_mass;
              md.timeStep = this.defaults.timeStep;
              this.mouseJoint = world.CreateJoint(md);
              body.WakeUp();
            }
          }

          // mouse release
          if (!this.isMouseDown) {
            if (this.mouseJoint) {
              world.DestroyJoint(this.mouseJoint);
              this.mouseJoint = null;
            }
          }

          // mouse move
          if (this.mouseJoint) {
            var p2 = new b2Vec2(
              this.mouse.x + window.scrollX,
              this.mouse.y + window.scrollY
            );
            this.mouseJoint.SetTarget(p2);
          }
        },
        getBodyAtMouse: function() {
          // Make a small box.
          var mousePVec = new b2Vec2();
          mousePVec.Set(
            this.mouse.x + window.scrollX,
            this.mouse.y + window.scrollY
          );
          var aabb = new b2AABB();
          aabb.minVertex.Set(
            this.mouse.x + window.scrollX - 2,
            this.mouse.y + window.scrollY - 2
          );
          aabb.maxVertex.Set(
            this.mouse.x + window.scrollX + 2,
            this.mouse.y + window.scrollY + 2
          );

          // Query the world for overlapping shapes.
          var k_maxCount = 10;
          var shapes = [];
          var count = world.Query(aabb, shapes, k_maxCount);
          var body = null;

          for (var i = 0; i < count; i++) {
            if (shapes[i].m_body.IsStatic() === false) {
              if (shapes[i].TestPoint(mousePVec)) {
                var tmpBody = shapes[i].m_body;
                if ($.inArray(tmpBody, this.bodies) !== -1) {
                  body = tmpBody;
                  break;
                }
              }
            }
          }
          return body;
        },
        // create contaimnent walls
        setWalls: function(i) {
          if (this.wallsSetted) {
            world.DestroyBody(this.walls.left);
            world.DestroyBody(this.walls.top);
            world.DestroyBody(this.walls.right);
            world.DestroyBody(this.walls.bottom);

            this.walls.left = null;
            this.walls.top = null;
            this.walls.right = null;
            this.walls.bottom = null;
          }
          var x1 = this.stage.X,
            y1 = this.stage.Y,
            x2 = this.stage.Width,
            y2 = this.stage.Height;
          this.walls.top = this.createBox(
            world,
            (x1 + x2) / 2,
            y1 - wall_thickness,
            x2 - x1,
            wall_thickness,
            true,
            i,
            i
          );
          this.walls.bottom = this.createBox(
            world,
            (x1 + x2) / 2,
            y2 + wall_thickness,
            x2 - x1,
            wall_thickness,
            true,
            i,
            i
          );
          this.walls.left = this.createBox(
            world,
            x1 - wall_thickness,
            (y2 + y1) / 2,
            wall_thickness,
            y2 - y1,
            true,
            i,
            i
          );
          this.walls.right = this.createBox(
            world,
            x2 + wall_thickness,
            (y2 + y1) / 2,
            wall_thickness,
            y2 - y1,
            true,
            i,
            i
          );
          this.wallsSetted = true;
        },
        // .. UTILS
        getElementProperties: function(element) {
          var x = 0;
          var y = 0;
          var width = element.offsetWidth;
          var height = element.offsetHeight;
          do {
            x += element.offsetLeft;
            y += element.offsetTop;
          } while ((element = element.offsetParent));

          return { X: x, Y: y, Width: width, Height: height };
        },
        getBrowserDimensions: function() {
          if (
            this.defaults.containment === "window" ||
            this.defaults.containment ===
              "parent" /*|| this.defaults.fixed === true*/
          ) {
            var changed = false;
            if (this.stage.X !== window.scrollX) {
              this.delta.X = (window.scrollX - this.stage.X) * 50;
              this.stage.X = window.scrollX;
              changed = true;
            }

            if (this.stage.Y !== window.scrollY) {
              this.delta.Y = (window.scrollY - this.stage.Y) * 50;
              this.stage.Y = window.scrollY;
              changed = true;
            }

            if (this.stage.Width !== window.innerWidth + window.scrollX) {
              this.stage.Width = window.innerWidth + window.scrollX;
              changed = true;
            }

            if (this.stage.Height !== window.innerHeight + window.scrollY) {
              this.stage.Height = window.innerHeight + window.scrollY;
              changed = true;
            }
            return changed;
          } else {
            var c = this.defaults.containment;
            this.stage = { X: c[0], Y: c[1], Width: c[2], Height: c[3] };
          }
        }
      });
      bool = true;
    }
  }
  // JQuery.fn.throwable

  $.fn.throwable = function(options) {
    if ($.isFunction(this.each)) {
      var _this = this;
      if ($("body").data("throwable.instance") === undefined) {
        $("body").data("throwable.instance", true);
        init();
      }

      var throwableInstance = new throwable();

      var isEnvSet = false;
      var rt = this.each(function() {
        var i = inArrays(this, $.throwables),
          exist = i !== -1;
        if (
          !exist ||
          $.throwables[i.index].elements.selector !== _this.selector
        ) {
          if (exist) {
            $.throwables[i.index].removeElement(i.index);
            throwableInstance.defaults = $.extend(
              {},
              throwableInstance.defaults,
              $.throwables[i.index].defaults
            );
          }

          if (!isEnvSet) {
            throwableInstance.setEnv(_this, options);
            isEnvSet = true;
          }

          throwableInstance.initElem(this);
        } else {
          throwableInstance = $.throwables[i.index];
          throwableInstance.applyOptions(options, i.value);
        }
      });

      if ($.inArray(throwableInstance, $.throwables) === -1)
        $.throwables.push(throwableInstance);
      return rt;
    }
  };

  // array that will contient arrays
  $.throwables = [];
})(jQuery, window, document);

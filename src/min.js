/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/13 1:21 上午
 */
var $jscomp = {
  scope: {}
};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, d) {
  if (d.get || d.set)
    throw new TypeError("ES3 does not support getters and setters.");
  a != Array.prototype && a != Object.prototype && (a[b] = d.value)
}
;
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {}
  ;
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
}
;
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(a) {
  return $jscomp.SYMBOL_PREFIX + (a || "") + $jscomp.symbolCounter_++
}
;
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
    configurable: !0,
    writable: !0,
    value: function() {
      return $jscomp.arrayIterator(this)
    }
  });
  $jscomp.initSymbolIterator = function() {}
}
;
$jscomp.arrayIterator = function(a) {
  var b = 0;
  return $jscomp.iteratorPrototype(function() {
    return b < a.length ? {
      done: !1,
      value: a[b++]
    } : {
      done: !0
    }
  })
}
;
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {
    next: a
  };
  a[$jscomp.global.Symbol.iterator] = function() {
    return this
  }
  ;
  return a
}
;
$jscomp.makeIterator = function(a) {
  $jscomp.initSymbolIterator();
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var b = a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a)
}
;
var LongMap = function(a) {
  function b(a) {
    var b = {
      features: [],
      kmz: [],
      tiles: [],
      terrainPosition: null,
      featureID: null,
      activeModel: null
    }
      , c = e.map.scene;
    if (c.mode !== Cesium.SceneMode.MORPHING) {
      var d = c.pick(a);
      d && d._content && d._content._tileset && "activeModel" == d._content._tileset._type && (b.activeModel = d._content._tileset);
      d && d.primitive && d.primitive.parentClass ? (b.features.push(d.primitive.parentClass),
      d.id && (b.featureID = d.id)) : d && d.collection && d.collection.parentClass ? b.features.push(d.collection.parentClass) : d && d.id && !d.id._description && d.id.parentClass && b.features.push(d.id.parentClass);
      d && d.id && ("cutBIM" == d.id.__fsf || "cutGeology" == d.id.__fsf) && (b.cutFeature = d);
      d && Cesium.defined(d) && d instanceof Cesium.Cesium3DTileFeature && b.tiles.push(d);
      d && d.id && d.id._description && d.id._description._value && (b.kmz.push(d),
        b.info = d.id._description._value);
      document.body.style.cursor = 0 < b.kmz.length || 0 < b.features.length || b.tiles.length ? "pointer" : "default";
      var g = e.map.camera.getPickRay(a);
      if (g = e.map.scene.globe.pick(g, e.map.scene)) {
        var k = Cesium.Cartographic.fromCartesian(g)
          , g = Cesium.Math.toDegrees(k.longitude)
          , p = Cesium.Math.toDegrees(k.latitude)
          , k = e.map.scene.globe.getHeight(k);
        b.terrainPosition = new LongMap.Point3(g,p,k)
      }
      c.pickPositionSupported && Cesium.defined(d) && d.content && d.content._tileset ? (g = e.map.scene.pickPosition(a),
      Cesium.defined(g) && (k = Cesium.Cartographic.fromCartesian(g),
        g = Cesium.Math.toDegrees(k.longitude),
        p = Cesium.Math.toDegrees(k.latitude),
        k = k.height,
        b.point = new LongMap.Point3(g,p,k))) : b.point = b.terrainPosition
    }
    return b
  }
  function d() {
    this.event = {
      click: "LEFT_CLICK",
      mousedown: "LEFT_DOWN",
      mouseup: "LEFT_UP",
      mousemove: "MOUSE_MOVE",
      touchstart: "PINCH_START",
      touchmove: "PINCH_MOVE",
      touchend: "PINCH_END",
      dblckick: "LEFT_DOUBLE_CLICK",
      rightClick: "RIGHT_CLICK",
      wheel: "WHEEL"
    };
    var a = e.event;
    e.handler.setInputAction(function(b) {
      a.wheel.forEach(function(a) {
        a(b)
      })
    }, Cesium.ScreenSpaceEventType.WHEEL);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.click.forEach(function(a) {
        c.info = null;
        c.type = 0;
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.terrainPosition = d.terrainPosition;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        d.info && (c.info = d.info);
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.rightClick.forEach(function(a) {
        c.type = 1;
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.mousedown.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.terrainPosition = d.terrainPosition;
        c.cutFeature = d.cutFeature;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.mouseup.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    e.handler.setInputAction(function(c) {
      var d = b(c.endPosition);
      a.mousemove.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.terrainPosition = d.terrainPosition;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.touchstart.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.PINCH_START);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.touchmove.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.PINCH_MOVE);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.touchend.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.PINCH_END);
    e.handler.setInputAction(function(c) {
      var d = b(c.position);
      a.dblclick.forEach(function(a) {
        c.point = d.point;
        c.features = d.features;
        c.kmz = d.kmz;
        c.tiles = d.tiles;
        c.featureID = d.featureID;
        c.activeModel = d.activeModel;
        a(c)
      })
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }
  var e = this;
  this.handler = this.camera = this.scene = this.controls = this.map = null;
  this.tiles = [];
  this.tileUrl = null;
  this.event = {
    click: [],
    mousedown: [],
    mouseup: [],
    mousemove: [],
    touchstart: [],
    touchmove: [],
    touchend: [],
    dblclick: [],
    rightClick: [],
    wheel: []
  };
  this.splitScreen = [];
  (function() {
      var b = new Cesium.Ellipsoid(6378137,6378137,6356752.314140356);
      new Cesium.GeographicTilingScheme({
        ellipsoid: b,
        rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
        numberOfLevelZeroTilesX: 4,
        numberOfLevelZeroTilesY: 2
      });
      b = new Cesium.Viewer(a,{
        imageryProvider: !1,
        animation: !1,
        sceneMode: 1,
        baseLayerPicker: !1,
        fullscreenButton: !1,
        geocoder: !1,
        timeline: !1,
        vrButton: !1,
        homeButton: !1,
        infoBox: !1,
        selectionIndicator: !1,
        navigationHelpButton: !1,
        navigationInstructionsInitiallyVisible: !1,
        shouldAnimate: !0,
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true
          }
        }
      });
      b.scene.screenSpaceCameraController.maximumZoomDistance = 1E6;
      e._container = document.getElementById(a);
      b.scene.fxaa = !1;
      b.scene.fog.enabled = !1;
      e.map = b;
      e.scene = b.scene;
      e.camera = b.camera;
      e.handler = new Cesium.ScreenSpaceEventHandler(b.scene.canvas);
      b.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      b.scene.globe.depthTestAgainstTerrain = !1;
      d();
      e.map.camera.changed.addEventListener(function(a) {
        for (a = 0; a < e.splitScreen.length; a++)
          e.splitScreen[a].scene.camera.up = e.map.scene.camera.up.clone(),
            e.splitScreen[a].scene.camera.direction = e.map.scene.camera.direction.clone(),
            e.splitScreen[a].scene.camera.right = e.map.scene.camera.right.clone(),
            e.splitScreen[a].scene.camera.position = e.map.scene.camera.position.clone(),
            e.splitScreen[a].scene.camera._viewMatrix = e.map.scene.camera._viewMatrix.clone()
      });
      e.map.camera.percentageChanged = .01
    }
  )(this);
  LongMap.prototype.setTileUrl = function(a) {
    e.tileUrl = a;
    a = new Cesium.UrlTemplateImageryProvider({
      url: a,
      format: "image/png"
    });
    for (var b = e.map.imageryLayers; 0 < b._layers.length; )
      b._layers.pop();
    b.addImageryProvider(a, 0);
    return a
  }
  ;
  LongMap.prototype.getTileUrl = function() {
    return e.tileUrl
  }
  ;
  LongMap.prototype.zoomIn = function() {
    this.map.camera.zoomIn(1E3)
  }
  ;
  LongMap.prototype.zoomOut = function() {
    this.map.camera.zoomOut(1E3)
  }
  ;
  LongMap.prototype.rotateLeft = function() {
    this.map.camera.rotateLeft(Cesium.Math.toDegrees(.005).toFixed(2))
  }
  ;
  LongMap.prototype.rotateRight = function() {
    this.map.camera.rotateRight(Cesium.Math.toDegrees(.005).toFixed(2))
  }
  ;
  LongMap.prototype.flipDown = function() {
    this.map.camera.twistLeft(Cesium.Math.toDegrees(.005).toFixed(2))
  }
  ;
  LongMap.prototype.flipUp = function() {
    this.map.camera.twistRight(Cesium.Math.toDegrees(.005).toFixed(2))
  }
  ;
  LongMap.prototype.setZoom = function(a) {
    e.map.scene.screenSpaceCameraController.enableZoom = a
  }
  ;
  LongMap.prototype.setPan = function(a) {
    e.map.scene.screenSpaceCameraController.enableRotate = a
  }
  ;
  LongMap.prototype.setRotate = function(a) {
    e.map.scene.screenSpaceCameraController.enableTilt = a
  }
};
LongMap.prototype = {
  constructor: LongMap,
  move: function(a) {
    "Point3" == a.type && this.map.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(a.lon, a.lat, a.z)
    })
  },
  addEventListener: function(a, b) {
    switch (a) {
      case "click":
        this.event.click.push(b);
        break;
      case "mousedown":
        this.event.mousedown.push(b);
        break;
      case "mouseup":
        this.event.mouseup.push(b);
        break;
      case "mousemove":
        this.event.mousemove.push(b);
        break;
      case "touchstart":
        this.event.touchstart.push(b);
        break;
      case "touchmove":
        this.event.touchmove.push(b);
        break;
      case "touchend":
        this.event.touchend.push(b);
        break;
      case "dblclick":
        this.event.dblclick.push(b);
        break;
      case "rightClick":
        this.event.rightClick.push(b);
        break;
      case "wheel":
        this.event.wheel.push(b);
        break;
      default:
        console.error("type\u5c5e\u6027\u9519\u8bef")
    }
  },
  removeEventListener: function(a, b) {
    var d = null;
    switch (a) {
      case "click":
        d = this.event.click;
        break;
      case "mousedown":
        d = this.event.mousedown;
        break;
      case "mouseup":
        d = this.event.mouseup;
        break;
      case "mousemove":
        d = this.event.mousemove;
        break;
      case "touchstart":
        d = this.event.touchstart;
        break;
      case "touchmove":
        d = this.event.touchmove;
        break;
      case "touchend":
        d = this.event.touchend;
        break;
      case "dblclick":
        d = this.event.dblclick;
        break;
      case "rightClick":
        d = this.event.rightClick;
        break;
      case "wheel":
        d = this.event.wheel;
        break;
      default:
        console.error("type\u5c5e\u6027\u9519\u8bef")
    }
    for (a = 0; a < d.length; )
      if (b == d[a]) {
        d.splice(a, 1);
        break
      } else
        a++
  },
  addIntercation: function(a) {
    a.map = this;
    a.init && a.init()
  },
  removeIntercation: function(a) {
    a.reInit && a.reInit();
    a.map = null
  },
  locate: function(a, b) {
    this.map.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(a.lon, a.lat, Math.ceil(this.map.camera.positionCartographic.height)),
      duration: b
    })
  },
  addLayer: function(a) {
    a.map = this.map;
    this.scene.primitives.add(a.object)
  },
  removeLayer: function(a) {
    a.removeAllFeature && a.removeAllFeature();
    this.scene.primitives.remove(a.object);
    a.map = null
  },
  add3DTiles: function(a) {
    a = new Cesium.Cesium3DTileset({
      url: a,
      show: !0,
      maximumScreenSpaceError: 16,
      maximumNumberOfLoadedTiles: 10,
      maximumMemoryUsage: 128
    });
    return this.map.scene.primitives.add(a)
  },
  addKML: function(a) {
    a.map = this;
    a.init && a.init()
  },
  removeKML: function(a) {
    a.reInit && a.reInit();
    a.map = null
  },
  getInfo: function(a) {
    this.infoCallback = a
  },
  removeGetInfo: function() {
    this.infoCallback = null
  },
  splitScreen: function() {
    $(this.map._element).parent().append($screen);
    var a = this
      , b = new Cesium.Viewer("screen",{
      imageryProvider: !1,
      animation: !1,
      baseLayerPicker: !1,
      fullscreenButton: !1,
      geocoder: !1,
      timeline: !1,
      vrButton: !1,
      homeButton: !1,
      infoBox: !1,
      selectionIndicator: !1,
      navigationHelpButton: !1,
      navigationInstructionsInitiallyVisible: !1,
      shouldAnimate: !0
    });
    b.scene.fxaa = !1;
    b.scene.fog.enabled = !1;
    b.scene.camera.up = a.map.scene.camera.up.clone();
    b.scene.camera.direction = a.map.scene.camera.direction.clone();
    b.scene.camera.right = a.map.scene.camera.right.clone();
    b.scene.camera.position = a.map.scene.camera.position.clone();
    b.scene.camera._viewMatrix = a.map.scene.camera._viewMatrix.clone();
    a.map.camera.changed.addEventListener(function() {
      b.scene.camera.up = a.map.scene.camera.up.clone();
      b.scene.camera.direction = a.map.scene.camera.direction.clone();
      b.scene.camera.right = a.map.scene.camera.right.clone();
      b.scene.camera.position = a.map.scene.camera.position.clone();
      b.scene.camera._viewMatrix = a.map.scene.camera._viewMatrix.clone()
    });
    a.map.camera.percentageChanged = .01;
    b.camera.changed.addEventListener(function() {
      a.map.scene.camera.up = b.scene.camera.up.clone();
      a.map.scene.camera.direction = b.scene.camera.direction.clone();
      a.map.scene.camera.right = b.scene.camera.right.clone();
      a.map.scene.camera.position = b.scene.camera.position.clone();
      a.map.scene.camera._viewMatrix = b.scene.camera._viewMatrix.clone()
    });
    b.camera.percentageChanged = .01
  },
  removeSplitScreen: function() {
    $("#screen").remove()
  },
  addSplitScreen: function(a) {
    var b = this
      , d = new LongMap(a);
    d.scene.camera.up = b.map.scene.camera.up.clone();
    d.scene.camera.direction = b.map.scene.camera.direction.clone();
    d.scene.camera.right = b.map.scene.camera.right.clone();
    d.scene.camera.position = b.map.scene.camera.position.clone();
    d.scene.camera._viewMatrix = b.map.scene.camera._viewMatrix.clone();
    d.camera.changed.addEventListener(function(a) {
      b.map.scene.camera.up = d.scene.camera.up.clone();
      b.map.scene.camera.direction = d.scene.camera.direction.clone();
      b.map.scene.camera.right = d.scene.camera.right.clone();
      b.map.scene.camera.position = d.scene.camera.position.clone();
      b.map.scene.camera._viewMatrix = d.scene.camera._viewMatrix.clone()
    });
    d.camera.percentageChanged = .01;
    this.splitScreen.push(d);
    return d
  },
  getScreenPosition: function(a) {
    return Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.scene, Cesium.Cartesian3.fromDegrees(a.lon, a.lat, a.z))
  },
  setAnimation: function(a) {
    a.map = this.map;
    a.smap = this;
    a.init()
  },
  removeAnimation: function(a) {
    a.remove();
    a.map = null
  },
  addGrid: function(a) {
    var b = a.url;
    a = a.hierarchy;
    var d = new Cesium.Ellipsoid(6378137,6378137,6356752.314140356)
      , e = new Cesium.GeographicTilingScheme({
      ellipsoid: d,
      rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
      numberOfLevelZeroTilesX: 4,
      numberOfLevelZeroTilesY: 2
    })
      , b = new Cesium.ArcGisMapServerImageryProvider({
      url: b,
      tilingScheme: e,
      minimumLevel: 0,
      ellipsoid: d,
      maximumLevel: 20
    })
      , d = this.map.imageryLayers
      , e = d._layers.length;
    a > e && (a = e);
    0 >= a && (a = 0);
    a = d.addImageryProvider(b, a);
    a.alpha = 1;
    a.brightness = 2;
    return a
  },
  removeGrid: function(a) {
    this.map.imageryLayers.remove(a)
  },
  addUrlProvider: function(a, b) {
    this.tileUrl = a.url;
    console.log();
    a = new Cesium.UrlTemplateImageryProvider({
      url: a.url,
      format: "image/png",
      maximumLevel: a.hasOwnProperty("maximumLevel") ? a.maximumLevel : 1
    });
    console.log();
    b = this.map.imageryLayers;
    console.log();
    console.log();
    return b.addImageryProvider(a, b._layers.length)
  },
  removeUrlProvider: function(a) {
    this.map.imageryLayers.remove(a)
  },
  addTileset: function(a) {
    a.tileset && this.map.scene.primitives.add(a.tileset)
  },
  removeTileset: function(a) {
    a.tileset && (this.map.scene.primitives.remove(a.tileset),
      a.tileset = null)
  },
  addBIM: function(a) {
    a.map = this;
    a.init();
    this.map.scene.primitives.add(a.title)
  },
  removeBIM: function(a) {
    a.title && a.reInit()
  },
  openShadow: function(a) {
    a.map = this;
    this.scene.shadowMap.enabled = !0;
    a.init && a.init()
  },
  closeShadow: function() {
    this.scene.shadowMap.enabled = !1
  },
  addDEM: function(a) {
    a = new Cesium.CesiumTerrainProvider({
      url: a,
      requestWaterMask: !0,
      credit: "http://www.bjxbsj.cn"
    });
    this.map.terrainProvider = a
  },
  removeDEM: function() {
    var a = new Cesium.EllipsoidTerrainProvider;
    this.map.terrainProvider = a
  },
  excavation: function(a, b) {
    if (!a.points || 3 > a.points.length)
      return !1;
    new Instrument(this,a,function(d) {
        var e = a.height
          , c = d.points;
        if (1 > c.length)
          return !1;
        d = d.distance;
        for (var f = c[0].height, h = c[0].height, l = 0, g = 0, k = 0, p = c.length; k < p; k++) {
          f < c[k].height && (f = c[k].height);
          h > c[k].height && (h = c[k].height);
          var m = c[k].height;
          m < e ? l += d * d * (e - m) : g += d * d * (m - e)
        }
        e = {
          tArea: l.toFixed(2),
          wArea: g.toFixed(2),
          tfl: (l + g).toFixed(2),
          maxHeight: f.toFixed(2),
          minHeight: h.toFixed(2)
        };
        b && b(e)
      }
    )
  }
};
function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
    var b = 16 * Math.random() | 0;
    return ("x" == a ? b : b & 3 | 8).toString(16)
  })
}
LongMap.Color = function(a, b) {
  this.hex = a || "#FFFFFF";
  this.opacity = 0 === b || b ? b : 1
}
;
LongMap.Point3 = function(a, b, d) {
  this.lon = a || 0;
  this.lat = b || 0;
  this.z = d || 0;
  this.spaceCoordinate = null;
  this.spaceCoordinate = Cesium.Cartesian3.fromDegrees(a, b, d)
}
;
LongMap.Point3.prototype = {
  constructor: LongMap.Point3,
  type: "Point3",
  vector: function() {
    return Cesium.Cartesian3.fromDegrees(this.lon, this.lat, this.z)
  },
  fromVector: function(a) {
    a = Cesium.Cartographic.fromCartesian(a);
    this.lon = 180 * a.longitude / Math.PI;
    this.lat = 180 * a.latitude / Math.PI;
    this.z = a.height;
    return this
  },
  copy: function(a) {
    this.lon = a.lon;
    this.lat = a.lat;
    this.z = a.z;
    return this
  },
  distanceTo: function(a) {
    return Cesium.Cartesian3.distance(this.vector(), a.vector())
  }
};
LongMap.Point2 = function(a, b) {
  this.lon = a || 0;
  this.lat = b || 0;
  this.spaceCoordinate = null;
  a = Cesium.Cartesian3.fromDegrees(a, b);
  this.spaceCoordinate = new Cesium.Cartesian2(a.y,a.z)
}
;
LongMap.Point2.prototype = {
  constructor: LongMap.Point2,
  type: "Point2"
};
LongMap.Layer = function() {
  this.object = new Cesium.PrimitiveCollection;
  this.entities = [];
  this.children = [];
  this.map = null
}
;
LongMap.Layer.prototype = {
  constructor: LongMap.Layer,
  addFeature: function(a) {
    "primitive" === a.type ? (this.object.add(a.object),
      a.layer = this) : "entitie" === a.type && (this.map.entities.add(a.object),
    a.object.id || (a.object.id = this.map.entities._entities._array[this.map.entities._entities._array.length - 1]._id),
      this.entities.push(a),
      a.layer = this);
    this.children.push(a)
  },
  removeFeature: function(a) {
    a && "primitive" === a.type ? this.object.remove(a.object) : "entitie" === a.type && (this.map.entities.remove(a.object),
    a.video && (document.body.removeChild(a.video),
      a.video = null));
    -1 != this.children.indexOf(a) && this.children.splice(this.children.indexOf(a), 1)
  },
  removeAllFeature: function() {
    for (this.object.removeAll(); 0 < this.entities.length; ) {
      var a = this.entities.pop();
      "entitie" === a.type && (this.map.entities.remove(a.object),
      a.video && (document.body.removeChild(a.video),
        a.video = null))
    }
    this.children.length = 0
  },
  addEffect: function(a) {
    if ("primitive" === a.type)
      for (var b = 0; b < a.object.length; b++)
        this.object.add(a[b].object);
    else if ("entitie" === a.type)
      for (b = 0; b < a.object.length; b++)
        this.map.entities.add(a.object[b].object),
          this.entities.push(a.object[b]),
        a.object[b].object.id || (a.object[b].object.id = this.map.entities._entities._array[this.map.entities._entities._array.length - 1]._id);
    this.children.push(a);
    a.parent = this
  },
  removeEffect: function(a) {
    a.clearTimer && a.clearTimer();
    if (a && "primitive" === a.type)
      for (var b = 0; b < a.object.length; b++)
        this.object.remove(a[b].object);
    else if ("entitie" === a.type)
      for (b = 0; b < a.object.length; b++)
        this.map.entities.remove(a.object[b].object);
    -1 != this.children.indexOf(a) && this.children.splice(this.children.indexOf(a), 1);
    this.entities = []
  },
  show: function() {
    this.object.show = !0
  },
  hide: function() {
    this.object.show = !1
  }
};
LongMap.Sprite = function(a) {
  this.object = null;
  this.type = "primitive";
  this.opacity = this.url = this.position = null;
  this.scale = a.scale || 1;
  this.offset = a.offset ? new Cesium.Cartesian2(a.offset.x,a.offset.y) : new Cesium.Cartesian2(0,1);
  this.uuid = guid();
  this.info = a.info || null;
  this.color = a.color || new LongMap.Color("#fff");
  if (a.url) {
    var b = new Cesium.BillboardCollection
      , d = {
      position: a.position.spaceCoordinate,
      color: Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity || 1),
      image: a.url,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      scale: this.scale,
      pixelOffset: this.offset
    };
    this.position = a.position;
    this.url = a.url;
    b.add(d)
  } else
    b = new Cesium.PointPrimitiveCollection,
      d = {
        position: a.position.spaceCoordinate,
        color: Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity || 1),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        pixelSize: this.scale
      },
      b.add(d),
      this.position = a.position;
  this.object = b;
  this.object.parentClass = this
}
;
LongMap.Sprite.prototype = {
  setPosition: function(a) {
    this.position = a;
    this.object._billboards ? this.object._billboards[0].position = this.position.vector() : this.object._pointPrimitives[0].position = this.position.vector()
  },
  show: function() {
    if (this.object)
      for (var a = this.object, b = a.length, d = 0; d < b; ++d)
        a.get(d).show = !0
  },
  hide: function() {
    if (this.object)
      for (var a = this.object, b = a.length, d = 0; d < b; ++d)
        a.get(d).show = !1
  },
  setScale: function(a) {
    this.scale = a || this.scale;
    if (this.object) {
      a = this.object;
      for (var b = a.length, d = 0; d < b; ++d) {
        var e = a.get(d);
        e.scale ? e.scale = this.scale : e.pixelSize = this.scale
      }
    }
  },
  setColor: function(a) {
    this.color = a || this.color;
    if (this.object) {
      a = this.object;
      for (var b = a.length, d = 0; d < b; ++d)
        a.get(d).color = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity || 1)
    }
  },
  setImage: function(a) {
    if (!this.url)
      return !1;
    this.url = a || this.url;
    if (this.object) {
      a = this.object;
      for (var b = a.length, d = 0; d < b; ++d)
        a.get(d).image = this.url
    }
  },
  remove: function() {
    globe = this;
    var a = globe.layer;
    if (!a)
      return !1;
    a.removeFeature(globe)
  }
};
LongMap.Line = function(a) {
  this.object = null;
  if (a && !(a.points && 2 > a.points.length)) {
    this.type = "primitive";
    this.vertexs = null;
    this.width = a.width || 1;
    this.info = a.info || null;
    this.opacity = 1;
    this.color = Cesium.Color.fromCssColorString("#fff").withAlpha(1);
    this.points = a.points;
    this.uuid = guid();
    this.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    var b = [];
    this.color = a.color || new LongMap.Color("#ffffff",1);
    for (a = 0; a < this.points.length; a++)
      b.push(this.points[a].spaceCoordinate);
    a = Cesium.Color.fromCssColorString(this.color.hex || "#fff").withAlpha(.3);
    b = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: b,
        width: 10
      }),
      id: this.uuid,
      attributes: {
        show: new Cesium.ShowGeometryInstanceAttribute(!0)
      }
    });
    this.vertexs = b.geometry._positions;
    this.object = this.depth ? new Cesium.Primitive({
      geometryInstances: b,
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: a
            }
          }
        }),
        translucent: true,
        vertexShaderSource: "#define CLIP_POLYLINE\n\r\n\t\t\t\t\t\t\tvoid clipLineSegmentToNearPlane(\n\r\n\t\t\t\t\t\t\tvec3 p0,\n\r\n\t\t\t\t\t\t\tvec3 p1,\n\r\n\t\t\t\t\t\t\tout vec4 positionWC,\n\r\n\t\t\t\t\t\t\tout bool clipped,\n\r\n\t\t\t\t\t\t\tout bool culledByNearPlane)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tculledByNearPlane \x3d false;\n\r\n\t\t\t\t\t\t\tclipped \x3d false;\n\r\n\t\t\t\t\t\t\tvec3 p1ToP0 \x3d p1 - p0;\n\r\n\t\t\t\t\t\t\tfloat magnitude \x3d length(p1ToP0);\n\r\n\t\t\t\t\t\t\tvec3 direction \x3d normalize(p1ToP0);\n\r\n\t\t\t\t\t\t\tfloat endPoint0Distance \x3d  -(czm_currentFrustum.x + p0.z);\n\r\n\t\t\t\t\t\t\tfloat denominator \x3d -direction.z;\n\r\n\t\t\t\t\t\t\tif (endPoint0Distance \x3c 0.0 \x26\x26 abs(denominator) \x3c czm_epsilon7)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tculledByNearPlane \x3d true;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse if (endPoint0Distance \x3c 0.0 \x26\x26 abs(denominator) \x3e czm_epsilon7)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tfloat t \x3d (czm_currentFrustum.x + p0.z) / denominator;\n\r\n\t\t\t\t\t\t\tif (t \x3c 0.0 || t \x3e magnitude)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tculledByNearPlane \x3d true;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tp0 \x3d p0 + t * direction;\n\r\n\t\t\t\t\t\t\tclipped \x3d true;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tpositionWC \x3d czm_eyeToWindowCoordinates(vec4(p0, 1.0));\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tvec4 endPointWC, p0, p1;\n\r\n\t\t\t\t\t\t\tbool culledByNearPlane, clipped;\n\r\n\t\t\t\t\t\t\t#ifdef POLYLINE_DASH\n\r\n\t\t\t\t\t\t\tvec4 positionWindow \x3d czm_eyeToWindowCoordinates(positionEC);\n\r\n\t\t\t\t\t\t\tvec4 previousWindow \x3d czm_eyeToWindowCoordinates(prevEC);\n\r\n\t\t\t\t\t\t\tvec4 nextWindow \x3d czm_eyeToWindowCoordinates(nextEC);\n\r\n\t\t\t\t\t\t\tvec2 lineDir;\n\r\n\t\t\t\t\t\t\tif (usePrevious) {\n\r\n\t\t\t\t\t\t\tlineDir \x3d normalize(positionWindow.xy - previousWindow.xy);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse {\n\r\n\t\t\t\t\t\t\tlineDir \x3d normalize(nextWindow.xy - positionWindow.xy);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tangle \x3d atan(lineDir.x, lineDir.y) - 1.570796327;\n\r\n\t\t\t\t\t\t\tangle \x3d floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;\n\r\n\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\tclipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, p0, clipped, culledByNearPlane);\n\r\n\t\t\t\t\t\t\tclipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, p1, clipped, culledByNearPlane);\n\r\n\t\t\t\t\t\t\tclipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, endPointWC, clipped, culledByNearPlane);\n\r\n\t\t\t\t\t\t\tif (culledByNearPlane)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\treturn vec4(0.0, 0.0, 0.0, 1.0);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec2 prevWC \x3d normalize(p0.xy - endPointWC.xy);\n\r\n\t\t\t\t\t\t\tvec2 nextWC \x3d normalize(p1.xy - endPointWC.xy);\n\r\n\t\t\t\t\t\t\tfloat expandWidth \x3d width * 0.5;\n\r\n\t\t\t\t\t\t\tvec2 direction;\n\r\n\t\t\t\t\t\t\t#ifdef CLIP_POLYLINE\n\r\n\t\t\t\t\t\t\tif (clipped)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tif (prevEC.z - positionEC.z \x3c 0.0)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(prevWC.y, -prevWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(-prevWC.y, prevWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\tif (czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) || czm_equalsEpsilon(prevWC, -nextWC, czm_epsilon1))\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(-nextWC.y, nextWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse if (czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(prevWC.y, -prevWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tvec2 normal \x3d vec2(-nextWC.y, nextWC.x);\n\r\n\t\t\t\t\t\t\tdirection \x3d normalize((nextWC + prevWC) * 0.5);\n\r\n\t\t\t\t\t\t\tif (dot(direction, normal) \x3c 0.0)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d -direction;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tfloat sinAngle \x3d abs(direction.x * nextWC.y - direction.y * nextWC.x);\n\r\n\t\t\t\t\t\t\texpandWidth \x3d clamp(expandWidth / sinAngle, 0.0, width * 2.0);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec2 offset \x3d direction * expandDirection * expandWidth * czm_pixelRatio;\n\r\n\t\t\t\t\t\t\treturn vec4(endPointWC.xy + offset, -endPointWC.z, 1.0);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tvec4 positionEC \x3d czm_modelViewRelativeToEye * position;\n\r\n\t\t\t\t\t\t\tvec4 prevEC \x3d czm_modelViewRelativeToEye * previous;\n\r\n\t\t\t\t\t\t\tvec4 nextEC \x3d czm_modelViewRelativeToEye * next;\n\r\n\t\t\t\t\t\t\treturn getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tattribute vec3 position3DHigh;\n\r\n\t\t\t\t\t\t\tattribute vec3 position3DLow;\n\r\n\t\t\t\t\t\t\tattribute vec3 prevPosition3DHigh;\n\r\n\t\t\t\t\t\t\tattribute vec3 prevPosition3DLow;\n\r\n\t\t\t\t\t\t\tattribute vec3 nextPosition3DHigh;\n\r\n\t\t\t\t\t\t\tattribute vec3 nextPosition3DLow;\n\r\n\t\t\t\t\t\t\tattribute vec2 expandAndWidth;\n\r\n\t\t\t\t\t\t\tattribute vec2 st;\n\r\n\t\t\t\t\t\t\tattribute float batchId;\n\r\n\t\t\t\t\t\t\tvarying float v_width;\n\r\n\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\tvarying float v_polylineAngle;\n\r\n\t\t\t\t\t\t\tuniform vec4 color_0;\n\r\n\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tfloat expandDir \x3d expandAndWidth.x;\n\r\n\t\t\t\t\t\t\t// float width \x3d abs(expandAndWidth.y*color_0.a)+ 0.5;\n\r\n\t\t\t\t\t\t\tfloat width \x3d abs(color_0.a)+ 0.5;\n\r\n\t\t\t\t\t\t\tbool usePrev \x3d expandAndWidth.y \x3c 0.0;\n\r\n\t\t\t\t\t\t\tvec4 p \x3d czm_computePosition();\n\r\n\t\t\t\t\t\t\tvec4 prev \x3d czm_computePrevPosition();\n\r\n\t\t\t\t\t\t\tvec4 next \x3d czm_computeNextPosition();\n\r\n\t\t\t\t\t\t\tv_width \x3d width;\n\r\n\t\t\t\t\t\t\tv_st \x3d st;\n\r\n\t\t\t\t\t\t\tvec4 positionWC \x3d getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, v_polylineAngle);\n\r\n\t\t\t\t\t\t\tgl_Position \x3d czm_viewportOrthographic * positionWC;\n\r\n\t\t\t\t\t\t\t#ifdef LOG_DEPTH\n\r\n\t\t\t\t\t\t\tczm_vertexLogDepth(czm_modelViewProjectionRelativeToEye * p);\n\r\n\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t",
        fragmentShaderSource: "#ifdef VECTOR_TILE\n\r\n\t\t\t\t\t\t\t\t\tuniform vec4 u_highlightColor;\n\r\n\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\tczm_materialInput materialInput;\n\r\n\t\t\t\t\t\t\t\t\tmaterialInput.s \x3d v_st.s;\n\r\n\t\t\t\t\t\t\t\t\tmaterialInput.st \x3d v_st;\n\r\n\t\t\t\t\t\t\t\t\tmaterialInput.str \x3d vec3(v_st, 0.0);\n\r\n\t\t\t\t\t\t\t\t\tczm_material material \x3d czm_getMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\t\tgl_FragColor \x3d vec4(material.diffuse + material.emission, 1.0);\n\r\n\t\t\t\t\t\t\t\t\t#ifdef VECTOR_TILE\n\r\n\t\t\t\t\t\t\t\t\tgl_FragColor *\x3d u_highlightColor;\n\r\n\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\tczm_writeLogDepth();\n\r\n\t\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t\t"
      })
    }) : new Cesium.Primitive({
      geometryInstances: b,
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: a
            }
          }
        }),
        translucent: true,
        renderState: {
          depthTest: !0
        },
        vertexShaderSource: "#define CLIP_POLYLINE\n\r\n\t\t\t\t\t\t\tvoid clipLineSegmentToNearPlane(\n\r\n\t\t\t\t\t\t\tvec3 p0,\n\r\n\t\t\t\t\t\t\tvec3 p1,\n\r\n\t\t\t\t\t\t\tout vec4 positionWC,\n\r\n\t\t\t\t\t\t\tout bool clipped,\n\r\n\t\t\t\t\t\t\tout bool culledByNearPlane)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tculledByNearPlane \x3d false;\n\r\n\t\t\t\t\t\t\tclipped \x3d false;\n\r\n\t\t\t\t\t\t\tvec3 p1ToP0 \x3d p1 - p0;\n\r\n\t\t\t\t\t\t\tfloat magnitude \x3d length(p1ToP0);\n\r\n\t\t\t\t\t\t\tvec3 direction \x3d normalize(p1ToP0);\n\r\n\t\t\t\t\t\t\tfloat endPoint0Distance \x3d  -(czm_currentFrustum.x + p0.z);\n\r\n\t\t\t\t\t\t\tfloat denominator \x3d -direction.z;\n\r\n\t\t\t\t\t\t\tif (endPoint0Distance \x3c 0.0 \x26\x26 abs(denominator) \x3c czm_epsilon7)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tculledByNearPlane \x3d true;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse if (endPoint0Distance \x3c 0.0 \x26\x26 abs(denominator) \x3e czm_epsilon7)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tfloat t \x3d (czm_currentFrustum.x + p0.z) / denominator;\n\r\n\t\t\t\t\t\t\tif (t \x3c 0.0 || t \x3e magnitude)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tculledByNearPlane \x3d true;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tp0 \x3d p0 + t * direction;\n\r\n\t\t\t\t\t\t\tclipped \x3d true;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tpositionWC \x3d czm_eyeToWindowCoordinates(vec4(p0, 1.0));\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tvec4 endPointWC, p0, p1;\n\r\n\t\t\t\t\t\t\tbool culledByNearPlane, clipped;\n\r\n\t\t\t\t\t\t\t#ifdef POLYLINE_DASH\n\r\n\t\t\t\t\t\t\tvec4 positionWindow \x3d czm_eyeToWindowCoordinates(positionEC);\n\r\n\t\t\t\t\t\t\tvec4 previousWindow \x3d czm_eyeToWindowCoordinates(prevEC);\n\r\n\t\t\t\t\t\t\tvec4 nextWindow \x3d czm_eyeToWindowCoordinates(nextEC);\n\r\n\t\t\t\t\t\t\tvec2 lineDir;\n\r\n\t\t\t\t\t\t\tif (usePrevious) {\n\r\n\t\t\t\t\t\t\tlineDir \x3d normalize(positionWindow.xy - previousWindow.xy);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse {\n\r\n\t\t\t\t\t\t\tlineDir \x3d normalize(nextWindow.xy - positionWindow.xy);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tangle \x3d atan(lineDir.x, lineDir.y) - 1.570796327;\n\r\n\t\t\t\t\t\t\tangle \x3d floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;\n\r\n\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\tclipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, p0, clipped, culledByNearPlane);\n\r\n\t\t\t\t\t\t\tclipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, p1, clipped, culledByNearPlane);\n\r\n\t\t\t\t\t\t\tclipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, endPointWC, clipped, culledByNearPlane);\n\r\n\t\t\t\t\t\t\tif (culledByNearPlane)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\treturn vec4(0.0, 0.0, 0.0, 1.0);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec2 prevWC \x3d normalize(p0.xy - endPointWC.xy);\n\r\n\t\t\t\t\t\t\tvec2 nextWC \x3d normalize(p1.xy - endPointWC.xy);\n\r\n\t\t\t\t\t\t\tfloat expandWidth \x3d width * 0.5;\n\r\n\t\t\t\t\t\t\tvec2 direction;\n\r\n\t\t\t\t\t\t\t#ifdef CLIP_POLYLINE\n\r\n\t\t\t\t\t\t\tif (clipped)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tif (prevEC.z - positionEC.z \x3c 0.0)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(prevWC.y, -prevWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(-prevWC.y, prevWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\tif (czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) || czm_equalsEpsilon(prevWC, -nextWC, czm_epsilon1))\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(-nextWC.y, nextWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse if (czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d vec2(prevWC.y, -prevWC.x);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\telse\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tvec2 normal \x3d vec2(-nextWC.y, nextWC.x);\n\r\n\t\t\t\t\t\t\tdirection \x3d normalize((nextWC + prevWC) * 0.5);\n\r\n\t\t\t\t\t\t\tif (dot(direction, normal) \x3c 0.0)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tdirection \x3d -direction;\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tfloat sinAngle \x3d abs(direction.x * nextWC.y - direction.y * nextWC.x);\n\r\n\t\t\t\t\t\t\texpandWidth \x3d clamp(expandWidth / sinAngle, 0.0, width * 2.0);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec2 offset \x3d direction * expandDirection * expandWidth * czm_pixelRatio;\n\r\n\t\t\t\t\t\t\treturn vec4(endPointWC.xy + offset, -endPointWC.z, 1.0);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tvec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tvec4 positionEC \x3d czm_modelViewRelativeToEye * position;\n\r\n\t\t\t\t\t\t\tvec4 prevEC \x3d czm_modelViewRelativeToEye * previous;\n\r\n\t\t\t\t\t\t\tvec4 nextEC \x3d czm_modelViewRelativeToEye * next;\n\r\n\t\t\t\t\t\t\treturn getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\tattribute vec3 position3DHigh;\n\r\n\t\t\t\t\t\t\tattribute vec3 position3DLow;\n\r\n\t\t\t\t\t\t\tattribute vec3 prevPosition3DHigh;\n\r\n\t\t\t\t\t\t\tattribute vec3 prevPosition3DLow;\n\r\n\t\t\t\t\t\t\tattribute vec3 nextPosition3DHigh;\n\r\n\t\t\t\t\t\t\tattribute vec3 nextPosition3DLow;\n\r\n\t\t\t\t\t\t\tattribute vec2 expandAndWidth;\n\r\n\t\t\t\t\t\t\tattribute vec2 st;\n\r\n\t\t\t\t\t\t\tattribute float batchId;\n\r\n\t\t\t\t\t\t\tvarying float v_width;\n\r\n\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\tvarying float v_polylineAngle;\n\r\n\t\t\t\t\t\t\tuniform vec4 color_0;\n\r\n\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\tfloat expandDir \x3d expandAndWidth.x;\n\r\n\t\t\t\t\t\t\t// float width \x3d abs(expandAndWidth.y*color_0.a)+ 0.5;\n\r\n\t\t\t\t\t\t\tfloat width \x3d abs(color_0.a)+ 0.5;\n\r\n\t\t\t\t\t\t\tbool usePrev \x3d expandAndWidth.y \x3c 0.0;\n\r\n\t\t\t\t\t\t\tvec4 p \x3d czm_computePosition();\n\r\n\t\t\t\t\t\t\tvec4 prev \x3d czm_computePrevPosition();\n\r\n\t\t\t\t\t\t\tvec4 next \x3d czm_computeNextPosition();\n\r\n\t\t\t\t\t\t\tv_width \x3d width;\n\r\n\t\t\t\t\t\t\tv_st \x3d st;\n\r\n\t\t\t\t\t\t\tvec4 positionWC \x3d getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, v_polylineAngle);\n\r\n\t\t\t\t\t\t\tgl_Position \x3d czm_viewportOrthographic * positionWC;\n\r\n\t\t\t\t\t\t\t#ifdef LOG_DEPTH\n\r\n\t\t\t\t\t\t\tczm_vertexLogDepth(czm_modelViewProjectionRelativeToEye * p);\n\r\n\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t",
        fragmentShaderSource: "#ifdef VECTOR_TILE\n\r\n\t\t\t\t\t\t\t\t\tuniform vec4 u_highlightColor;\n\r\n\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\tczm_materialInput materialInput;\n\r\n\t\t\t\t\t\t\t\t\tmaterialInput.s \x3d v_st.s;\n\r\n\t\t\t\t\t\t\t\t\tmaterialInput.st \x3d v_st;\n\r\n\t\t\t\t\t\t\t\t\tmaterialInput.str \x3d vec3(v_st, 0.0);\n\r\n\t\t\t\t\t\t\t\t\tczm_material material \x3d czm_getMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\t\tgl_FragColor \x3d vec4(material.diffuse + material.emission, 1.0);\n\r\n\t\t\t\t\t\t\t\t\t#ifdef VECTOR_TILE\n\r\n\t\t\t\t\t\t\t\t\tgl_FragColor *\x3d u_highlightColor;\n\r\n\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\tczm_writeLogDepth();\n\r\n\t\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t\t"
      })
    });
    this.object.parentClass = this
  }
}
;
LongMap.Line.prototype = {
  setColor: function(a) {
    this.color = a || this.color;
    a = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.width);
    this.object._material && (this.object._material.uniforms.color = a)
  },
  rePaint: function() {},
  setStyle: function() {
    console.log()
  },
  show: function() {
    this.object.show = !0
  },
  hide: function() {
    this.object.show = !1
  },
  remove: function() {
    globe = this;
    var a = globe.layer;
    if (!a)
      return !1;
    a.removeFeature(globe)
  },
  setLineWidth: function(a) {
    this.width = a || this.width;
    a = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.width);
    this.object._material && (this.object._material.uniforms.color = a)
  }
};
LongMap.CoarseLine = function(a) {
  this.object = null;
  this.type = "primitive";
  if (a && !(a.positions && 2 > a.positions.length)) {
    this.color = a.color || new LongMap.Color("#fff",1);
    this.width = a.width || 1;
    var b = this;
    b.uuid = guid();
    (function() {
        for (var d = [], e = 0; e < a.positions.length; e++)
          d.push(a.positions[e].lon, a.positions[e].lat);
        d = new Cesium.GeometryInstance({
          geometry: new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArray(d),
            width: b.width
          })
        });
        d = new Cesium.Primitive({
          geometryInstances: d,
          appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
              fabric: {
                type: "Color",
                uniforms: {
                  color: Cesium.Color.fromCssColorString(b.color.hex).withAlpha(b.color.opacity)
                }
              }
            })
          })
        });
        d.parentClass = b;
        b.object = d
      }
    )();
    LongMap.CoarseLine.prototype.setColor = function(a) {
      this.color = new LongMap.Color(a,this.color.opacity);
      a = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity);
      this.object._material && (this.object._material.uniforms.color = a)
    }
  }
}
;
LongMap.Plane = function(a) {
  if (a && !(a.points && 3 > a.points.length)) {
    this.object = null;
    this.type = "primitive";
    this.vertexs = null;
    this.fillColor = Cesium.Color.fromCssColorString("#fff");
    this.fillOpacity = 0;
    this.borderColor = Cesium.Color.fromCssColorString("#fff");
    this.borderOpacity = 0;
    this.height = a.hasOwnProperty("height") ? a.height : 0;
    this.info = a.hasOwnProperty("info") ? a.info : null;
    var b = this;
    b.flat = a.flat || !1;
    b.id = a.id || null;
    b.uuid = guid();
    b.points = a.points;
    b.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    b.extrudedHeight = a.hasOwnProperty("extrudedHeight") ? a.extrudedHeight : 0;
    b.borderFeature = null;
    (function() {
        for (var d = [], e = 0; e < b.points.length; e++)
          d.push(b.points[e].spaceCoordinate);
        b.fillColor = a.fillColor || a.borderColor || new LongMap.Color("#ffffff",1);
        var c = Cesium.Color.fromCssColorString(b.fillColor.hex).withAlpha(b.fillColor.opacity);
        b.material = new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: c
            }
          }
        });
        e = new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(d),
            height: b.height,
            extrudedHeight: a.extrudedHeight || null
          })
        });
        b.vertexs = e.geometry._polygonHierarchy.positions;
        e = b.depth ? new Cesium.Primitive({
          geometryInstances: e,
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: b.material,
            flat: b.flat,
            vertexShaderSource: "attribute vec3 position3DHigh;\n\r\n\t\t\t\t\t\tattribute vec3 position3DLow;\n\r\n\t\t\t\t\t\tattribute vec2 st;\n\r\n\t\t\t\t\t\tattribute vec3 normal;\n\r\n\t\t\t\t\t\tattribute float batchId;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionMC;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\tvec4 p \x3d czm_computePosition();\n\r\n\t\t\t\t\t\tv_positionMC \x3d position3DHigh + position3DLow;\n\r\n\t\t\t\t\t\tv_normalEC \x3d czm_normal * normal;\n\r\n\t\t\t\t\t\tv_positionEC \x3d (czm_modelViewRelativeToEye * p).xyz;\n\r\n\t\t\t\t\t\tv_st \x3d st;\n\r\n\t\t\t\t\t\tgl_Position \x3d czm_modelViewProjectionRelativeToEye * p;\n\r\n\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t",
            fragmentShaderSource: "varying vec3 v_positionMC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_materialInput materialInput;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 normalEC \x3d normalize(v_normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FACE_FORWARD\n\r\n\t\t\t\t\t\t\t\t\t\t\tnormalEC \x3d faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.s \x3d v_st.s;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.st \x3d v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.str \x3d vec3(v_st, 0.0);\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.normalEC \x3d normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.tangentToEyeMatrix \x3d czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 positionToEyeEC \x3d -v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.positionToEyeEC \x3d positionToEyeEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_material material \x3d czm_getMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FLAT\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d vec4(material.diffuse + material.emission, material.alpha);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#else\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d czm_phong(normalize(positionToEyeEC), material);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t\t\t\t"
          })
        }) : new Cesium.Primitive({
          geometryInstances: e,
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: b.material,
            flat: b.flat,
            vertexShaderSource: "attribute vec3 position3DHigh;\n\r\n\t\t\t\t\t\tattribute vec3 position3DLow;\n\r\n\t\t\t\t\t\tattribute vec2 st;\n\r\n\t\t\t\t\t\tattribute vec3 normal;\n\r\n\t\t\t\t\t\tattribute float batchId;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionMC;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\tvec4 p \x3d czm_computePosition();\n\r\n\t\t\t\t\t\tv_positionMC \x3d position3DHigh + position3DLow;\n\r\n\t\t\t\t\t\tv_normalEC \x3d czm_normal * normal;\n\r\n\t\t\t\t\t\tv_positionEC \x3d (czm_modelViewRelativeToEye * p).xyz;\n\r\n\t\t\t\t\t\tv_st \x3d st;\n\r\n\t\t\t\t\t\tgl_Position \x3d czm_modelViewProjectionRelativeToEye * p;\n\r\n\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t",
            fragmentShaderSource: "varying vec3 v_positionMC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_materialInput materialInput;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 normalEC \x3d normalize(v_normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FACE_FORWARD\n\r\n\t\t\t\t\t\t\t\t\t\t\tnormalEC \x3d faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.s \x3d v_st.s;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.st \x3d v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.str \x3d vec3(v_st, 0.0);\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.normalEC \x3d normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.tangentToEyeMatrix \x3d czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 positionToEyeEC \x3d -v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.positionToEyeEC \x3d positionToEyeEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_material material \x3d czm_getMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FLAT\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d vec4(material.diffuse + material.emission, material.alpha);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#else\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d czm_phong(normalize(positionToEyeEC), material);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t\t\t\t",
            renderState: {
              depthTest: b.depth
            }
          })
        });
        a.fillColor && a.borderColor ? (b.borderColor = a.borderColor,
          c = Cesium.Color.fromCssColorString(b.borderColor.hex).withAlpha(b.borderColor.opacity),
          d = new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonOutlineGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(d),
              height: b.height,
              extrudedHeight: a.extrudedHeight || null
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(c)
            },
            id: b.uuid
          }),
        b.extrudedHeight && (d.extrudedHeight = b.extrudedHeight),
          d = b.depth ? new Cesium.Primitive({
            geometryInstances: d,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: !0
            })
          }) : new Cesium.Primitive({
            geometryInstances: d,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: !0,
              renderState: {
                depthTest: b.depth
              }
            })
          }),
          c = new Cesium.PrimitiveCollection,
          c.add(e),
          c.add(d),
          b.object = c,
          e.parentClass = b,
          d.parentClass = b,
          b.borderFeature = d) : b.object = e;
        b.object.parentClass = b
      }
    )();
    LongMap.Plane.prototype.setColor = function(a) {
      this.fillColor = a;
      a = Cesium.Color.fromCssColorString(this.fillColor.hex).withAlpha(this.fillColor.opacity);
      this.material && (this.material.uniforms.color = a)
    }
    ;
    LongMap.Plane.prototype.setBorderColor = function(a) {
      if (!this.borderFeature)
        return !1;
      this.borderColor = new LongMap.Color(a,this.borderColor.opacity);
      a = Cesium.Color.fromCssColorString(this.borderColor.hex).withAlpha(this.borderColor.opacity);
      var b = this.borderFeature.getGeometryInstanceAttributes(this.uuid);
      b && (b.color = Cesium.ColorGeometryInstanceAttribute.toValue(a))
    }
    ;
    LongMap.Plane.prototype.show = function() {
      if (this.borderFeature)
        for (var a = this.object, b = a.length, c = 0; c < b; ++c)
          a.get(c).show = !0;
      else
        this.object.show = !0
    }
    ;
    LongMap.Plane.prototype.hide = function() {
      if (this.borderFeature)
        for (var a = this.object, b = a.length, c = 0; c < b; ++c)
          a.get(c).show = !1;
      else
        this.object.show = !1
    }
    ;
    LongMap.Plane.prototype.remove = function() {
      globe = this;
      var a = globe.layer;
      if (!a)
        return !1;
      a.removeFeature(globe)
    }
  }
}
;
LongMap.Point = function(a) {
  this.object = null;
  this.type = "primitive";
  this.color = a.color || "#fff";
  this.uuid = guid();
  var b = new Cesium.PointPrimitiveCollection;
  b.add({
    position: Cesium.Cartesian3.fromDegrees(a.lon, a.lat),
    color: Cesium.Color.fromCssColorString(this.color).withAlpha(1)
  });
  this.object = b
}
;
(function(a, b) {
    "object" === typeof module && "object" === typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document)
          throw Error("EZUIPlayer requires a window with a document");
        return b(a)
      }
      : b(a)
  }
)("undefined" !== typeof window ? window : this, function(a, b) {
  function d(a) {
    var b = {
      Ver: "v.1.3.0",
      PlatAddr: "open.ys7.com",
      ExterVer: "Ez.1.3.0",
      CltType: 102,
      StartTime: (new Date).Format("yyyy-MM-dd hh:mm:ss.S"),
      OS: navigator.platform
    }, c;
    for (c in a)
      b[c] = a[c];
    a = [];
    for (var d in b)
      a.push(d + "\x3d" + b[d]);
    b = "?" + a.join("\x26")
  }
  function e(b) {
    return a.getComputedStyle ? a.getComputedStyle(b, null) : b.currentStyle
  }
  function c(a, b) {
    var c = document.createElement("script");
    c.setAttribute("src", a);
    c.onload = b;
    document.getElementsByTagName("head")[0].appendChild(c)
  }
  function f(a) {
    var b = !1
      , c = !1
      , d = 0;
    a.addEventListener("loadeddata", function() {
      b = !0
    }, !1);
    a.addEventListener("stalled", function() {
      d++;
      !c && 2 <= d && !b && (a.load(),
        a.play(),
        c = b = !1,
        d = 0)
    }, !1);
    a.addEventListener("playing", function() {
      c = !0
    })
  }
  !function(a, b) {
    function c() {
      var a = w.elements;
      return "string" == typeof a ? a.split(" ") : a
    }
    function d(a) {
      var b = r[a[m]];
      return b || (b = {},
        n++,
        a[m] = n,
        r[n] = b),
        b
    }
    function e(a, c, e) {
      if (c || (c = b),
        k)
        return c.createElement(a);
      e || (e = d(c));
      var f;
      return f = e.cache[a] ? e.cache[a].cloneNode() : p.test(a) ? (e.cache[a] = e.createElem(a)).cloneNode() : e.createElem(a),
        !f.canHaveChildren || q.test(a) || f.tagUrn ? f : e.frag.appendChild(f)
    }
    function f(a, b) {
      b.cache || (b.cache = {},
        b.createElem = a.createElement,
        b.createFrag = a.createDocumentFragment,
        b.frag = b.createFrag());
      a.createElement = function(c) {
        return w.shivMethods ? e(c, a, b) : b.createElem(c)
      }
      ;
      a.createDocumentFragment = Function("h,f", "return function(){var n\x3df.cloneNode(),c\x3dn.createElement;h.shivMethods\x26\x26(" + c().join().replace(/[\w\-:]+/g, function(a) {
        return b.createElem(a),
          b.frag.createElement(a),
        'c("' + a + '")'
      }) + ");return n}")(w, b.frag)
    }
    function g(a) {
      a || (a = b);
      var c = d(a);
      if (w.shivCSS && !h && !c.hasCSS) {
        var e, g = a;
        e = g.createElement("p");
        g = g.getElementsByTagName("head")[0] || g.documentElement;
        e = (e.innerHTML = "x\x3cstyle\x3earticle,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}\x3c/style\x3e",
          g.insertBefore(e.lastChild, g.firstChild));
        c.hasCSS = !!e
      }
      return k || f(a, c),
        a
    }
    var h, k, l = a.html5 || {}, q = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, p = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, m = "_html5shiv", n = 0, r = {};
    !function() {
      try {
        var a = b.createElement("a");
        a.innerHTML = "\x3cxyz\x3e\x3c/xyz\x3e";
        h = "hidden"in a;
        var c;
        if (!(c = 1 == a.childNodes.length)) {
          b.createElement("a");
          var d = b.createDocumentFragment();
          c = "undefined" == typeof d.cloneNode || "undefined" == typeof d.createDocumentFragment || "undefined" == typeof d.createElement
        }
        k = c
      } catch (G) {
        k = h = !0
      }
    }();
    var w = {
      elements: l.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
      version: "3.7.3",
      shivCSS: !1 !== l.shivCSS,
      supportsUnknownElements: k,
      shivMethods: !1 !== l.shivMethods,
      type: "default",
      shivDocument: g,
      createElement: e,
      createDocumentFragment: function(a, e) {
        if (a || (a = b),
          k)
          return a.createDocumentFragment();
        e = e || d(a);
        a = e.frag.cloneNode();
        e = 0;
        for (var f = c(), g = f.length; g > e; e++)
          a.createElement(f[e]);
        return a
      },
      addElements: function(a, b) {
        var c = w.elements;
        "string" != typeof c && (c = c.join(" "));
        "string" != typeof a && (a = a.join(" "));
        w.elements = c + " " + a;
        g(b)
      }
    };
    a.html5 = w;
    g(b);
    "object" == typeof module && module.exports && (module.exports = w)
  }("undefined" != typeof a ? a : this, document);
  "document"in self && ("classList"in document.createElement("_") ? function() {
    var a = document.createElement("_");
    a.classList.add("c1", "c2");
    if (!a.classList.contains("c2")) {
      var b = function(a) {
        var b = DOMTokenList.prototype[a];
        DOMTokenList.prototype[a] = function(a) {
          var c, d = arguments.length;
          for (c = 0; c < d; c++)
            a = arguments[c],
              b.call(this, a)
        }
      };
      b("add");
      b("remove")
    }
    a.classList.toggle("c3", !1);
    if (a.classList.contains("c3")) {
      var c = DOMTokenList.prototype.toggle;
      DOMTokenList.prototype.toggle = function(a, b) {
        return 1 in arguments && !this.contains(a) === !b ? b : c.call(this, a)
      }
    }
    a = null
  }() : function(a) {
    if ("Element"in a) {
      a = a.Element.prototype;
      var b = Object
        , c = String.prototype.trim || function() {
        return this.replace(/^\s+|\s+$/g, "")
      }
        , d = Array.prototype.indexOf || function(a) {
        for (var b = 0, c = this.length; b < c; b++)
          if (b in this && this[b] === a)
            return b;
        return -1
      }
        , e = function(a, b) {
        this.name = a;
        this.code = DOMException[a];
        this.message = b
      }
        , f = function(a, b) {
        if ("" === b)
          throw new e("SYNTAX_ERR","An invalid or illegal string was specified");
        if (/\s/.test(b))
          throw new e("INVALID_CHARACTER_ERR","String contains an invalid character");
        return d.call(a, b)
      }
        , g = function(a) {
        for (var b = c.call(a.getAttribute("class") || ""), b = b ? b.split(/\s+/) : [], d = 0, e = b.length; d < e; d++)
          this.push(b[d]);
        this._updateClassName = function() {
          a.setAttribute("class", this.toString())
        }
      }
        , h = g.prototype = []
        , k = function() {
        return new g(this)
      };
      e.prototype = Error.prototype;
      h.item = function(a) {
        return this[a] || null
      }
      ;
      h.contains = function(a) {
        return -1 !== f(this, a + "")
      }
      ;
      h.add = function() {
        var a = arguments, b = 0, c = a.length, d, e = !1;
        do
          d = a[b] + "",
          -1 === f(this, d) && (this.push(d),
            e = !0);
        while (++b < c);e && this._updateClassName()
      }
      ;
      h.remove = function() {
        var a = arguments, b = 0, c = a.length, d, e = !1, g;
        do
          for (d = a[b] + "",
                 g = f(this, d); -1 !== g; )
            this.splice(g, 1),
              e = !0,
              g = f(this, d);
        while (++b < c);e && this._updateClassName()
      }
      ;
      h.toggle = function(a, b) {
        a += "";
        var c = this.contains(a)
          , d = c ? !0 !== b && "remove" : !1 !== b && "add";
        if (d)
          this[d](a);
        return !0 === b || !1 === b ? b : !c
      }
      ;
      h.toString = function() {
        return this.join(" ")
      }
      ;
      if (b.defineProperty) {
        h = {
          get: k,
          enumerable: !0,
          configurable: !0
        };
        try {
          b.defineProperty(a, "classList", h)
        } catch (y) {
          -2146823252 === y.number && (h.enumerable = !1,
            b.defineProperty(a, "classList", h))
        }
      } else
        b.prototype.__defineGetter__ && a.__defineGetter__("classList", k)
    }
  }(self));
  Date.prototype.Format = function(a) {
    var b = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds()
    };
    /(y+)/.test(a) && (a = a.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
    for (var c in b)
      (new RegExp("(" + c + ")")).test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? b[c] : ("00" + b[c]).substr(("" + b[c]).length)));
    return a
  }
  ;
  var h = "https:" === location.protocol ? !0 : !1
    , l = !!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i)
    , g = document.createElement("video")
    , k = !!g.canPlayType && !!a.addEventListener
    , p = k && g.canPlayType("application/vnd.apple.mpegURL")
    , m = !1;
  d({
    systemName: "open_netstream_localinfo"
  });
  var n = /^rtmp/
    , g = function(a) {
    var b = a.id;
    if (!k)
      throw Error("\u4e0d\u652f\u6301ie8\u7b49\u4f4e\u7248\u672c\u6d4f\u89c8\u5668");
    if ("string" !== typeof b)
      throw Error("EZUIPlayer requires parameter videoId");
    this.videoId = b;
    this.video = a;
    if (!this.video)
      throw Error("EZUIPlayer requires parameter videoId");
    this.opt = {};
    this.opt.sources = [];
    a = this.video.getElementsByTagName("source");
    a = Array.prototype.slice.call(a, 0);
    this.video.src && (l && n.test(this.video.src) ? (this.video.removeAttribute("src"),
      this.video.load()) : this.opt.sources.push(this.video.src));
    var c = a.length;
    if (0 < c)
      for (var f = 0; f < c; f++)
        l && n.test(a[f].src) ? this.video.removeChild(a[f]) : this.opt.sources.push(a[f].src);
    if (1 > this.opt.sources.length)
      throw Error("no source found in video tag.");
    this.opt.cur = 0;
    this.handlers = {};
    this.opt.poster = this.video.poster;
    a = e(this.video);
    c = this.video.width;
    f = this.video.height;
    c ? (this.opt.width = c,
      this.opt.height = f ? f : "auto",
      this.log("video width:" + this.opt.width + " height:" + this.opt.height)) : (this.opt.width = a.width,
      this.opt.height = a.height,
      this.log("videoStyle.width:" + a.width + " wideoStyle.height:" + a.height));
    this.opt.parentId = b;
    this.opt.autoplay = this.video.autoplay ? !0 : !1;
    this.log("autoplay:" + this.video.autoplay);
    this.tryPlay();
    this.initTime = (new Date).getTime();
    this.on("play", function() {
      d({
        systemName: "open_netstream_play_main",
        playurl: this.opt.currentSource,
        Time: (new Date).Format("yyyy-MM-dd hh:mm:ss.S"),
        Enc: 0,
        PlTp: 1,
        Via: 2,
        ErrCd: 0,
        Cost: (new Date).getTime() - this.initTime
      })
    });
    this.retry = 2;
    this.on("error", function() {
      d({
        systemName: "open_netstream_play_main",
        playurl: this.opt.currentSource,
        cost: -1,
        ErrCd: -1
      })
    })
  };
  g.prototype.on = function(a, b) {
    "string" === typeof a && "function" === typeof b && ("undefined" === typeof this.handlers[a] && (this.handlers[a] = []),
      this.handlers[a].push(b))
  }
  ;
  g.prototype.emit = function() {
    if (this.handlers[arguments[0]]instanceof Array)
      for (var a = this.handlers[arguments[0]], b = a.length, c = 0; c < b; c++)
        a[c].apply(this, Array.prototype.slice.call(arguments, 1))
  }
  ;
  g.prototype.tryPlay = function() {
    this.opt.currentSource = this.opt.sources[this.opt.cur];
    if (this.opt.currentSource) {
      var a = this;
      /\.m3u8/.test(this.opt.currentSource) ? l || p ? (this.log("\u4f7f\u7528\u539f\u751fvideo"),
        this.video.style.heght = this.opt.height = 9 * Number(this.opt.width.replace(/px$/g, "")) / 16 + "px",
        this.initVideoEvent()) : h ? c("https://open.ys7.com/sdk/js/1.3/ckplayer/ckplayer.js", function() {
        a.initCKPlayer()
      }) : c("https://open.ys7.com/sdk/js/1.3/hls.min.js", function() {
        (m = Hls.isSupported()) ? (a.log("\u4f7f\u7528hls.js"),
          a.initHLS()) : (a.log("2 \u4f7f\u7528flash"),
          c("https://open.ys7.com/sdk/js/1.3/ckplayer/ckplayer.js", function() {
            a.initCKPlayer()
          }))
      }) : /^rtmp:/.test(this.opt.currentSource) && (l ? (this.opt.cur++,
        this.tryPlay()) : c("https://open.ys7.com/sdk/js/1.3/ckplayer/ckplayer.js", function() {
        a.initCKPlayer()
      }))
    } else
      this.log("\u672a\u627e\u5230\u5408\u9002\u7684\u64ad\u653eURL")
  }
  ;
  g.prototype.initHLS = function() {
    var a = this
      , b = new Hls({
      defaultAudioCodec: "mp4a.40.2"
    });
    b.loadSource(this.opt.currentSource);
    b.attachMedia(this.video);
    b.on(Hls.Events.MANIFEST_PARSED, function() {
      a.opt.autoplay && a.video.play();
      a.initVideoEvent()
    });
    b.on(Hls.Events.ERROR, function(a, c) {
      if (c.fatal)
        switch (c.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log();
            b.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log();
            b.recoverMediaError();
            break;
          default:
            b.destroy()
        }
    });
    this.hls = b
  }
  ;
  g.prototype.log = function(a) {
    this.emit("log", a)
  }
  ;
  g.prototype.initCKPlayer = function() {
    this.log("ckplayer\u521d\u59cb\u5316");
    var b = this
      , c = {
      play: function() {
        b.emit("play")
      },
      pause: function() {
        b.emit("pause")
      },
      error: function() {
        b.emit("error")
      }
    };
    a.ckplayer_status = function() {
      b.log(arguments);
      c[arguments[0]] && c[arguments[0]]()
    }
    ;
    this.videoFlash = document.createElement("DIV");
    this.video.parentNode.replaceChild(this.videoFlash, this.video);
    this.video = this.videoFlash;
    this.videoFlash.id = this.opt.parentId;
    var d = null
      , d = /^rtmp/.test(this.opt.currentSource) ? {
      f: this.opt.currentSource,
      c: 0,
      p: this.opt.autoplay ? 1 : 0,
      i: this.opt.poster,
      lv: 1,
      loaded: "loadHandler"
    } : /\.m3u8/.test(this.opt.currentSource) ? {
      s: 4,
      f: "https://open.ys7.com/sdk/js/1.3/ckplayer/m3u8.swf",
      a: this.opt.currentSource,
      c: 0,
      lv: 1,
      p: this.opt.autoplay ? 1 : 0,
      i: this.opt.poster,
      loaded: "loadHandler"
    } : {
      f: this.opt.currentSource,
      c: 0,
      p: 1,
      loaded: "loadHandler"
    };
    this.flashId = this.opt.parentId + "flashId";
    CKobject.embedSWF("https://open.ys7.com/sdk/js/1.3/ckplayer/ckplayer.swf", this.opt.parentId, this.flashId, this.opt.width, this.opt.height, d, {
      bgcolor: "#FFF",
      allowFullScreen: !0,
      allowScriptAccess: "always",
      wmode: "transparent"
    })
  }
  ;
  g.prototype.initVideoEvent = function() {
    var a = this, b = {
      loadstart: function(b) {
        a.log("loadstart...\u5f53\u6d4f\u89c8\u5668\u5f00\u59cb\u67e5\u627e\u97f3\u9891/\u89c6\u9891\u65f6...");
        a.emit("loadstart", b)
      },
      durationchange: function(b) {
        a.log("durationchange...\u5f53\u97f3\u9891/\u89c6\u9891\u7684\u65f6\u957f\u5df2\u66f4\u6539\u65f6...");
        a.emit("durationchange", b)
      },
      loadedmetadata: function(b) {
        a.log("loadedmetadata...\u5f53\u6d4f\u89c8\u5668\u5df2\u52a0\u8f7d\u97f3\u9891/\u89c6\u9891\u7684\u5143\u6570\u636e\u65f6...");
        a.emit("loadedmetadata", b)
      },
      loadeddata: function(b) {
        a.log("loadeddata...\u5f53\u6d4f\u89c8\u5668\u5df2\u52a0\u8f7d\u97f3\u9891/\u89c6\u9891\u7684\u5f53\u524d\u5e27\u65f6...");
        a.emit("loadeddata", b)
      },
      progress: function(b) {
        a.log("progress...\u5f53\u6d4f\u89c8\u5668\u6b63\u5728\u4e0b\u8f7d\u97f3\u9891/\u89c6\u9891\u65f6...");
        a.emit("progress", b)
      },
      canplay: function(b) {
        a.log("canplay...\u5f53\u6d4f\u89c8\u5668\u53ef\u4ee5\u64ad\u653e\u97f3\u9891/\u89c6\u9891\u65f6...");
        a.emit("canplay", b)
      },
      canplaythrough: function(b) {
        a.log("canplaythrough...\u5f53\u6d4f\u89c8\u5668\u53ef\u5728\u4e0d\u56e0\u7f13\u51b2\u800c\u505c\u987f\u7684\u60c5\u51b5\u4e0b\u8fdb\u884c\u64ad\u653e\u65f6...");
        a.emit("canplaythrough", b)
      },
      abort: function(b) {
        a.log("abort...\u5f53\u97f3\u9891/\u89c6\u9891\u7684\u52a0\u8f7d\u5df2\u653e\u5f03\u65f6...");
        a.emit("abort", b)
      },
      emptied: function(b) {
        a.log("emptied...\u5f53\u76ee\u524d\u7684\u64ad\u653e\u5217\u8868\u4e3a\u7a7a\u65f6...");
        a.emit("emptied", b)
      },
      ended: function(b) {
        a.log("ended...\u5f53\u76ee\u524d\u7684\u64ad\u653e\u5217\u8868\u5df2\u7ed3\u675f\u65f6...");
        a.emit("ended", b)
      },
      pause: function(b) {
        a.log("pause...\u5f53\u97f3\u9891/\u89c6\u9891\u5df2\u6682\u505c\u65f6...");
        a.emit("pause", b)
      },
      play: function(b) {
        a.log("play...\u5f53\u97f3\u9891/\u89c6\u9891\u5df2\u5f00\u59cb\u6216\u4e0d\u518d\u6682\u505c\u65f6...");
        a.emit("play", b)
      },
      playing: function(b) {
        a.log("playing...\u5f53\u97f3\u9891/\u89c6\u9891\u5728\u5df2\u56e0\u7f13\u51b2\u800c\u6682\u505c\u6216\u505c\u6b62\u540e\u5df2\u5c31\u7eea\u65f6...");
        a.emit("playing", b)
      },
      ratechange: function(b) {
        a.log("ratechange...\u5f53\u97f3\u9891/\u89c6\u9891\u7684\u64ad\u653e\u901f\u5ea6\u5df2\u66f4\u6539\u65f6...");
        a.emit("ratechange", b)
      },
      seeked: function(b) {
        a.log("seeked...\u5f53\u7528\u6237\u5df2\u79fb\u52a8/\u8df3\u8dc3\u5230\u97f3\u9891/\u89c6\u9891\u4e2d\u7684\u65b0\u4f4d\u7f6e\u65f6...");
        a.emit("seeked", b)
      },
      seeking: function(b) {
        a.log("seeking...\u5f53\u7528\u6237\u5f00\u59cb\u79fb\u52a8/\u8df3\u8dc3\u5230\u97f3\u9891/\u89c6\u9891\u4e2d\u7684\u65b0\u4f4d\u7f6e\u65f6...");
        a.emit("seeking", b)
      },
      stalled: function(b) {
        a.log("stalled...\u5f53\u6d4f\u89c8\u5668\u5c1d\u8bd5\u83b7\u53d6\u5a92\u4f53\u6570\u636e\uff0c\u4f46\u6570\u636e\u4e0d\u53ef\u7528\u65f6...");
        a.emit("stalled", b)
      },
      suspend: function(b) {
        a.log("suspend...\u5f53\u6d4f\u89c8\u5668\u523b\u610f\u4e0d\u83b7\u53d6\u5a92\u4f53\u6570\u636e\u65f6...");
        a.emit("suspend", b);
        a.opt.autoplay && a.video.play()
      },
      timeupdate: function(b) {
        a.emit("timeupdate", b)
      },
      volumechange: function(b) {
        a.log("volumechange...\u5f53\u97f3\u91cf\u5df2\u66f4\u6539\u65f6...");
        a.emit("volumechange", b)
      },
      waiting: function(b) {
        a.log("waiting...\u5f53\u89c6\u9891\u7531\u4e8e\u9700\u8981\u7f13\u51b2\u4e0b\u4e00\u5e27\u800c\u505c\u6b62...");
        a.emit("waiting", b)
      },
      error: function(b) {
        a.log("error...\u5f53\u5728\u97f3\u9891/\u89c6\u9891\u52a0\u8f7d\u671f\u95f4\u53d1\u751f\u9519\u8bef\u65f6...");
        a.emit("error", b)
      }
    }, c;
    for (c in b)
      this.video.addEventListener(c, b[c], !1);
    f(this.video)
  }
  ;
  g.prototype.play = function() {
    this.opt.autoplay = !0;
    a.CKobject ? CKobject.getObjectById(this.flashId).videoPlay() : this.video && this.video.play()
  }
  ;
  g.prototype.pause = function() {
    this.opt.autoplay = !1;
    a.CKobject ? CKobject.getObjectById(this.flashId).videoPause() : this.video && this.video.pause()
  }
  ;
  g.prototype.load = function() {
    a.CKobject || this.video && this.video.load()
  }
  ;
  b || (a.EZUIPlayer = g);
  return g
});
LongMap.Video = function(a) {
  if (!a.points || a.points && 3 > a.points.length || !a.url)
    return !1;
  this.object = null;
  this.type = "entitie";
  this.video = null;
  this.height = a.height;
  this.angle = a.angle || 0;
  this.currentTime = this.duration = 0;
  this.url = null;
  var b = this;
  b.points = a.points;
  b.uuid = guid();
  (function() {
      var d = document.createElement("video");
      d.width = 200;
      d.height = 200;
      d.autoplay = "autoplay";
      d.loop = "loop";
      d.controls = "controls";
      var e = document.createElement("source");
      e.src = a.url;
      b.url = e.src;
      document.body.appendChild(d);
      d.style.display = "none";
      for (var c = [], f = 0; f < b.points.length; f++)
        c.push(b.points[f].spaceCoordinate);
      var h = {
        id: a.id,
        polygon: {
          hierarchy: c,
          material: d,
          height: b.height,
          stRotation: b.angle * Math.PI / 180
        }
      };
      d.appendChild(e);
      var l = setInterval(function() {
        h.id && (d.id = h.id,
          new EZUIPlayer(d),
          b.video = d,
          clearInterval(l),
          l = null)
      }, 10);
      b.object = h
    }
  )();
  LongMap.Video.prototype.play = function() {
    this.video.play()
  }
  ;
  LongMap.Video.prototype.pause = function() {
    this.video.pause()
  }
  ;
  LongMap.Video.prototype.getDuration = function() {
    return this.video.duration
  }
  ;
  LongMap.Video.prototype.getCurrentTime = function() {
    return this.video.currentTime
  }
  ;
  LongMap.Video.prototype.rate = function(a) {
    1 >= a ? a = 1 : 10 <= a && (a = 10);
    this.video.playbackRate = a
  }
  ;
  LongMap.Video.prototype.fastForward = function() {
    var a = this.getCurrentTime() + 10;
    parseInt(a) >= this.getDuration() ? this.video.currentTime = this.getDuration() : this.video.currentTime = parseInt(a)
  }
  ;
  LongMap.Video.prototype.fastBackward = function() {
    var a = this.getCurrentTime() - 10;
    0 >= parseInt(a) ? this.video.currentTime = 0 : this.video.currentTime = parseInt(a)
  }
  ;
  LongMap.Video.prototype.setCurrentTime = function(a) {
    this.video.currentTime = a
  }
}
;
LongMap.Circular = function(a) {
  if (!a.position || !a.radius)
    return !1;
  this.object = null;
  this.type = "primitive";
  this.color = a.color || "#fff";
  this.uuid = guid();
  var b = new Cesium.GeometryInstance({
    geometry: new Cesium.EllipseGeometry({
      center: Cesium.Cartesian3.fromDegrees(a.position.lon, a.position.lat),
      semiMinorAxis: a.radius,
      semiMajorAxis: a.radius,
      extrudedHeight: a.extrudedHeight || 0,
      height: a.height
    }),
    id: a.id || ""
  });
  this.object = new Cesium.Primitive({
    geometryInstances: b,
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: "Color",
          uniforms: {
            color: Cesium.Color.fromCssColorString(this.color).withAlpha(a.opacity || 1)
          }
        }
      })
    })
  })
}
;
LongMap.Text = function(a) {
  if (!a.text)
    return !1;
  this.object = null;
  this.type = "primitive";
  this.color = a.color || new LongMap.Color("#fff",1);
  this.scale = a.scale || 1;
  this.font = a.font || 16;
  this.uuid = guid();
  this.offset = a.offset ? new Cesium.Cartesian2(a.offset.x,a.offset.y) : new Cesium.Cartesian2(0,0);
  this.text = a.text;
  this.position = a.position;
  var b = new Cesium.LabelCollection;
  a = {
    position: a.position.spaceCoordinate,
    text: a.text,
    font: this.font + "px sans-serif",
    fillColor: Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity),
    scale: this.scale,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    pixelOffset: this.offset
  };
  b.add(a);
  this.object = b;
  this.object.parentClass = this
}
;
LongMap.Text.prototype = {
  setText: function(a) {
    0 < this.object._labels.length && (this.object._labels[0].text = a)
  },
  setColor: function(a) {
    this.color = a || this.color;
    0 < this.object._labels.length && (this.object._labels[0].fillColor = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity))
  },
  setScale: function(a) {
    this.scale = a || this.scale;
    0 < this.object._labels.length && (this.object._labels[0].scale = this.scale)
  },
  show: function() {
    0 < this.object._labels.length && (this.object._labels[0].show = !0)
  },
  hide: function() {
    0 < this.object._labels.length && (this.object._labels[0].show = !1)
  },
  setFont: function(a) {
    this.font = a || this.font;
    0 < this.object._labels.length && (this.object._labels[0].font = this.font + "px sans-serif")
  },
  setOffset: function(a) {
    this.offset = a || this.offset;
    0 < this.object._labels.length && (this.object._labels[0].pixelOffset = new Cesium.Cartesian2(this.offset.x,this.offset.y))
  },
  setPosition: function(a) {
    this.position = a || this.position;
    0 < this.object._labels.length && (this.object._labels[0].position = this.position.vector())
  },
  remove: function() {
    globe = this;
    var a = globe.layer;
    if (!a)
      return !1;
    a.removeFeature(globe)
  }
};
LongMap.Circle = function(a) {
  if (!a.radius)
    return !1;
  this.object = null;
  this.type = "primitive";
  this.center = null;
  this.position = a.position;
  this.info = a.info || null;
  this.depth = a.hasOwnProperty("depth") ? a.depth : !0;
  this.uuid = guid();
  this.fillColor = a.fillColor || new LongMap.Color("#ffffff",0);
  var b = Cesium.Color.fromCssColorString(this.fillColor.hex).withAlpha(this.fillColor.opacity)
    , d = new Cesium.GeometryInstance({
    geometry: new Cesium.EllipseGeometry({
      center: this.position.spaceCoordinate,
      semiMinorAxis: a.radius,
      semiMajorAxis: a.radius,
      extrudedHeight: a.extrudedHeight || 0,
      height: a.height || 0
    })
  });
  this.center = d.geometry._center;
  d = this.depth ? new Cesium.Primitive({
    geometryInstances: d,
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: "Color",
          uniforms: {
            color: b
          }
        }
      })
    })
  }) : new Cesium.Primitive({
    geometryInstances: d,
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: "Color",
          uniforms: {
            color: b
          }
        }
      }),
      renderState: {
        depthTest: this.depth
      }
    })
  });
  a.borderColor ? (this.borderColor = a.borderColor,
    b = Cesium.Color.fromCssColorString(this.borderColor.hex).withAlpha(this.borderColor.opacity),
    a = new Cesium.GeometryInstance({
      geometry: new Cesium.EllipseOutlineGeometry({
        center: this.position.spaceCoordinate,
        semiMinorAxis: a.radius,
        semiMajorAxis: a.radius,
        extrudedHeight: a.extrudedHeight || 0,
        height: a.height || 0
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(b)
      }
    }),
    a = this.depth ? new Cesium.Primitive({
      geometryInstances: a,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: !0
      })
    }) : new Cesium.Primitive({
      geometryInstances: a,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: !0,
        renderState: {
          depthTest: this.depth
        }
      })
    }),
    b = new Cesium.PrimitiveCollection,
    b.add(d),
    b.add(a),
    this.object = b) : this.object = d;
  this.object.parentClass = this
}
;
LongMap.Circle.prototype = {
  setColor: function(a) {
    this.fillColor = a;
    a = Cesium.Color.fromCssColorString(this.fillColor.hex).withAlpha(this.fillColor.opacity);
    var b = this.object;
    b.get ? b.get(0)._material.uniforms.color = a : b._material.uniforms.color = a
  },
  setBorderColor: function(a) {},
  show: function() {
    if (this.borderFeature)
      for (var a = this.object, b = a.length, d = 0; d < b; ++d)
        a.get(d).show = !0;
    else
      this.object.show = !0
  },
  hide: function() {
    if (this.borderFeature)
      for (var a = this.object, b = a.length, d = 0; d < b; ++d)
        a.get(d).show = !1;
    else
      this.object.show = !1
  },
  remove: function() {
    globe = this;
    var a = globe.layer;
    if (!a)
      return !1;
    a.removeFeature(globe)
  }
};
  , Water = function(a) {
  !a.points || 3 > a.points.length ? console.error("missing parameter") : (this.points = a.points,
    this.object = null,
    this.frequency = a.hasOwnProperty("frequency") ? a.frequency : 200,
    this.animationSpeed = a.hasOwnProperty("animationSpeed") ? a.animationSpeed : .05,
    this.amplitude = a.hasOwnProperty("amplitude") ? a.amplitude : 3E3,
    this.specularIntensity = a.hasOwnProperty("specularIntensity") ? a.specularIntensity : .1,
    this.baseWaterColor = a.hasOwnProperty("baseWaterColor") ? a.baseWaterColor : new LongMap.Color("#8ee7f8",1),
    this.rePaint())
};
Water.prototype = {
  type: "primitive",
  rePaint: function() {
    for (var a = [], b = 0; b < this.points.length; b++)
      a.push(this.points[b].lon, this.points[b].lat);
    a = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(a)),
          vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        })
      }),
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: !0,
        fragmentShaderSource: "varying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\nvoid main()\n{\nczm_materialInput materialInput;\nvec3 normalEC \x3d normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC \x3d faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n#endif\nmaterialInput.s \x3d v_st.s;\nmaterialInput.st \x3d v_st;\nmaterialInput.str \x3d vec3(v_st, 0.0);\nmaterialInput.normalEC \x3d normalEC;\nmaterialInput.tangentToEyeMatrix \x3d czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\nvec3 positionToEyeEC \x3d -v_positionEC;\nmaterialInput.positionToEyeEC \x3d positionToEyeEC;\nczm_material material \x3d czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor \x3d vec4(material.diffuse + material.emission, material.alpha);\n#else\ngl_FragColor \x3d czm_phong(normalize(positionToEyeEC), material);gl_FragColor.a\x3d0.4;\n#endif\n}\n"
      }),
      show: !0
    });
    a.appearance.material = new Cesium.Material({
      fabric: {
        type: "Water",
        uniforms: {
          normalMap: waterTexture,
          frequency: this.frequency || 200,
          animationSpeed: this.animationSpeed || .05,
          amplitude: this.amplitude || 3E3,
          specularIntensity: this.specularIntensity || .1,
          baseWaterColor: Cesium.Color.fromCssColorString(this.baseWaterColor.hex).withAlpha(this.baseWaterColor.opacity)
        }
      }
    });
    this.object = a
  },
  remove: function() {
    this.layer && this.layer.removeFeature(this)
  }
};
LongMap.Water = Water;
LongMap.Water3 = function() {
  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      aboveGround: !0
    }),
    show: !0
  })).appearance.material = new Cesium.Material({
    fabric: {
      type: "Water",
      uniforms: {
        specularMap: "../images/earthspec1k.jpg",
        normalMap: "../images/waterNormals.jpg",
        frequency: 1E4,
        animationSpeed: .01,
        amplitude: 1
      }
    }
  });
  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([111.48894522023063, 32.55843610413914, 111.48869238776277, 32.55602570974643, 111.49004745721604, 32.5548361448687, 111.49250635559537, 32.5526581917131, 111.49401017612676, 32.55129837476868, 111.49557557543416, 32.549965127681524, 111.49805874806115, 32.550219820173126, 111.49881935514881, 32.550823388219456, 111.49893286824275, 32.55195597852755, 111.4983164393889, 32.5535655841798, 111.49817521853979, 32.554570336381104, 111.49914284747027, 32.55554277243855, 111.49967950821859, 32.555814392110264, 111.50062151969038, 32.556517275179836, 111.50149914222958, 32.55731250438687, 111.50207800636986, 32.55757396515373, 111.50386396090245, 32.55781206769338, 111.50391371888884, 32.559650818164926, 111.50077307397399, 32.56013340913413, 111.49625702141412, 32.560250133340446, 111.49171532588734, 32.560183453792156, 111.48920373670329, 32.56015020231049, 111.48844043918616, 32.55981856869106, 111.48743657311691, 32.55945303779285, 111.48760383414758, 32.55863069835514, 111.48812831262538, 32.55837951411848])),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      aboveGround: !0
    }),
    show: !0
  })).appearance.material = new Cesium.Material({
    fabric: {
      type: "Water",
      uniforms: {
        normalMap: "../images/waterNormals.jpg",
        frequency: 1E4,
        animationSpeed: .01,
        amplitude: 50
      }
    }
  })
}
;
LongMap.Rectangle = function(a) {
  this.points = a.points;
  this.fillColor = a.fillColor || new LongMap.Color("#ffffff",1);
  this.borderColor = a.borderColor || null;
  this.lineWidth = a.lineWidth || 0;
  this.heigt = a.height || 0;
  this.extrudedHeight = a.extrudedHeight || 0;
  this.depth = a.depth || !0;
  this.uuid = guid();
  this.init()
}
;
LongMap.Rectangle.prototype = {
  type: "primitive",
  init: function() {
    var a = this.points[0].lon
      , b = this.points[0].lat
      , d = this.points[1].lon
      , e = this.points[1].lat;
    if (a > d)
      var c = d
        , d = a
        , a = c;
    b > e && (c = e,
      e = b,
      b = c);
    var c = new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle: Cesium.Rectangle.fromDegrees(a, b, d, e),
        height: this.heigt,
        extrudedHeight: this.extrudedHeight
      })
    })
      , f = Cesium.Color.fromCssColorString(this.fillColor.hex).withAlpha(this.fillColor.opacity)
      , f = new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: "Color",
          uniforms: {
            color: f
          }
        }
      })
    })
      , c = new Cesium.Primitive({
      geometryInstances: c,
      appearance: f
    });
    this.fillColor && this.borderColor ? (f = Cesium.Color.fromCssColorString(this.borderColor.hex).withAlpha(this.borderColor.opacity),
      a = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleOutlineGeometry({
          ellipsoid: Cesium.Ellipsoid.WGS84,
          rectangle: Cesium.Rectangle.fromDegrees(a, b, d, e),
          height: this.heigt,
          extrudedHeight: this.extrudedHeight
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(f)
        }
      }),
      a = this.depth ? new Cesium.Primitive({
        geometryInstances: a,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: !0
        })
      }) : new Cesium.Primitive({
        geometryInstances: a,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: !0,
          renderState: {
            depthTest: this.depth
          }
        })
      }),
      b = new Cesium.PrimitiveCollection,
      b.add(c),
      b.add(a),
      this.object = b,
      c.parentClass = this,
      a.parentClass = this) : this.object = c;
    this.object.parentClass = this
  },
  setColor: function(a) {
    this.fillColor = a;
    a = Cesium.Color.fromCssColorString(this.fillColor.hex).withAlpha(this.fillColor.opacity);
    var b = this.object;
    b.get ? b.get(0)._material.uniforms.color = a : b._material.uniforms.color = a
  },
  setBorderColor: function(a) {},
  show: function() {
    if (this.borderFeature)
      for (var a = this.object, b = a.length, d = 0; d < b; ++d)
        a.get(d).show = !0;
    else
      this.object.show = !0
  },
  hide: function() {
    if (this.borderFeature)
      for (var a = this.object, b = a.length, d = 0; d < b; ++d)
        a.get(d).show = !1;
    else
      this.object.show = !1
  },
  remove: function() {
    globe = this;
    var a = globe.layer;
    if (!a)
      return !1;
    a.removeFeature(globe)
  }
};
var czml1 = [{
  id: "document",
  version: "1.0"
}]
  , czml_piece1 = {
  id: "test",
  availability: "2019-11-11T11:00:00Z/2019-11-11T12:04:54.9962195740191Z",
  orientation: {
    velocityReference: "#position"
  },
  path: {
    material: {
      solidColor: {
        color: {
          interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
          rgba: [0, 0, 255, 80]
        }
      }
    },
    width: [{
      interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
      number: 2
    }],
    show: [{
      interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
      "boolean": !0
    }]
  },
  position: {
    interpolationAlgorithm: "LAGRANGE",
    interpolationDegree: 1,
    epoch: "2019-11-11T11:00:00Z",
    cartographicDegrees: []
  }
}
  , czml_model1 = {
  gltf: "",
  minimumPixelSize: 2,
  maximumScale: 1,
  scale: .05
}
  , Car = function(a) {
  this.map = null;
  this.id = Math.random().toString(36).substr(2);
  console.log();
  this.points = a.points;
  this.piece = a.piece;
  this.speed = a.speed || 1E3;
  this.maxTimer = 0;
  this.onload = null;
  this.height = a.hasOwnProperty("height") ? a.height : 0;
  this.dataSourcePromise = null
};
Car.prototype = {
  init: function() {
    var a = this;
    if (this.map) {
      for (var b = JSON.parse(JSON.stringify(czml1)), d = 0; d < a.piece.length; d++) {
        if (a.piece[d].route) {
          for (var e = [], c = 0, f = 0; f < a.piece[d].route.length - 1; f++)
            c += a.piece[d].route[f].distanceTo(a.piece[d].route[f + 1]);
          e.push(0, a.piece[d].route[0].lon, a.piece[d].route[0].lat, a.piece[d].route[0].z + this.height);
          c = 0;
          for (f = 1; f < a.piece[d].route.length; f++) {
            var h = a.piece[d].route[f - 1].distanceTo(a.piece[d].route[f]);
            if (5 >= h && a.piece[d].route[f + 1]) {
              var c = c + (a.piece[d].intervalTime || 100)
                , h = a.piece[d].route[f].vector()
                , l = a.piece[d].route[f + 1].vector()
                , l = new Cesium.Cartesian3(l.x - h.x,l.y - h.y,l.z - h.z)
                , l = Cesium.Cartesian3.normalize(l, l);
              h.x += l.x;
              h.y += l.y;
              h.z += l.z;
              h = (new LongMap.Point3(0,0,0)).fromVector(h);
              e.push(c, h.lon, h.lat, h.z + this.height)
            } else
              c += h,
                e.push(c, a.piece[d].route[f].lon, a.piece[d].route[f].lat, a.piece[d].route[f].z + this.height);
            a.maxTimer = c > a.maxTimer ? c : a.maxTimer
          }
        }
        f = JSON.parse(JSON.stringify(czml_piece1));
        a.piece[d].model && (c = JSON.parse(JSON.stringify(czml_model1)),
          c.gltf = a.piece[d].model.url,
          c.scale = a.piece[d].model.scale || .04,
          c.minimumPixelSize = a.piece[d].model.minimumPixelSize || 2,
          c.maximumScale = a.piece[d].model.maximumScale || 1,
          f.model = c);
        f.id = "car_" + d;
        f.position.cartographicDegrees = e;
        b.push(f)
      }
      h = Cesium.CzmlDataSource.load(b);
      this.dataSourcePromise && a.onload && a.onload(a);
      h.then(function(b) {
        a.dataSourcePromise = b;
        a.onload && a.onload(a)
      });
      this.map.dataSources.add(this.dataSourcePromise)
    } else
      console.error("\u64cd\u4f5c\u4e0d\u6b63\u786e")
  },
  remove: function() {
    this.dataSourcePromise.entities.removeAll();
    this.map.dataSources.remove(this.dataSourcePromise);
    this.map = null
  },
  play: function() {},
  cause: function() {}
};
LongMap.Car = Car;
LongMap.Wall = function(a) {
  if (a && !(a.points && 2 > a.points.length)) {
    this.object = null;
    this.type = "primitive";
    this.vertexs = null;
    this.fillColor = Cesium.Color.fromCssColorString("#fff");
    this.fillOpacity = 0;
    this.borderColor = Cesium.Color.fromCssColorString("#fff");
    this.borderOpacity = 0;
    this.height = a.hasOwnProperty("height") ? a.height : 0;
    this.info = a.hasOwnProperty("info") ? a.info : null;
    var b = this;
    b.flat = a.flat || !1;
    b.id = a.id || null;
    b.width = a.width;
    b.uuid = guid();
    b.points = a.points;
    b.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    b.extrudedHeight = a.hasOwnProperty("extrudedHeight") ? a.extrudedHeight : 0;
    (function() {
        for (var d = [], e = 0; e < b.points.length; e++)
          d.push(b.points[e].spaceCoordinate);
        b.fillColor = a.fillColor || a.borderColor || new LongMap.Color("#ffffff",1);
        var c = Cesium.Color.fromCssColorString(b.fillColor.hex).withAlpha(b.fillColor.opacity);
        b.material = new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: c
            }
          }
        });
        e = new Cesium.GeometryInstance({
          geometry: new Cesium.CorridorGeometry({
            positions: d,
            height: b.height,
            width: b.width,
            extrudedHeight: a.extrudedHeight || null
          })
        });
        b.vertexs = e.geometry._positions;
        e = b.depth ? new Cesium.Primitive({
          geometryInstances: e,
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: b.material,
            flat: b.flat,
            vertexShaderSource: "attribute vec3 position3DHigh;\n\r\n\t\t\t\t\t\tattribute vec3 position3DLow;\n\r\n\t\t\t\t\t\tattribute vec2 st;\n\r\n\t\t\t\t\t\tattribute vec3 normal;\n\r\n\t\t\t\t\t\tattribute float batchId;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionMC;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\tvec4 p \x3d czm_computePosition();\n\r\n\t\t\t\t\t\tv_positionMC \x3d position3DHigh + position3DLow;\n\r\n\t\t\t\t\t\tv_normalEC \x3d czm_normal * normal;\n\r\n\t\t\t\t\t\tv_positionEC \x3d (czm_modelViewRelativeToEye * p).xyz;\n\r\n\t\t\t\t\t\tv_st \x3d st;\n\r\n\t\t\t\t\t\tgl_Position \x3d czm_modelViewProjectionRelativeToEye * p;\n\r\n\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t",
            fragmentShaderSource: "varying vec3 v_positionMC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_materialInput materialInput;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 normalEC \x3d normalize(v_normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FACE_FORWARD\n\r\n\t\t\t\t\t\t\t\t\t\t\tnormalEC \x3d faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.s \x3d v_st.s;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.st \x3d v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.str \x3d vec3(v_st, 0.0);\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.normalEC \x3d normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.tangentToEyeMatrix \x3d czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 positionToEyeEC \x3d -v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.positionToEyeEC \x3d positionToEyeEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_material material \x3d czm_getMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FLAT\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d vec4(material.diffuse + material.emission, material.alpha);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#else\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d czm_phong(normalize(positionToEyeEC), material);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t\t\t\t"
          })
        }) : new Cesium.Primitive({
          geometryInstances: e,
          appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: b.material,
            flat: b.flat,
            vertexShaderSource: "attribute vec3 position3DHigh;\n\r\n\t\t\t\t\t\tattribute vec3 position3DLow;\n\r\n\t\t\t\t\t\tattribute vec2 st;\n\r\n\t\t\t\t\t\tattribute vec3 normal;\n\r\n\t\t\t\t\t\tattribute float batchId;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionMC;\n\r\n\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\tvec4 p \x3d czm_computePosition();\n\r\n\t\t\t\t\t\tv_positionMC \x3d position3DHigh + position3DLow;\n\r\n\t\t\t\t\t\tv_normalEC \x3d czm_normal * normal;\n\r\n\t\t\t\t\t\tv_positionEC \x3d (czm_modelViewRelativeToEye * p).xyz;\n\r\n\t\t\t\t\t\tv_st \x3d st;\n\r\n\t\t\t\t\t\tgl_Position \x3d czm_modelViewProjectionRelativeToEye * p;\n\r\n\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t",
            fragmentShaderSource: "varying vec3 v_positionMC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec3 v_normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvarying vec2 v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvoid main()\n\r\n\t\t\t\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_materialInput materialInput;\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 normalEC \x3d normalize(v_normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FACE_FORWARD\n\r\n\t\t\t\t\t\t\t\t\t\t\tnormalEC \x3d faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.s \x3d v_st.s;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.st \x3d v_st;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.str \x3d vec3(v_st, 0.0);\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.normalEC \x3d normalEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.tangentToEyeMatrix \x3d czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n\r\n\t\t\t\t\t\t\t\t\t\t\tvec3 positionToEyeEC \x3d -v_positionEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tmaterialInput.positionToEyeEC \x3d positionToEyeEC;\n\r\n\t\t\t\t\t\t\t\t\t\t\tczm_material material \x3d czm_getMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#ifdef FLAT\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d vec4(material.diffuse + material.emission, material.alpha);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#else\n\r\n\t\t\t\t\t\t\t\t\t\t\tgl_FragColor \x3d czm_phong(normalize(positionToEyeEC), material);\n\r\n\t\t\t\t\t\t\t\t\t\t\t#endif\n\r\n\t\t\t\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t\t\t\t",
            renderState: {
              depthTest: b.depth
            }
          })
        });
        a.fillColor && a.borderColor ? (b.borderColor = a.borderColor,
          c = Cesium.Color.fromCssColorString(b.borderColor.hex).withAlpha(b.borderColor.opacity),
          d = new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonOutlineGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(d),
              height: b.height,
              extrudedHeight: a.extrudedHeight || null
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(c)
            }
          }),
        b.extrudedHeight && (d.extrudedHeight = b.extrudedHeight),
          d = b.depth ? new Cesium.Primitive({
            geometryInstances: d,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: !0
            })
          }) : new Cesium.Primitive({
            geometryInstances: d,
            appearance: new Cesium.PerInstanceColorAppearance({
              flat: !0,
              renderState: {
                depthTest: b.depth
              }
            })
          }),
          c = new Cesium.PrimitiveCollection,
          c.add(e),
          c.add(d),
          b.object = c,
          e.parentClass = b,
          d.parentClass = b) : b.object = e;
        b.object.parentClass = b
      }
    )();
    LongMap.Wall.prototype.setColor = function(a) {
      this.fillColor = new LongMap.Color(a,this.fillColor.opacity);
      a = Cesium.Color.fromCssColorString(this.fillColor.hex).withAlpha(this.fillColor.opacity);
      this.material && (this.material.uniforms.color = a)
    }
  }
}
;
var Instrument = function(a, b, d) {
  this.cutfill(a, b, d)
};
Instrument.prototype = {
  range: function(a, b) {
    var d = []
      , e = b.lon;
    b = b.lat;
    for (var c = 0; c < a.length; c++)
      d.push({
        x: a[c].lon,
        y: a[c].lat
      });
    for (c = a = 0; c < d.length; c++) {
      var f = c + 1;
      f >= d.length && (f = 0);
      var h = d[c]
        , f = d[f];
      if (!(b < Math.min(h.y, f.y) || b > Math.max(h.y, f.y)))
        if (h.y === f.y) {
          var l = Math.min(h.x, f.x)
            , f = Math.max(h.x, f.x);
          if (b === h.y && e >= l && e <= f)
            return !0
        } else if (l = (b - h.y) * (f.x - h.x) / (f.y - h.y) + h.x,
        1E-10 >= Math.abs(l - e) && (l = e),
        l > e && Math.min(h.y, f.y) < b && Math.max(h.y, f.y) >= b)
          a++;
        else if (l === e)
          return !0
    }
    return 1 === a % 2
  },
  cutfill: function(a, b, d) {
    for (var e = b.points, c = b.interval || 5E-4, f = 0, h = (new LongMap.Point3(0,0,0)).copy(e[0]), l = (new LongMap.Point3(0,0,0)).copy(e[0]), g = 0; g < e.length; g++)
      h.lon = Math.min(h.lon, e[g].lon),
        h.lat = Math.min(h.lat, e[g].lat),
        l.lon = Math.max(l.lon, e[g].lon),
        l.lat = Math.max(l.lat, e[g].lat);
    b = [];
    for (g = h.lon; g < l.lon; g += c)
      for (var k = h.lat; k < l.lat; k += c)
        b.push(new LongMap.Point3(g + c / 2,k + c / 2));
    f = b[0].distanceTo(b[1]);
    c = [];
    for (g = 0; g < b.length; g++)
      h = b[g],
      this.range(e, h) && c.push(Cesium.Cartographic.fromDegrees(h.lon, h.lat));
    a = Cesium.sampleTerrainMostDetailed(a.map.terrainProvider, c);
    Cesium.when(a, function(a) {
      var b = [];
      a.forEach(function(a) {
        b.push(a)
      });
      a = {
        points: b,
        distance: f
      };
      d && d(a)
    })
  }
};
LongMap.Instrument = Instrument;
LongMap.railway = function(a) {
  this.object = null;
  if (a && !(a.points && 2 > a.points.length)) {
    this.type = "entitie";
    this.vertexs = null;
    this.width = a.width || 1;
    this.info = a.info || null;
    this.opacity = 1;
    this.color = Cesium.Color.fromCssColorString("#fff").withAlpha(1);
    var b = this;
    b.points = a.points;
    b.uuid = guid();
    b.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    (function() {
        var d = [];
        b.color = a.color || new LongMap.Color("#ffffff",1);
        for (var e = 0; e < b.points.length; e++)
          d.push(b.points[e].lon, b.points[e].lat, b.points[e].z);
        d = {
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(d),
            width: b.width,
            material: new Cesium.PolylineDashMaterialProperty({
              color: new Cesium.CallbackProperty(function() {
                  return Cesium.Color.fromCssColorString(b.color.hex || "#fff").withAlpha(b.color.opacity || 1)
                }
                ,!1),
              gapColor: Cesium.Color.BLACK,
              dashLength: 20,
              dashPattern: 255
            })
          }
        };
        b.object = d;
        b.object.parentClass = b
      }
    )()
  }
}
;
LongMap.railway.prototype = {
  setColor: function(a) {
    this.color = new LongMap.Color(a,this.color.opacity)
  },
  rePaint: function() {},
  setStyle: function() {}
};
var czml_3 = [{
  id: "document",
  version: "1.0"
}, {
  id: "Vehicle",
  availability: "2019-11-11T11:00:00Z/2019-11-11T12:04:54.9962195740191Z",
  orientation: {
    velocityReference: "#position"
  },
  viewFrom: {
    cartesian: [-2080, -1715, 779]
  },
  properties: {
    fuel_remaining: {
      epoch: "2019-11-11T11:00:00Z",
      number: [0, 22.5, 1500, 21.2]
    }
  },
  path: {
    material: {
      solidColor: {
        color: {
          interval: "2019-11-11T11:00:00Z/2019-11-12T12:04:54.9962195740191Z",
          rgba: [255, 255, 0, 255]
        }
      }
    },
    width: [{
      interval: "2019-11-11T11:00:00Z/2019-11-12T12:04:54.9962195740191Z",
      number: 5
    }],
    show: [{
      interval: "2019-11-11T11:00:00Z/2019-11-12T12:04:54.9962195740191Z",
      "boolean": !0
    }]
  },
  position: {
    interpolationAlgorithm: "LAGRANGE",
    interpolationDegree: 1,
    epoch: "2019-11-11T11:00:00Z",
    cartographicDegrees: []
  }
}]
  , czml_label_3 = {
  fillColor: [{
    interval: "2019-11-11T11:00:00Z/2012-08-04T13:00:00Z",
    rgba: [255, 0, 0, 255]
  }],
  font: "bold 10pt Segoe UI Semibold",
  horizontalOrigin: "CENTER",
  outlineColor: {
    rgba: [0, 0, 0, 255]
  },
  pixelOffset: {
    cartesian2: [0, 0]
  },
  scale: 1,
  show: [{
    interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
    "boolean": !0
  }],
  style: "FILL",
  text: "Test Vehicle",
  verticalOrigin: "CENTER"
}
  , czml_billboard_3 = {
  eyeOffset: {
    cartesian: [0, 0, 0]
  },
  horizontalOrigin: "CENTER",
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACvSURBVDhPrZDRDcMgDAU9GqN0lIzijw6SUbJJygUeNQgSqepJTyHG91LVVpwDdfxM3T9TSl1EXZvDwii471fivK73cBFFQNTT/d2KoGpfGOpSIkhUpgUMxq9DFEsWv4IXhlyCnhBFnZcFEEuYqbiUlNwWgMTdrZ3JbQFoEVG53rd8ztG9aPJMnBUQf/VFraBJeWnLS0RfjbKyLJA8FkT5seDYS1Qwyv8t0B/5C2ZmH2/eTGNNBgMmAAAAAElFTkSuQmCC",
  pixelOffset: {
    cartesian2: [0, 0]
  },
  scale: 1.5,
  show: !0,
  verticalOrigin: "CENTER"
}
  , czml_model_3 = {
  gltf: "",
  minimumPixelSize: 2,
  maximumScale: 1,
  scale: .05
}
  , Roam = function(a) {
  this.smap = this.map = null;
  this.points = a.points;
  var b = this;
  this.model = a.model;
  this.label = a.label;
  this.maker = a.maker;
  this.route = a.route;
  this.speed = a.speed || 1E3;
  this.maxTime = 0;
  this.timer = [];
  this.onload = null;
  this.height = a.hasOwnProperty("height") ? a.height : 1.5;
  this.lineFollow = a.hasOwnProperty("lineFollow") ? a.lineFollow : !0;
  this.event = null;
  this.indexMultiplier = this.index = 0;
  this.line = {
    width: 1,
    curve: 1,
    color: new LongMap.Color("#FFFFFF"),
    show: !1
  };
  a.line && (this.line.show = !0,
  a.line.width && (this.line.width = a.line.width),
  a.line.curve && (this.line.curve = a.line.curve),
  a.line.color && (this.line.color = a.line.color));
  this.initEvent = function() {
    if (this.smap) {
      this.index = 0;
      var a = this.smap;
      a.map.clock.currentTime = a.map.clock.startTime;
      a.map.clock.shouldAnimate = !1;
      this.event = function(d) {
        Cesium.JulianDate.secondsDifference(d.currentTime, d.startTime) > b.maxTime && (a.map.clock.currentTime = d.startTime,
          a.map.clock.shouldAnimate = !0,
          b.remove())
      }
      ;
      a.map.clock.shouldAnimate = !0;
      a.map.clock.indexMultiplier = a.map.clock.multiplier;
      a.map.clock.currentMultiplier = a.map.clock.indexMultiplier;
      a.map.clock.onTick.addEventListener(this.event);
      a.map.trackedEntity = this.dataSourcePromise.entities.getById("Vehicle")
    } else
      alert("error")
  }
};
Roam.prototype = {
  init: function() {
    var a = this;
    if (this.map) {
      var b = JSON.parse(JSON.stringify(czml_3));
      b[1].path.width[0].number = a.line.width;
      b[1].path.show["boolean"] = a.line.show;
      b[1].position.interpolationDegree = a.line.curve;
      var d = Cesium.Color.fromCssColorString(a.line.color.hex);
      b[1].path.material.solidColor.color.rgba = [255 * d.red, 255 * d.green, 255 * d.blue, 255];
      if (this.route) {
        for (var d = [], e = 0, c = 0; c < this.route.length - 1; c++)
          e += this.route[c].distanceTo(this.route[c + 1]);
        d.push(0, this.route[0].lon, this.route[0].lat, this.route[0].z + this.height);
        e = 0;
        for (c = 1; c < this.route.length; c++)
          e += this.route[c - 1].distanceTo(this.route[c]) / this.speed,
            d.push(e, this.route[c].lon, this.route[c].lat, this.route[c].z + this.height),
            a.maxTime = e,
            this.timer.push(e);
        b[1].position.cartographicDegrees = d
      }
      d = "2019-11-11 11:00:00".replace(/-/g, "/");
      d = (new Date(d)).getTime();
      c = (new Date(d + 36E5 * (a.maxTime / 3600 + 1))).getTime();
      d = a.dateFormat(d);
      c = a.dateFormat(c);
      b[1].availability = d + "/" + c;
      b[1].position.epoch = d;
      b[1].path.width[0].interval = d + "/" + c;
      b[1].path.show.interval = d + "/" + c;
      b[1].path.material.solidColor.color.interval = d + "/" + c;
      console.log();
      e = JSON.parse(JSON.stringify(czml_label_3));
      e.text = "o";
      e.show[0].interval = d + "/" + c;
      b[1].label = e;
      this.model && (d = JSON.parse(JSON.stringify(czml_model_3)),
        d.gltf = this.model.url,
        b[1].model = d);
      this.maker && (d = JSON.parse(JSON.stringify(czml_billboard_3)),
        d.image = this.maker.url,
        b[1].billboard = d);
      this.dataSourcePromise = Cesium.CzmlDataSource.load(b);
      this.dataSourcePromise.then(function(b) {
        a.dataSourcePromise = b;
        a.onload && a.onload(a);
        a.initEvent()
      });
      this.map.dataSources.add(this.dataSourcePromise)
    } else
      console.error("\u64cd\u4f5c\u4e0d\u6b63\u786e")
  },
  remove: function() {
    this.map && (this.dataSourcePromise.entities.removeAll(),
      this.map.clock.shouldAnimate = !0,
      this.map.dataSources.remove(this.dataSourcePromise),
    this.event && this.map.clock.onTick.removeEventListener(this.event),
      this.event = null,
    this.eventControls && this.eventControls.removeEvent(),
      this.smap = this.map = this.eventControls = null)
  },
  setLineFollow: function(a) {
    a ? (this.followLine(),
      this.lineFollow = !0) : this.lineFollow = !1
  },
  play: function() {
    this.map.clock.multiplier = this.map.clock.currentMultiplier;
    this.map.clock.shouldAnimate = !0
  },
  pause: function() {
    this.map.clock.currentMultiplier = this.map.clock.multiplier;
    this.map.clock.multiplier = 0;
    this.map.clock.shouldAnimate = !0
  },
  dateFormat: function(a) {
    function b(a) {
      return 10 > a ? "0" + a : a
    }
    return function(a) {
      var d = new Date(a);
      a = d.getFullYear();
      var c = d.getMonth() + 1
        , f = d.getDate()
        , h = d.getHours()
        , l = d.getMinutes()
        , d = d.getSeconds();
      return a + "-" + b(c) + "-" + b(f) + "T" + b(h) + ":" + b(l) + ":" + b(d) + "Z"
    }(a)
  },
  followLine: function() {
    var a = this;
    this.map.clock.shouldAnimate = !1;
    var b = new Cesium.Cartesian3(a.route[a.index].lon,a.route[a.index].lat,0)
      , d = new Cesium.Cartesian3(a.route[a.index + 1].lon,a.route[a.index + 1].lat,0)
      , b = Cesium.Cartesian3.subtract(d, b, new Cesium.Cartesian3);
    b.z = 0;
    b = Cesium.Cartesian3.normalize(b, new Cesium.Cartesian3);
    d = a.dataSourcePromise.entities.getById("Vehicle").position.getValue(a.map.clock.currentTime);
    d = (new LongMap.Point3).fromVector(d);
    d = Cesium.Cartesian3.fromDegreesArrayHeights([d.lon, d.lat, d.z])[0];
    this.map.camera.flyTo({
      destination: d,
      orientation: {
        heading: a.getDirection(b),
        pitch: Cesium.Math.toRadians(0)
      },
      duration: 3,
      maximumHeight: a.route[a.index].z,
      complete: function() {
        a.map.clock.shouldAnimate = !0
      }
    })
  },
  getDirection: function(a) {
    return 0 < a.x ? 0 < a.y ? Math.atan(Math.abs(a.x / a.y)) : Math.PI / 2 + Math.atan(Math.abs(a.y / a.x)) : 0 < a.y ? 2 * Math.PI - Math.atan(Math.abs(a.x / a.y)) : Math.PI + Math.atan(Math.abs(a.x / a.y))
  },
  setSpeed: function(a) {
    this.map.clock.multiplier = a / this.speed * this.map.clock.indexMultiplier;
    this.map.clock.currentMultiplier = this.map.clock.multiplier
  }
};
LongMap.Roam = Roam;
var RoamEvent = function(a, b) {
  this.map = a;
  var d = a.map.scene
    , e = a.map.canvas;
  e.setAttribute("tabindex", "0");
  e.onclick = function() {
    e.focus()
  }
  ;
  var c, f, h = !1;
  this.mousedownEvent = function(a) {
    h = !0;
    f = c = Cesium.Cartesian3.clone(a.position)
  }
  ;
  this.mousemoveEvent = function(a) {
    f = a.endPosition
  }
  ;
  this.mouseupEventListener = function(a) {
    h = !1
  }
  ;
  this.clockEvent = function(d) {
    if (!b.lineFollow && (d = a.map.camera,
      h)) {
      var g = (f.x - c.x) / e.clientWidth
        , k = -(f.y - c.y) / e.clientHeight;
      Math.abs(g) > Math.abs(k) ? d.lookRight(.05 * g) : d.lookUp(.05 * k)
    }
  }
  ;
  this.scene = d
};
RoamEvent.prototype = {
  addEvent: function() {
    var a = this.map
      , b = this.scene;
    a.addEventListener("mousedown", this.mousedownEvent);
    a.addEventListener("mousemove", this.mousemoveEvent);
    a.addEventListener("mouseup", this.mouseupEventListener);
    a.map.clock.onTick.addEventListener(this.clockEvent);
    b.screenSpaceCameraController.enableRotate = !1;
    b.screenSpaceCameraController.enableTranslate = !1;
    b.screenSpaceCameraController.enableZoom = !1;
    b.screenSpaceCameraController.enableTilt = !1;
    b.screenSpaceCameraController.enableLook = !1
  },
  removeEvent: function() {
    var a = this.map
      , b = this.scene;
    a.removeEventListener("mousedown", this.mousedownEvent);
    a.removeEventListener("mousemove", this.mousemoveEvent);
    a.removeEventListener("mouseup", this.mouseupEventListener);
    a.map.clock.onTick.removeEventListener(this.clockEvent);
    b.screenSpaceCameraController.enableRotate = !0;
    b.screenSpaceCameraController.enableTranslate = !0;
    b.screenSpaceCameraController.enableZoom = !0;
    b.screenSpaceCameraController.enableTilt = !0;
    b.screenSpaceCameraController.enableLook = !0
  }
};
Cesium.Material.PolylineTrailLinkTypeKeliu = "PolylineTrailLinkKeliu";
Cesium.Material.PolylineTrailLinkImageKeliu = "/assets/klh.png";
Cesium.Material.PolylineTrailLinkSourceKeliu = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d repeat*materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a;\n\r\n                                                           if(color.a\x3e0.0){\n\r\n                                                           \t material.diffuse \x3d color.rgb;\n\r\n                                                           \t//  material.alpha \x3d color.a;\n\r\n                                                           }else{\n\r\n                                                                material.diffuse \x3d colorImage.rgb;\n\r\n                                                                // material.alpha \x3d colorImage.a;\n\r\n                                                           }\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeKeliu, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeKeliu,
    uniforms: {
      color: new Cesium.Color(1,1,1,0),
      image: Cesium.Material.PolylineTrailLinkImageKeliu,
      time: 0,
      repeat: {
        x: 1,
        y: 1
      }
    },
    source: Cesium.Material.PolylineTrailLinkSourceKeliu
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyKeliu(a, b, d, e) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.repeat = d;
  this.duration = b;
  this.image = e || Cesium.Material.PolylineTrailLinkImageKeliu;
  this._time = (new Date).getTime()
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyKeliu.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color"),
  repeat: Cesium.createPropertyDescriptor("repeat"),
  image: Cesium.createPropertyDescriptor("image")
});
PolylineTrailLinkMaterialPropertyKeliu.prototype.getType = function(a) {
  return "PolylineTrailLinkKeliu"
}
;
PolylineTrailLinkMaterialPropertyKeliu.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, null, b.color);
  b.repeat = Cesium.Property.getValueOrClonedDefault(this.repeat, a, {
    x: 1,
    y: 1
  }, b.repeat);
  b.image = Cesium.Property.getValueOrClonedDefault(this.image, a, Cesium.Material.PolylineTrailLinkImageKeliu, b.image);
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyKeliu.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyKeliu && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyKeliu = PolylineTrailLinkMaterialPropertyKeliu;
LongMap.Keliu = function(a) {
  function b(a) {
    for (var b = 0, c = new Cesium.WebMercatorProjection, d = [], e = 0; e < a.length; e++) {
      var f = Cesium.Cartographic.fromCartesian(a[e].vector());
      d.push(c.project(f))
    }
    for (e = 0; e < d.length - 1; e++) {
      a = d[e].x;
      var c = d[e].y
        , f = d[e + 1].x
        , g = d[e + 1].y
        , b = b + Math.sqrt((a - f) * (a - f) + (c - g) * (c - g))
    }
    return b
  }
  var d = this;
  d.color = a.color || new LongMap.Color("#ffffff",0);
  d.duration = a.duration || 3;
  d.lineWidth = a.lineWidth || 1;
  d.points = a.points;
  d.repeat = a.repeat || {
    x: 1,
    y: 1
  };
  d.url = a.url || null;
  d.object = [];
  a = function(a) {
    var c = Math.ceil(b(a) / 100);
    d.repeat = {
      x: c,
      y: 1
    };
    Cesium.Color.fromCssColorString(d.color.hex).withAlpha(1);
    c = [];
    c.push(a[0].lon, a[0].lat, a[0].z);
    c.push(a[1].lon, a[1].lat, a[1].z);
    a = Cesium.Color.fromCssColorString(d.color.hex).withAlpha(d.color.opacity || 0);
    d.material = new Cesium.PolylineTrailLinkMaterialPropertyKeliu(a,1E3 * d.duration,d.repeat,d.url);
    a = {
      object: {
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(c),
          width: d.lineWidth,
          material: d.material
        }
      },
      type: "entitie"
    };
    a.object.parentClass = d;
    d.object.push(a)
  }
  ;
  for (var e = 0; e < d.points.length; e++) {
    for (var c = d.points[e], f = [], h = 0; h < c.length - 1; h++) {
      var l = c[h + 1];
      f.push(c[h]);
      f.push(l)
    }
    new a(c)
  }
  d.object.parentClass = d
}
;
LongMap.Keliu.prototype = {
  type: "entitie",
  setRepeat: function(a) {
    this.repeat.x = a.x ? a.x : this.repeat.x;
    this.repeat.y = a.x ? a.y : this.repeat.y;
    this.material.repeat = new Cesium.ConstantProperty(this.repeat)
  },
  setColor: function(a) {
    this.color = a ? a : this.color;
    a = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity || 0);
    this.material.color = new Cesium.ConstantProperty(a)
  },
  setImageUrl: function(a) {
    this.url = a ? a : this.url;
    this.material.image = new Cesium.ConstantProperty(this.url)
  }
};
var lights = [];
LongMap.Visual = function(a) {
  this.map = a.map;
  this.direction = !1;
  this.angle = a.angle || 60;
  var b = this.map.scene;
  b.shadowMaps || (b.shadowMaps = []);
  this.position = a.position;
  this.center = a.center;
  if (!this.position || !this.center)
    return "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u53c2\u6570";
  this.radius = a.radius || 100;
  this.horizontal = a.horizontal || 60;
  this.vertical = a.vertical || 60;
  a = this.position.vector();
  this.aspectRatio = this.horizontal / this.vertical;
  var d = this.horizontal < this.vertical ? new Cesium.Camera(b,this.vertical,this.aspectRatio,this.radius) : new Cesium.Camera(b,this.horizontal,this.aspectRatio,this.radius);
  d.position = a;
  a = new Cesium.ShadowMap({
    context: b.context,
    lightCamera: d,
    darkness: .1,
    cascadesEnabled: !1,
    isPointLight: !1,
    softShadows: !0,
    pointLightRadius: this.radius,
    _isPointLightF: !0
  });
  a.enabled = !0;
  a.debugShow = !0;
  lights.push(a);
  a.lights = lights;
  this.object = a;
  b.shadowMaps.push(this.object);
  this.update();
  this.horizontalAnge = this.courseAngle(this.position, this.center);
  this.verticalAnge = this.coursePitchAngle(this.position, this.center);
  this.horizontalRotate(this.horizontalAnge);
  this.verticalRotate(this.verticalAnge)
}
;
LongMap.Visual.prototype = {
  type: "Visual",
  horizontalRotate: function(a) {
    this.horizontalAnge = a;
    this.object._lightCamera.setView({
      destination: this.position.vector(),
      orientation: {
        heading: Cesium.Math.toRadians(this.horizontalAnge),
        pitch: Cesium.Math.toRadians(this.verticalAnge),
        roll: 0
      }
    })
  },
  verticalRotate: function(a) {
    this.object._lightCamera.setView({
      destination: this.position.vector(),
      orientation: {
        heading: Cesium.Math.toRadians(this.horizontalAnge),
        pitch: Cesium.Math.toRadians(a),
        roll: 0
      }
    });
    this.verticalAnge = a
  },
  remove: function() {
    var a = this.map.scene.shadowMaps;
    this.object && (this.object.debugShow = !1,
      this.object._debugLightFrustum.destroy());
    for (var b = 0, d = a.length; b < d; b++)
      a[b] == this.object && a.splice(b, 1);
    this.update()
  },
  courseAngle: function(a, b) {
    if (!a || !b)
      return "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u53c2\u6570";
    var d = a.lon
      , e = a.lat;
    a = b.lon;
    b = b.lat;
    var c = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(d,e))
      , c = Cesium.Matrix4.inverse(c, new Cesium.Matrix4)
      , d = Cesium.Matrix4.multiplyByPoint(c, new Cesium.Cartesian3.fromDegrees(d,e), new Cesium.Cartesian3);
    a = Cesium.Matrix4.multiplyByPoint(c, new Cesium.Cartesian3.fromDegrees(a,b), new Cesium.Cartesian3);
    d = 180 / Math.PI * (Math.atan2(a.y - d.y, a.x - d.x) - Math.PI / 2);
    0 > d && (d += 360);
    return 360 - d
  },
  coursePitchAngle: function(a, b) {
    if (!a || !b)
      return "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u53c2\u6570";
    var d = a.lon
      , e = a.lat
      , c = a.z;
    a = b.lon;
    var f = b.lat;
    b = b.z;
    var h = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(d,e,c))
      , h = Cesium.Matrix4.inverse(h, new Cesium.Matrix4)
      , d = Cesium.Matrix4.multiplyByPoint(h, new Cesium.Cartesian3.fromDegrees(d,e,c), new Cesium.Cartesian3)
      , e = Cesium.Matrix4.multiplyByPoint(h, new Cesium.Cartesian3.fromDegrees(a,f,b), new Cesium.Cartesian3)
      , d = 180 / Math.PI * Math.atan2(e.z - d.z, Math.sqrt(e.x * e.x + e.y * e.y));
    0 > d && (d += 360);
    180 >= d && 90 < d ? d -= 180 : 270 >= d && 180 < d ? d -= 270 : 360 >= d && 270 < d && (d -= 360);
    return d
  },
  update: function() {
    this.map.scene.updateShader = !0
  }
};
LongMap.SpriteCeshi = function(a) {
  this.object = null;
  this.type = "primitive";
  this.uuid = guid();
  this.points = a.points;
  if (this.isSprite = a.isSprite || !1) {
    var b = new Cesium.PointPrimitiveCollection
      , d = 0;
    for (a = this.points.length; d < a; d++) {
      var e = this.points[d]
        , c = e.position
        , f = e.color || new LongMap.Color("#fff",1)
        , h = e.offset
        , e = {
        position: c.spaceCoordinate,
        color: Cesium.Color.fromCssColorString(f.hex).withAlpha(f.opacity),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        pixelOffset: h,
        id: e.id
      };
      b.add(e).parentClass = this
    }
  } else
    for (b = new Cesium.BillboardCollection,
           d = 0,
           a = this.points.length; d < a; d++)
      e = this.points[d],
        b.add({
          position: e.position.spaceCoordinate,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          pixelOffset: e.offset,
          id: e.id,
          image: e.url,
          scale: e.scale
        }).parentClass = this;
  this.object = b;
  this.object.parentClass = this
}
;
LongMap.SpriteCeshi.prototype = {
  setPosition: function(a) {
    this.position = a;
    this.object._billboards[0].position = this.position.vector()
  }
};
LongMap.LineCeshi = function(a) {
  this.object = null;
  if (a && !(a.points && 2 > a.points.length)) {
    this.type = "primitive";
    this.vertexs = null;
    this.info = a.info || null;
    this.opacity = 1;
    this.color = Cesium.Color.fromCssColorString("#fff").withAlpha(1);
    var b = this;
    b.points = a.points;
    b.uuid = guid();
    b.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    (function() {
        b.color = a.color || new LongMap.Color("#ffffff",1);
        for (var d = [], e = 0, c = b.points.length; e < c; e++) {
          for (var f = [], h = b.points[e].points, l = 0, g = h.length; l < g; l++)
            f.push(h[l].spaceCoordinate);
          h = Cesium.Color.fromCssColorString(b.points[e].color.hex || "#fff").withAlpha(b.points[e].color.opacity || 1);
          f = new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
              positions: f,
              width: b.points[e].width || 1,
              vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(h),
              show: new Cesium.ShowGeometryInstanceAttribute(!0)
            },
            id: b.points[e].id.toString() || uuid()
          });
          d.push(f)
        }
        d = new Cesium.Primitive({
          geometryInstances: d,
          appearance: new Cesium.PolylineColorAppearance({
            translucent: !1,
            closed: !0
          })
        });
        b.object = d;
        b.object.parentClass = b;
        b.object.readyPromise.then(function() {
          b.callback && b.callback()
        })
      }
    )()
  }
}
;
LongMap.LineCeshi.prototype = {
  setColor: function(a, b) {
    if (!a || !b)
      return !1;
    b = Cesium.Color.fromCssColorString(b.hex || "#fff").withAlpha(b.opacity || 1);
    a = this.object.getGeometryInstanceAttributes(a);
    if (!a)
      return !1;
    a.color = Cesium.ColorGeometryInstanceAttribute.toValue(b)
  },
  getColor: function(a) {
    if (!a)
      return !1;
    if (a = this.object.getGeometryInstanceAttributes(a)) {
      var b = a.color;
      a = b[0].toString(16);
      var d = b[1].toString(16)
        , e = b[2].toString(16)
        , b = b[3] / 255;
      2 > a.split("").length && (a = "0" + a);
      2 > d.split("").length && (d = "0" + d);
      2 > e.split("").length && (e = "0" + e);
      return new LongMap.Color("#" + a + d + e,b)
    }
  },
  rePaint: function() {},
  setStyle: function() {},
  ready: function(a) {
    a && (this.callback = a)
  }
};
LongMap.PlaneCeshi = function(a) {
  if (a && !(a.points && 1 > a.points.length)) {
    this.object = null;
    this.type = "primitive";
    this.vertexs = null;
    this.fillColor = Cesium.Color.fromCssColorString("#fff");
    this.fillOpacity = 0;
    this.borderColor = Cesium.Color.fromCssColorString("#fff");
    this.borderOpacity = 0;
    this.height = a.hasOwnProperty("height") ? a.height : 0;
    this.info = a.hasOwnProperty("info") ? a.info : null;
    var b = this;
    b.flat = a.flat || !1;
    b.id = a.id || null;
    b.uuid = guid();
    b.points = a.points;
    b.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    b.extrudedHeight = a.hasOwnProperty("extrudedHeight") ? a.extrudedHeight : 0;
    b.borderFeature = null;
    (function() {
        for (var a = [], e = [], c = 0, f = b.points.length; c < f; c++) {
          for (var h = b.points[c], l = [], g = 0, k = h.points.length; g < k; g++)
            l.push(h.points[g].spaceCoordinate);
          g = Cesium.Color.fromCssColorString(h.color.hex).withAlpha(h.color.opacity);
          g = new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(l),
              height: b.height,
              extrudedHeight: h.extrudedHeight || null,
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(g),
              show: new Cesium.ShowGeometryInstanceAttribute(!0)
            },
            id: h.id.toString() || uuid()
          });
          a.push(g);
          h.borderColor && (g = Cesium.Color.fromCssColorString(h.borderColor.hex).withAlpha(h.borderColor.opacity),
            h = new Cesium.GeometryInstance({
              geometry: new Cesium.PolygonOutlineGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(l),
                height: b.height,
                extrudedHeight: h.extrudedHeight || null,
                vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
              }),
              attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(g),
                show: new Cesium.ShowGeometryInstanceAttribute(!0)
              },
              id: "border" + h.id.toString()
            }),
            e.push(h))
        }
        a = b.depth ? new Cesium.Primitive({
          geometryInstances: a,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: !1,
            closed: !0
          })
        }) : new Cesium.Primitive({
          geometryInstances: a,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: !1,
            closed: !0,
            renderState: {
              depthTest: b.depth
            }
          })
        });
        if (0 < e.length) {
          var c = new Cesium.PrimitiveCollection
            , p = b.depth ? new Cesium.Primitive({
            geometryInstances: e,
            appearance: new Cesium.PerInstanceColorAppearance({
              closed: !0
            })
          }) : new Cesium.Primitive({
            geometryInstances: e,
            appearance: new Cesium.PerInstanceColorAppearance({
              closed: !0,
              renderState: {
                depthTest: b.depth
              }
            })
          });
          c.add(a);
          c.add(p);
          b.object = c;
          a.parentClass = b;
          p.parentClass = b;
          b.borderFeature = p;
          b.fillFeature = a;
          a.readyPromise.then(function() {
            p.readyPromise.then(function() {
              b.callback && b.callback()
            })
          })
        } else
          b.object = a,
            b.fillFeature = a,
            b.object.readyPromise.then(function() {
              b.callback && b.callback()
            });
        b.object.parentClass = b
      }
    )();
    LongMap.PlaneCeshi.prototype.setColor = function(a, b) {
      if (!a || !b)
        return !1;
      b = Cesium.Color.fromCssColorString(b.hex || "#fff").withAlpha(b.opacity || 1);
      a = this.fillFeature.getGeometryInstanceAttributes(a);
      if (!a)
        return !1;
      a.color = Cesium.ColorGeometryInstanceAttribute.toValue(b)
    }
    ;
    LongMap.PlaneCeshi.prototype.setBorderColor = function(a, b) {
      if (!a || !b)
        return !1;
      b = Cesium.Color.fromCssColorString(b.hex || "#fff").withAlpha(b.opacity || 1);
      a = this.borderFeature.getGeometryInstanceAttributes(a);
      if (!a)
        return !1;
      a.color = Cesium.ColorGeometryInstanceAttribute.toValue(b)
    }
    ;
    LongMap.PlaneCeshi.prototype.ready = function(a) {
      a && (this.callback = a)
    }
  }
}
;
LongMap.fgLine = function(a) {
  for (var b = [], d = 0; d < a.length; d++)
    a[d].vector(),
      b.push(a[d].lon, a[d].lat, a[d].z);
  this.object = {
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(b),
      width: 50,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: .1,
        color: Cesium.Color.fromCssColorString("#0e7ad6").withAlpha(.9)
      })
    }
  };
  this.object.parentClass = this
}
;
LongMap.fgLine.prototype = {
  constructor: LongMap.fgLine,
  type: "entitie"
};
LongMap.xzpm = function(a) {
  var b = this;
  b.position = a.position;
  b.url = a.url;
  if (!b.position || !b.url)
    return !1;
  b.radius = a.radius || 100;
  b.height = a.height || 0;
  b.stRotation = a.stRotation || 0;
  b.show = !0;
  b.object = {
    position: new Cesium.CallbackProperty(function() {
        return Cesium.Cartesian3.fromDegreesArrayHeights([b.position.lon, b.position.lat, b.position.z + b.height])[0]
      }
      ,!1),
    ellipse: {
      show: new Cesium.CallbackProperty(function() {
          return b.show
        }
        ,!1),
      stRotation: new Cesium.CallbackProperty(function() {
          return b.stRotation / 180 * Math.PI
        }
        ,!1),
      semiMinorAxis: b.radius,
      semiMajorAxis: b.radius,
      height: b.height,
      fill: !0,
      material: new Cesium.ImageMaterialProperty({
        image: b.url,
        transparent: !0
      })
    }
  };
  b.object.parentClass = b
}
;
LongMap.xzpm.prototype = {
  type: "entitie",
  rotation: function(a) {
    this.stRotation = (this.stRotation + a) % 360
  },
  initRotation: function(a) {
    this.stRotation = a
  },
  setPosition: function(a) {
    this.position = a
  },
  _type: "xzpm"
};
LongMap.planeAngle = function(a) {
  var b = this;
  if (!a.plane || !a.entity || !a.dimensions)
    return !1;
  b.length = a.length || 10;
  b.bottomRadius = a.bottomRadius || 3;
  b.topRadius = a.topRadius || 0;
  b.color = a.color || new LongMap.Color("#ff0000");
  b.plane = a.plane;
  b.entity = a.entity;
  b.angle = a.angle || 0;
  b.dimensions = a.dimensions;
  a = b.entity.computeModelMatrix(Cesium.JulianDate.fromDate(new Date));
  a = b.createPrimitiveMatrix(b.plane, b.dimensions, a, Cesium.Ellipsoid.WGS84, a);
  var d = new Cesium.PlaneGeometry({
    vertexFormat: Cesium.VertexFormat.POSITION_ONLY
  })
    , d = (new Cesium.PlaneGeometry.createGeometry(d)).attributes.position.values;
  b.position = b.transformPoint(a, d);
  b.object = [];
  a = {
    i$31: 0
  };
  for (d = b.position.length; a.i$31 < d; a = {
    i$31: a.i$31
  },
    a.i$31++) {
    var e = {
      object: {
        position: new Cesium.CallbackProperty(function(a) {
          return function() {
            return b.position[a.i$31]
          }
        }(a),!1),
        orientation: new Cesium.CallbackProperty(function(a) {
          return function() {
            return Cesium.Transforms.headingPitchRollQuaternion(b.position[a.i$31], new Cesium.HeadingPitchRoll(0,-b.angle * Math.PI / 180,0))
          }
        }(a),!1),
        cylinder: {
          length: b.length,
          topRadius: b.topRadius,
          bottomRadius: b.bottomRadius,
          bottomSurface: !1,
          material: b.color
        }
      }
    };
    b.object.push(e)
  }
}
;
LongMap.planeAngle.prototype = {
  type: "entitie",
  createPrimitiveMatrix: function(a, b, d, e, c) {
    a._callback && (a = a.getValue(Cesium.JulianDate.fromDate(new Date)));
    var f = new Cesium.Cartesian3
      , h = new Cesium.Cartesian3
      , l = new Cesium.Cartesian3
      , g = new Cesium.Cartesian3
      , k = new Cesium.Cartesian3
      , p = new Cesium.Quaternion
      , m = new Cesium.Matrix3
      , n = a.normal;
    a = Cesium.Cartesian3.multiplyByScalar(n, -a.distance, l);
    a = Cesium.Matrix4.multiplyByPoint(d, a, a);
    d = Cesium.Matrix4.multiplyByPointAsVector(d, n, g);
    Cesium.Cartesian3.normalize(d, d);
    e = e.geodeticSurfaceNormal(a, h);
    Cesium.Math.equalsEpsilon(Math.abs(Cesium.Cartesian3.dot(e, d)), 1, Cesium.Math.EPSILON8) && (e = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Z, e));
    f = Cesium.Cartesian3.cross(e, d, f);
    e = Cesium.Cartesian3.cross(d, f, e);
    Cesium.Cartesian3.normalize(f, f);
    Cesium.Cartesian3.normalize(e, e);
    Cesium.Matrix3.setColumn(m, 0, f, m);
    Cesium.Matrix3.setColumn(m, 1, e, m);
    Cesium.Matrix3.setColumn(m, 2, d, m);
    p = Cesium.Quaternion.fromRotationMatrix(m, p);
    b = Cesium.Cartesian2.clone(b, k);
    b.z = 1;
    return Cesium.Matrix4.fromTranslationQuaternionRotationScale(a, p, b, c)
  },
  transformPoint: function(a, b) {
    var d = [];
    if (b)
      for (var e = b.length, c = 0; c < e; c += 3) {
        var f = new Cesium.Cartesian3;
        Cesium.Cartesian3.unpack(b, c, f);
        Cesium.Matrix4.multiplyByPoint(a, f, f);
        Cesium.Cartesian3.pack(f, b, c);
        d.push(f)
      }
    return d
  },
  updata: function() {
    var a = this.entity.computeModelMatrix(Cesium.JulianDate.fromDate(new Date))
      , b = new Cesium.PlaneGeometry({
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY
    })
      , b = new Cesium.PlaneGeometry.createGeometry(b)
      , a = this.createPrimitiveMatrix(this.plane, this.dimensions, a, Cesium.Ellipsoid.WGS84, a);
    this.position = this.transformPoint(a, b.attributes.position.values)
  },
  setColor: function(a, b) {
    for (var d = this.object, e = 0, c = d.length; e < c; e++)
      a.map.entities.getById(d[e].id)._cylinder._material._color._value = b
  }
};
function EllipsoidFadeMaterialPropertyCeshi(a, b) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime()
}
Cesium.defineProperties(EllipsoidFadeMaterialPropertyCeshi.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
EllipsoidFadeMaterialPropertyCeshi.prototype.getType = function(a) {
  return "EllipsoidFadeCeshi"
}
;
EllipsoidFadeMaterialPropertyCeshi.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
EllipsoidFadeMaterialPropertyCeshi.prototype.equals = function(a) {
  return this === a || a instanceof EllipsoidFadeMaterialPropertyCeshi && Property.equals(this._color, a._color)
}
;
Cesium.EllipsoidFadeMaterialPropertyCeshi = EllipsoidFadeMaterialPropertyCeshi;
Cesium.Material.EllipsoidFadeTypeCeshi = "EllipsoidFadeCeshi";
Cesium.Material.EllipsoidFadeSourceCeshi = "czm_material czm_getMaterial(czm_materialInput materialInput)\n{\nczm_material material \x3d czm_getDefaultMaterial(materialInput);\nmaterial.diffuse \x3d 1.5 * color.rgb;\nvec2 st \x3d materialInput.st;\nfloat dis \x3d distance(st, vec2(0.5, 0.5));\nfloat per \x3d fract(1.0);\nfloat a \x3d time*0.09;\nfloat opacity \x3d 1.0-color.a  * dis / 0.6;\nif(abs(0.49-a)\x3cdis\x26\x26dis \x3c\x3d abs(0.5-a)){\nmaterial.alpha \x3d opacity;\n}else if(abs(0.39-a)\x3cdis\x26\x26dis \x3c\x3d abs(0.4-a)){\nmaterial.alpha \x3d opacity;\n}else if(abs(0.29-a)\x3cdis\x26\x26dis \x3c\x3d abs(0.3-a)){\nmaterial.alpha \x3d opacity;\n}else if(abs(0.19-a)\x3cdis\x26\x26dis \x3c\x3d abs(0.2-a)){\nmaterial.alpha \x3d opacity;\n}else if(abs(0.09-a)\x3cdis\x26\x26dis \x3c\x3d abs(0.1-a)){\nmaterial.alpha \x3d opacity;\n}else {\nmaterial.alpha \x3d 0.0;\n}\nreturn material;\n}";
Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidFadeTypeCeshi, {
  fabric: {
    type: Cesium.Material.EllipsoidFadeTypeCeshi,
    uniforms: {
      color: new Cesium.Color(1,0,0,1),
      time: 1
    },
    source: Cesium.Material.EllipsoidFadeSourceCeshi
  },
  translucent: function(a) {
    return !0
  }
});
LongMap.dynamicCircle = function(a) {
  var b = this;
  b.color = a.color || new LongMap.Color("#ff0000");
  b.duration = a.duration || 100;
  b.position = a.position;
  b.radius = a.radius || 10;
  b.height = a.height || null;
  b.dis = b.radius;
  b.state = !0;
  b._time = (new Date).getTime();
  a = Cesium.Color.fromCssColorString(b.color.hex).withAlpha(1);
  a = b.height ? {
    ellipse: {
      semiMinorAxis: b.dis,
      semiMajorAxis: b.dis,
      material: new Cesium.EllipsoidFadeMaterialPropertyCeshi(a,b.duration),
      show: !0,
      height: b.height
    }
  } : {
    ellipse: {
      semiMinorAxis: b.dis,
      semiMajorAxis: b.dis,
      material: new Cesium.EllipsoidFadeMaterialPropertyCeshi(a,b.duration),
      show: !0
    }
  };
  b.object = a;
  a = function() {
    return b.dis
  }
  ;
  b.object.position = new Cesium.CallbackProperty(function() {
      return b.position.vector()
    }
    ,!1);
  b.object.ellipse.semiMinorAxis = new Cesium.CallbackProperty(a,!1);
  b.object.ellipse.semiMajorAxis = new Cesium.CallbackProperty(a,!1);
  b.object.ellipse.show = new Cesium.CallbackProperty(function() {
      return b.state
    }
    ,!1)
}
;
LongMap.dynamicCircle.prototype = {
  type: "entitie",
  show: function(a) {
    this.state = a
  },
  setPosition: function(a) {
    this.position = a ? a : this.position
  }
};
LongMap.LuminescenceLine = function(a) {
  this.object = null;
  if (a && !(a.points && 2 > a.points.length)) {
    this.type = "primitive";
    this.vertexs = null;
    this.width = a.width || 1;
    this.info = a.info || null;
    this.opacity = 1;
    this.color = Cesium.Color.fromCssColorString("#fff").withAlpha(1);
    this.points = a.points;
    this.uuid = guid();
    this.depth = a.hasOwnProperty("depth") ? a.depth : !0;
    var b = [];
    this.color = a.color || new LongMap.Color("#ffffff",1);
    for (var d = 0; d < this.points.length; d++)
      b.push(this.points[d].spaceCoordinate);
    d = Cesium.Color.fromCssColorString(this.color.hex || "#fff").withAlpha(this.color.opacity || 1);
    a = new Cesium.GeometryInstance({
      geometry: new Cesium.PolylineGeometry({
        positions: b,
        width: a.width
      })
    });
    this.vertexs = a.geometry._positions;
    this.width = a.geometry._width;
    this.object = this.depth ? new Cesium.Primitive({
      geometryInstances: a,
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "PolylineGlow",
            uniforms: {
              color: d,
              glowPower: .05,
              taperPower: .5
            },
            source: "uniform vec4 color;\n\r\n\t\t\t\t\t\t\t\tuniform float glowPower;\n\r\n\t\t\t\t\t\t\t\tvarying float v_width;\n\r\n\t\t\t\t\t\t\t\tczm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\tczm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n\t\t\t\t\t\t\t\tvec2 st \x3d materialInput.st;\n\r\n\t\t\t\t\t\t\t\tfloat glow \x3d glowPower / abs(st.t - 0.5) - (glowPower / 0.5);\n\r\n\t\t\t\t\t\t\t\t// material.emission \x3d max(vec3(glow - 1.0 + color.rgb), color.rgb);\n\r\n\t\t\t\t\t\t\t\tmaterial.emission \x3dcolor.rgb;\n\r\n\t\t\t\t\t\t\t\t// material.alpha \x3d clamp(0.0, 1.0, glow) * color.a;\n\r\n\t\t\t\t\t\t\t\tmaterial.alpha \x3d clamp(0.0, 1.0, glow) * color.a;\n\r\n\t\t\t\t\t\t\t\tif(material.alpha\x3c0.1)\n\r\n\t\t\t\t\t\t\t\t{\n\r\n\t\t\t\t\t\t\t\t\tmaterial.alpha\x3d0.1;\n\r\n\t\t\t\t\t\t\t\t};\n\r\n\t\t\t\t\t\t\t\treturn material;\n\r\n\t\t\t\t\t\t\t\t}\n\r\n\t\t\t\t\t\t\t\t"
          }
        })
      })
    }) : new Cesium.Primitive({
      geometryInstances: a,
      appearance: new Cesium.PolylineMaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "PolylineGlow",
            uniforms: {
              color: d,
              glowPower: .5,
              taperPower: .1
            },
            components: {
              diffuse: "vec3(1.0,0.0,0.0)"
            }
          }
        }),
        renderState: {
          depthTest: !0
        }
      })
    });
    this.object.parentClass = this
  }
}
;
LongMap.LuminescenceLine.prototype = {
  setColor: function(a) {
    this.color = new LongMap.Color(a,this.color.opacity);
    a = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(this.color.opacity);
    this.object._material && (this.object._material.uniforms.color = a)
  },
  rePaint: function() {},
  setStyle: function() {}
};
LongMap.Torus = function(a) {
  if (!a.radius)
    return !1;
  this.object = null;
  this.type = "primitive";
  this.color = Cesium.Color.fromCssColorString(a.color || "#fff").withAlpha(1);
  this.uuid = guid();
  var b = new Cesium.GeometryInstance({
    geometry: new Cesium.EllipseOutlineGeometry({
      center: Cesium.Cartesian3.fromDegrees(a.position.lon, a.position.lat),
      semiMinorAxis: a.radius,
      semiMajorAxis: a.radius
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(this.color)
    },
    id: a.id || ""
  })
    , d = new Cesium.Primitive({
    geometryInstances: b,
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: !0
    })
  });
  !0 === a.fill ? (b = new Cesium.PrimitiveCollection,
    b.add(d),
    d = Cesium.Color.fromCssColorString(a.fillColor || "#fff").withAlpha(a.fillOpacity || .5),
    a = new Cesium.GeometryInstance({
      geometry: new Cesium.EllipseGeometry({
        center: Cesium.Cartesian3.fromDegrees(a.position.lon, a.position.lat),
        semiMinorAxis: a.radius,
        semiMajorAxis: a.radius,
        extrudedHeight: a.extrudedHeight || 0,
        height: a.height
      })
    }),
    a = new Cesium.Primitive({
      geometryInstances: a,
      appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Color",
            uniforms: {
              color: d
            }
          }
        })
      })
    }),
    b.add(a),
    this.object = b) : this.object = d
}
;
LongMap.Curve = function(a) {
  if (!a.positions || a.positions && 2 > a.positions.length)
    return !1;
  this.object = null;
  this.type = "primitive";
  this.width = 30;
  this.opacity = 1;
  this.color = Cesium.Color.fromCssColorString("#fff").withAlpha(1);
  this.vertexs = null;
  this.uuid = guid();
  for (var b = [], d = 0; d < a.positions.length; d++)
    b.push(a.positions[d].lon, a.positions[d].lat);
  b = new Cesium.GeometryInstance({
    geometry: new Cesium.CorridorGeometry({
      positions: Cesium.Cartesian3.fromDegreesArray(b),
      width: a.width
    }),
    id: a.id
  });
  this.vertexs = b.geometry._positions;
  this.width = b.geometry._width || 30;
  this.color = Cesium.Color.fromCssColorString(a.color || "#fff").withAlpha(a.opacity || 1);
  this.opacity = a.opacity || 1;
  this.object = new Cesium.Primitive({
    geometryInstances: b,
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material({
        fabric: {
          type: "Color",
          uniforms: {
            color: this.color
          }
        }
      })
    })
  })
}
;
LongMap.Draw = function(a) {
  function b() {
    var a = {};
    if (2 <= c.path.length)
      var b = c.countLength(c.path);
    if (3 <= c.path.length)
      var d = c.countArea(c.path);
    b && (a.distance = b);
    d && (a.area = d);
    "Circle" === c.drawType && (a.area = Math.PI * a.distance * a.distance);
    a.vertexs = c.points;
    return a
  }
  function d() {
    if (!Cesium.defined(c.movePoints))
      throw new Cesium.DeveloperError("_this.path\u662f\u5fc5\u987b\u7684");
    if (2 > c.movePoints.length)
      throw new Cesium.DeveloperError("\u957f\u5ea6\u5fc5\u987b\u5927\u4e8e\u6216\u7b49\u4e8e2");
    c.moveFeature = {
      polyline: {
        show: !0,
        width: a.lineWidth || 1,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString("Line" == c.drawType ? c.fillColor.hex : c.borderColor.opacity ? c.borderColor.hex : c.fillColor.hex).withAlpha(1)
        }),
        followSurface: !1
      }
    };
    c.moveFeature.polyline.positions = new Cesium.CallbackProperty(function() {
        return c.movePoints
      }
      ,!1);
    c.map.map.entities.add(c.moveFeature);
    c.moveFeature.id = c.map.map.entities._entities._array[c.map.map.entities._entities._array.length - 1]._id
  }
  function e() {
    if (!Cesium.defined(c.movePoints))
      throw new Cesium.DeveloperError("_this.path\u662f\u5fc5\u987b\u7684");
    if (2 > c.movePoints.length)
      throw new Cesium.DeveloperError("\u957f\u5ea6\u5fc5\u987b\u5927\u4e8e\u6216\u7b49\u4e8e2");
    var a = Cesium.Color.fromCssColorString(c.fillColor.hex).withAlpha(.3);
    c.moveFeature = {
      rectangle: {
        material: a,
        outline: !0,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 5,
        height: 0
      }
    };
    c.moveFeature.rectangle.coordinates = new Cesium.CallbackProperty(function() {
        if (2 <= c.movePoints.length) {
          var a = []
            , b = c.map.map.scene.globe.ellipsoid
            , d = c.movePoints[0]
            , d = b.cartesianToCartographic(d)
            , e = Cesium.Math.toDegrees(d.latitude)
            , d = Cesium.Math.toDegrees(d.longitude);
          a.push(new LongMap.Point3(d,e,0));
          d = c.movePoints[1];
          d = b.cartesianToCartographic(d);
          b = Cesium.Math.toDegrees(d.latitude);
          d = Cesium.Math.toDegrees(d.longitude);
          a.push(new LongMap.Point3(d,b,0));
          b = a[0].lon;
          d = a[0].lat;
          e = a[1].lon;
          a = a[1].lat;
          if (b > e)
            var f = e
              , e = b
              , b = f;
          d > a && (f = a,
            a = d,
            d = f);
          return Cesium.Rectangle.fromDegrees(b, d, e, a)
        }
      }
      ,!1);
    c.map.map.entities.add(c.moveFeature);
    c.moveFeature.id = c.map.map.entities._entities._array[c.map.map.entities._entities._array.length - 1]._id
  }
  this.map = null;
  this.type = "Draw";
  this.drawType = a.type;
  this.play = null;
  this.fillColor = a.fillColor || a.borderColor || new LongMap.Color("#fff",1);
  this.borderColor = a.borderColor || new LongMap.Color("#fff",0);
  this.object = null;
  this.path = [];
  var c = this;
  c.depth = a.hasOwnProperty("depth") ? a.depth : !0;
  this._isDraw = !0;
  this.sprites = [];
  this.elId = [];
  this.callback = null;
  this.moveCalb = this.calb = !1;
  c.scale = a.scale || .2;
  c.url = a.url || null;
  c.color = a.color || new LongMap.Color("#ff0000");
  this.count = 0;
  this.direction = a.direction || !1;
  c.feature = null;
  c.moveFeature = null;
  c.maxPoint = a.maxPoint;
  "Rectangle" === c.drawType && (c.maxPoint = 2);
  c.movePoints = [];
  c.points = [];
  c.isDbllick = !0;
  c.clickTimer = function(a) {
    c.isDbllick ? (c.isDbllick = !1,
      c.play = setTimeout(function() {
        painting(a);
        c.isDbllick = !0
      }, 300)) : (dblClick(a),
      c.isDbllick = !0)
  }
  ;
  c.dblClick = function(d) {
    c.play && (clearTimeout(c.play),
      c.play = null);
    var e = d.vector();
    c.moveFeature && (c.map.map.entities.remove(c.moveFeature),
      c.movePoints.length = 0,
      c.moveFeature = null);
    if (d && c._isDraw) {
      var f = new LongMap.Sprite(c.url ? {
        url: c.url,
        position: d,
        scale: c.scale
      } : {
        color: c.color,
        position: d,
        scale: c.scale
      });
      c.object.addFeature(f)
    }
    if (e && c._isDraw)
      if (c.path.push(e),
      3 <= c.path.length && "Plane" === c.drawType) {
        c.feature && (c.object.removeFeature(c.feature),
          c.feature = null);
        for (var g = [], f = 0; f < c.path.length; f++) {
          var k = {};
          k.spaceCoordinate = c.path[f];
          g.push(k)
        }
        f = c.map.map.scene.globe.ellipsoid;
        k = c.path[0];
        k = f.cartesianToCartographic(k);
        g = {
          points: g,
          fillColor: c.fillColor,
          borderColor: c.borderColor,
          height: k.height || 0,
          depth: c.depth
        };
        c.feature = new LongMap.Plane(g);
        c.object.addFeature(c.feature);
        if (c.moveCallback && c.moveCalb) {
          g = JSON.parse(JSON.stringify(c.path)).concat([e]);
          e = {
            position: {
              lon: d.lon,
              lat: d.lat,
              height: d.z
            }
          };
          if (2 <= g.length)
            var p = c.countLength(g)
              , m = Math.abs(d.z - c.points[0].z);
          if (3 <= g.length)
            var n = c.countArea(g);
          p && (e.distance = p);
          m && (e.height = m);
          n && (e.area = n);
          c.moveCallback(e)
        }
      } else if (2 <= c.path.length && "Line" === c.drawType) {
        c.moveCallback && c.moveCalb && (g = JSON.parse(JSON.stringify(c.path)).concat([e]),
          e = {
            position: {
              lon: d.lon,
              lat: d.lat,
              height: d.z
            }
          },
        2 <= g.length && (p = c.countLength(g),
          m = Math.abs(d.z - c.points[0].z)),
        3 <= g.length && (n = c.countArea(g)),
        p && (e.distance = p),
          e.height = m ? m : 0,
        n && (e.area = n),
          c.moveCallback(e));
        c.feature && (c.object.removeFeature(c.feature),
          c.feature = null);
        g = [];
        for (f = 0; f < c.path.length; f++)
          k = {},
            k.spaceCoordinate = c.path[f],
            g.push(k);
        g = {
          points: g,
          color: c.fillColor,
          height: 0,
          depth: c.depth,
          width: a.lineWidth
        };
        c.feature = new LongMap.Line(g);
        c.object.addFeature(c.feature)
      } else
        2 <= c.path.length && "Rectangle" === c.drawType && (2 == c.path.length && (g = [],
          f = c.map.map.scene.globe.ellipsoid,
          k = c.path[0],
          k = f.cartesianToCartographic(k),
          p = Cesium.Math.toDegrees(k.latitude),
          m = Cesium.Math.toDegrees(k.longitude),
          g.push(new LongMap.Point3(m,p,0)),
          k = c.path[1],
          k = f.cartesianToCartographic(k),
          p = Cesium.Math.toDegrees(k.latitude),
          m = Cesium.Math.toDegrees(k.longitude),
          g.push(new LongMap.Point3(m,p,0))),
        c.moveCallback && c.moveCalb && (JSON.parse(JSON.stringify(c.path)).concat([e]),
          e = {
            position: {
              lon: d.lon,
              lat: d.lat,
              height: d.z
            }
          },
          c.moveCallback(e)),
        c.feature && (c.object.removeFeature(c.feature),
          c.feature = null),
          g = {
            points: g,
            fillColor: c.fillColor,
            depth: c.depth
          },
          c.feature = new LongMap.Rectangle(g),
          c.object.addFeature(c.feature));
    c.callback && c.calb && (c.callback(b()),
      c.calb = !1);
    c._isDraw = !1;
    c._isDraw = !1
  }
  ;
  c.drawMove = function(a) {
    if (!c._isDraw || !a || 1 > c.path.length)
      return !1;
    var b = a.vector();
    if (b)
      if ("Line" === c.drawType) {
        if (0 < c.path.length && (c.movePoints = [c.path[c.path.length - 1], b],
        c.moveFeature || d(),
        c.moveCallback && c.moveCalb)) {
          var b = JSON.parse(JSON.stringify(c.path)).concat([b])
            , f = {
            position: {
              lon: a.lon,
              lat: a.lat,
              height: a.z
            }
          };
          if (2 <= b.length)
            var g = c.countLength(b)
              , k = Math.abs(a.z - c.points[0].z);
          if (3 <= b.length)
            var p = c.countArea(b);
          g && (f.distance = g);
          f.height = k ? k : 0;
          p && (f.area = p);
          c.moveCallback(f)
        }
      } else if ("Rectangle" === c.drawType)
        0 < c.path.length && (c.movePoints = [c.path[c.path.length - 1], b],
        c.moveFeature || e(),
        c.moveCallback && c.moveCalb && (b = JSON.parse(JSON.stringify(c.path)).concat([b]),
          f = {
            position: {
              lon: a.lon,
              lat: a.lat,
              height: a.z
            }
          },
        2 <= b.length && (g = c.countLength(b),
          k = Math.abs(a.z - c.points[0].z)),
        3 <= b.length && (p = c.countArea(b)),
        g && (f.distance = g),
          f.height = k ? k : 0,
        p && (f.area = p),
          c.moveCallback(f)));
      else if ("Plane" === c.drawType) {
        var m = c.map.map.scene.globe.ellipsoid
          , n = c.path[0]
          , n = m.cartesianToCartographic(n)
          , q = Cesium.Math.toDegrees(n.latitude)
          , r = Cesium.Math.toDegrees(n.longitude)
          , k = n.height
          , f = Cesium.Cartesian3.fromDegrees(r, q, k)
          , n = m.cartesianToCartographic(b)
          , t = Cesium.Math.toDegrees(n.latitude)
          , n = Cesium.Math.toDegrees(n.longitude)
          , t = Cesium.Cartesian3.fromDegrees(n, t, k);
        1 == c.path.length ? (c.movePoints = [f, t],
        c.moveFeature || d()) : 2 <= c.path.length && (n = c.path[c.path.length - 1],
          n = m.cartesianToCartographic(n),
          q = Cesium.Math.toDegrees(n.latitude),
          r = Cesium.Math.toDegrees(n.longitude),
          m = Cesium.Cartesian3.fromDegrees(r, q, k),
          c.movePoints = [f, t, m],
        c.moveFeature || d(),
        c.moveCallback && c.moveCalb && (b = JSON.parse(JSON.stringify(c.path)).concat([b]),
          f = {
            position: {
              lon: a.lon,
              lat: a.lat,
              height: a.z
            }
          },
        2 <= b.length && (g = c.countLength(b),
          k = Math.abs(a.z - c.points[0].z)),
        3 <= b.length && (p = c.countArea(b)),
        g && (f.distance = g),
          f.height = k ? k : 0,
        p && (f.area = p),
          c.moveCallback(f)))
      }
  }
  ;
  c.painting = function(d) {
    if (c._isDraw && c._isDraw) {
      if (d) {
        var e = new LongMap.Sprite(c.url ? {
          url: c.url,
          position: d,
          scale: c.scale
        } : {
          color: c.color,
          position: d,
          scale: c.scale
        });
        c.object.addFeature(e)
      }
      if (e = d.vector()) {
        c.path.push(e);
        if ("Plane" == c.drawType)
          if (c.moveFeature && (c.object.removeFeature(c.moveFeature),
            c.moveFeature = null),
          c.feature && (c.object.removeFeature(c.feature),
            c.feature = null),
          2 == c.path.length) {
            var f = c.map.map.scene.globe.ellipsoid
              , g = c.path[0]
              , g = f.cartesianToCartographic(g)
              , k = Cesium.Math.toDegrees(g.latitude)
              , p = Cesium.Math.toDegrees(g.longitude)
              , m = g.height
              , n = Cesium.Cartesian3.fromDegrees(p, k, m)
              , g = c.path[1]
              , g = f.cartesianToCartographic(g)
              , f = Cesium.Math.toDegrees(g.latitude)
              , g = Cesium.Math.toDegrees(g.longitude)
              , m = Cesium.Cartesian3.fromDegrees(g, f, m)
              , q = []
              , f = {};
            f.spaceCoordinate = n;
            q.push(f);
            n = {};
            n.spaceCoordinate = m;
            q.push(n);
            q = {
              points: q,
              color: c.fillColor,
              height: 0,
              depth: c.depth
            };
            c.feature = new LongMap.Line(q);
            c.object.addFeature(c.feature)
          } else {
            if (2 < c.path.length) {
              q = [];
              for (g = 0; g < c.path.length; g++)
                f = {},
                  f.spaceCoordinate = c.path[g],
                  q.push(f);
              f = c.map.map.scene.globe.ellipsoid;
              g = c.path[0];
              g = f.cartesianToCartographic(g);
              q = {
                points: q,
                fillColor: c.fillColor,
                borderColor: c.borderColor,
                height: g.height || 0,
                depth: c.depth
              };
              c.feature = new LongMap.Plane(q);
              c.object.addFeature(c.feature);
              if (c.moveCallback && c.moveCalb) {
                f = JSON.parse(JSON.stringify(c.path)).concat([e]);
                g = {
                  position: {
                    lon: d.lon,
                    lat: d.lat,
                    height: d.z
                  }
                };
                2 <= f.length && (n = c.countLength(f),
                  m = Math.abs(d.z - c.points[0].z));
                if (3 <= f.length)
                  var r = c.countArea(f);
                n && (g.distance = n);
                g.height = m ? m : 0;
                r && (g.area = r);
                c.moveCallback(g)
              }
            }
          }
        else if (2 <= c.path.length && "Line" === c.drawType) {
          c.moveCallback && c.moveCalb && (f = JSON.parse(JSON.stringify(c.path)).concat([e]),
            g = {
              position: {
                lon: d.lon,
                lat: d.lat,
                height: d.z
              }
            },
          2 <= f.length && (n = c.countLength(f),
            m = Math.abs(d.z - c.points[0].z)),
          3 <= f.length && (r = c.countArea(f)),
          n && (g.distance = n),
            g.height = m ? m : 0,
          r && (g.area = r),
            c.moveCallback(g));
          c.feature && (c.object.removeFeature(c.feature),
            c.feature = null);
          q = [];
          for (g = 0; g < c.path.length; g++)
            f = {},
              f.spaceCoordinate = c.path[g],
              q.push(f);
          q = {
            points: q,
            color: c.fillColor,
            depth: c.depth,
            width: a.lineWidth
          };
          c.feature = new LongMap.Line(q);
          c.object.addFeature(c.feature)
        } else
          2 <= c.path.length && "Rectangle" === c.drawType && (2 == c.path.length && (q = [],
            f = c.map.map.scene.globe.ellipsoid,
            g = c.path[0],
            g = f.cartesianToCartographic(g),
            k = Cesium.Math.toDegrees(g.latitude),
            p = Cesium.Math.toDegrees(g.longitude),
            m = g.height,
            q.push(new LongMap.Point3(p,k,0)),
            g = c.path[1],
            g = f.cartesianToCartographic(g),
            f = Cesium.Math.toDegrees(g.latitude),
            g = Cesium.Math.toDegrees(g.longitude),
            q.push(new LongMap.Point3(g,f,0))),
          c.moveCallback && c.moveCalb && (f = JSON.parse(JSON.stringify(c.path)).concat([e]),
            g = {
              position: {
                lon: d.lon,
                lat: d.lat,
                height: d.z
              }
            },
          2 <= f.length && (n = c.countLength(f),
            m = Math.abs(d.z - c.points[0].z)),
          3 <= f.length && (r = c.countArea(f)),
          n && (g.distance = n),
            g.height = m ? m : 0,
          r && (g.area = r),
            c.moveCallback(g)),
          c.feature && (c.object.removeFeature(c.feature),
            c.feature = null),
            q = {
              points: q,
              fillColor: c.fillColor,
              depth: c.depth
            },
            c.feature = new LongMap.Rectangle(q),
            c.object.addFeature(c.feature));
        ("Line" == c.drawType || "Rectangle" == c.drawType) && c.maxPoint && c.path.length >= c.maxPoint && (c._isDraw = !1,
        c.moveFeature && (c.map.map.entities.remove(c.moveFeature),
          c.movePoints.length = 0,
          c.moveFeature = null),
        c.isDbllick || (c.callback && c.calb && (c.callback(b()),
          c.calb = !1),
          c._isDraw = !1),
          c._isDraw = !1)
      }
      c.clickCallback && (e = JSON.parse(JSON.stringify(c.path)).concat([e]),
        r = {
          position: d,
          area: 0,
          distance: 0,
          height: 0
        },
      2 <= e.length && (n = c.countLength(e),
        m = Math.abs(d.z - c.points[0].z),
        r.distance = n,
        r.height = m),
      3 <= e.length && (r.area = c.countArea(e)),
        c.clickCallback(r))
    }
  }
  ;
  c.elClick = function(a) {
    if (c.isDbllick)
      c.isDbllick = !1,
        c.play = setTimeout(function() {
          var b = a.point;
          a.point && -10 > a.point.z && (a.point.z = 0,
            b = a.terrainPosition);
          c.points.push(b);
          c.painting(b);
          c.isDbllick = !0
        }, 300);
    else
      return c.isDbllick = !0,
        !1
  }
  ;
  c.elDbl = function(a) {
    var b = a.point;
    a.point && -10 > a.point.z && (a.point.z = 0,
      b = a.terrainPosition);
    c.points.push(b);
    c.dblClick(b);
    c.isDbllick = !0
  }
  ;
  c.elMove = function(a) {
    if (c._isDraw) {
      var b = a.point;
      a.point && -10 > a.point.z && (a.point.z = 0,
        b = a.terrainPosition);
      c.drawMove(b)
    }
  }
  ;
  LongMap.Draw.prototype.start = function() {
    c = this;
    c._isDraw = !0;
    c.callback && (c.calb = !0)
  }
  ;
  LongMap.Draw.prototype.end = function() {
    c = this;
    c._isDraw = !1;
    c.moveFeature && (c.map.map.entities.remove(c.moveFeature),
      c.movePoints.length = 0,
      c.moveFeature = null)
  }
  ;
  LongMap.Draw.prototype.resetd = function() {
    c = this;
    c._isDraw = !0;
    c.moveFeature && (c.map.map.entities.remove(c.moveFeature),
      c.movePoints.length = 0,
      c.moveFeature = null);
    c.feature && (c.object.removeFeature(c.feature),
      c.feature = null);
    c.path.length = 0;
    c.sprites.length = 0;
    c.elId.length = 0;
    c.callback && (c.calb = !0)
  }
  ;
  LongMap.Draw.prototype.countArea = function(a) {
    for (var b = [], c = new Cesium.WebMercatorProjection, d = 0; d < a.length; d++) {
      var e = Cesium.Cartographic.fromCartesian(a[d]);
      b.push(c.project(e))
    }
    b.push(b[0]);
    for (d = a = 0; d < b.length - 1; d++)
      a += b[d].x * b[(d + 1) % b.length].y - b[(d + 1) % b.length].x * b[d].y;
    return Math.abs(.5 * a)
  }
  ;
  LongMap.Draw.prototype.countHeight = function(a) {
    var b = 0;
    new Cesium.WebMercatorProjection;
    for (var c = [], d = this.map.map.scene.globe.ellipsoid, e = 0; e < a.length; e++) {
      var b = d.cartesianToCartographic(a[e])
        , f = Cesium.Math.toDegrees(b.latitude)
        , m = Cesium.Math.toDegrees(b.longitude)
        , b = b.height;
      c.push({
        lon: m,
        lat: f,
        z: b
      })
    }
    for (e = 0; e < c.length - 1; e++)
      b += c[e].z - c[e + 1].z;
    return Math.abs(b)
  }
  ;
  LongMap.Draw.prototype.countLength = function(a) {
    for (var b = 0, c = new Cesium.WebMercatorProjection, d = [], e = 0; e < a.length; e++) {
      var f = Cesium.Cartographic.fromCartesian(a[e]);
      d.push(c.project(f))
    }
    for (e = 0; e < d.length - 1; e++) {
      a = d[e].x;
      var c = d[e].y
        , f = d[e + 1].x
        , m = d[e + 1].y
        , b = b + Math.sqrt((a - f) * (a - f) + (c - m) * (c - m))
    }
    return b
  }
  ;
  LongMap.Draw.prototype.on = function(a, b) {
    if (b)
      switch (a) {
        case "drawed":
          c.callback = b;
          this.calb = !0;
          break;
        case "move":
          c.moveCallback = b;
          this.moveCalb = !0;
          break;
        case "click":
          c.clickCallback = b,
            this.clickCalb = !0
      }
  }
}
;
LongMap.Draw.prototype = {
  constructor: LongMap.Draw,
  init: function() {
    this.drawType && (this.object = new LongMap.Layer,
      this.map.addLayer(this.object),
    this.borderOpacity || this.fillOpacity || (this.fillOpacity = .01),
      this.map.addEventListener("mousemove", this.elMove),
      this.map.addEventListener("dblclick", this.elDbl),
      this.map.addEventListener("click", this.elClick))
  },
  reInit: function() {
    this.map.removeLayer(this.object);
    this.moveFeature && (this.movePoints.length = 0,
      this.map.map.entities.remove(this.moveFeature),
      this.moveFeature = null);
    this.map.removeEventListener("mousemove", this.elMove);
    this.map.removeEventListener("click", this.elClick);
    this.map.removeEventListener("dblclick", this.elDbl)
  }
};
var CameraMode1 = function(a) {
  this.map = a;
  this.event = {
    mousedown: null,
    mouseup: null,
    mousemove: null,
    clockEvent: null
  }
};
CameraMode1.prototype = {
  setType: function(a) {
    var b = this.map.map
      , d = this.map.map.scene
      , e = this.map.map.canvas;
    e.setAttribute("tabindex", "0");
    e.onclick = function() {
      e.focus()
    }
    ;
    this.removeEvent();
    if (0 == a)
      d.screenSpaceCameraController.enableRotate = !0,
        d.screenSpaceCameraController.enableTranslate = !0,
        d.screenSpaceCameraController.enableZoom = !0,
        d.screenSpaceCameraController.enableTilt = !0,
        d.screenSpaceCameraController.enableLook = !0;
    else if (1 == a) {
      d.screenSpaceCameraController.enableRotate = !1;
      d.screenSpaceCameraController.enableTranslate = !1;
      d.screenSpaceCameraController.enableZoom = !1;
      d.screenSpaceCameraController.enableTilt = !1;
      d.screenSpaceCameraController.enableLook = !1;
      var c, f, h = !1;
      this.event.mousedown = function(a) {
        h = !0;
        f = c = Cesium.Cartesian3.clone(a.position)
      }
      ;
      this.event.mouseup = function(a) {
        h = !1
      }
      ;
      this.event.mousemove = function(a) {
        f = a.endPosition
      }
      ;
      this.event.clockEvent = function(a) {
        a = b.camera;
        if (h) {
          var d = -(f.y - c.y) / e.clientHeight;
          a.lookRight((f.x - c.x) / e.clientWidth * .05);
          a.lookUp(.05 * d)
        }
      }
      ;
      this.map.addEventListener("mousedown", this.event.mousedown);
      this.map.addEventListener("mouseup", this.event.mouseup);
      this.map.addEventListener("mousemove", this.event.mousemove);
      this.map.map.clock.onTick.addEventListener(this.event.clockEvent)
    }
  },
  setCamera: function(a) {
    this.map && this.map.map.camera.setView({
      destination: a.vector(),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(5),
        roll: 0
      }
    })
  },
  removeEvent: function() {
    this.map && (this.event.mousedown && (this.map.removeEventListener("mousedown", this.event.mousedown),
      this.event.mousedown = null),
    this.event.mouseup && (this.map.removeEventListener("mouseup", this.event.mouseup),
      this.event.mouseup = null),
    this.event.mousemove && (this.map.removeEventListener("mousemove", this.event.mousemove),
      this.event.mousemove = null),
    this.event.clockEvent && (this.map.map.clock.onTick.removeEventListener(this.event.clockEvent),
      this.event.clockEvent = null))
  }
};
var czml = [{
  id: "document",
  version: "1.0"
}, {
  id: "test",
  availability: "2019-11-11T11:00:00Z/2019-11-11T13:04:54.9962195740191Z",
  orientation: {
    velocityReference: "#position"
  },
  path: {
    material: {
      solidColor: {
        color: {
          interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
          rgba: [255, 255, 0, 255]
        }
      }
    },
    width: [{
      interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
      number: 5
    }],
    show: [{
      interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
      "boolean": !1
    }]
  },
  position: {
    interpolationAlgorithm: "LAGRANGE",
    interpolationDegree: 1,
    epoch: "2019-11-11T11:00:00Z",
    cartographicDegrees: []
  }
}]
  , czml_label = {
  fillColor: [{
    interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
    rgba: [255, 0, 0, 255]
  }],
  font: "bold 10pt Segoe UI Semibold",
  horizontalOrigin: "CENTER",
  outlineColor: {
    rgba: [0, 0, 0, 255]
  },
  pixelOffset: {
    cartesian2: [0, 0]
  },
  scale: 1,
  show: [{
    interval: "2019-11-11T11:00:00Z/2019-11-11T13:00:00Z",
    "boolean": !0
  }],
  style: "FILL",
  text: "Test Vehicle",
  verticalOrigin: "CENTER"
}
  , czml_billboard = {
  eyeOffset: {
    cartesian: [0, 0, 0]
  },
  horizontalOrigin: "CENTER",
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACvSURBVDhPrZDRDcMgDAU9GqN0lIzijw6SUbJJygUeNQgSqepJTyHG91LVVpwDdfxM3T9TSl1EXZvDwii471fivK73cBFFQNTT/d2KoGpfGOpSIkhUpgUMxq9DFEsWv4IXhlyCnhBFnZcFEEuYqbiUlNwWgMTdrZ3JbQFoEVG53rd8ztG9aPJMnBUQf/VFraBJeWnLS0RfjbKyLJA8FkT5seDYS1Qwyv8t0B/5C2ZmH2/eTGNNBgMmAAAAAElFTkSuQmCC",
  pixelOffset: {
    cartesian2: [0, 0]
  },
  scale: 1.5,
  show: !0,
  verticalOrigin: "CENTER"
}
  , czml_model = {
  gltf: "",
  minimumPixelSize: 2,
  maximumScale: 1,
  scale: .02
}
  , Route = function(a) {
  this.map = null;
  this.points = a.points;
  this.model = a.model;
  this.label = a.label;
  this.maker = a.maker;
  this.route = a.route;
  this.speed = a.speed || 1E3;
  this.maxTimer = 0;
  this.onload = null;
  this.height = a.hasOwnProperty("height") ? a.height : 0
};
Route.prototype = {
  init: function() {
    var a = this;
    if (this.map) {
      var b = JSON.parse(JSON.stringify(czml));
      if (this.route) {
        for (var d = [], e = 0, c = 0; c < this.route.length - 1; c++)
          e += this.route[c].distanceTo(this.route[c + 1]);
        d.push(0, this.route[0].lon, this.route[0].lat, this.route[0].z + this.height);
        e = 0;
        for (c = 1; c < this.route.length; c++) {
          var f = this.route[c - 1].distanceTo(this.route[c]);
          if (5 >= f && this.route[c + 1]) {
            var e = e + 100
              , f = this.route[c].vector()
              , h = this.route[c + 1].vector()
              , h = new Cesium.Cartesian3(h.x - f.x,h.y - f.y,h.z - f.z)
              , h = Cesium.Cartesian3.normalize(h, h);
            f.x += h.x;
            f.y += h.y;
            f.z += h.z;
            f = (new LongMap.Point3(0,0,0)).fromVector(f);
            d.push(e, f.lon, f.lat, f.z + this.height)
          } else
            e += f,
              d.push(e, this.route[c].lon, this.route[c].lat, this.route[c].z + this.height);
          a.maxTimer = e
        }
        b[1].position.cartographicDegrees = d
      }
      this.label && (d = JSON.parse(JSON.stringify(czml_label)),
        d.text = this.label.text,
        b[1].label = d);
      this.model && (d = JSON.parse(JSON.stringify(czml_model)),
        d.gltf = this.model.url,
        b[1].model = d);
      this.maker && (d = JSON.parse(JSON.stringify(czml_billboard)),
        d.image = this.maker.url,
        b[1].billboard = d);
      this.dataSourcePromise = Cesium.CzmlDataSource.load(b);
      this.dataSourcePromise.then(function(b) {
        a.dataSourcePromise = b;
        a.onload && a.onload(a)
      });
      this.map.dataSources.add(this.dataSourcePromise)
    } else
      console.error("\u64cd\u4f5c\u4e0d\u6b63\u786e")
  },
  remove: function() {
    this.dataSourcePromise.entities.removeAll();
    this.map.dataSources.remove(this.dataSourcePromise);
    this.map = null
  },
  follow: function() {
    this.map.trackedEntity = this.dataSourcePromise.entities.getById("test")
  },
  play: function() {},
  cause: function() {}
};
LongMap.Route = Route;
LongMap.Shadow = function(a) {
  this.map = null;
  this.position = a.position || null;
  if (!this.position)
    return !1;
  this.heading = a.heading || 0;
  this.pitch = a.pitch || 0;
  this.range = a.range || 1E7
}
;
LongMap.Shadow.prototype = {
  init: function() {
    if (!this.map)
      return !1;
    var a = new Cesium.Camera(this.map.scene);
    a.direction = Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3);
    a.up = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y);
    a.frustum.fov = Cesium.Math.PI_OVER_THREE;
    a.frustum.near = 1;
    a.frustum.far = 2;
    this.map.scene.shadowMap._lightCamera = a;
    this.map.scene.shadowMap.size = 16384;
    this.map.scene.shadowMap.softShadows = !0;
    var b = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(this.position.lon, this.position.lat));
    this.map.scene.shadowMap._lightCamera.lookAtTransform(b, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading),Cesium.Math.toRadians(this.pitch),this.range));
    this.object = a
  },
  setHeading: function(a) {
    this.heading = a;
    if (!this.map)
      return !1;
    a = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(this.position.lon, this.position.lat));
    this.map.scene.shadowMap._lightCamera.lookAtTransform(a, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading),Cesium.Math.toRadians(this.pitch),this.range))
  },
  setPitch: function(a) {
    this.pitch = a;
    if (!this.map)
      return !1;
    a = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(this.position.lon, this.position.lat));
    this.map.scene.shadowMap._lightCamera.lookAtTransform(a, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading),Cesium.Math.toRadians(this.pitch),this.range))
  },
  setRange: function(a) {
    this.range = a;
    if (!this.map)
      return !1;
    a = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(this.position.lon, this.position.lat));
    this.map.scene.shadowMap._lightCamera.lookAtTransform(a, new Cesium.HeadingPitchRange(Cesium.Math.toRadians(this.heading),Cesium.Math.toRadians(this.pitch),this.range))
  }
};
LongMap.Snow = function(a) {
  this.width = a.width;
  this.snowRadius = a.radius;
  this.position = a.position;
  this.src = a.src;
  this.time = a.time;
  this.number = a.number;
  this.speed = a.speed || 1
}
;
LongMap.Snow.prototype = {
  constructor: LongMap.Snow,
  init: function() {
    var a = new Cesium.Cartesian2(this.width,this.width), b = new Cesium.Cartesian2(2 * this.width,2 * this.width), d, e = new Cesium.Cartesian3, c = this.map.scene.camera.position, f = this.snowRadius, h = this.speed;
    this.object = d = new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(this.position.spaceCoordinate),
      minimumSpeed: -1,
      maximumSpeed: 0,
      lifetime: this.time,
      emitter: new Cesium.SphereEmitter(f),
      startScale: .5,
      endScale: 1,
      image: this.src,
      emissionRate: this.number,
      startColor: Cesium.Color.WHITE.withAlpha(.2),
      endColor: Cesium.Color.WHITE.withAlpha(1),
      minimumImageSize: a,
      maximumImageSize: b,
      updateCallback: function(a, b) {
        e = Cesium.Cartesian3.normalize(a.position, e);
        Cesium.Cartesian3.multiplyByScalar(e, -h, e);
        a.velocity = Cesium.Cartesian3.add(a.velocity, e, a.velocity);
        b = Cesium.Cartesian3.distance(c, a.position);
        a.endColor.alpha = b > f ? 0 : d.endColor.alpha / (b / f + .1)
      }
    });
    this.map.scene.primitives.add(this.object)
  },
  reInit: function() {
    this.map.scene.primitives.remove(this.object);
    for (i in this)
      this[i] = null
  }
};
LongMap.Rain = function(a) {
  this.width = a.width;
  this.height = a.height;
  this.rainRadius = a.radius;
  this.position = a.position;
  this.src = a.src;
  this.time = a.time;
  this.number = a.number;
  this.startColor = a.startColor || new LongMap.Color("#777777",0);
  this.endColor = a.endColor || new LongMap.Color("#777777",1);
  this.speed = a.speed || 5
}
;
LongMap.Rain.prototype = {
  constructor: LongMap.Rain,
  init: function() {
    var a, b = new Cesium.Cartesian3, d = this.map.scene.camera.position, e = this.rainRadius, c = this.speed;
    this.object = a = new Cesium.ParticleSystem({
      modelMatrix: new Cesium.Matrix4.fromTranslation(this.position.spaceCoordinate),
      speed: -1,
      lifetime: this.time,
      emitter: new Cesium.SphereEmitter(e),
      startScale: 1,
      endScale: 0,
      image: this.src,
      emissionRate: this.number,
      startColor: Cesium.Color.fromCssColorString(this.startColor.hex).withAlpha(this.startColor.opacity),
      endColor: Cesium.Color.fromCssColorString(this.endColor.hex).withAlpha(this.endColor.opacity),
      imageSize: new Cesium.Cartesian2(this.width,this.height),
      updateCallback: function(f, h) {
        b = Cesium.Cartesian3.normalize(f.position, b);
        Cesium.Cartesian3.multiplyByScalar(b, -c, b);
        f.position = Cesium.Cartesian3.add(f.position, b, f.position);
        h = Cesium.Cartesian3.distance(d, f.position);
        f.endColor.alpha = h > e ? 0 : a.endColor.alpha / (h / e + .1)
      }
    });
    this.map.scene.primitives.add(this.object)
  },
  reInit: function() {
    this.map.scene.primitives.remove(this.object);
    for (i in this)
      this[i] = null
  }
};
LongMap.Flame = function(a) {
  this.width = a.width;
  this.height = a.height;
  this.rainRadius = a.radius;
  this.position = a.position;
  this.src = a.src;
  this.time = a.time;
  this.number = a.number;
  this.startColor = a.startColor || new LongMap.Color("#ff0000",1);
  this.endColor = a.endColor || new LongMap.Color("#ea4",.2);
  this.speed = a.speed || .2
}
;
LongMap.Flame.prototype = {
  constructor: LongMap.Flame,
  init: function() {
    var a = new Cesium.Cartesian3
      , b = this.speed
      , d = this.position.spaceCoordinate;
    this.object = new Cesium.ParticleSystem({
      image: this.src,
      startScale: 1,
      endScale: 4,
      particleLife: 1,
      speed: 1,
      imageSize: new Cesium.Cartesian2(this.width,this.height),
      emissionRate: this.number,
      lifetime: this.time,
      modelMatrix: new Cesium.Matrix4.fromTranslation(d),
      updateCallback: function(d, c) {
        Cesium.Cartesian3.normalize(d.position, a);
        Cesium.Cartesian3.multiplyByScalar(a, b, a);
        d.velocity = Cesium.Cartesian3.add(d.velocity, a, d.velocity)
      },
      emitter: new Cesium.SphereEmitter(this.rainRadius),
      startColor: Cesium.Color.fromCssColorString(this.startColor.hex).withAlpha(this.startColor.opacity),
      endColor: Cesium.Color.fromCssColorString(this.endColor.hex).withAlpha(this.endColor.opacity)
    });
    this.map.scene.primitives.add(this.object)
  },
  reInit: function() {
    this.map.scene.primitives.remove(this.object);
    for (i in this)
      this[i] = null
  }
};
LongMap.LoaderBIM = function(a) {
  a.url || console.error("\u8bf7\u8f93\u5165\u5730\u5740");
  this.url = a.url;
  this.position = a.position || null;
  this.map = null;
  this.click = [];
  this.mousedown = [];
  this.mouseup = [];
  this.mousemove = [];
  this.touchstart = [];
  this.touchmove = [];
  this.touchend = [];
  this.dblclick = [];
  this.maximumScreenSpaceError = a.maximumScreenSpaceError || 32;
  this.maximumNumberOfLoadedTiles = a.maximumNumberOfLoadedTiles || 32;
  this.preloadWhenMHidden = a.preloadWhenMHidden || !1
}
;
LongMap.LoaderBIM.prototype = {
  type: "LoaderBIM",
  init: function() {
    function a(a) {
      return Cesium.defined(a) && Cesium.defined(a.getProperty) ? parseInt(a.getProperty("DbId"), 10) : -1
    }
    function b(a, b) {
      if (a !== q && (a === t && d(),
        e(),
        q = a,
        !(0 > q))) {
        g.map.selectedEntity = z;
        var c = g.title.url.lastIndexOf("/")
          , c = -1 == c ? "." : g.title.url.substr(0, c);
        fetch(c + "/info/" + parseInt(a / 100) + ".json").then(function(a) {
          return a.json()
        }).then(function(c) {
          if (q === a) {
            c = c.data[a + ""];
            z.name = c.name || "\x3cnull\x3e";
            for (var d = [], e = !0, f = 0; f < c.categories.length; f++) {
              for (var g = c.categories[f], h = g.props, k = g.count, m = !1, p = {
                className: null,
                infoName: [],
                infoValue: []
              }, l = 0; l < k; l++)
                if (h.flags[l])
                  e = !1;
                else {
                  m || (m = !0,
                    p.className = "" + g.name);
                  var n = h.values[l];
                  switch (h.types[l]) {
                    case "boolean":
                      n = n ? "Yes" : "No";
                      break;
                    case "double":
                      n = h.units[l] ? n.toFixed(3) + " " + h.units[l] : "" + n.toFixed(3);
                      break;
                    default:
                      n += ""
                  }
                  p.infoName.push("" + h.names[l]);
                  p.infoValue.push("" + n)
                }
              e && d.push(p);
              e = !0
            }
            c = {
              name: c.name,
              info: d
            };
            b && b(c)
          }
        })["catch"](function(a) {});
        for (var c = $jscomp.makeIterator(p[a]), f = c.next(); !f.done; f = c.next())
          f = f.value,
            n.push({
              feature: f,
              originalColor: Cesium.Color.clone(f.color)
            }),
            f.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, .3)
      }
    }
    function d() {
      if (!(0 > t)) {
        if (0 < r.length) {
          for (var a = $jscomp.makeIterator(r), b = a.next(); !b.done; b = a.next())
            b = b.value,
              b.feature.color = b.originalColor;
          r = []
        }
        t = -1
      }
    }
    function e() {
      if (0 < n.length) {
        for (var a = $jscomp.makeIterator(n), b = a.next(); !b.done; b = a.next())
          b = b.value,
            b.feature.color = b.originalColor;
        n = []
      }
      q = -1;
      g.map.selectedEntity === z && (g.map.selectedEntity = null)
    }
    function c(b) {
      var c = a(b)
        , d = p[c];
      d.splice(d.findIndex(function(a) {
        return a.feature === b
      }), 1);
      c === q && n.splice(n.findIndex(function(a) {
        return a.feature === b
      }), 1);
      c === r && r.splice(r.findIndex(function(a) {
        return a.feature === b
      }), 1)
    }
    function f(b) {
      var c = a(b)
        , d = p[c];
      Cesium.defined(d) || (p[c] = d = []);
      d.push(b);
      -1 < m.indexOf(c) && (b.show = !1)
    }
    function h(a, b) {
      for (var c = a.featuresLength, d = 0; d < c; ++d) {
        var e = a.getFeature(d);
        b(e)
      }
    }
    function l(a, b) {
      var c = a.content;
      a = c.innerContents;
      if (Cesium.defined(a))
        for (var c = a.length, d = 0; d < c; ++d)
          h(a[d], b);
      else
        h(c, b)
    }
    var g = this;
    if (!g.map)
      return !1;
    var k = g.position
      , k = k ? Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(k.lon, k.lat, k.z)) : Cesium.Matrix4.IDENTITY
      , k = new Cesium.Cesium3DTileset({
      url: g.url,
      show: !0,
      maximumScreenSpaceError: g.maximumScreenSpaceError,
      maximumNumberOfLoadedTiles: g.maximumNumberOfLoadedTiles,
      preloadWhenMHidden: g.preloadWhenMHidden,
      modelMatrix: k
    });
    g.title = k;
    var p = {}
      , m = []
      , n = []
      , q = -1
      , r = []
      , t = -1
      , z = new Cesium.Entity;
    g.title.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE;
    var B = new Cesium.ScreenSpaceEventHandler(g.map.scene.canvas);
    (function() {
        this.event = {
          click: "LEFT_CLICK",
          mousedown: "LEFT_DOWN",
          mouseup: "LEFT_UP",
          mousemove: "MOUSE_MOVE",
          touchstart: "PINCH_START",
          touchmove: "PINCH_MOVE",
          touchend: "PINCH_END",
          dblckick: "LEFT_DOUBLE_CLICK",
          rightCkick: "RIGHT_CLICK"
        };
        B.setInputAction(function(c) {
          g.click.forEach(function(d) {
            var f = g.map.scene.pick(c.position);
            if (Cesium.defined(f) && f instanceof Cesium.Cesium3DTileFeature && f.tileset === g.title)
              f = a(f),
                f === q ? e() : b(f, d);
            else
              return !1
          })
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        B.setInputAction(function(b) {
          g.mousemove.forEach(function(c) {
            c = g.map.scene.pick(b.endPosition);
            if (Cesium.defined(c) && c instanceof Cesium.Cesium3DTileFeature && c.tileset === g.title) {
              if (c = a(c),
              c !== t && (d(),
                t = c,
                !(t === q || 0 > t))) {
                c = $jscomp.makeIterator(p[c]);
                for (var e = c.next(); !e.done; e = c.next())
                  e = e.value,
                    r.push({
                      feature: e,
                      originalColor: Cesium.Color.clone(e.color)
                    }),
                    e.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, .3)
              }
            } else
              d()
          })
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      }
    )();
    g.title.tileLoad.addEventListener(function(a) {
      l(a, f)
    });
    g.title.tileUnload.addEventListener(function(a) {
      l(a, c)
    })
  },
  reInit: function() {
    this.map.scene.primitives.remove(this.title)
  },
  addEventListener: function(a, b) {
    switch (a) {
      case "click":
        this.click.push(b);
        break;
      case "mousedown":
        this.mousedown.push(b);
        break;
      case "mouseup":
        this.mouseup.push(b);
        break;
      case "mousemove":
        this.mousemove.push(b);
        break;
      case "touchstart":
        this.touchstart.push(b);
        break;
      case "touchmove":
        this.touchmove.push(b);
        break;
      case "touchend":
        this.touchend.push(b);
        break;
      case "dblclick":
        this.dblclick.push(b);
        break;
      default:
        console.error("type\u5c5e\u6027\u9519\u8bef")
    }
  },
  removeEventListener: function(a, b) {
    var d = null;
    switch (a) {
      case "click":
        d = click;
        break;
      case "mousedown":
        d = mousedown;
        break;
      case "mouseup":
        d = mouseup;
        break;
      case "mousemove":
        d = mousemove;
        break;
      case "touchstart":
        d = touchstart;
        break;
      case "touchmove":
        d = touchmove;
        break;
      case "touchend":
        d = touchend;
        break;
      case "dblclick":
        d = dblclick;
        break;
      default:
        console.error("type\u5c5e\u6027\u9519\u8bef")
    }
    for (a = 0; a < d.length; )
      if (b == d[a]) {
        d.splice(a, 1);
        break
      } else
        a++
  }
};
LongMap.LoaderKML = function(a) {
  this.url = a;
  this.map = this.object = null
}
;
LongMap.LoaderKML.prototype = {
  constructor: LongMap.LoaderKML,
  init: function() {
    var a = this;
    a.a = Cesium.KmlDataSource.load(a.url, {
      camera: a.map.map.scene.camera,
      canvas: a.map.map.scene.canvas,
      clampToGround: !0
    });
    a.a.then(function(b) {
      a.map.map.dataSources.add(a.a);
      a.object = b;
      b = dataSources.entities.values;
      for (var d = 0; d < b.length; d++) {
        var e = b[d];
        Cesium.defined(e.polyline) && (e.polyline.clampToGround = !0)
      }
    })
  },
  reInit: function() {
    for (item in this.a)
      this[item] = null;
    this.a = null;
    this.object && this.map.map.dataSources.remove(this.object, !0)
  }
};
LongMap.Flood = function(a) {
  this.points = a.points;
  this.speed = a.speed;
  this.minimum = a.minimum;
  this.highest = a.highest;
  this.map = this.timer = null;
  this.uuid = guid()
}
;
LongMap.Flood.prototype = {
  type: "entitie",
  init: function() {
    for (var a = [], b = 0; b < this.points.length; b++)
      a.push(this.points[b].lon, this.points[b].lat, 0);
    this.feature = {
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(a),
        material: new Cesium.Color.fromBytes(64,157,253,150),
        perPositionHeight: !0,
        extrudedHeight: this.minimum
      }
    };
    this.object = this.map.map.entities.add(this.feature);
    this.feature.id = this.map.map.entities._entities._array[this.map.map.entities._entities._array.length - 1]._id
  },
  reInit: function() {
    this.map.map.entities.remove(this.feature);
    window.clearTimeout(this.timer);
    this.timer = null
  },
  play: function() {
    for (var a = this, b = [], d = 0; d < a.points.length; d++)
      b.push(a.points[d].lon, a.points[d].lat, 0);
    var e = parseFloat(a.speed) / 10
      , c = a.minimum;
    (function() {
        a.timer = setInterval(function() {
          c < a.highest && (c += e,
          c > a.highest && (c = a.highest),
            a.object.polygon.extrudedHeight = new Cesium.CallbackProperty(function() {
                return c
              }
              ,!1),
          c >= a.highest && (window.clearTimeout(a.timer),
            b.length = 0,
            a.timer = null))
        }, 100)
      }
    )()
  },
  setMinimum: function(a) {
    this.minimum = a
  },
  setHighest: function(a) {
    this.highest = a
  },
  setSpeed: function(a) {
    this.speed = a
  }
};
LongMap.LimitHeight = function(a) {
  this.points = a.points;
  this.layer = a.layer;
  this.features = [];
  this.heightPlane = null;
  this.uuid = guid()
}
;
LongMap.LimitHeight.prototype = {
  init: function() {
    for (var a = 0; a < this.points.length; a++)
      for (var b = 0; b < this.points[a].length; b++) {
        for (var d = [], e = 0; e < this.points[a][b].points[0].length; e++) {
          var c = this.points[a][b].points[0][e];
          d.push(new LongMap.Point3(c[0],c[1],c[2]))
        }
        d = {
          points: d,
          fillColor: new LongMap.Color("#ffffff"),
          extrudedHeight: this.points[a][b].height,
          info: this.points[a][b].html
        };
        d = new LongMap.Plane(d);
        this.layer.addFeature(d);
        this.features.push(d)
      }
  },
  setPlane: function(a) {
    this.removePlane();
    var b = a.points
      , d = a.height;
    a = a.color || new LongMap.Color("#3366cc",.5);
    var e = {
      points: b,
      fillColor: a,
      height: d
    };
    this.heightPlane = e = new LongMap.Plane(e);
    this.layer.addFeature(e);
    for (e = 0; e < this.features.length; e++)
      this.layer.removeFeature(this.features[e]);
    for (a = this.features.length = 0; a < this.points.length; a++)
      for (var c = 0; c < this.points[a].length; c++) {
        b = [];
        for (e = 0; e < this.points[a][c].points[0].length; e++) {
          var f = this.points[a][c].points[0][e];
          b.push(new LongMap.Point3(f[0],f[1],f[2]))
        }
        this.points[a][c].height > d ? (e = {
          points: b,
          fillColor: new LongMap.Color("#ffffff"),
          extrudedHeight: d,
          info: this.points[a][c].html
        },
          e = new LongMap.Plane(e),
          this.layer.addFeature(e),
          this.features.push(e),
          b = {
            points: b,
            fillColor: new LongMap.Color("#ff0000"),
            extrudedHeight: this.points[a][c].height,
            info: this.points[a][c].html,
            height: d
          },
          b = new LongMap.Plane(b),
          this.layer.addFeature(b),
          this.features.push(b)) : (e = {
          points: b,
          fillColor: new LongMap.Color("#ffffff"),
          extrudedHeight: this.points[a][c].height,
          info: this.points[a][c].html
        },
          e = new LongMap.Plane(e),
          this.layer.addFeature(e),
          this.features.push(e))
      }
  },
  removePlane: function() {
    this.heightPlane && (this.layer.removeFeature(this.heightPlane),
      this.heightPlane = null)
  },
  reInit: function() {
    this.removePlane();
    for (var a = 0; a < this.features.length; a++)
      this.layer.removeFeature(this.features[a]);
    this.features.length = 0
  }
};
(function() {
    Object.defineProperty(Cesium, "__esModule", {
      value: !0
    });
    Cesium.TerrainClipPlan = void 0;
    var a = function() {
      function a(a, b) {
        for (var c = 0; c < b.length; c++) {
          var d = b[c];
          d.enumerable = d.enumerable || !1;
          d.configurable = !0;
          "value"in d && (d.writable = !0);
          Object.defineProperty(a, d.key, d)
        }
      }
      return function(b, e, c) {
        return e && a(b.prototype, e),
        c && a(b, c),
          b
      }
    }();
    Cesium.TerrainClipPlan = function() {
      function b(a, e) {
        if (!(this instanceof b))
          throw new TypeError("Cannot call a class as a function");
        this.viewer = a;
        this.options = e || {};
        this._positions = e.positions;
        this._height = this.options.height || 0;
        this.bottomImg = e.bottomImg;
        this.wallImg = e.wallImg;
        this.splitNum = Cesium.defaultValue(e.splitNum, 50);
        this._positions && 0 < this._positions.length && this.updateData(this._positions)
      }
      return a(b, [{
        key: "updateData",
        value: function(a) {
          this.clear();
          this._positions = a;
          for (var b = [], c = 0; c < a.length; c++)
            b.push(a[c].spaceCoordinate);
          a = [];
          var d = b.length
            , h = new Cesium.Cartesian3
            , h = Cesium.Cartesian3.subtract(b[0], b[1], h)
            , h = 0 < h.x;
          this.excavateMinHeight = 9999;
          for (var l = 0; l < d; ++l) {
            var g = (l + 1) % d
              , c = Cesium.Cartesian3.midpoint(b[l], b[g], new Cesium.Cartesian3)
              , k = Cesium.Cartographic.fromCartesian(b[l])
              , k = this.viewer.scene.globe.getHeight(k) || k.height;
            k < this.excavateMinHeight && (this.excavateMinHeight = k);
            k = Cesium.Cartesian3.normalize(c, new Cesium.Cartesian3);
            g = h ? Cesium.Cartesian3.subtract(b[l], c, new Cesium.Cartesian3) : Cesium.Cartesian3.subtract(b[g], c, new Cesium.Cartesian3);
            g = Cesium.Cartesian3.normalize(g, g);
            g = Cesium.Cartesian3.cross(g, k, new Cesium.Cartesian3);
            g = Cesium.Cartesian3.normalize(g, g);
            k = new Cesium.Plane(g,0);
            c = Cesium.Plane.getPointDistance(k, c);
            a.push(new Cesium.ClippingPlane(g,c))
          }
          this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: a,
            edgeWidth: 1,
            edgeColor: Cesium.Color.WHITE,
            enabled: !0
          });
          this._prepareWell(b);
          this._createWell(this.wellData)
        }
      }, {
        key: "clear",
        value: function() {
          this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = !1,
            this.viewer.scene.globe.clippingPlanes.removeAll(),
            this.viewer.scene.globe.clippingPlanes.isDestroyed());
          this.viewer.scene.globe.clippingPlanes = void 0;
          this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface);
          this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
          delete this.bottomSurface;
          delete this.wellWall;
          this.viewer.scene.render()
        }
      }, {
        key: "_prepareWell",
        value: function(a) {
          var b = this.splitNum
            , c = a.length;
          if (0 != c) {
            for (var d = this.excavateMinHeight - this.height, h = [], l = [], g = [], k = 0; k < c; k++) {
              var p = k == c - 1 ? 0 : k + 1
                , m = Cesium.Cartographic.fromCartesian(a[k])
                , p = Cesium.Cartographic.fromCartesian(a[p])
                , m = [m.longitude, m.latitude]
                , p = [p.longitude, p.latitude];
              0 == k && (g.push(new Cesium.Cartographic(m[0],m[1])),
                l.push(Cesium.Cartesian3.fromRadians(m[0], m[1], d)),
                h.push(Cesium.Cartesian3.fromRadians(m[0], m[1], 0)));
              for (var n = 1; n <= b; n++) {
                var q = Cesium.Math.lerp(m[0], p[0], n / b)
                  , r = Cesium.Math.lerp(m[1], p[1], n / b);
                k == c - 1 && n == b || (g.push(new Cesium.Cartographic(q,r)),
                  l.push(Cesium.Cartesian3.fromRadians(q, r, d)),
                  h.push(Cesium.Cartesian3.fromRadians(q, r, 0)))
              }
            }
            this.wellData = {
              lerp_pos: g,
              bottom_pos: l,
              no_height_top: h
            }
          }
        }
      }, {
        key: "_createWell",
        value: function(a) {
          if (this.viewer.terrainProvider._layers) {
            var b = this;
            this._createBottomSurface(a.bottom_pos);
            var c = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, a.lerp_pos);
            Cesium.when(c, function(c) {
              for (var d = c.length, e = [], f = 0; f < d; f++) {
                var k = Cesium.Cartesian3.fromRadians(c[f].longitude, c[f].latitude, c[f].height);
                e.push(k)
              }
              b._createWellWall(a.bottom_pos, e)
            })
          } else
            this._createBottomSurface(a.bottom_pos),
              this._createWellWall(a.bottom_pos, a.no_height_top)
        }
      }, {
        key: "_getMinHeight",
        value: function(a) {
          for (var b = 5E6, c = null, d = 0; d < a.length; d++) {
            var h = a[d].z;
            h < b && (b = h,
              c = this._ellipsoidToLonLat(a[d]))
          }
          return c.altitude
        }
      }, {
        key: "_ellipsoidToLonLat",
        value: function(a) {
          var b = this.viewer.scene.globe.ellipsoid;
          a = new Cesium.Cartesian3(a.x,a.y,a.z);
          b = b.cartesianToCartographic(a);
          a = Cesium.Math.toDegrees(b.latitude);
          return {
            longitude: Cesium.Math.toDegrees(b.longitude),
            latitude: a,
            altitude: b.height
          }
        }
      }, {
        key: "_createWellWall",
        value: function(a, b) {
          a = this._getMinHeight(a);
          for (var c = [], d = [], e = 0; e < b.length; e++)
            c.push(this._ellipsoidToLonLat(b[e]).altitude),
              d.push(a);
          b = new Cesium.WallGeometry({
            positions: b,
            maximumHeights: c,
            minimumHeights: d
          });
          b = Cesium.WallGeometry.createGeometry(b);
          a = new Cesium.Material({
            fabric: {
              type: "Image",
              uniforms: {
                image: this.wallImg
              }
            }
          });
          a = new Cesium.MaterialAppearance({
            translucent: !1,
            flat: !0,
            material: a
          });
          this.wellWall = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
              geometry: b,
              attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY)
              },
              id: "PitWall"
            }),
            appearance: a,
            asynchronous: !1
          });
          this.viewer.scene.primitives.add(this.wellWall)
        }
      }, {
        key: "_createBottomSurface",
        value: function(a) {
          if (a.length) {
            for (var b = this._getMinHeight(a), c = [], d = 0; d < a.length; d++) {
              var h = this._ellipsoidToLonLat(a[d]);
              c.push(h.longitude);
              c.push(h.latitude);
              c.push(b)
            }
            a = new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(c)),
              perPositionHeight: !0
            });
            a = Cesium.PolygonGeometry.createGeometry(a);
            b = new Cesium.Material({
              fabric: {
                type: "Image",
                uniforms: {
                  image: this.bottomImg
                }
              }
            });
            b = new Cesium.MaterialAppearance({
              translucent: !1,
              flat: !0,
              material: b
            });
            this.bottomSurface = new Cesium.Primitive({
              geometryInstances: new Cesium.GeometryInstance({
                geometry: a
              }),
              appearance: b,
              asynchronous: !1
            });
            this.viewer.scene.primitives.add(this.bottomSurface)
          }
        }
      }, {
        key: "_switchExcavate",
        value: function(a) {
          a ? (this.viewer.scene.globe.material = Cesium.Material.fromType("WaJue"),
            this.wellWall.show = !0,
            this.bottomSurface.show = !0) : (this.viewer.scene.globe.material = null,
            this.wellWall.show = !1,
            this.bottomSurface.show = !1)
        }
      }, {
        key: "_updateExcavateDepth",
        value: function(a) {
          this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface);
          this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
          for (var b = this.wellData.lerp_pos, c = [], d = b.length, h = 0; h < d; h++)
            c.push(Cesium.Cartesian3.fromRadians(b[h].longitude, b[h].latitude, this.excavateMinHeight - a));
          this.wellData.bottom_pos = c;
          this._createWell(this.wellData);
          this.viewer.scene.primitives.add(this.bottomSurface);
          this.viewer.scene.primitives.add(this.wellWall)
        }
      }, {
        key: "show",
        get: function() {
          return this._show
        },
        set: function(a) {
          this._show = a;
          this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = a);
          this._switchExcavate(a)
        }
      }, {
        key: "height",
        get: function() {
          return this._height
        },
        set: function(a) {
          this._height = a;
          this._updateExcavateDepth(a)
        }
      }]),
        b
    }()
  }
)();
LongMap.Volume = function(a) {
  this.map = null;
  this.points = a.points;
  this.area = a.area;
  this.uuid = guid();
  if (!this.points || 3 > this.points.length || !this.area)
    return !1;
  this.volume = 0;
  this.fillColor = a.fillColor || new LongMap.Color("#fff");
  this.borderColor = a.borderColor || null;
  this.isMove = !1;
  this.height = a.height || 0;
  this.proportion = 1;
  this.difference = 0;
  this.mousemove = this.mouseup = this.mousedown = null;
  this.isShow = !0;
  this.angle = 0
}
;
LongMap.Volume.prototype = {
  type: "entitie",
  init: function() {
    var a = this;
    if (!a.points || 3 > a.points.length || !a.area)
      return !1;
    for (var b = [], d = 0; d < a.points.length; d++)
      b.push(a.points[d].lon, a.points[d].lat, 0);
    d = Cesium.Color.fromCssColorString(a.fillColor.hex).withAlpha(a.fillColor.opacity);
    a.center = a.getCenter(a.points);
    a.feature = {
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(b),
        material: d,
        perPositionHeight: !0,
        extrudedHeight: a.height,
        outlineColor: new Cesium.CallbackProperty(function() {
            return a.borderColor ? Cesium.Color.fromCssColorString(a.borderColor.hex).withAlpha(a.borderColor.opacity) : Cesium.Color.RED
          }
          ,!1),
        outline: a.borderColor ? !0 : !1,
        show: new Cesium.CallbackProperty(function() {
            return a.isShow
          }
          ,!1)
      }
    };
    a.object = a.map.map.entities.add(a.feature);
    a.object.parentClass = a;
    a.object.polygon.extrudedHeight = new Cesium.CallbackProperty(function() {
        return a.height
      }
      ,!1);
    a.feature.id = a.map.map.entities._entities._array[a.map.map.entities._entities._array.length - 1]._id;
    a.addDown();
    a.addUp();
    a.addMove()
  },
  reInit: function() {
    this.removeEventListener();
    this.map.map.entities.remove(this.feature);
    this.map.setPan(!0);
    this.map.setRotate(!0)
  },
  addDown: function() {
    var a = this
      , b = function(b) {
      if (b.features && b.features[0] == a) {
        a.map.setPan(!1);
        a.map.setRotate(!1);
        a.map.map.scene.screenSpaceCameraController.enableRotate = !1;
        a.isMove = !0;
        var d = a.map.map.scene.globe.ellipsoid.cartesianToCartographic(a.map.map.scene.camera.position).height;
        a.proportion = d / 500;
        a.startP = b.position
      }
    };
    a.mousedown = b;
    a.map.addEventListener("mousedown", b)
  },
  addUp: function() {
    var a = this;
    a.map.map.scene.screenSpaceCameraController.enableRotate = !0;
    var b = function(b) {
      a.map.setPan(!0);
      a.map.setRotate(!0);
      a.isMove && (a.difference = parseFloat(a.startP.y - b.position.y) * a.proportion,
        a.height += a.difference,
        a.difference = 0,
        a.isMove = !1,
      a.callback && (b = {
        points: a.points,
        volume: Math.abs(a.area * a.height),
        height: a.height
      },
        a.volume = b.volume,
        a.callback(b)))
    };
    a.mouseup = b;
    a.map.addEventListener("mouseup", b)
  },
  addMove: function() {
    var a = this
      , b = function(b) {
      a.isMove && (b = b.startPosition,
        a.difference = parseFloat(a.startP.y - b.y) * a.proportion,
        a.height += a.difference,
        a.startP.y = b.y,
        b = {
          position: new LongMap.Point3(a.points[0].lon,a.points[0].lat,0),
          volume: Math.abs(a.area * a.height),
          height: a.height
        },
      a.moveCallback && a.moveCallback(b))
    };
    a.mousemove = b;
    a.map.addEventListener("mousemove", b)
  },
  on: function(a, b) {
    if (b)
      switch (a) {
        case "complete":
          this.callback = b;
          this.calb = !0;
          break;
        case "move":
          this.moveCallback = b
      }
  },
  removeEventListener: function() {
    this.map.removeEventListener("mousedown", this.mousedown);
    this.map.removeEventListener("mouseup", this.mouseup);
    this.map.removeEventListener("mousemove", this.mousemove)
  },
  hide: function() {
    this.isShow = !1
  },
  show: function() {
    this.isShow = !0
  },
  setColor: function() {},
  rotateZ: function(a) {
    if (3 > this.points.length)
      return !1;
    this.angle = a;
    var b = Math.cos(a * Math.PI / 180);
    a = Math.sin(a * Math.PI / 180);
    parseFloat(a);
    b = [b, -a, 0, 0, a, b, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    a = this.points;
    for (var d = this.center, e = [], c = 0, f = a.length; c < f; c++) {
      var h = a[c]
        , l = h.lon - d.lon
        , g = h.lat - d.lat
        , h = h.z - d.z
        , k = 1 / (b[3] * l + b[7] * g + b[11] * h + b[15]);
      e.push(new LongMap.Point3((b[0] * l + b[4] * g + b[8] * h + b[12]) * k + d.lon,(b[1] * l + b[5] * g + b[9] * h + b[13]) * k + d.lat,0))
    }
    return e
  },
  getCenter: function(a) {
    for (var b = 0, d = 0, e = a.length, c = 0; c < e; c++)
      b += a[c].lon,
        d += a[c].lat;
    return new LongMap.Point3(b / e,d / e,0)
  },
  setHeight: function(a) {
    this.height = a;
    this.moveCallback && (a = {
      position: new LongMap.Point3(this.points[0].lon,this.points[0].lat,0),
      volume: Math.abs(this.area * this.height),
      height: this.height
    },
      this.moveCallback(a));
    return this.height
  },
  setBorderColor: function(a) {
    this.borderColor && (this.borderColor = new LongMap.Color(a,this.borderColor.opacity))
  }
};
Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImage = "/assets/colors1.png";
Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a * color.a;\n\r\n                                                           material.diffuse \x3d (colorImage.rgb+color.rgb)/2.0;\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkType,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImage,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSource
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialProperty(a, b) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime()
}
Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialProperty.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialProperty.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImage;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialProperty.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialProperty && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
LongMap.TrailLine = function(a) {
  this.color = a.color || new LongMap.Color("#ff0000");
  this.duration = a.duration || 3;
  this.lineWidth = a.lineWidth || 1;
  this.points = a.points;
  this.object = null;
  this.info = a.info || null;
  this.uuid = guid();
  a = [];
  for (var b = 0; b < this.points.length; b++)
    a.push(this.points[b].lon, this.points[b].lat, this.points[b].z);
  b = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
  this.object = {
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(a),
      width: this.lineWidth,
      material: new Cesium.PolylineTrailLinkMaterialProperty(b,1E3 * this.duration)
    }
  };
  this.object.parentClass = this
}
;
LongMap.TrailLine.prototype = {
  type: "entitie"
};
Cesium.Material.PolylineTrailLinkTypePower = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImagePower = "/assets/power2.png";
Cesium.Material.PolylineTrailLinkSourcePower = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a * color.a;\n\r\n                                                           material.diffuse \x3d (colorImage.rgb+color.rgb)/2.0;\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypePower, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypePower,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImagePower,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSourcePower
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyPower(a, b, d) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime();
  this.url = d
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyPower.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyPower.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialPropertyPower.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImagePower;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyPower.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyPower && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyPower = PolylineTrailLinkMaterialPropertyPower;
LongMap.TrailLinePower = function(a) {
  this.color = a.color || new LongMap.Color("#ffffff");
  this.duration = a.duration || 3;
  this.lineWidth = a.lineWidth || 1;
  this.points = a.points;
  this.object = null;
  a = [];
  for (var b = 0; b < this.points.length; b++)
    a.push(this.points[b].lon, this.points[b].lat, this.points[b].z);
  b = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
  this.object = {
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(a),
      width: this.lineWidth,
      material: new Cesium.PolylineTrailLinkMaterialPropertyPower(b,1E3 * this.duration,this.url)
    }
  }
}
;
LongMap.TrailLinePower.prototype = {
  type: "entitie"
};
Cesium.Material.PolylineTrailLinkTypeEffectElectric = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImageEffectElectric = "./img/colors1.png";
Cesium.Material.PolylineTrailLinkSourceEffectElectric = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a * color.a;\n\r\n                                                           material.diffuse \x3d (colorImage.rgb+color.rgb)/2.0;\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeEffectElectric, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeEffectElectric,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImageEffectElectric,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSourceEffectElectric
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyEffectElectric(a, b, d) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime();
  this.url = d
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyEffectElectric.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyEffectElectric.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialPropertyEffectElectric.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImageEffectElectric;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyEffectElectric.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyEffectElectric && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyEffectElectric = PolylineTrailLinkMaterialPropertyEffectElectric;
LongMap.EffectElectric = function(a) {
  function b(a) {
    for (var b = 0, c = new Cesium.WebMercatorProjection, d = [], e = 0; e < a.length; e++) {
      var f = Cesium.Cartographic.fromCartesian(a[e].vector());
      d.push(c.project(f))
    }
    for (e = 0; e < d.length - 1; e++) {
      a = d[e].x;
      var c = d[e].y
        , f = d[e + 1].x
        , g = d[e + 1].y
        , b = b + Math.sqrt((a - f) * (a - f) + (c - g) * (c - g))
    }
    return b
  }
  function d(a) {
    var b = 5
      , c = a[5]
      , d = a[3]
      , f = a[0]
      , g = setInterval(function() {
      b < a.length - 5 ? b++ : b = 5;
      c = a[b];
      d = a[b - 2];
      f = a[b - 5]
    }, e.duration)
      , h = function() {
      return c.spaceCoordinate
    }
      , k = function() {
      return d.spaceCoordinate
    }
      , m = function() {
      return f.spaceCoordinate
    };
    5 < a.length && (h = {
      object: {
        position: new Cesium.CallbackProperty(h,!1),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#ffffff").withAlpha(1),
          disableDepthTestDistance: 0,
          scaleByDistance: new Cesium.NearFarScalar(0,0,.5,.5)
        }
      },
      type: "entitie"
    },
      h.object.parentClass = e,
      e.object.push(h));
    3 < a.length && (k = {
      object: {
        position: new Cesium.CallbackProperty(k,!1),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#ffffff").withAlpha(.8),
          disableDepthTestDistance: 0,
          scaleByDistance: new Cesium.NearFarScalar(0,0,.5,.5)
        }
      },
      type: "entitie"
    },
      k.object.parentClass = e,
      e.object.push(k));
    0 < a.length && (m = {
      object: {
        position: new Cesium.CallbackProperty(m,!1),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString("#ffffff").withAlpha(.5),
          disableDepthTestDistance: 0,
          scaleByDistance: new Cesium.NearFarScalar(0,0,.5,.5)
        }
      },
      type: "entitie"
    },
      m.object.parentClass = e,
      e.object.push(m));
    return g
  }
  var e = this;
  e.color = a.color || new LongMap.Color("#ffffff");
  e.duration = a.duration || 3;
  e.lineWidth = a.lineWidth || 1;
  e.points = a.points;
  e.object = [];
  e.timers = [];
  e.uuid = guid();
  for (a = 0; a < e.points.length; a++) {
    for (var c = [], f = e.points[a], h = 0; h < f.length; h++)
      c.push(f[h].lon, f[h].lat, f[h].z);
    c = {
      object: {
        polyline: {
          width: e.lineWidth,
          followSurface: !0,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(c),
          material: Cesium.Color.fromCssColorString("#ffff00").withAlpha(1)
        }
      },
      type: "entitie"
    };
    c.object.parentClass = e;
    e.object.push(c);
    c = [];
    for (h = 0; h < f.length - 1; h++) {
      var l = f[h]
        , g = f[h + 1];
      c.push(l);
      for (var k = parseInt(b([l, g]) / 2) - 1, p = (g.lon - l.lon) / k, m = (g.lat - l.lat) / k, n = (g.z - l.z) / k, q = 0; q < k; q++)
        c.push(new LongMap.Point3(l.lon + p * q,l.lat + m * q,l.z + n * q));
      c.push(g);
      if (300 < c.length) {
        l = Math.ceil(c.length / 300);
        for (g = 0; g < l - 1; g++)
          k = 300 * (g + 1) > c.length ? d(c.slice(300 * g, c.length)) : d(c.slice(300 * g, 300 * (g + 1))),
            e.timers.push(k);
        c = []
      }
    }
    300 >= c.length && (k = d(c),
      e.timers.push(k),
      c = [])
  }
  e.object.parentClass = e
}
;
LongMap.EffectElectric.prototype = {
  type: "entitie",
  clearTimer: function() {
    for (var a = 0; a < this.timers.length; a++)
      clearInterval(this.timers[a]),
        this.timers[a] = null;
    this.timers = []
  }
};
Cesium.Material.PolylineTrailLinkTypeEffectPedestrian1 = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImageEffectPedestrian1 = "/assets/klh.png";
Cesium.Material.PolylineTrailLinkSourceEffectPedestrian1 = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t   vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a;\n\r\n                                                           if(color.as\x3e0.0){\n\r\n                                                           \t material.diffuse \x3d color.rgb;\n\r\n                                                           }else{\n\r\n                                                           \t material.diffuse \x3d colorImage.rgb;\n\r\n                                                           }\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeEffectPedestrian1, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeEffectPedestrian1,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImageEffectPedestrian1,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSourceEffectPedestrian1
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyEffectPedestrian1(a, b, d) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime();
  this.url = d
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyEffectPedestrian1.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyEffectPedestrian1.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialPropertyEffectPedestrian1.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImageEffectPedestrian1;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyEffectPedestrian1.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyEffectPedestrian1 && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyEffectPedestrian1 = PolylineTrailLinkMaterialPropertyEffectPedestrian1;
LongMap.EffectPedestrian = function(a) {
  function b(a) {
    for (var b = 0, c = new Cesium.WebMercatorProjection, d = [], e = 0; e < a.length; e++) {
      var f = Cesium.Cartographic.fromCartesian(a[e].vector());
      d.push(c.project(f))
    }
    for (e = 0; e < d.length - 1; e++) {
      a = d[e].x;
      var c = d[e].y
        , f = d[e + 1].x
        , g = d[e + 1].y
        , b = b + Math.sqrt((a - f) * (a - f) + (c - g) * (c - g))
    }
    return b
  }
  var d = this;
  d.color = a.color || new LongMap.Color("#ffffff");
  d.duration = a.duration || 3;
  d.lineWidth = a.lineWidth || 1;
  d.points = a.points;
  d.object = [];
  d.uuid = guid();
  a = function(a) {
    var c = Cesium.Color.fromCssColorString(d.color.hex).withAlpha(1)
      , e = 0
      , f = a
      , f = a
      , c = Cesium.Color.fromCssColorString(d.color.hex).withAlpha(1);
    a = {
      object: {
        polyline: {
          positions: new Cesium.CallbackProperty(function() {
              var a = []
                , c = new LongMap.Point3(f[e].lon,f[e].lon,f[e].lon)
                , d = new LongMap.Point3(f[e + 1].lon,f[e + 1].lon,f[e + 1].lon);
              parseInt(b([c, d]));
              for (c = e; c < f.length; c++)
                a.push(f[c].lon, f[c].lat, f[c].z);
              e++;
              e >= f.length - 1 && (e = 0);
              return Cesium.Cartesian3.fromDegreesArrayHeights(a)
            }
            ,!1),
          width: d.lineWidth,
          material: new Cesium.PolylineTrailLinkMaterialPropertyEffectPedestrian1(c,1E3 * d.duration)
        }
      },
      type: "entitie"
    };
    a.object.parentClass = d;
    d.object.push(a)
  }
  ;
  for (var e = 0; e < d.points.length; e++) {
    for (var c = d.points[e], f = [], h = 0; h < c.length - 1; h++) {
      var l = c[h]
        , g = c[h + 1];
      f.push(l);
      for (var k = parseInt(b([l, g])) - 1, p = (g.lon - l.lon) / k, m = (g.lat - l.lat) / k, n = (g.z - l.z) / k, q = 0; q < k; q++)
        f.push(new LongMap.Point3(l.lon + p * q,l.lat + m * q,l.z + n * q));
      f.push(g)
    }
    new a(f)
  }
  d.object.parentClass = d
}
;
LongMap.EffectPedestrian.prototype = {
  type: "entitie"
};
Cesium.Material.PolylineTrailLinkTypeEffectWater = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImageEffectWater = "/assets/colors1.png";
Cesium.Material.PolylineTrailLinkSourceEffectWater = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a * color.a;\n\r\n                                                           material.diffuse \x3d (colorImage.rgb+color.rgb)/2.0;\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeEffectWater, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeEffectWater,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImageEffectWater,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSourceEffectWater
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyEffectWater(a, b, d) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime();
  this.url = d
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyEffectWater.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyEffectWater.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialPropertyEffectWater.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImageEffectWater;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyEffectWater.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyEffectWater && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyEffectWater = PolylineTrailLinkMaterialPropertyEffectWater;
LongMap.EffectWater = function(a) {
  this.color = a.color || new LongMap.Color("#ffffff");
  this.duration = a.duration || 3;
  this.lineWidth = a.lineWidth || 1;
  this.points = a.points;
  this.object = [];
  this.uuid = guid();
  for (a = 0; a < this.points.length; a++) {
    for (var b = [], d = this.points[a], e = 0; e < d.length; e++)
      b.push(d[e].lon, d[e].lat, d[e].z);
    e = {
      object: {
        polyline: {
          width: this.lineWidth,
          followSurface: !0,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(b),
          material: new Cesium.PolylineGlowMaterialProperty({
            color: new Cesium.Color(27 / 255,53 / 255,5.2,.5)
          })
        }
      },
      type: "entitie"
    };
    e.object.parentClass = this;
    this.object.push(e);
    b = [];
    for (e = 0; e < d.length - 1; e++) {
      var c = d[e]
        , f = d[e + 1];
      b.push(c);
      for (var h = parseInt, l = [c, f], g = 0, k = new Cesium.WebMercatorProjection, p = [], m = 0; m < l.length; m++) {
        var n = Cesium.Cartographic.fromCartesian(l[m].vector());
        p.push(k.project(n))
      }
      for (m = 0; m < p.length - 1; m++)
           var l = p[m].x
             , k = p[m].y
             , n = p[m + 1].x
             , q = p[m + 1].y
             , g = g + Math.sqrt((l - n) * (l - n) + (k - q) * (k - q));
      h = h(g / 20) - 1;
      g = (f.lon - c.lon) / h;
      p = (f.lat - c.lat) / h;
      m = (f.z - c.z) / h;
      for (l = 0; l < h; l++)
        b.push(new LongMap.Point3(c.lon + g * l,c.lat + p * l,c.z + m * l));
      b.push(f)
    }
    if (40 > b.length) {
      e = [];
      for (f = 0; f < b.length; f++)
        e.push(b[f].lon, b[f].lat, b[f].z);
      f = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
      e = {
        object: {
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(e),
            width: this.lineWidth,
            material: new Cesium.PolylineTrailLinkMaterialPropertyEffectWater(f,1E3 * this.duration)
          }
        },
        type: "entitie"
      };
      e.object.parentClass = this;
      this.object.push(e)
    } else
      for (h = Math.ceil(b.length / 40),
             d = 0; d < h; d++) {
        c = [];
        for (e = 0; 41 > e; e++)
          if (40 * d + e >= b.length) {
            if (0 < c.length) {
              e = [];
              for (f = 0; f < c.length; f++)
                e.push(c[f].lon, c[f].lat, c[f].z);
              f = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
              e = {
                object: {
                  polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(e),
                    width: this.lineWidth,
                    material: new Cesium.PolylineTrailLinkMaterialPropertyEffectWater(f,1E3 * this.duration)
                  }
                },
                type: "entitie"
              };
              e.object.parentClass = this;
              this.object.push(e)
            }
            break
          } else
            c.push(new LongMap.Point3(b[40 * d + e].lon,b[40 * d + e].lat,b[40 * d + e].z));
        e = [];
        for (f = 0; f < c.length; f++)
          e.push(c[f].lon, c[f].lat, c[f].z);
        f = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
        e = {
          object: {
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(e),
              width: this.lineWidth,
              material: new Cesium.PolylineTrailLinkMaterialPropertyEffectWater(f,1E3 * this.duration)
            }
          },
          type: "entitie"
        };
        e.object.parentClass = this;
        this.object.push(e)
      }
  }
  this.object.parentClass = this
}
;
LongMap.EffectWater.prototype = {
  type: "entitie"
};
Cesium.Material.PolylineTrailLinkTypeEffectDian = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImageEffectDian = "/assets/colors1.png";
Cesium.Material.PolylineTrailLinkSourceEffectDian = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a * color.a;\n\r\n                                                           material.diffuse \x3d (colorImage.rgb+color.rgb)/2.0;\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeEffectDian, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeEffectDian,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImageEffectDian,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSourceEffectDian
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyEffectDian(a, b, d) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime();
  this.url = d
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyEffectDian.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyEffectDian.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialPropertyEffectDian.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImageEffectDian;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyEffectDian.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyEffectDian && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyEffectDian = PolylineTrailLinkMaterialPropertyEffectDian;
LongMap.EffectDian = function(a) {
  this.color = a.color || new LongMap.Color("#ffffff");
  this.duration = a.duration || 3;
  this.lineWidth = a.lineWidth || 1;
  this.points = a.points;
  this.object = [];
  this.uuid = guid();
  for (a = 0; a < this.points.length; a++) {
    for (var b = [], d = this.points[a], e = 0; e < d.length; e++)
      b.push(d[e].lon, d[e].lat, d[e].z);
    b = [];
    for (e = 0; e < d.length - 1; e++) {
      var c = d[e]
        , f = d[e + 1];
      b.push(c);
      for (var h = parseInt, l = [c, f], g = 0, k = new Cesium.WebMercatorProjection, p = [], m = 0; m < l.length; m++) {
        var n = Cesium.Cartographic.fromCartesian(l[m].vector());
        p.push(k.project(n))
      }
      for (m = 0; m < p.length - 1; m++)
           var l = p[m].x
             , k = p[m].y
             , n = p[m + 1].x
             , q = p[m + 1].y
             , g = g + Math.sqrt((l - n) * (l - n) + (k - q) * (k - q));
      h = h(g / 20) - 1;
      g = (f.lon - c.lon) / h;
      p = (f.lat - c.lat) / h;
      m = (f.z - c.z) / h;
      for (l = 0; l < h; l++)
        b.push(new LongMap.Point3(c.lon + g * l,c.lat + p * l,c.z + m * l));
      b.push(f)
    }
    if (40 > b.length) {
      e = [];
      for (f = 0; f < b.length; f++)
        e.push(b[f].lon, b[f].lat, b[f].z);
      f = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
      e = {
        object: {
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(e),
            width: this.lineWidth,
            material: new Cesium.PolylineTrailLinkMaterialPropertyEffectDian(f,1E3 * this.duration)
          }
        },
        type: "entitie"
      };
      e.object.parentClass = this;
      this.object.push(e)
    } else
      for (h = Math.ceil(b.length / 40),
             d = 0; d < h; d++) {
        c = [];
        for (e = 0; 41 > e; e++)
          if (40 * d + e >= b.length) {
            if (0 < c.length) {
              e = [];
              for (f = 0; f < c.length; f++)
                e.push(c[f].lon, c[f].lat, c[f].z);
              f = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
              e = {
                object: {
                  polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(e),
                    width: this.lineWidth,
                    material: new Cesium.PolylineTrailLinkMaterialPropertyEffectDian(f,1E3 * this.duration)
                  }
                },
                type: "entitie"
              };
              e.object.parentClass = this;
              this.object.push(e)
            }
            break
          } else
            c.push(new LongMap.Point3(b[40 * d + e].lon,b[40 * d + e].lat,b[40 * d + e].z));
        e = [];
        for (f = 0; f < c.length; f++)
          e.push(c[f].lon, c[f].lat, c[f].z);
        f = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
        e = {
          object: {
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(e),
              width: this.lineWidth,
              material: new Cesium.PolylineTrailLinkMaterialPropertyEffectDian(f,1E3 * this.duration)
            }
          },
          type: "entitie"
        };
        e.object.parentClass = this;
        this.object.push(e)
      }
  }
  this.object.parentClass = this
}
;
LongMap.EffectDian.prototype = {
  type: "entitie"
};
Cesium.Material.PolylineTrailLinkTypeEffectflight = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImageEffectflight = "/assets/colors1.png";
Cesium.Material.PolylineTrailLinkSourceEffectflight = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a * color.a;\n\r\n                                                           material.diffuse \x3d (colorImage.rgb+color.rgb)/2.0;\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeEffectflight, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeEffectflight,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImageEffectflight,
      time: 0
    },
    source: Cesium.Material.PolylineTrailLinkSourceEffectflight
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyEffectflight(a, b) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime()
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyEffectflight.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyEffectflight.prototype.getType = function(a) {
  return "PolylineTrailLink"
}
;
PolylineTrailLinkMaterialPropertyEffectflight.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImageEffectflight;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyEffectflight.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyEffectflight && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyEffectflight = PolylineTrailLinkMaterialPropertyEffectflight;
LongMap.Effectflight = function(a) {
  var b = this;
  b.color = a.color || new LongMap.Color("#ff0000");
  b.duration = a.duration || 3;
  b.lineWidth = a.lineWidth || 2;
  b.object = null;
  b.center = a.center;
  b.point = a.point;
  b.height = a.height || 1E3;
  b.info = a.info;
  b.isShow = !0;
  b.uuid = guid();
  var d = function(a, b) {
    b = a.height && a.height ? a.height : 1E3;
    var c = Math.abs(a.pt1.lon - a.pt2.lon) > Math.abs(a.pt1.lat - a.pt2.lat) ? Math.abs(a.pt1.lon - a.pt2.lon) : Math.abs(a.pt1.lat - a.pt2.lat)
      , d = a.num ? a.num : 50
      , e = []
      , f = c / d;
    if (Math.abs(a.pt1.lon - a.pt2.lon) > Math.abs(a.pt1.lat - a.pt2.lat)) {
      var p = (a.pt2.lat - a.pt1.lat) / d;
      0 < a.pt1.lon - a.pt2.lon && (f = -f);
      for (var m = 0; m < d; m++) {
        var n = b - 4 * Math.pow(-.5 * c + Math.abs(f) * m, 2) * b / Math.pow(c, 2)
          , q = a.pt1.lon + f * m
          , r = a.pt1.lat + p * m;
        e.push([q, r, n])
      }
    } else
      for (p = (a.pt2.lon - a.pt1.lon) / d,
           0 < a.pt1.lat - a.pt2.lat && (f = -f),
             m = 0; m < d; m++)
        n = b - 4 * Math.pow(-.5 * c + Math.abs(f) * m, 2) * b / Math.pow(c, 2),
          q = a.pt1.lon + p * m,
          r = a.pt1.lat + f * m,
          e.push([q, r, n]);
    return e
  }({
    pt1: b.center,
    pt2: b.point,
    height: b.height,
    num: 100
  });
  a = [];
  for (var e = 0; e < d.length; e++)
    a.push(d[e][0], d[e][1], d[e][2]);
  d = Cesium.Color.fromCssColorString(b.color.hex).withAlpha(1);
  a = {
    polyline: {
      show: new Cesium.CallbackProperty(function() {
          return b.isShow
        }
        ,!1),
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(a),
      width: b.lineWidth,
      material: new Cesium.PolylineTrailLinkMaterialPropertyEffectflight(d,1E3 * b.duration)
    }
  };
  b.object = a;
  b.object.parentClass = b
}
;
LongMap.Effectflight.prototype = {
  type: "entitie",
  hide: function() {
    this.isShow = !1
  },
  show: function() {
    this.isShow = !0
  }
};
Cesium.Material.PolylineTrailLinkTypeDian = "PolylineTrailLinkDian";
Cesium.Material.PolylineTrailLinkImageDian = "/assets/colors1.png";
Cesium.Material.PolylineTrailLinkSourceDian = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\r\n                                                      {\n\r\n                                                           czm_material material \x3d czm_getDefaultMaterial(materialInput);\n\r\n                                                           vec2 st \x3d repeat*materialInput.st;\n\r\n                                                           vec4 colorImage \x3d texture2D(image, vec2(fract(st.s - time), st.t));\n\r\n                                                           material.alpha \x3d colorImage.a;\n\r\n                                                           if(color.a\x3e0.0){\n\r\n                                                           \t material.diffuse \x3d color.rgb;\n\r\n                                                           }else{\n\r\n                                                           \t material.\ndiffuse \x3d colorImage.rgb;\n\r\n                                                           }\n\r\n                                                           return material;\n\r\n                                                       }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkTypeDian, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkTypeDian,
    uniforms: {
      color: new Cesium.Color(1,0,0,.5),
      image: Cesium.Material.PolylineTrailLinkImageDian,
      time: 0,
      repeat: {
        x: 1,
        y: 1
      }
    },
    source: Cesium.Material.PolylineTrailLinkSourceDian
  },
  translucent: function(a) {
    return !0
  }
});
function PolylineTrailLinkMaterialPropertyDian(a, b, d) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime();
  this.url = d
}
Cesium.defineProperties(PolylineTrailLinkMaterialPropertyDian.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
PolylineTrailLinkMaterialPropertyDian.prototype.getType = function(a) {
  return "PolylineTrailLinkDian"
}
;
PolylineTrailLinkMaterialPropertyDian.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.image = Cesium.Material.PolylineTrailLinkImageDian;
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
PolylineTrailLinkMaterialPropertyDian.prototype.equals = function(a) {
  return this === a || a instanceof PolylineTrailLinkMaterialPropertyDian && this.equals(this._color, a._color)
}
;
Cesium.PolylineTrailLinkMaterialPropertyDian = PolylineTrailLinkMaterialPropertyDian;
LongMap.Dian = function(a) {
  this.color = a.color || new LongMap.Color("#ffffff");
  this.duration = a.duration || 3;
  this.points = a.points;
  this.object = [];
  this.uuid = guid();
  for (a = 0; a < this.points.length; a++) {
    for (var b = this.points[a].points, d = 4 * this.points[a].lineWidth || 4, e = [], c = 0; c < b.length - 1; c++) {
      var f = b[c]
        , h = b[c + 1];
      e.push(f);
      for (var l = parseInt, g = [f, h], k = 0, p = new Cesium.WebMercatorProjection, m = [], n = 0; n < g.length; n++) {
        var q = Cesium.Cartographic.fromCartesian(g[n].vector());
        m.push(p.project(q))
      }
      for (n = 0; n < m.length - 1; n++)
           var g = m[n].x
             , p = m[n].y
             , q = m[n + 1].x
             , r = m[n + 1].y
             , k = k + Math.sqrt((g - q) * (g - q) + (p - r) * (p - r));
      l = l(k / 20) - 1;
      k = (h.lon - f.lon) / l;
      m = (h.lat - f.lat) / l;
      n = (h.z - f.z) / l;
      for (g = 0; g < l; g++)
        e.push(new LongMap.Point3(f.lon + k * g,f.lat + m * g,f.z + n * g));
      e.push(h)
    }
    if (40 > e.length) {
      c = [];
      for (h = 0; h < e.length; h++)
        c.push(e[h].lon, e[h].lat, e[h].z);
      h = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
      c = {
        object: {
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(c),
            width: d,
            material: new Cesium.PolylineTrailLinkMaterialPropertyDian(h,1E3 * this.duration)
          }
        },
        type: "entitie"
      };
      c.object.parentClass = this;
      this.object.push(c)
    } else
      for (l = Math.ceil(e.length / 40),
             b = 0; b < l; b++) {
        f = [];
        for (c = 0; 41 > c; c++)
          if (40 * b + c >= e.length) {
            if (0 < f.length) {
              c = [];
              for (h = 0; h < f.length; h++)
                c.push(f[h].lon, f[h].lat, f[h].z);
              h = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
              c = {
                object: {
                  polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(c),
                    width: d,
                    material: new Cesium.PolylineTrailLinkMaterialPropertyDian(h,1E3 * this.duration)
                  }
                },
                type: "entitie"
              };
              c.object.parentClass = this;
              this.object.push(c)
            }
            break
          } else
            f.push(new LongMap.Point3(e[40 * b + c].lon,e[40 * b + c].lat,e[40 * b + c].z));
        c = [];
        for (h = 0; h < f.length; h++)
          c.push(f[h].lon, f[h].lat, f[h].z);
        h = Cesium.Color.fromCssColorString(this.color.hex).withAlpha(1);
        c = {
          object: {
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights(c),
              width: d,
              material: new Cesium.PolylineTrailLinkMaterialPropertyDian(h,1E3 * this.duration)
            }
          },
          type: "entitie"
        };
        c.object.parentClass = this;
        this.object.push(c)
      }
  }
  this.object.parentClass = this
}
;
LongMap.Dian.prototype = {
  type: "entitie"
};
(function(a) {
    function b() {
      var a = {
        defaults: {
          useEntitiesIfAvailable: !0,
          minCanvasSize: 700,
          maxCanvasSize: 2E3,
          radiusFactor: 60,
          spacingFactor: 1.5,
          maxOpacity: .8,
          minOpacity: .1,
          blur: .85,
          gradient: {
            ".3": "blue",
            ".65": "yellow",
            ".8": "orange",
            ".95": "red"
          }
        },
        create: function(a, b, d) {
          return new CHInstance(a,b,d)
        },
        _getContainer: function(a, b, d) {
          var c = document.createElement("div");
          d && c.setAttribute("id", d);
          c.setAttribute("style", "width: " + a + "px; height: " + b + "px; margin: 0px; display: none;");
          document.body.appendChild(c);
          return c
        },
        _getImageryProvider: function(a) {
          var b = a._heatmap.getDataURL()
            , b = new Cesium.SingleTileImageryProvider({
            url: b,
            rectangle: a._rectangle
          });
          b._tilingScheme = new Cesium.WebMercatorTilingScheme({
            rectangleSouthwestInMeters: new Cesium.Cartesian2(a._mbounds.west,a._mbounds.south),
            rectangleNortheastInMeters: new Cesium.Cartesian2(a._mbounds.east,a._mbounds.north)
          });
          return b
        },
        _getID: function(a) {
          for (var b = "", c = 0; c < (a ? a : 8); c++)
            b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
          return b
        }
      }
        , b = new Cesium.WebMercatorProjection;
      a.wgs84ToMercator = function(a) {
        a = b.project(Cesium.Cartographic.fromDegrees(a.x, a.y));
        return {
          x: a.x,
          y: a.y
        }
      }
      ;
      a.wgs84ToMercatorBB = function(a) {
        var c = b.project(Cesium.Cartographic.fromDegrees(a.west, a.south));
        a = b.project(Cesium.Cartographic.fromDegrees(a.east, a.north));
        return {
          north: a.y,
          east: a.x,
          south: c.y,
          west: c.x
        }
      }
      ;
      a.mercatorToWgs84 = function(a) {
        a = b.unproject(new Cesium.Cartesian3(a.x,a.y));
        return {
          x: a.longitude,
          y: a.latitude
        }
      }
      ;
      a.mercatorToWgs84BB = function(a) {
        var c = b.unproject(new Cesium.Cartesian3(a.west,a.south));
        a = b.unproject(new Cesium.Cartesian3(a.east,a.north));
        return {
          north: this.rad2deg(a.latitude),
          east: this.rad2deg(a.longitude),
          south: this.rad2deg(c.latitude),
          west: this.rad2deg(c.longitude)
        }
      }
      ;
      a.deg2rad = function(a) {
        return Math.PI / 180 * a
      }
      ;
      a.rad2deg = function(a) {
        return a / (Math.PI / 180)
      }
      ;
      return a
    }
    "undefined" === typeof CesiumHeatmap ? a.CesiumHeatmap = b() : console.log()
  }
)(window);
function CHInstance(a, b, d) {
  if (!b)
    return null;
  d || (d = {});
  this._cesium = a;
  this._options = d;
  this._id = CesiumHeatmap._getID();
  this._options.gradient = this._options.gradient ? this._options.gradient : CesiumHeatmap.defaults.gradient;
  this._options.maxOpacity = this._options.maxOpacity ? this._options.maxOpacity : CesiumHeatmap.defaults.maxOpacity;
  this._options.minOpacity = this._options.minOpacity ? this._options.minOpacity : CesiumHeatmap.defaults.minOpacity;
  this._options.blur = this._options.blur ? this._options.blur : CesiumHeatmap.defaults.blur;
  this._mbounds = CesiumHeatmap.wgs84ToMercatorBB(b);
  this._setWidthAndHeight(this._mbounds);
  this._options.radius = Math.round(this._options.radius ? this._options.radius : this.width > this.height ? this.width / CesiumHeatmap.defaults.radiusFactor : this.height / CesiumHeatmap.defaults.radiusFactor);
  this._spacing = this._options.radius * CesiumHeatmap.defaults.spacingFactor;
  this._xoffset = this._mbounds.west;
  this._yoffset = this._mbounds.south;
  this.width = Math.round(this.width + 2 * this._spacing);
  this.height = Math.round(this.height + 2 * this._spacing);
  this._mbounds.west -= this._spacing * this._factor;
  this._mbounds.east += this._spacing * this._factor;
  this._mbounds.south -= this._spacing * this._factor;
  this._mbounds.north += this._spacing * this._factor;
  this.bounds = CesiumHeatmap.mercatorToWgs84BB(this._mbounds);
  this._rectangle = Cesium.Rectangle.fromDegrees(this.bounds.west, this.bounds.south, this.bounds.east, this.bounds.north);
  this._container = CesiumHeatmap._getContainer(this.width, this.height, this._id);
  this._options.container = this._container;
  this._heatmap = h337.create(this._options);
  this._container.children[0].setAttribute("id", this._id + "-hm")
}
CHInstance.prototype.wgs84PointToHeatmapPoint = function(a) {
  return this.mercatorPointToHeatmapPoint(CesiumHeatmap.wgs84ToMercator(a))
}
;
CHInstance.prototype.mercatorPointToHeatmapPoint = function(a) {
  var b = {};
  b.x = Math.round((a.x - this._xoffset) / this._factor + this._spacing);
  b.y = Math.round((a.y - this._yoffset) / this._factor + this._spacing);
  b.y = this.height - b.y;
  return b
}
;
CHInstance.prototype._setWidthAndHeight = function(a) {
  this.width = 0 < a.east && 0 > a.west ? a.east + Math.abs(a.west) : Math.abs(a.east - a.west);
  this.height = 0 < a.north && 0 > a.south ? a.north + Math.abs(a.south) : Math.abs(a.north - a.south);
  this._factor = 1;
  this.width > this.height && this.width > CesiumHeatmap.defaults.maxCanvasSize ? (this._factor = this.width / CesiumHeatmap.defaults.maxCanvasSize,
  this.height / this._factor < CesiumHeatmap.defaults.minCanvasSize && (this._factor = this.height / CesiumHeatmap.defaults.minCanvasSize)) : this.height > this.width && this.height > CesiumHeatmap.defaults.maxCanvasSize ? (this._factor = this.height / CesiumHeatmap.defaults.maxCanvasSize,
  this.width / this._factor < CesiumHeatmap.defaults.minCanvasSize && (this._factor = this.width / CesiumHeatmap.defaults.minCanvasSize)) : this.width < this.height && this.width < CesiumHeatmap.defaults.minCanvasSize ? (this._factor = this.width / CesiumHeatmap.defaults.minCanvasSize,
  this.height / this._factor > CesiumHeatmap.defaults.maxCanvasSize && (this._factor = this.height / CesiumHeatmap.defaults.maxCanvasSize)) : this.height < this.width && this.height < CesiumHeatmap.defaults.minCanvasSize && (this._factor = this.height / CesiumHeatmap.defaults.minCanvasSize,
  this.width / this._factor > CesiumHeatmap.defaults.maxCanvasSize && (this._factor = this.width / CesiumHeatmap.defaults.maxCanvasSize));
  this.width /= this._factor;
  this.height /= this._factor
}
;
CHInstance.prototype.setData = function(a, b, d) {
  return d && 0 < d.length && null !== a && !1 !== a && null !== b && !1 !== b ? (this._heatmap.setData({
    min: a,
    max: b,
    data: d
  }),
    this.updateLayer(),
    !0) : !1
}
;
CHInstance.prototype.setWGS84Data = function(a, b, d) {
  if (d && 0 < d.length && null !== a && !1 !== a && null !== b && !1 !== b) {
    for (var e = [], c = 0; c < d.length; c++) {
      var f = d[c]
        , h = this.wgs84PointToHeatmapPoint(f);
      if (f.value || 0 === f.value)
        h.value = f.value;
      e.push(h)
    }
    return this.setData(a, b, e)
  }
  return !1
}
;
CHInstance.prototype.show = function(a) {
  this._layer && (this._layer.show = a)
}
;
CHInstance.prototype.updateLayer = function() {
  material = new Cesium.ImageMaterialProperty({
    image: this._heatmap._renderer.canvas
  });
  "1.21" <= Cesium.VERSION ? material.transparent = !0 : "1.16" <= Cesium.VERSION && (material.alpha = .99);
  this._layer = {
    show: !0,
    rectangle: {
      coordinates: this._rectangle,
      material: material
    }
  }
}
;
(function(a, b, d) {
    "undefined" !== typeof module && module.exports ? module.exports = d() : "function" === typeof define && define.amd ? define(d) : b[a] = d()
  }
)("h337", this, function() {
  var a = {
    defaultRadius: 40,
    defaultRenderer: "canvas2d",
    defaultGradient: {
      "0.25": "rgb(0,0,255)",
      "0.55": "rgb(0,255,0)",
      "0.85": "yellow",
      1: "rgb(255,0,0)"
    },
    defaultMaxOpacity: 1,
    defaultMinOpacity: 0,
    defaultBlur: .85,
    defaultXField: "x",
    defaultYField: "y",
    defaultValueField: "value",
    plugins: {}
  }
    , b = function() {
    var b = function(a) {
      this._coordinator = {};
      this._data = [];
      this._radi = [];
      this._min = 0;
      this._max = 1;
      this._xField = a.xField || a.defaultXField;
      this._yField = a.yField || a.defaultYField;
      this._valueField = a.valueField || a.defaultValueField;
      a.radius && (this._cfgRadius = a.radius)
    }
      , c = a.defaultRadius;
    b.prototype = {
      _organiseData: function(a, b) {
        var d = a[this._xField]
          , e = a[this._yField]
          , f = this._radi
          , g = this._data
          , h = this._max
          , k = this._min
          , l = a[this._valueField] || 1;
        a = a.radius || this._cfgRadius || c;
        g[d] || (g[d] = [],
          f[d] = []);
        g[d][e] ? g[d][e] += l : (g[d][e] = l,
          f[d][e] = a);
        return g[d][e] > h ? (b ? this.setDataMax(g[d][e]) : this._max = g[d][e],
          !1) : {
          x: d,
          y: e,
          value: l,
          radius: a,
          min: k,
          max: h
        }
      },
      _unOrganizeData: function() {
        var a = [], b = this._data, c = this._radi, d;
        for (d in b)
          for (var e in b[d])
            a.push({
              x: d,
              y: e,
              radius: c[d][e],
              value: b[d][e]
            });
        return {
          min: this._min,
          max: this._max,
          data: a
        }
      },
      _onExtremaChange: function() {
        this._coordinator.emit("extremachange", {
          min: this._min,
          max: this._max
        })
      },
      addData: function(a) {
        if (0 < a.length)
          for (var b = a.length; b--; )
            this.addData.call(this, a[b]);
        else
          (a = this._organiseData(a, !0)) && this._coordinator.emit("renderpartial", {
            min: this._min,
            max: this._max,
            data: [a]
          });
        return this
      },
      setData: function(a) {
        var b = a.data
          , c = b.length;
        this._data = [];
        this._radi = [];
        for (var d = 0; d < c; d++)
          this._organiseData(b[d], !1);
        this._max = a.max;
        this._min = a.min || 0;
        this._onExtremaChange();
        this._coordinator.emit("renderall", this._getInternalData());
        return this
      },
      removeData: function() {},
      setDataMax: function(a) {
        this._max = a;
        this._onExtremaChange();
        this._coordinator.emit("renderall", this._getInternalData());
        return this
      },
      setDataMin: function(a) {
        this._min = a;
        this._onExtremaChange();
        this._coordinator.emit("renderall", this._getInternalData());
        return this
      },
      setCoordinator: function(a) {
        this._coordinator = a
      },
      _getInternalData: function() {
        return {
          max: this._max,
          min: this._min,
          data: this._data,
          radi: this._radi
        }
      },
      getData: function() {
        return this._unOrganizeData()
      }
    };
    return b
  }()
    , d = function() {
    function a(a) {
      var c = a.container
        , d = this.shadowCanvas = document.createElement("canvas")
        , e = this.canvas = a.canvas || document.createElement("canvas");
      this._renderBoundaries = [1E4, 1E4, 0, 0];
      var f = getComputedStyle(a.container) || {};
      e.className = "heatmap-canvas";
      this._width = e.width = d.width = +f.width.replace(/px/, "");
      this._height = e.height = d.height = +f.height.replace(/px/, "");
      this.shadowCtx = d.getContext("2d");
      this.ctx = e.getContext("2d");
      e.style.cssText = d.style.cssText = "position:absolute;left:0;top:0;";
      c.style.position = "relative";
      c.appendChild(e);
      this._palette = b(a);
      this._templates = {};
      this._setStyles(a)
    }
    var b = function(a) {
      a = a.gradient || a.defaultGradient;
      var b = document.createElement("canvas")
        , c = b.getContext("2d");
      b.width = 256;
      b.height = 1;
      var b = c.createLinearGradient(0, 0, 256, 1), d;
      for (d in a)
        b.addColorStop(d, a[d]);
      c.fillStyle = b;
      c.fillRect(0, 0, 256, 1);
      return c.getImageData(0, 0, 256, 1).data
    }
      , c = function(a) {
      var b = []
        , c = a.min
        , d = a.max
        , e = a.radi;
      a = a.data;
      for (var f = Object.keys(a), g = f.length; g--; )
        for (var h = f[g], k = Object.keys(a[h]), l = k.length; l--; ) {
          var u = k[l];
          b.push({
            x: h,
            y: u,
            value: a[h][u],
            radius: e[h][u]
          })
        }
      return {
        min: c,
        max: d,
        data: b
      }
    };
    a.prototype = {
      renderPartial: function(a) {
        this._drawAlpha(a);
        this._colorize()
      },
      renderAll: function(a) {
        this._clear();
        this._drawAlpha(c(a));
        this._colorize()
      },
      _updateGradient: function(a) {
        this._palette = b(a)
      },
      updateConfig: function(a) {
        a.gradient && this._updateGradient(a);
        this._setStyles(a)
      },
      setDimensions: function(a, b) {
        this._width = a;
        this._height = b;
        this.canvas.width = this.shadowCanvas.width = a;
        this.canvas.height = this.shadowCanvas.height = b
      },
      _clear: function() {
        this.shadowCtx.clearRect(0, 0, this._width, this._height);
        this.ctx.clearRect(0, 0, this._width, this._height)
      },
      _setStyles: function(a) {
        this._blur = 0 == a.blur ? 0 : a.blur || a.defaultBlur;
        a.backgroundColor && (this.canvas.style.backgroundColor = a.backgroundColor);
        this._opacity = 255 * (a.opacity || 0);
        this._maxOpacity = 255 * (a.maxOpacity || a.defaultMaxOpacity);
        this._minOpacity = 255 * (a.minOpacity || a.defaultMinOpacity);
        this._useGradientOpacity = !!a.useGradientOpacity
      },
      _drawAlpha: function(a) {
        var b = this._min = a.min
          , c = this._max = a.max;
        a = a.data || [];
        for (var d = a.length, e = 1 - this._blur; d--; ) {
          var f = a[d], g = f.radius, h = Math.min(f.value, c), k = f.x - g, f = f.y - g, l = this.shadowCtx, u;
          if (this._templates[g])
            u = this._templates[g];
          else {
            u = this._templates;
            var x = g
              , v = g
              , y = e
              , C = document.createElement("canvas")
              , A = C.getContext("2d")
              , D = v
              , E = v;
            C.width = C.height = 2 * v;
            1 == y ? (A.beginPath(),
              A.arc(D, E, v, 0, 2 * Math.PI, !1),
              A.fillStyle = "rgba(0,0,0,1)",
              A.fill()) : (y = A.createRadialGradient(D, E, v * y, D, E, v),
              y.addColorStop(0, "rgba(0,0,0,1)"),
              y.addColorStop(1, "rgba(0,0,0,0)"),
              A.fillStyle = y,
              A.fillRect(0, 0, 2 * v, 2 * v));
            u[x] = u = C
          }
          l.globalAlpha = (h - b) / (c - b);
          l.drawImage(u, k, f);
          k < this._renderBoundaries[0] && (this._renderBoundaries[0] = k);
          f < this._renderBoundaries[1] && (this._renderBoundaries[1] = f);
          k + 2 * g > this._renderBoundaries[2] && (this._renderBoundaries[2] = k + 2 * g);
          f + 2 * g > this._renderBoundaries[3] && (this._renderBoundaries[3] = f + 2 * g)
        }
      },
      _colorize: function() {
        var a = this._renderBoundaries[0]
          , b = this._renderBoundaries[1]
          , c = this._renderBoundaries[2] - a
          , d = this._renderBoundaries[3] - b
          , e = this._width
          , f = this._height
          , g = this._opacity
          , h = this._maxOpacity
          , l = this._minOpacity
          , F = this._useGradientOpacity;
        0 > a && (a = 0);
        0 > b && (b = 0);
        a + c > e && (c = e - a);
        b + d > f && (d = f - b);
        for (var c = this.shadowCtx.getImageData(a, b, c, d), d = c.data, e = d.length, f = this._palette, u = 3; u < e; u += 4) {
          var x = d[u]
            , v = 4 * x;
          v && (x = 0 < g ? g : x < h ? x < l ? l : x : h,
            d[u - 3] = f[v],
            d[u - 2] = f[v + 1],
            d[u - 1] = f[v + 2],
            d[u] = F ? f[v + 3] : x)
        }
        c.data = d;
        this.ctx.putImageData(c, a, b);
        this._renderBoundaries = [1E3, 1E3, 0, 0]
      },
      getValueAt: function(a) {
        a = this.shadowCtx.getImageData(a.x, a.y, 1, 1).data[3];
        return a / 255 * Math.abs(this._max - this._min) >> 0
      },
      getDataURL: function() {
        return this.canvas.toDataURL()
      }
    };
    return a
  }()
    , e = function() {
    var b = !1;
    "canvas2d" === a.defaultRenderer && (b = d);
    return b
  }()
    , c = {
    merge: function() {
      for (var a = {}, b = arguments.length, c = 0; c < b; c++) {
        var d = arguments[c], e;
        for (e in d)
          a[e] = d[e]
      }
      return a
    }
  }
    , f = function() {
    function d(d) {
      d = this._config = c.merge(a, d || {});
      this._coordinator = new f;
      if (d.plugin) {
        var h = d.plugin;
        if (a.plugins[h])
          h = a.plugins[h],
            this._renderer = new h.renderer(d),
            this._store = new h.store(d);
        else
          throw Error("Plugin '" + h + "' not found. Maybe it was not registered.");
      } else
        this._renderer = new e(d),
          this._store = new b(d);
      g(this)
    }
    var f = function() {
      function a() {
        this.cStore = {}
      }
      a.prototype = {
        on: function(a, b, c) {
          var d = this.cStore;
          d[a] || (d[a] = []);
          d[a].push(function(a) {
            return b.call(c, a)
          })
        },
        emit: function(a, b) {
          var c = this.cStore;
          if (c[a])
            for (var d = c[a].length, e = 0; e < d; e++)
              (0,
                c[a][e])(b)
        }
      };
      return a
    }()
      , g = function(a) {
      var b = a._renderer
        , c = a._coordinator
        , d = a._store;
      c.on("renderpartial", b.renderPartial, b);
      c.on("renderall", b.renderAll, b);
      c.on("extremachange", function(b) {
        a._config.onExtremaChange && a._config.onExtremaChange({
          min: b.min,
          max: b.max,
          gradient: a._config.gradient || a._config.defaultGradient
        })
      });
      d.setCoordinator(c)
    };
    d.prototype = {
      addData: function() {
        this._store.addData.apply(this._store, arguments);
        return this
      },
      removeData: function() {
        this._store.removeData && this._store.removeData.apply(this._store, arguments);
        return this
      },
      setData: function() {
        this._store.setData.apply(this._store, arguments);
        return this
      },
      setDataMax: function() {
        this._store.setDataMax.apply(this._store, arguments);
        return this
      },
      setDataMin: function() {
        this._store.setDataMin.apply(this._store, arguments);
        return this
      },
      configure: function(a) {
        this._config = c.merge(this._config, a);
        this._renderer.updateConfig(this._config);
        this._coordinator.emit("renderall", this._store._getInternalData());
        return this
      },
      repaint: function() {
        this._coordinator.emit("renderall", this._store._getInternalData());
        return this
      },
      getData: function() {
        return this._store.getData()
      },
      getDataURL: function() {
        return this._renderer.getDataURL()
      },
      getValueAt: function(a) {
        return this._store.getValueAt ? this._store.getValueAt(a) : this._renderer.getValueAt ? this._renderer.getValueAt(a) : null
      }
    };
    return d
  }();
  return {
    create: function(a) {
      return new f(a)
    },
    register: function(b, c) {
      a.plugins[b] = c
    }
  }
});
LongMap.HeatChart = function(a) {
  function b(a, b) {
    a.sort(function(a, c) {
      return a[b] - c[b]
    });
    return a
  }
  this.type = "entitie";
  this.object = null;
  var d = this;
  (function() {
      var e = b(a.positions, "x")
        , c = e[e.length - 1].x
        , f = e[0].x;
      b(a.positions, "y");
      var h = e[e.length - 1].y
        , l = e[0].y;
      b(a.positions, "value");
      var g = e[e.length - 1].value
        , e = e[0].value
        , c = CesiumHeatmap.create(a.map, {
        west: f,
        south: l,
        east: c,
        north: h
      }, {
        backgroundColor: "rgba(0,0,0,0)",
        radius: a.radius,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
      });
      c.setWGS84Data(e, g, a.positions);
      d.object = c._layer
    }
  )()
}
;
var air_czml_path = [["air1", "/daKongGang/show/show/air1.czml", 1900], ["air2", "/daKongGang/show/show/air2.czml", 1E3], ["air3", "/daKongGang/show/show/air3.czml", 1900], ["air4", "/daKongGang/show/show/air4.czml", 1E3]]
  , Flight = function(a) {
  var b = this;
  this.map = a;
  this.dataSource = new Cesium.CzmlDataSource;
  this.maxTime = 0;
  this.add = function(e, c, f) {
    this.maxTime = f;
    b.dataSource.process(c).then(function() {
      a.dataSources.add(b.dataSource);
      a.trackedEntity = b.dataSource.entities.getById(e);
      a.clockk.currentTime = a.clock.startTime;
      a.clock.shouldAnimate = !0;
      a.map.clock.onTick.addEventListener(d)
    })
  }
  ;
  this.remove = function() {
    this.dataSource && (a.dataSources.remove(this.dataSource),
      this.dataSource = null,
      a.trackedEntity = null,
      a.clock.onTick.removeEventListener(d))
  }
  ;
  var d = function(d) {
    Cesium.JulianDate.secondsDifference(d.currentTime, d.startTime) >= b.maxTime && (a.clock.currentTime = d.startTime,
      a.clock.shouldAnimate = !0,
      b.remove())
  }
}
  , FlightPath = function(a) {
  this.map = a;
  this.flight = null
};
FlightPath.prototype = {
  addFlight: function(a) {
    this.removeFlight();
    air_czml_path[a] ? (this.flight = new Flight(this.map),
      this.flight.add(air_czml_path[a][0], air_czml_path[a][1], air_czml_path[a][2])) : alert("\u65e0\u8be5\u822a\u73ed\u7ebf\u8def")
  },
  removeFlight: function() {
    this.flight && this.flight.remove()
  }
};
function EllipsoidFadeMaterialProperty(a, b) {
  this._definitionChanged = new Cesium.Event;
  this._colorSubscription = this._color = void 0;
  this.color = a;
  this.duration = b;
  this._time = (new Date).getTime()
}
Cesium.defineProperties(EllipsoidFadeMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return !1
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});
EllipsoidFadeMaterialProperty.prototype.getType = function(a) {
  return "EllipsoidFade"
}
;
EllipsoidFadeMaterialProperty.prototype.getValue = function(a, b) {
  Cesium.defined(b) || (b = {});
  b.color = Cesium.Property.getValueOrClonedDefault(this._color, a, Cesium.Color.WHITE, b.color);
  b.time = ((new Date).getTime() - this._time) % this.duration / this.duration;
  return b
}
;
EllipsoidFadeMaterialProperty.prototype.equals = function(a) {
  return this === a || a instanceof EllipsoidFadeMaterialProperty && Property.equals(this._color, a._color)
}
;
Cesium.EllipsoidFadeMaterialProperty = EllipsoidFadeMaterialProperty;
Cesium.Material.EllipsoidFadeType = "EllipsoidFade";
Cesium.Material.EllipsoidFadeSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n{\nczm_material material \x3d czm_getDefaultMaterial(materialInput);\nmaterial.diffuse \x3d 1.5 * color.rgb;\nvec2 st \x3d materialInput.st;\nfloat dis \x3d distance(st, vec2(0.5, 0.5));\nfloat per \x3d fract(time);\nif(dis \x3e per * 0.5){\nmaterial.alpha \x3d 0.0;\ndiscard;\n}else {\nmaterial.alpha \x3d color.a  * dis / per / 1.0;\n}\nreturn material;\n}";
Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidFadeType, {
  fabric: {
    type: Cesium.Material.EllipsoidFadeType,
    uniforms: {
      color: new Cesium.Color(1,0,0,1),
      time: 0
    },
    source: Cesium.Material.EllipsoidFadeSource
  },
  translucent: function(a) {
    return !0
  }
});
LongMap.Spread = function(a) {
  var b = this;
  b.color = a.color || new LongMap.Color("#ff0000");
  b.duration = a.duration || 100;
  b.position = a.position;
  b.radius = a.radius || 10;
  b.uuid = guid();
  b.state = !0;
  a = Cesium.Color.fromCssColorString(b.color.hex).withAlpha(1);
  a = {
    ellipse: {
      semiMinorAxis: b.radius,
      semiMajorAxis: b.radius,
      material: new Cesium.EllipsoidFadeMaterialProperty(a,b.duration),
      show: !0
    }
  };
  b.object = a;
  b.object.position = new Cesium.CallbackProperty(function() {
      return b.position.spaceCoordinate
    }
    ,!1);
  b.object.ellipse.show = new Cesium.CallbackProperty(function() {
      return b.state
    }
    ,!1)
}
;
LongMap.Spread.prototype = {
  type: "entitie",
  show: function(a) {
    this.state = a
  },
  setPosition: function(a) {
    this.position = a ? a : this.position
  }
};
var HeatMap1 = function(a, b) {
  this.obejct = null;
  this.parent = a;
  this.map = a.map;
  this.points = b.points;
  this.radius = b.hasOwnProperty("radius") ? b.radius : 100;
  this.gradient = b.gradient || {
    ".3": "blue",
    ".65": "yellow",
    ".8": "orange",
    ".95": "rgba(255,255,255,1)"
  };
  this.rePaint()
};
HeatMap1.prototype = {
  type: "entitie",
  rePaint: function() {
    function a(a, b) {
      a.sort(function(a, c) {
        return a.point[b] - c.point[b]
      });
      return a
    }
    var b = a(this.points, "lon")
      , d = b[b.length - 1].point.lon
      , e = b[0].point.lon;
    a(this.points, "lat");
    for (var c = b[b.length - 1].point.lat, f = b[0].point.lat, b = [], h = 0; h < this.points.length; h++)
      b.push({
        x: this.points[h].point.lon,
        y: this.points[h].point.lat,
        value: this.points[h].value
      });
    d = CesiumHeatmap.create(this.map, {
      west: e,
      south: f,
      east: d,
      north: c
    }, {
      backgroundColor: "rgba(0,0,0,0)",
      radius: this.radius,
      maxOpacity: .5,
      minOpacity: 0,
      blur: .75,
      gradient: this.gradient
    });
    d.setWGS84Data(0, 1E3, b);
    d = d._layer;
    d.parentClass = this;
    this.object && this.parent && this.parent.map.entities.remove(this.object);
    this.object = d;
    this.parent && (this.parent.map.entities.add(this.object),
      this.object.id = this.map.entities._entities._array[this.map.entities._entities._array.length - 1]._id)
  },
  setStyle: function(a) {
    this.radius = a.hasOwnProperty("radius") ? a.radius : this.radius;
    this.gradient = a.hasOwnProperty("gradient") ? a.gradient : this.gradient;
    this.rePaint()
  },
  setRadius: function(a) {
    this.radius = a;
    this.rePaint()
  },
  setGradient: function(a) {
    this.gradient = a;
    this.rePaint()
  },
  show: function() {
    this.object.show = !0
  },
  hide: function() {
    this.object.show = !1
  },
  remove: function() {
    this.object && this.parent && this.parent.map.entities.remove(this.object)
  }
};
LongMap.HeatMap = HeatMap1;
var VisibilityAnalysisLine = function(a, b) {
  this.start = a;
  this.end = b;
  this.line0Positions = [a, b];
  this.line1Positions = [a, b]
}
  , VisibilityAnalysis = function(a, b) {
  this.map = a;
  this.tiles = b;
  this.lines = [];
  this.start = this.moveLine = null;
  this.object = new Cesium.PrimitiveCollection;
  this.drawState = !1
};
VisibilityAnalysis.prototype = {
  calculate: function(a) {
    var b = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(a.end, a.start, new Cesium.Cartesian3), new Cesium.Cartesian3)
      , b = new Cesium.Ray(a.start,b)
      , b = this.map.map.scene.pickFromRay(b);
    this.showIntersection(b, a)
  },
  calculatePoint: function(a, b) {
    b = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(b, a, new Cesium.Cartesian3), new Cesium.Cartesian3);
    a = new Cesium.Ray(a,b);
    return this.map.map.scene.pickFromRay(a)
  },
  setDirection: function(a, b) {
    a = new VisibilityAnalysisLine(a.vector(),b.vector());
    this.lines.push(a);
    this.map.map.scene.globe.depthTestAgainstTerrain = !0;
    this.calculate(a)
  },
  setStartPoint: function(a) {
    this.start = a;
    a = a.vector();
    this.moveLine0 = [a, a];
    this.moveLine1 = [a, a]
  },
  setPoint: function(a) {
    if (this.start) {
      var b = this;
      if (this.drawState)
        if (this.moveLine) {
          a = a.vector();
          var d = this.calculatePoint(this.moveLine.start, a);
          Cesium.defined(d) && Cesium.defined(d.object) && d.position ? this.judgeDirection(this.moveLine.start, a, d.position) ? (console.log(),
            this.moveLine0[1] = d.position,
            this.moveLine1 = [d.position, a]) : (this.moveLine0[1] = a,
            this.moveLine1 = [a, a]) : (this.moveLine0[1] = a,
            this.moveLine1 = [a, a])
        } else
          this.moveLine = new VisibilityAnalysisLine(this.start.vector(),a.vector()),
            this.moveLine.line0 = this.drawLine(this.moveLine.start, this.moveLine.end, Cesium.Color.GREEN),
            this.moveLine.line1 = this.drawLine(this.moveLine.start, this.moveLine.end, Cesium.Color.RED),
            this.moveLine.line0.polyline.positions = new Cesium.CallbackProperty(function() {
                return b.moveLine0
              }
              ,!1),
            this.moveLine.line1.polyline.positions = new Cesium.CallbackProperty(function() {
                return b.moveLine1
              }
              ,!1);
      else
        this.moveLine && (this.moveLine.line0.show = !1,
          this.moveLine.line1.show = !1)
    } else
      console.error("\u6ca1\u6709\u89c2\u6d4b\u70b9")
  },
  setLine: function() {},
  addPoint: function(a) {
    this.start ? this.drawState && this.setDirection(this.start, a) : console.error("\u6ca1\u6709\u89c2\u6d4b\u70b9")
  },
  setState: function(a) {
    (this.drawState = a) ? this.moveLine && (this.moveLine.line0.show = !0,
      this.moveLine.line1.show = !0) : this.moveLine && (this.moveLine.line0.show = !1,
      this.moveLine.line1.show = !1)
  },
  destroy: function() {
    this.setState(!1);
    this.moveLine && (this.moveLine.line0 && this.removeLine(this.moveLine.line0),
    this.moveLine.line1 && this.removeLine(this.moveLine.line1));
    for (; 0 < this.lines.length; ) {
      var a = this.lines.pop();
      a.line0 && this.removeLine(a.line0);
      a.line1 && this.removeLine(a.line1)
    }
  },
  removeDirection: function() {
    var a = new VisibilityAnalysisLine(start.vector(),end.vector());
    this.lines.push(a);
    this.map.map.scene.globe.depthTestAgainstTerrain = !0;
    this.calculate(a)
  },
  remove: function() {},
  clear: function() {
    for (; 0 < this.lines.length; ) {
      var a = this.lines.pop();
      this.removeLine(a.line)
    }
  },
  drawLine: function(a, b, d) {
    return this.map.map.entities.add({
      polyline: {
        positions: [a, b],
        width: 5,
        material: d
      }
    })
  },
  removeLine: function(a) {
    this.map.map.entities.remove(a)
  },
  getPoint: function(a) {
    a = a.vector();
    (new Cesium.WebMercatorProjection(this.map.map.scene.globe.ellipsoid)).project(Cesium.Cartographic.fromCartesian(a));
    return a
  },
  showIntersection: function(a, b) {
    Cesium.defined(a) && Cesium.defined(a.object) && a.position ? (b.line0 = this.drawLine(a.position, b.start, Cesium.Color.GREEN),
      b.line1 = this.drawLine(a.position, b.end, Cesium.Color.RED)) : b.line0 = this.drawLine(b.start, b.end, Cesium.Color.GREEN)
  },
  judgeDirection: function(a, b, d) {
    if (!d)
      return !1;
    a = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(a, d, new Cesium.Cartesian3), new Cesium.Cartesian3);
    b = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(b, d, new Cesium.Cartesian3), new Cesium.Cartesian3);
    return 0 < Cesium.Cartesian3.dot(a, b) ? !1 : !0
  }
};
LongMap.Tileset = function(a) {
  var b = this;
  b.url = a.url;
  b.maximumScreenSpaceError = a.maximumScreenSpaceError || 16;
  b.maximumMemoryUsage = a.maximumMemoryUsage || 512;
  b.angle = a.angle || 0;
  b.position = a.position;
  var d = new Cesium.Cesium3DTileset({
    url: b.url,
    maximumScreenSpaceError: b.maximumScreenSpaceError,
    maximumMemoryUsage: b.maximumMemoryUsage
  });
  b.position && d.readyPromise.then(function() {
    var a = Cesium.Transforms.eastNorthUpToFixedFrame(b.position.vector())
      , c = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians((360 - b.angle) % 360)));
    Cesium.Matrix4.multiply(a, c, a);
    d._root.transform = a
  });
  b.tileset = d
}
;
LongMap.Tileset.prototype = {
  show: function() {
    this.tileset && (this.tileset.show = true)
  },
  hide: function() {
    this.tileset && (this.tileset.show = false)
  }
};
LongMap.BIM = function(a) {
  a.url || console.error("\u8bf7\u8f93\u5165\u5730\u5740");
  this.angle = a.angle || 0;
  this.url = a.url;
  this.position = a.position || null;
  this.map = null;
  this.click = [];
  this.mousedown = [];
  this.mouseup = [];
  this.mousemove = [];
  this.touchstart = [];
  this.touchmove = [];
  this.touchend = [];
  this.dblclick = [];
  this.maximumScreenSpaceError = a.maximumScreenSpaceError || 16;
  this.maximumMemoryUsage = a.maximumMemoryUsage || 512;
  this.maximumNumberOfLoadedTiles = a.maximumNumberOfLoadedTiles || 32;
  this.preloadWhenMHidden = a.preloadWhenMHidden || !1
}
;
LongMap.BIM.prototype = {
  type: "BIM",
  init: function() {
    function a(a) {
      return Cesium.defined(a) && Cesium.defined(a.getProperty) ? parseInt(a.getProperty("DbId"), 10) : -1
    }
    function b(a, b) {
      if (a !== q && (a === t && d(),
        e(),
        q = a,
        !(0 > q))) {
        g.map.selectedEntity = z;
        var c = g.title.url.lastIndexOf("/")
          , c = -1 == c ? "." : g.title.url.substr(0, c);
        fetch(c + "/info/" + parseInt(a / 100) + ".json").then(function(a) {
          return a.json()
        }).then(function(c) {
          if (q === a) {
            c = c.data[a + ""];
            z.name = c.name || "\x3cnull\x3e";
            for (var d = [], e = !0, f = 0; f < c.categories.length; f++) {
              for (var g = c.categories[f], h = g.props, k = g.count, l = !1, m = {
                className: null,
                infoName: [],
                infoValue: []
              }, n = 0; n < k; n++)
                if (h.flags[n])
                  e = !1;
                else {
                  l || (l = !0,
                    m.className = "" + g.name);
                  var p = h.values[n];
                  switch (h.types[n]) {
                    case "boolean":
                      p = p ? "Yes" : "No";
                      break;
                    case "double":
                      p = h.units[n] ? p.toFixed(3) + " " + h.units[n] : "" + p.toFixed(3);
                      break;
                    default:
                      p += ""
                  }
                  m.infoName.push("" + h.names[n]);
                  m.infoValue.push("" + p)
                }
              e && d.push(m);
              e = !0
            }
            c = {
              name: c.name,
              info: d
            };
            b && b(c)
          }
        })["catch"](function(a) {});
        for (var c = $jscomp.makeIterator(p[a]), f = c.next(); !f.done; f = c.next())
          f = f.value,
            n.push({
              feature: f,
              originalColor: Cesium.Color.clone(f.color)
            }),
            f.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, .3)
      }
    }
    function d() {
      if (!(0 > t)) {
        if (0 < r.length) {
          for (var a = $jscomp.makeIterator(r), b = a.next(); !b.done; b = a.next())
            b = b.value,
              b.feature.color = b.originalColor;
          r = []
        }
        t = -1
      }
    }
    function e() {
      if (0 < n.length) {
        for (var a = $jscomp.makeIterator(n), b = a.next(); !b.done; b = a.next())
          b = b.value,
            b.feature.color = b.originalColor;
        n = []
      }
      q = -1;
      g.map.selectedEntity === z && (g.map.selectedEntity = null)
    }
    function c(b) {
      var c = a(b)
        , d = p[c];
      d.splice(d.findIndex(function(a) {
        return a.feature === b
      }), 1);
      c === q && n.splice(n.findIndex(function(a) {
        return a.feature === b
      }), 1);
      c === r && r.splice(r.findIndex(function(a) {
        return a.feature === b
      }), 1)
    }
    function f(b) {
      var c = a(b)
        , d = p[c];
      Cesium.defined(d) || (p[c] = d = []);
      d.push(b);
      -1 < m.indexOf(c) && (b.show = !1)
    }
    function h(a, b) {
      for (var c = a.featuresLength, d = 0; d < c; ++d) {
        var e = a.getFeature(d);
        b(e)
      }
    }
    function l(a, b) {
      var c = a.content;
      a = c.innerContents;
      if (Cesium.defined(a))
        for (var c = a.length, d = 0; d < c; ++d)
          h(a[d], b);
      else
        h(c, b)
    }
    var g = this;
    if (!g.map)
      return !1;
    var k = new Cesium.Cesium3DTileset({
      url: g.url,
      show: !0,
      maximumScreenSpaceError: g.maximumScreenSpaceError,
      maximumMemoryUsage: g.maximumMemoryUsage,
      maximumNumberOfLoadedTiles: g.maximumNumberOfLoadedTiles,
      preloadWhenMHidden: g.preloadWhenMHidden
    });
    g.title = k;
    g.position && (console.log(g.position),
      console.log(g.angle),
      g.title.readyPromise.then(function() {
        var a = Cesium.Transforms.eastNorthUpToFixedFrame(g.position.vector())
          , b = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians((360 - g.angle) % 360)));
        Cesium.Matrix4.multiply(a, b, a);
        g.title._root.transform = a
      }));
    var p = {}
      , m = []
      , n = []
      , q = -1
      , r = []
      , t = -1
      , z = new Cesium.Entity;
    g.title.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE;
    var B = new Cesium.ScreenSpaceEventHandler(g.map.scene.canvas);
    g.handler = B;
    (function() {
        this.event = {
          click: "LEFT_CLICK",
          mousedown: "LEFT_DOWN",
          mouseup: "LEFT_UP",
          mousemove: "MOUSE_MOVE",
          touchstart: "PINCH_START",
          touchmove: "PINCH_MOVE",
          touchend: "PINCH_END",
          dblckick: "LEFT_DOUBLE_CLICK",
          rightCkick: "RIGHT_CLICK"
        };
        B.setInputAction(function(c) {
          g.click.forEach(function(d) {
            var f = g.map.scene.pick(c.position);
            if (Cesium.defined(f) && f instanceof Cesium.Cesium3DTileFeature && f.tileset === g.title)
              f = a(f),
                f === q ? e() : b(f, d);
            else
              return !1
          })
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        B.setInputAction(function(b) {
          g.mousemove.forEach(function(c) {
            c = g.map.scene.pick(b.endPosition);
            if (Cesium.defined(c) && c instanceof Cesium.Cesium3DTileFeature && c.tileset === g.title) {
              if (c = a(c),
              c !== t && (d(),
                t = c,
                !(t === q || 0 > t))) {
                c = $jscomp.makeIterator(p[c]);
                for (var e = c.next(); !e.done; e = c.next())
                  e = e.value,
                    r.push({
                      feature: e,
                      originalColor: Cesium.Color.clone(e.color)
                    }),
                    e.color = Cesium.Color.fromAlpha(Cesium.Color.WHITE, .3)
              }
            } else
              d()
          })
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      }
    )();
    g.title.tileLoad.addEventListener(function(a) {
      l(a, f)
    });
    g.title.tileUnload.addEventListener(function(a) {
      l(a, c)
    })
  },
  reInit: function() {
    this.map.scene.primitives.remove(this.title);
    !this.handler.isDestroyed() && this.handler.destroy();
    for (i in this)
      this[i] = null
  },
  addEventListener: function(a, b) {
    if (!this.map)
      return console.error("\u8bf7\u5148\u6dfb\u52a0\u5230\u573a\u666f\u4e2d"),
        !1;
    switch (a) {
      case "click":
        this.click.push(b);
        break;
      case "mousedown":
        this.mousedown.push(b);
        break;
      case "mouseup":
        this.mouseup.push(b);
        break;
      case "mousemove":
        this.mousemove.push(b);
        break;
      case "touchstart":
        this.touchstart.push(b);
        break;
      case "touchmove":
        this.touchmove.push(b);
        break;
      case "touchend":
        this.touchend.push(b);
        break;
      case "dblclick":
        this.dblclick.push(b);
        break;
      default:
        console.error("type\u5c5e\u6027\u9519\u8bef")
    }
  },
  removeEventListener: function(a, b) {
    if (!this.map)
      return !1;
    var d = null;
    switch (a) {
      case "click":
        d = this.click;
        break;
      case "mousedown":
        d = this.mousedown;
        break;
      case "mouseup":
        d = this.mouseup;
        break;
      case "mousemove":
        d = this.mousemove;
        break;
      case "touchstart":
        d = this.touchstart;
        break;
      case "touchmove":
        d = touchmove;
        break;
      case "touchend":
        d = this.touchend;
        break;
      case "dblclick":
        d = this.dblclick;
        break;
      default:
        console.error("type\u5c5e\u6027\u9519\u8bef")
    }
    for (a = 0; a < d.length; )
      if (b == d[a]) {
        d.splice(a, 1);
        break
      } else
        a++
  }
};
LongMap.MovePoint = function(a) {
  this.position = a.position;
  this.img = a.img;
  this.time = a.time || 2;
  this.uuid = guid();
  if (!this.position || !this.img)
    return !1;
  this.scale = a.scale || 1;
  this.Z = a.Z || 10;
  this.object = {
    id: this.uuid,
    position: (new LongMap.Point3(this.position.lon,this.position.lat,this.position.z + this.Z)).vector(),
    billboard: {
      scale: this.scale,
      image: this.img
    }
  };
  this.object.parentClass = this
}
;
LongMap.MovePoint.prototype = {
  type: "entitie",
  move: function() {
    var a = this;
    console.log();
    if (!a.layer || !a.layer.map)
      return !1;
    var f = a.layer.map.entities.getById(a.uuid)
      , b = Cesium.JulianDate.fromDate(new Date)
      , g = Cesium.JulianDate.addSeconds(b, a.time, new Cesium.JulianDate)
      , c = a.position.vector()
      , d = (new LongMap.Point3(a.position.lon,a.position.lat,a.position.z + a.Z)).vector();
    var property = new Cesium.SampledPositionProperty;
    property.addSample(b, d);
    property.addSample(g, c);
    var e = !1;
    f.position = new Cesium.CallbackProperty(function() {
        if (property.getValue(Cesium.JulianDate.fromDate(new Date), new Cesium.Cartesian3))
          return property.getValue(Cesium.JulianDate.fromDate(new Date), new Cesium.Cartesian3);
        e = !e;
        var b = Cesium.JulianDate.fromDate(new Date);
        if (e)
          return property.addSample(Cesium.JulianDate.addSeconds(b, a.time, new Cesium.JulianDate), d),
            c;
        property.addSample(Cesium.JulianDate.addSeconds(b, a.time, new Cesium.JulianDate), c);
        return d
      }
      ,!1)
  }
};
LongMap.LineCeshi = function(b) {
  this.object = null;
  if (b && !(b.points && 1 > b.points.length)) {
    this.type = "primitive";
    this.vertexs = null;
    this.info = b.info || null;
    this.opacity = 1;
    this.color = Cesium.Color.fromCssColorString("#fff").withAlpha(1);
    var a = this;
    a.points = b.points;
    a.uuid = guid();
    a.depth = b.hasOwnProperty("depth") ? b.depth : !0;
    (function() {
        a.color = b.color || new LongMap.Color("#ffffff",1);
        for (var d = [], c = 0, h = a.points.length; c < h; c++) {
          for (var e = [], f = a.points[c].points, g = 0, k = f.length; g < k; g++)
            e.push(f[g].spaceCoordinate);
          f = Cesium.Color.fromCssColorString(a.points[c].color.hex || "#fff").withAlpha(a.points[c].color.opacity || 1);
          e = new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
              positions: e,
              width: a.points[c].width || 1,
              vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(f),
              show: new Cesium.ShowGeometryInstanceAttribute(!0)
            },
            id: a.points[c].id.toString() || uuid()
          });
          d.push(e)
        }
        d = new Cesium.Primitive({
          geometryInstances: d,
          appearance: new Cesium.PolylineColorAppearance({
            translucent: !1,
            closed: !0
          })
        });
        a.object = d;
        a.object.parentClass = a;
        a.object.readyPromise.then(function() {
          a.callback && a.callback()
        })
      }
    )()
  }
}
;
LongMap.LineCeshi.prototype = {
  setColor: function(b, a) {
    if (!b || !a)
      return !1;
    a = Cesium.Color.fromCssColorString(a.hex || "#fff").withAlpha(a.opacity || 1);
    b = this.object.getGeometryInstanceAttributes(b);
    if (!b)
      return !1;
    b.color = Cesium.ColorGeometryInstanceAttribute.toValue(a)
  },
  getColor: function(b) {
    if (!b)
      return !1;
    if (b = this.object.getGeometryInstanceAttributes(b)) {
      var a = b.color;
      b = a[0].toString(16);
      var d = a[1].toString(16)
        , c = a[2].toString(16)
        , a = a[3] / 255;
      2 > b.split("").length && (b = "0" + b);
      2 > d.split("").length && (d = "0" + d);
      2 > c.split("").length && (c = "0" + c);
      return new LongMap.Color("#" + b + d + c,a)
    }
  },
  rePaint: function() {},
  setStyle: function() {
    console.log(this.object)
  },
  ready: function(b) {
    b && (this.callback = b)
  }
};
LongMap.prototype.flyTo = function(data, picth) {
  this.map.camera.flyTo({
    destination: data.point.vector(),
    duration: data.duration || 2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(picth || -90),
      roll: 0
    },
    complete: function() {
      data.complete && data.complete()
    }
  })
}
;
var x_PI = 3.141592653589793 * 3E3 / 180;
var PI = 3.141592653589793;
var a = 6378245;
var ee = .006693421622965943;
function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = 3.141592653589793 * 3E3 / 180;
  var x = bd_lon - .0065;
  var y = bd_lat - .006;
  var z = Math.sqrt(x * x + y * y) - 2E-5 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 3E-6 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat]
}
function gcj02tobd09(lng, lat) {
  var z = Math.sqrt(lng * lng + lat * lat) + 2E-5 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 3E-6 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + .0065;
  var bd_lat = z * Math.sin(theta) + .006;
  return [bd_lng, bd_lat]
}
function wgs84togcj02(lng, lat) {
  if (out_of_china(lng, lat))
    return [lng, lat];
  else {
    var dlat = transformlat(lng - 105, lat - 35);
    var dlng = transformlng(lng - 105, lat - 35);
    var radlat = lat / 180 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = dlat * 180 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
    dlng = dlng * 180 / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat]
  }
}
function gcj02towgs84(lng, lat) {
  if (out_of_china(lng, lat))
    return [lng, lat];
  else {
    var dlat = transformlat(lng - 105, lat - 35);
    var dlng = transformlng(lng - 105, lat - 35);
    var radlat = lat / 180 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = dlat * 180 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
    dlng = dlng * 180 / (a / sqrtmagic * Math.cos(radlat) * PI);
    mglat = lat + dlat;
    mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}
function transformlat(lng, lat) {
  var ret = -100 + 2 * lng + 3 * lat + .2 * lat * lat + .1 * lng * lat + .2 * Math.sqrt(Math.abs(lng));
  ret += (20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) * 2 / 3;
  ret += (20 * Math.sin(lat * PI) + 40 * Math.sin(lat / 3 * PI)) * 2 / 3;
  ret += (160 * Math.sin(lat / 12 * PI) + 320 * Math.sin(lat * PI / 30)) * 2 / 3;
  return ret
}
function transformlng(lng, lat) {
  var ret = 300 + lng + 2 * lat + .1 * lng * lng + .1 * lng * lat + .1 * Math.sqrt(Math.abs(lng));
  ret += (20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) * 2 / 3;
  ret += (20 * Math.sin(lng * PI) + 40 * Math.sin(lng / 3 * PI)) * 2 / 3;
  ret += (150 * Math.sin(lng / 12 * PI) + 300 * Math.sin(lng / 30 * PI)) * 2 / 3;
  return ret
}
function out_of_china(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || (lat < .8293 || lat > 55.8271 || false)
}
LongMap.prototype.setBackgroundImage = function(url) {
  var tu = "data:image/png;base64,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\x3d";
  if (url)
    tu = url;
  this._container.style.backgroundImage = "url(" + tu + ")"
}
;
LongMap.prototype.setSceneState = function(state) {
  this.map.scene.skyBox.show = state;
  this.map.scene.backgroundColor = new Cesium.Color(0,0,0,0);
  this.map.scene.globe.show = state
}
;
LongMap.prototype.addBoundary = function() {
  var scope = this;
  var bs = new BS1(this);
  var data = shenzhen_boundary;
  data.features.forEach(function(feature) {
    var points = [];
    var sb = [];
    feature.geometry.coordinates[0].forEach(function(point) {
      var sp = wgs84togcj02(point[0], point[1]);
      points.push(new LongMap.Point3(sp[0],sp[1],2010));
      sb.push(sp[0], sp[1], 0)
    });
    var sls = getKLine(points);
    console.log(bs.lineObject);
    bs.lineObject.add(sls);
    scope.map.entities.add({
      name: "aGlowLine",
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(sb),
        width: 7,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: .3,
          color: Cesium.Color.fromCssColorString("#cccccc").withAlpha(.3)
        })
      }
    })
  });
  var data = area_bounday;
  data.features.forEach(function(feature) {
    var points = [];
    var sb = [];
    feature.geometry.coordinates[0][0].forEach(function(point) {
      var sp = wgs84togcj02(point[0], point[1]);
      points.push(new LongMap.Point3(sp[0],sp[1],0))
    });
    bs.addBoundary({
      points: points,
      height: 3E3,
      lineColor: new LongMap.Color("#aaaaaa",.1),
      msg: {
        name: feature.properties.name,
        position: feature.properties.cp
      }
    })
  });
  return bs
}
;
LongMap.prototype.removeBoundary = function() {}
;
LongMap.prototype.addMask = function(color) {
  var s = color || new LongMap.Color("#000000",.7);
  var color = Cesium.Color.fromCssColorString(color.hex).withAlpha(color.opacity);
  var sc = new Cesium.Entity({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
      coordinates: Cesium.Rectangle.fromDegrees(100, 0, 150, 40),
      material: color
    }
  });
  var st = this.map.entities.add(sc);
  this.mask = st
}
;
LongMap.prototype.removeMask = function(color) {
  if (this.mask) {
    this.map.entities.remove(this.mask);
    this.mask = null
  }
}
;
LongMap.prototype.controlsEnabled = function(state) {
  this.scene.screenSpaceCameraController.enableRotate = state;
  this.scene.screenSpaceCameraController.enableTranslate = state;
  this.scene.screenSpaceCameraController.enableZoom = state;
  this.scene.screenSpaceCameraController.enableTilt = state
}
;
var shenzhen_boundary = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[114.4731616973877, 22.5495011613606, 0], [114.4833755493164, 22.53697612119435, 0], [114.4789981842041, 22.51747284762276, 0], [114.4750499725342, 22.51398416697013, 0], [114.4785690307617, 22.50668936836207, 0], [114.4771957397461, 22.49542924989981, 0], [114.4823455810547, 22.49186071124547, 0], [114.4812297821045, 22.4702889187511, 0], [114.4951343536377, 22.46608520035064, 0], [114.494104385376, 22.45640823181894, 0], [114.5052623748779, 22.44942770395736, 0], [114.5146179199219, 22.4504589404246, 0], [114.5316982269287, 22.46513339734383, 0], [114.5280075073242, 22.47155794074906, 0], [114.5417404174805, 22.48202692858451, 0], [114.5459461212158, 22.48274069438745, 0], [114.5550441741943, 22.4772683958621, 0], [114.5601081848145, 22.47909251940119, 0], [114.5637130737305, 22.48163039043726, 0], [114.5687770843506, 22.4821855435254, 0], [114.5709228515625, 22.48480266381325, 0], [114.5839691162109, 22.48567502624756, 0], [114.5830249786377, 22.49186071124547, 0], [114.5945262908936, 22.4914642012696, 0], [114.5958995819092, 22.49495345006347, 0], [114.607572555542, 22.49598434764082, 0], [114.6119499206543, 22.49788752298717, 0], [114.6108341217041, 22.50042504938729, 0], [114.6163272857666, 22.50288323369632, 0], [114.6193313598633, 22.50772017847269, 0], [114.6235370635986, 22.51160547058612, 0], [114.620532989502, 22.52064429907181, 0], [114.6063709259033, 22.53150596867372, 0], [114.6050834655762, 22.53515276109746, 0], [114.6082592010498, 22.54046422124226, 0], [114.6084308624268, 22.54395223315781, 0], [114.6040534973145, 22.54553766398187, 0], [114.591007232666, 22.54339732806691, 0], [114.5765018463135, 22.54807431541816, 0], [114.5667171478272, 22.54934262365114, 0], [114.5550441741943, 22.56218358786963, 0], [114.5512676239014, 22.5632932447078, 0], [114.5502376556397, 22.56947545504479, 0], [114.5451736450195, 22.57240794505542, 0], [114.5246601104736, 22.56804881572589, 0], [114.517879486084, 22.55401940950566, 0], [114.5092964172363, 22.54934262365114, 0], [114.5006275177002, 22.55703149272952, 0], [114.5021724700928, 22.56559179118036, 0], [114.5003700256348, 22.58104653946133, 0], [114.5084381103516, 22.59222043147961, 0], [114.5129013061523, 22.59388455059785, 0], [114.5268058776856, 22.59071478256657, 0], [114.5350456237793, 22.58992232915781, 0], [114.5460319519043, 22.58770343535385, 0], [114.5626831054687, 22.6085437784106, 0], [114.57839012146, 22.61805163172998, 0], [114.5789909362793, 22.62874718102697, 0], [114.5831108093262, 22.6385705078794, 0], [114.5905780792236, 22.64173917318037, 0], [114.5915222167969, 22.64981893884204, 0], [114.594612121582, 22.65100709957968, 0], [114.5962429046631, 22.65401706076315, 0], [114.5941829681397, 22.65615567728996, 0], [114.5920372009277, 22.65742298987948, 0], [114.5882606506348, 22.65639329929178, 0], [114.5869731903076, 22.6586110848051, 0], [114.5820808410644, 22.66051201529374, 0], [114.580192565918, 22.65805664178633, 0], [114.5772743225098, 22.65853187879668, 0], [114.5765018463135, 22.66098724380182, 0], [114.5731544494629, 22.66098724380182, 0], [114.5719528198242, 22.65496756111066, 0], [114.5654296875, 22.65274971672913, 0], [114.5592498779297, 22.65441310337441, 0], [114.5567607879639, 22.65203683056868, 0], [114.5532417297363, 22.65306655383448, 0], [114.5516967773438, 22.65140315087405, 0], [114.5468902587891, 22.65187841091922, 0], [114.539680480957, 22.6512447304934, 0], [114.5370197296142, 22.65306655383448, 0], [114.5355606079102, 22.65346259918787, 0], [114.5356464385986, 22.6512447304934, 0], [114.5313549041748, 22.65235366931922, 0], [114.5327281951904, 22.65425468646701, 0], [114.5246601104736, 22.65575963970616, 0], [114.5183944702148, 22.65465072839274, 0], [114.5173645019531, 22.65211604032487, 0], [114.5082664489746, 22.6506110471429, 0], [114.5092105865479, 22.64752179892897, 0], [114.5073223114014, 22.64672967280743, 0], [114.5052623748779, 22.64926446031251, 0], [114.5015716552734, 22.64839313238522, 0], [114.497537612915, 22.65504676917589, 0], [114.4999408721924, 22.65948234788074, 0], [114.5018291473389, 22.65971996412326, 0], [114.5043182373047, 22.66067042497928, 0], [114.5044898986816, 22.66328415839078, 0], [114.5071506500244, 22.66439299994894, 0], [114.5078372955322, 22.66708586356858, 0], [114.5074939727783, 22.66787787222139, 0], [114.5002841949463, 22.67128345732393, 0], [114.4776248931885, 22.67104586110697, 0], [114.473762512207, 22.66383858028995, 0], [114.4657802581787, 22.67064986649741, 0], [114.4506740570068, 22.6727882238071, 0], [114.4473266601563, 22.67223383807611, 0], [114.4446659088135, 22.66803627340325, 0], [114.4272422790527, 22.66518502414709, 0], [114.4268131256104, 22.66478901261949, 0], [114.4259548187256, 22.66637305187174, 0], [114.4276714324951, 22.66732346664452, 0], [114.4262981414795, 22.67025387074465, 0], [114.4250965118408, 22.67112505989169, 0], [114.4232082366943, 22.6793614837962, 0], [114.4315338134766, 22.68284597574951, 0], [114.4326496124268, 22.68466737947696, 0], [114.4371128082275, 22.68538009608663, 0], [114.4405460357666, 22.69195275234964, 0], [114.4377994537354, 22.700742197508, 0], [114.4345378875732, 22.69963364991788, 0], [114.4295597076416, 22.70327598687934, 0], [114.4229507446289, 22.70137564924551, 0], [114.418830871582, 22.70652233600077, 0], [114.4200325012207, 22.71151047855762, 0], [114.4157409667969, 22.71665678434663, 0], [114.406042098999, 22.7143607641316, 0], [114.3977165222168, 22.72686964884511, 0], [114.4028663635254, 22.72734464724458, 0], [114.4034671783447, 22.73415277636751, 0], [114.409990310669, 22.74127719969363, 0], [114.409818649292, 22.7551291820531, 0], [114.4162559509277, 22.75789941000427, 0], [114.4131660461426, 22.76169848839942, 0], [114.4173717498779, 22.76359798796435, 0], [114.4154834747315, 22.76597232526146, 0], [114.4111919403076, 22.77507356902285, 0], [114.4014072418213, 22.78401593908962, 0], [114.3949699401855, 22.78306633468677, 0], [114.3897342681885, 22.7641520036934, 0], [114.3832969665527, 22.76059043478445, 0], [114.3799495697022, 22.76280653302345, 0], [114.3632984161377, 22.76810919352519, 0], [114.3524837493897, 22.76755519385366, 0], [114.3498229980469, 22.78069229475948, 0], [114.3420124053955, 22.78085056537327, 0], [114.338493347168, 22.78820994612416, 0], [114.347677230835, 22.7939863861614, 0], [114.3456172943115, 22.80174067429179, 0], [114.3491363525391, 22.80965275844273, 0], [114.3455314636231, 22.81139335529879, 0], [114.325704574585, 22.81147247280929, 0], [114.3205547332764, 22.80814949780683, 0], [114.3133449554443, 22.80973187696411, 0], [114.3094825744629, 22.80324400563127, 0], [114.303731918335, 22.80648797991234, 0], [114.2883682250977, 22.80720006149094, 0], [114.2859649658203, 22.81163070769242, 0], [114.2791843414307, 22.81060217766661, 0], [114.2699146270752, 22.79920871034276, 0], [114.2636489868164, 22.79461940580789, 0], [114.2637348175049, 22.79082124384426, 0], [114.2568683624267, 22.78551946587438, 0], [114.245023727417, 22.78559859840397, 0], [114.2395305633545, 22.79525242251527, 0], [114.2285442352295, 22.79691407738783, 0], [114.2241668701172, 22.81495359777848, 0], [114.2190170288086, 22.81566563510753, 0], [114.2134380340576, 22.81234276239198, 0], [114.208288192749, 22.80498468435917, 0], [114.2026233673096, 22.79208730958779, 0], [114.1844272613525, 22.78828907709275, 0], [114.1737842559815, 22.78156278086308, 0], [114.175500869751, 22.77412390238037, 0], [114.1776466369629, 22.77507356902285, 0], [114.1776466369629, 22.77808080312452, 0], [114.18288230896, 22.77380734536433, 0], [114.1820240020752, 22.77119572196622, 0], [114.1780757904053, 22.77103744015417, 0], [114.1779899597168, 22.76787176536982, 0], [114.184684753418, 22.76660547490059, 0], [114.1915512084961, 22.7685840485971, 0], [114.1954135894775, 22.76818833615189, 0], [114.1951560974121, 22.76272738727705, 0], [114.1997909545898, 22.76177763474217, 0], [114.201250076294, 22.76027384638597, 0], [114.1984176635742, 22.75734536890876, 0], [114.199275970459, 22.75330871595219, 0], [114.2031383514404, 22.75481258099566, 0], [114.2060565948486, 22.75267550466529, 0], [114.2045116424561, 22.74697647101998, 0], [114.2113780975342, 22.74214793708231, 0], [114.2109489440918, 22.73826915512951, 0], [114.2042541503906, 22.73193621339709, 0], [114.2034816741943, 22.71649843936149, 0], [114.1983318328857, 22.71831939562927, 0], [114.1911220550537, 22.71317315235523, 0], [114.1948986053467, 22.70937272542976, 0], [114.1957569122315, 22.70438450498833, 0], [114.1934394836426, 22.70058383411586, 0], [114.1942119598389, 22.69725816058549, 0], [114.1921520233154, 22.69416996286942, 0], [114.1926670074463, 22.69116088275472, 0], [114.1875171661377, 22.69147763114183, 0], [114.1888046264648, 22.68664713868669, 0], [114.1931819915772, 22.68601361885075, 0], [114.1907787322998, 22.68316274335362, 0], [114.1884613037109, 22.68229163068102, 0], [114.1792774200439, 22.67294661931867, 0], [114.1823673248291, 22.66882827656911, 0], [114.1799640655518, 22.66684826008114, 0], [114.1726684570312, 22.65797743545796, 0], [114.1678619384766, 22.65734378318545, 0], [114.1647720336914, 22.65971996412326, 0], [114.1633129119873, 22.66550183254619, 0], [114.1599655151367, 22.66431379727766, 0], [114.1597080230713, 22.65995757995439, 0], [114.1556739807129, 22.66019519537409, 0], [114.1578197479248, 22.66391778323553, 0], [114.1547298431397, 22.66764027010564, 0], [114.1524124145508, 22.66447220257448, 0], [114.1523265838623, 22.66668985752757, 0], [114.1511249542236, 22.66668985752757, 0], [114.149751663208, 22.66320495507947, 0], [114.1487216949463, 22.66368017426164, 0], [114.1507816314697, 22.67144185457326, 0], [114.1555023193359, 22.67104586110697, 0], [114.1590213775635, 22.66803627340325, 0], [114.1621112823486, 22.68157889801348, 0], [114.1470909118652, 22.69282380361848, 0], [114.144344329834, 22.70216745979744, 0], [114.1391086578369, 22.70628480086984, 0], [114.1392803192139, 22.71665678434663, 0], [114.1322422027588, 22.7193486210626, 0], [114.1303539276123, 22.71641926680022, 0], [114.1209125518799, 22.71950696274989, 0], [114.1173076629639, 22.71808188096842, 0], [114.1116428375244, 22.72599881416217, 0], [114.1096687316895, 22.72330710827556, 0], [114.1054630279541, 22.7250488063673, 0], [114.102201461792, 22.72576131283196, 0], [114.1003131866455, 22.73391528919637, 0], [114.0975666046143, 22.73462774947245, 0], [114.0944766998291, 22.73811083516108, 0], [114.0955066680908, 22.73985234472982, 0], [114.09499168396, 22.74483927212336, 0], [114.0927600860596, 22.74578914242589, 0], [114.0931034088135, 22.75006347708464, 0], [114.0870952606201, 22.74958855761403, 0], [114.0876960754395, 22.75085500586733, 0], [114.0842628479004, 22.7522797461206, 0], [114.0812587738037, 22.7519631384594, 0], [114.0792846679687, 22.75330871595219, 0], [114.0762805938721, 22.75085500586733, 0], [114.0761089324951, 22.74808463506716, 0], [114.0725040435791, 22.74618491977012, 0], [114.0701007843017, 22.74293951171321, 0], [114.0671825408936, 22.74483927212336, 0], [114.067268371582, 22.74697647101998, 0], [114.0635776519775, 22.75156737785113, 0], [114.0605735778809, 22.75101331107361, 0], [114.058427810669, 22.75259635304808, 0], [114.0594577789307, 22.75473343061665, 0], [114.0599727630615, 22.75908663335527, 0], [114.0541362762451, 22.75789941000427, 0], [114.0539646148682, 22.75694962389314, 0], [114.0524196624756, 22.75782026141394, 0], [114.0513896942139, 22.75964066738727, 0], [114.0483856201172, 22.75845344885234, 0], [114.0440082550049, 22.75908663335527, 0], [114.0440082550049, 22.76233165785697, 0], [114.0475273132324, 22.76510173971335, 0], [114.0470123291016, 22.76668461839901, 0], [114.0440082550049, 22.7701668869071, 0], [114.0447807312012, 22.77238282970583, 0], [114.0448665618897, 22.77396562396413, 0], [114.0430641174316, 22.77475701420964, 0], [114.0406608581543, 22.7737282059956, 0], [114.0387725830078, 22.77032516972863, 0], [114.036111831665, 22.76905890201723, 0], [114.0348243713379, 22.76787176536982, 0], [114.0332794189453, 22.76723862160339, 0], [114.0311336517334, 22.76826747873269, 0], [114.0295886993408, 22.76921718612353, 0], [114.0274429321289, 22.76921718612353, 0], [114.0259838104248, 22.76755519385366, 0], [114.023323059082, 22.76818833615189, 0], [114.0224647521973, 22.76913804409332, 0], [114.0210056304932, 22.76803005085261, 0], [114.0202331542969, 22.76589318135011, 0], [114.0175724029541, 22.76431029348883, 0], [114.0133666992188, 22.76399371371448, 0], [114.0124225616455, 22.76320226106733, 0], [114.008903503418, 22.76312311555029, 0], [114.0076160430908, 22.76470601717454, 0], [114.0035820007324, 22.76423114861406, 0], [114.0020370483398, 22.76668461839901, 0], [113.9978313446045, 22.76628890044806, 0], [113.9954280853271, 22.7701668869071, 0], [113.9913082122803, 22.77151228503965, 0], [113.9904499053955, 22.77341164806174, 0], [113.9935398101807, 22.77736856945827, 0], [113.9931964874268, 22.77934698712932, 0], [113.9919090270996, 22.78021748181652, 0], [113.9889907836914, 22.78544033329889, 0], [113.9891624450684, 22.78741863391307, 0], [113.9876174926758, 22.79050472557163, 0], [113.9878749847412, 22.79256208121093, 0], [113.9861583709717, 22.7973097065151, 0], [113.9860725402832, 22.80284839372866, 0], [113.9787769317627, 22.80300663862752, 0], [113.9761161804199, 22.80284839372866, 0], [113.9760303497314, 22.80371873839848, 0], [113.9790344238281, 22.80379786036556, 0], [113.979549407959, 22.80656710027152, 0], [113.9742279052734, 22.80363961638546, 0], [113.9732837677002, 22.80395610416191, 0], [113.9734554290772, 22.80237365792962, 0], [113.972339630127, 22.80213628940995, 0], [113.9722537994385, 22.80379786036556, 0], [113.9719104766846, 22.80300663862752, 0], [113.9708805084229, 22.80435171284888, 0], [113.9698505401611, 22.80435171284888, 0], [113.9707088470459, 22.80126593463417, 0], [113.9700222015381, 22.80047469819672, 0], [113.9671897888184, 22.80498468435917, 0], [113.9694213867188, 22.80846597510855, 0], [113.9725112915039, 22.80894068968279, 0], [113.9720821380615, 22.81178894239177, 0], [113.9668464660644, 22.81511182861774, 0], [113.9643573760986, 22.81614032459217, 0], [113.9618682861328, 22.81495359777848, 0], [113.9596366882324, 22.81629855405273, 0], [113.9592933654785, 22.8185928605722, 0], [113.9546585083008, 22.81606120979295, 0], [113.952169418335, 22.81716881279975, 0], [113.9498519897461, 22.81819729324022, 0], [113.9497661590576, 22.82286491453748, 0], [113.9425563812256, 22.82800702393421, 0], [113.9419555664063, 22.83014291996767, 0], [113.9343166351318, 22.83235788785732, 0], [113.9324283599854, 22.83425640306941, 0], [113.9327716827393, 22.83623399491549, 0], [113.9179229736328, 22.83378177674956, 0], [113.9144897460938, 22.83393998570679, 0], [113.9106273651123, 22.83196236052097, 0], [113.90625, 22.8327534140441, 0], [113.9029026031494, 22.83591758215162, 0], [113.8997268676758, 22.83512654702273, 0], [113.8974094390869, 22.83884437214041, 0], [113.8966369628906, 22.84192929883134, 0], [113.897066116333, 22.84335308755366, 0], [113.8989543914795, 22.84406497632583, 0], [113.9004993438721, 22.84770346074537, 0], [113.8976669311523, 22.8468333972401, 0], [113.8956928253174, 22.84746617125056, 0], [113.8955211639404, 22.84881080624628, 0], [113.8932037353516, 22.84588423070374, 0], [113.8920879364014, 22.84707068783906, 0], [113.893461227417, 22.84841532674543, 0], [113.8920021057129, 22.84825713462303, 0], [113.8914012908936, 22.84865261458396, 0], [113.8914012908936, 22.84999723784744, 0], [113.8902854919434, 22.84888990200842, 0], [113.8877105712891, 22.85055090238519, 0], [113.8876247406006, 22.85197460084383, 0], [113.8899421691895, 22.85252825732934, 0], [113.8899421691895, 22.85308191156014, 0], [113.8879680633545, 22.85316100483762, 0], [113.8863372802734, 22.85371465649154, 0], [113.8865947723389, 22.85624560676595, 0], [113.888053894043, 22.85687833697142, 0], [113.8904571533203, 22.85490104530003, 0], [113.8926029205322, 22.85569196542007, 0], [113.8961219787598, 22.85964649698834, 0], [113.8945770263672, 22.86027921136166, 0], [113.8932037353516, 22.85790651727335, 0], [113.8897705078125, 22.85727379185413, 0], [113.8874530792236, 22.8594092283389, 0], [113.8846206665039, 22.86012103304449, 0], [113.886079788208, 22.86225642479194, 0], [113.886251449585, 22.86423360945351, 0], [113.884449005127, 22.86265186402581, 0], [113.8829040527344, 22.86288912701376, 0], [113.882303237915, 22.86186098440733, 0], [113.880672454834, 22.86201916069925, 0], [113.8832473754883, 22.85846014959894, 0], [113.8821959495544, 22.85741220079127, 0], [113.880136013031, 22.85820310629965, 0], [113.8805651664734, 22.85705629181101, 0], [113.8806080818176, 22.85496036446867, 0], [113.8789772987366, 22.85545468986727, 0], [113.8790202140808, 22.85375420295198, 0], [113.8774108886719, 22.8551185487918, 0], [113.8772821426392, 22.85300281823665, 0], [113.8762521743774, 22.85484172610552, 0], [113.8768100738525, 22.85646310810629, 0], [113.8755011558533, 22.85670038189883, 0], [113.875093460083, 22.8549999105667, 0], [113.8739132881165, 22.85515809484381, 0], [113.8748574256897, 22.85760992759984, 0], [113.8731622695923, 22.85784719939042, 0], [113.8729476928711, 22.8545649028555, 0], [113.8698577880859, 22.85179663935179, 0], [113.8703727722168, 22.84999723784744, 0], [113.8694071769714, 22.84695204259134, 0], [113.8661670684815, 22.84853397071645, 0], [113.8683986663818, 22.84343218649013, 0], [113.8677763938904, 22.84009021634093, 0], [113.859429359436, 22.8397144867519, 0], [113.8568758964539, 22.83714367751285, 0], [113.8520693778992, 22.83560116865192, 0], [113.850953578949, 22.83848841455895, 0], [113.8492155075073, 22.83825110898723, 0], [113.8460397720337, 22.84028796833938, 0], [113.8407826423645, 22.837776496602, 0], [113.8360190391541, 22.83623399491549, 0], [113.8355040550232, 22.83370267220197, 0], [113.8335084915161, 22.83249632215346, 0], [113.831684589386, 22.82960894910163, 0], [113.831148147583, 22.82640507991364, 0], [113.8297963142395, 22.82529755203766, 0], [113.8334226608276, 22.82270669270676, 0], [113.8335728645325, 22.81924554415783, 0], [113.8341093063355, 22.81833574193713, 0], [113.8332080841065, 22.8164765619761, 0], [113.8349032402039, 22.81398442987698, 0], [113.8346457481384, 22.80979121582498, 0], [113.8312125205994, 22.80247256135746, 0], [113.8254833221436, 22.80055382204716, 0], [113.8223505020142, 22.80087031698961, 0], [113.8226079940796, 22.79889221154202, 0], [113.8231658935547, 22.79835811814934, 0], [113.8229298591614, 22.79762620899021, 0], [113.8204622268677, 22.79784380401557, 0], [113.8193464279175, 22.79523264078764, 0], [113.8159990310669, 22.79556892976676, 0], [113.8110208511353, 22.79509416861398, 0], [113.8091969490051, 22.79368965719036, 0], [113.8080167770386, 22.79186970537471, 0], [113.8093900680542, 22.78728015380409, 0], [113.8037037849426, 22.78472813805355, 0], [113.8006567955017, 22.78522271847956, 0], [113.7983179092407, 22.78728015380409, 0], [113.7964725494385, 22.78688449557509, 0], [113.7952709197998, 22.7851435857319, 0], [113.7957215309143, 22.78326416948249, 0], [113.7966442108154, 22.78164191568799, 0], [113.7959790229797, 22.77881281718519, 0], [113.794047832489, 22.77758619680628, 0], [113.7902927398682, 22.77655740992151, 0], [113.7886834144592, 22.77442067391603, 0], [113.7874388694763, 22.7718090622542, 0], [113.7874174118042, 22.76925675712143, 0], [113.7888336181641, 22.76567553535734, 0], [113.7884044647217, 22.76051128775363, 0], [113.7862586975098, 22.7569891984463, 0], [113.7816023826599, 22.75320977688208, 0], [113.7758302688599, 22.7518444103973, 0], [113.7669682502747, 22.74715456941937, 0], [113.7631916999817, 22.74440391269502, 0], [113.7598013877869, 22.74133656832815, 0], [113.7572693824768, 22.73815041517037, 0], [113.7577414512634, 22.73650783515518, 0], [113.7586641311645, 22.73433089147521, 0], [113.7596082687378, 22.73066958985472, 0], [113.7586855888367, 22.72358419809152, 0], [113.7617540359497, 22.70398860669376, 0], [113.7636637687683, 22.69446690798246, 0], [113.7664318084717, 22.68892382642565, 0], [113.76793384552, 22.68021281671024, 0], [113.7661957740784, 22.67740141815495, 0], [113.762698173523, 22.67419397757954, 0], [113.7626338005066, 22.67031327018044, 0], [113.7661743164063, 22.667600669713, 0], [113.7734270095825, 22.66548203204266, 0], [113.7766885757446, 22.66019519537409, 0], [113.7859582901001, 22.64575931208174, 0], [113.8017082214356, 22.61662549562953, 0], [113.8031673431397, 22.6079891333487, 0], [113.8049697875977, 22.60117474012794, 0], [113.8120937347412, 22.59927298877605, 0], [113.8181018829346, 22.60244255976457, 0], [113.8236808776856, 22.6013332182212, 0], [113.8320922851563, 22.5869109646173, 0], [113.8302898406982, 22.5809672887631, 0], [113.8381004333496, 22.57431006737855, 0], [113.8499450683594, 22.5665429026504, 0], [113.8617038726807, 22.55671443443475, 0], [113.8689994812012, 22.55037311550674, 0], [113.8774108886719, 22.54434859257118, 0], [113.8827323913574, 22.54276314808852, 0], [113.8855648040772, 22.54125695896235, 0], [113.8861656188965, 22.53325009880448, 0], [113.8835048675537, 22.52857260923626, 0], [113.8753509521484, 22.52230928194575, 0], [113.8619613647461, 22.51580780647742, 0], [113.8651371002197, 22.50351759674845, 0], [113.8618755340576, 22.49931488731488, 0], [113.8709735870361, 22.47496837975996, 0], [113.8746643066406, 22.46259522402894, 0], [113.878698348999, 22.45624958736163, 0], [113.88427734375, 22.45577365290034, 0], [113.8838481903076, 22.44641327646702, 0], [113.8912296295166, 22.45037961481478, 0], [113.8968944549561, 22.46552998272458, 0], [113.9011859893799, 22.46545066573923, 0], [113.9055633544922, 22.46957508876842, 0], [113.9106273651123, 22.46783015554819, 0], [113.9178371429443, 22.48551641530479, 0], [113.9220428466797, 22.48028215224136, 0], [113.9332008361816, 22.48115454316138, 0], [113.9386940002441, 22.48234415828457, 0], [113.9409255981445, 22.48623016311604, 0], [113.9467191696167, 22.48751886512017, 0], [113.949830532074, 22.49921576526801, 0], [113.9505386352539, 22.51301287089108, 0], [113.9513325691223, 22.51477705666879, 0], [113.9515471458435, 22.5186819720723, 0], [113.9519333839417, 22.52145697179046, 0], [113.953800201416, 22.52219035526294, 0], [113.9574694633484, 22.52064429907181, 0], [113.9622330665588, 22.52181375342543, 0], [113.9669322967529, 22.52088215499638, 0], [113.9684772491455, 22.52199214389747, 0], [113.9731979370117, 22.52183357460038, 0], [113.9768886566162, 22.52044608548857, 0], [113.9805364608765, 22.52183357460038, 0], [113.9862442016601, 22.52175428988359, 0], [113.9878749847412, 22.5231417658592, 0], [113.9897632598877, 22.52423191577993, 0], [113.9940333366394, 22.52335979653147, 0], [113.9992904663086, 22.52550044304117, 0], [113.9981746673584, 22.52742303246627, 0], [113.9996767044067, 22.52809692345728, 0], [114.0030455589294, 22.52801764233486, 0], [114.007465839386, 22.52577793182692, 0], [114.0099334716797, 22.52498510524604, 0], [114.0133452415466, 22.52236874524877, 0], [114.0154480934143, 22.52246785069691, 0], [114.0233659744263, 22.51935590569861, 0], [114.0290522575378, 22.5140436338553, 0], [114.0290307998657, 22.51338949671144, 0], [114.0317130088806, 22.50946460884571, 0], [114.0310263633728, 22.50797787979963, 0], [114.0349960327148, 22.50672901504688, 0], [114.0413475036621, 22.50530172723242, 0], [114.0457677841186, 22.504865608573, 0], [114.0511107444763, 22.50280393811022, 0], [114.0545010566711, 22.50399336712806, 0], [114.0566468238831, 22.50559908007529, 0], [114.0568828582764, 22.50958354647878, 0], [114.0588784217835, 22.51340931909462, 0], [114.0624403953552, 22.51614478070915, 0], [114.0665173530579, 22.51757195658223, 0], [114.0721821784973, 22.51882072338168, 0], [114.0752506256104, 22.52270570348246, 0], [114.0765380859375, 22.5276212360402, 0], [114.0786838531494, 22.5309708334223, 0], [114.0826964378357, 22.5321203806646, 0], [114.0865159034729, 22.53432034957003, 0], [114.0886616706848, 22.53681756909829, 0], [114.0931463241577, 22.537570689933, 0], [114.0965580940247, 22.53539059204079, 0], [114.0994119644165, 22.53513294183369, 0], [114.099497795105, 22.53471673663747, 0], [114.1004633903503, 22.53469691731112, 0], [114.1026735305786, 22.5352122188717, 0], [114.1049909591675, 22.53479601391442, 0], [114.1072654724121, 22.5338645030358, 0], [114.108681678772, 22.53247713475979, 0], [114.109947681427, 22.53067353516448, 0], [114.1115570068359, 22.52966271630109, 0], [114.1138529777527, 22.53023749656207, 0], [114.1155052185059, 22.53120867156781, 0], [114.1161489486694, 22.53311136198683, 0], [114.1165995597839, 22.53388432248163, 0], [114.1199040412903, 22.53507348402533, 0], [114.1220819950104, 22.53767969392402, 0], [114.1252684593201, 22.53969129758218, 0], [114.1287446022034, 22.54014712487959, 0], [114.1308689117432, 22.5419307824451, 0], [114.1341090202332, 22.5414452335019, 0], [114.1378426551819, 22.54338741902716, 0], [114.1411900520325, 22.54284242074515, 0], [114.1439473628998, 22.54220823821726, 0], [114.1447305679321, 22.54114795779578, 0], [114.1487109661102, 22.54170287192934, 0], [114.1480779647827, 22.54322887429433, 0], [114.1502130031586, 22.54581511250363, 0], [114.1515648365021, 22.54651864018353, 0], [114.1521334648132, 22.54827248934799, 0], [114.1500306129456, 22.54799504576656, 0], [114.1496872901916, 22.55047220085651, 0], [114.1513180732727, 22.55111625389562, 0], [114.1518759727478, 22.55487151866775, 0], [114.152809381485, 22.55481206936213, 0], [114.1543650627136, 22.55428693271641, 0], [114.1554486751556, 22.55536692855169, 0], [114.1569292545319, 22.55504986643093, 0], [114.1572618484497, 22.5571900216036, 0], [114.1600835323334, 22.56143060135838, 0], [114.161639213562, 22.56197552621839, 0], [114.163259267807, 22.55927069618673, 0], [114.1645574569702, 22.55916170924947, 0], [114.1669714450836, 22.56102438324371, 0], [114.1684949398041, 22.56113336870899, 0], [114.1704797744751, 22.55974627454144, 0], [114.1761445999146, 22.56006332586685, 0], [114.1773247718811, 22.55971655094232, 0], [114.1781830787659, 22.55547591848739, 0], [114.1810047626495, 22.55424729968089, 0], [114.1817665100098, 22.55534711219049, 0], [114.1868948936462, 22.55471298712914, 0], [114.1874742507934, 22.5557731633289, 0], [114.1886651515961, 22.55448509772322, 0], [114.1904675960541, 22.55436619875329, 0], [114.1921520233154, 22.55590196922797, 0], [114.1945123672485, 22.55534711219049, 0], [114.1953706741333, 22.55570380625651, 0], [114.1958963871002, 22.5557731633289, 0], [114.1958856582642, 22.55635774298203, 0], [114.1960895061493, 22.55699186048252, 0], [114.1969478130341, 22.55685314752838, 0], [114.1975164413452, 22.55655590501409, 0], [114.1980850696564, 22.5567045263513, 0], [114.1992330551148, 22.55661535356819, 0], [114.2006385326386, 22.55750707880517, 0], [114.2015075683594, 22.55653608882368, 0], [114.2045760154724, 22.5562982943169, 0], [114.2079126834869, 22.55685314752838, 0], [114.2096400260925, 22.5562982943169, 0], [114.2111742496491, 22.55662526165805, 0], [114.2129123210907, 22.55510931563408, 0], [114.2165386676788, 22.55503005002419, 0], [114.2180621623993, 22.556149672542, 0], [114.2203795909882, 22.55368252768754, 0], [114.2211520671845, 22.55201792309974, 0], [114.2243492603302, 22.55108652843691, 0], [114.22682762146, 22.54797522834653, 0], [114.2255294322968, 22.54593401884224, 0], [114.227921962738, 22.5439423241579, 0], [114.2303574085236, 22.54572593268247, 0], [114.2316770553589, 22.5481486306752, 0], [114.2339301109314, 22.551854434066, 0], [114.2348152399063, 22.55331592006836, 0], [114.2377924919128, 22.55612985629324, 0], [114.2409896850586, 22.55917161715641, 0], [114.2437362670898, 22.55647168618524, 0], [114.2469280958176, 22.55871089873048, 0], [114.2499643564224, 22.56083613541897, 0], [114.2537033557892, 22.56346167398304, 0], [114.2497497797012, 22.56663206901433, 0], [114.2500877380371, 22.57042653972172, 0], [114.2542237043381, 22.56566114328014, 0], [114.266095161438, 22.57561776124758, 0], [114.2763519287109, 22.56733549053006, 0], [114.2898273468018, 22.56705808529047, 0], [114.2730045318603, 22.58326554050285, 0], [114.2790985107422, 22.58821853888745, 0], [114.2995262145996, 22.57308161638045, 0], [114.3013715744019, 22.57827273789989, 0], [114.3012428283691, 22.58358253773391, 0], [114.3024873733521, 22.58726757701301, 0], [114.3005561828613, 22.59055629224963, 0], [114.3056201934815, 22.59598448173318, 0], [114.3136882781982, 22.59955032915136, 0], [114.3167352676392, 22.59697500417008, 0], [114.320855140686, 22.59717310780225, 0], [114.3235588073731, 22.59828248287399, 0], [114.321928024292, 22.60050120619587, 0], [114.3228721618652, 22.6030368461989, 0], [114.3258762359619, 22.60454236034713, 0], [114.3300819396973, 22.60323494110675, 0], [114.3347597122192, 22.60014462807397, 0], [114.3362617492676, 22.59661841691381, 0], [114.3352317810059, 22.59400341547955, 0], [114.3390083312988, 22.59507319479693, 0], [114.3404674530029, 22.59745045240833, 0], [114.3423986434936, 22.59788627851753, 0], [114.3460035324097, 22.60002576849474, 0], [114.3519687652588, 22.59970880911496, 0], [114.3570327758789, 22.60323494110675, 0], [114.357762336731, 22.60830607365785, 0], [114.3659162521362, 22.60794951575872, 0], [114.3844985961914, 22.61333740326884, 0], [114.4088315963745, 22.61111888690809, 0], [114.421706199646, 22.60319532214798, 0], [114.4369411468506, 22.57018876916768, 0], [114.4578838348389, 22.56892065261958, 0], [114.4633769989014, 22.55417794184132, 0], [114.4681835174561, 22.54902554768576, 0], [114.4731616973877, 22.5495011613606, 0]]]
    },
    "properties": {
      "name": "\u6df1\u5733",
      "stroke": "#555555",
      "stroke-width": 2,
      "stroke-opacity": 1,
      "fill": "#ff0000",
      "fill-opacity": .5
    }
  }]
};
var area_bounday = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "name": "\u5927\u9e4f\u533a",
      "cp": [114.47685241699217, 22.63478596348914]
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [[[[114.50749397277832, 22.66668985752757], [114.50697898864746, 22.664313797277664], [114.50457572937012, 22.663204955079465], [114.50363159179688, 22.66043281038239], [114.50174331665039, 22.659799169446018], [114.49994087219238, 22.65948234788074], [114.49753761291504, 22.65488835299973], [114.50148582458496, 22.64823470853169], [114.50517654418944, 22.64918524891124], [114.50732231140137, 22.646729672807435], [114.50921058654785, 22.647521798928985], [114.50835227966309, 22.650611047142895], [114.51736450195312, 22.652116040324866], [114.51848030090332, 22.65465072839274], [114.52466011047363, 22.65575963970616], [114.53264236450195, 22.65417547794476], [114.53152656555176, 22.652353669319215], [114.5357322692871, 22.65132394070657], [114.53564643859863, 22.65346259918787], [114.53710556030273, 22.65322497211294], [114.53985214233398, 22.6512447304934], [114.54706192016602, 22.651878410919217], [114.55186843872069, 22.651482360995818], [114.5533275604248, 22.65306655383448], [114.55718994140625, 22.652116040324866], [114.55942153930663, 22.654413103374424], [114.5657730102539, 22.65267050733856], [114.57195281982422, 22.655046769175886], [114.57332611083984, 22.661066448393168], [114.57667350769043, 22.660987243801817], [114.57744598388672, 22.65845267274257], [114.58036422729492, 22.658056641786317], [114.5822525024414, 22.660591220159368], [114.58705902099608, 22.65853187879668], [114.58834648132323, 22.656155677289963], [114.59212303161621, 22.657422989879493], [114.59478378295898, 22.6556012243527], [114.59615707397461, 22.654017060763145], [114.59452629089355, 22.651007099579697], [114.59152221679688, 22.649977360867783], [114.59032058715819, 22.641739173180373], [114.58311080932616, 22.638491290310437], [114.5789909362793, 22.628588734517166], [114.57830429077148, 22.61797240233461], [114.56268310546874, 22.608464543538656], [114.5460319519043, 22.58770343535385], [114.54105377197266, 22.588654394218803], [114.53504562377928, 22.589922329157808], [114.5266342163086, 22.59087327270109], [114.5130729675293, 22.593884550597863], [114.50860977172852, 22.592299675703206], [114.50037002563477, 22.58104653946133], [114.5020866394043, 22.56551253159502], [114.50071334838867, 22.55695222822414], [114.50946807861328, 22.549342623651143], [114.51787948608398, 22.554098675696263], [114.52474594116211, 22.56804881572589], [114.54500198364258, 22.572487200676317], [114.55015182495117, 22.56931694029401], [114.55135345458984, 22.563293244707797], [114.5551300048828, 22.562183587869633], [114.56680297851562, 22.549342623651143], [114.5767593383789, 22.548074315418166], [114.59100723266602, 22.543318055728953], [114.6038818359375, 22.545537663981865], [114.60834503173828, 22.543952233157825], [114.60817337036131, 22.54046422124227], [114.60508346557617, 22.53507348402533], [114.60628509521483, 22.531585247793878], [114.620361328125, 22.520644299071808], [114.62345123291017, 22.511764051618446], [114.61933135986327, 22.50748229989845], [114.61624145507812, 22.502724642478643], [114.61074829101561, 22.500504346337234], [114.6119499206543, 22.497966821391756], [114.60765838623048, 22.496063647136296], [114.59581375122072, 22.494953450063466], [114.59426879882811, 22.491464201269597], [114.58293914794922, 22.491940013104305], [114.58379745483398, 22.48559572079889], [114.57092285156249, 22.484802663813245], [114.56869125366211, 22.482106236077673], [114.56371307373045, 22.481630390437257], [114.5599365234375, 22.478933900916928], [114.55495834350586, 22.477347706080856], [114.5460319519043, 22.48274069438746], [114.54191207885742, 22.482106236077673], [114.52800750732422, 22.47147862721479], [114.53161239624023, 22.465133397343827], [114.52011108398438, 22.45577365290034], [114.51444625854492, 22.450379614814782], [114.50517654418944, 22.44942770395736], [114.49419021606445, 22.456408231818937], [114.49487686157227, 22.466243833549445], [114.48131561279297, 22.470526861261266], [114.48148727416991, 22.47449250959042], [114.48234558105469, 22.491781409341186], [114.47719573974608, 22.49542924989981], [114.47856903076172, 22.50668936836207], [114.47513580322266, 22.513825588484632], [114.47908401489258, 22.517472847622763], [114.4833755493164, 22.53697612119435], [114.47324752807616, 22.549501161360602], [114.46826934814453, 22.549184085759524], [114.46346282958984, 22.554257207940832], [114.45779800415038, 22.56899991024561], [114.43702697753906, 22.570268026064607], [114.42947387695312, 22.586435479986736], [114.42157745361328, 22.60323494110675], [114.40887451171875, 22.611158503585433], [114.3844985961914, 22.61337701930728], [114.36595916748047, 22.607989133348692], [114.35771942138672, 22.608306073657854], [114.3570327758789, 22.60323494110675], [114.3518829345703, 22.59974842907735], [114.3460464477539, 22.600065388365874], [114.34364318847656, 22.605770530742948], [114.33265686035156, 22.605929003543956], [114.33746337890624, 22.619398524467492], [114.33420181274414, 22.626845810854576], [114.33900833129883, 22.634451133727296], [114.34432983398436, 22.63429269379353], [114.35531616210938, 22.62541976596588], [114.36046600341795, 22.626687362153042], [114.3621826171875, 22.635084891635483], [114.37007904052734, 22.634768013046767], [114.36681747436523, 22.64364033727684], [114.37042236328125, 22.646808885625212], [114.38398361206055, 22.639362681056678], [114.3844985961914, 22.64490776538838], [114.42741394042969, 22.665185024147085], [114.44475173950195, 22.668036273403263], [114.4474983215332, 22.672154639931616], [114.45075988769531, 22.672788223807103], [114.46603775024413, 22.67057066743831], [114.47393417358397, 22.66391778323553], [114.47771072387695, 22.67104586110696], [114.50037002563477, 22.671204258630677], [114.5075798034668, 22.667719470856607], [114.50783729553223, 22.66684826008114], [114.5071506500244, 22.667085863568587]]]]
    }
  }, {
    "type": "Feature",
    "properties": {
      "name": "\u576a\u5c71\u533a",
      "cp": [114.367511, 22.729989]
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [[[[114.42672729492188, 22.6649474173677], [114.4258689880371, 22.666293850343482], [114.42749977111816, 22.667085863568587], [114.42629814147949, 22.670253870744652], [114.42492485046385, 22.671125059891676], [114.42312240600586, 22.679123901574425], [114.43127632141113, 22.682687591672966], [114.43273544311523, 22.684508997504885], [114.43694114685059, 22.685300905535232], [114.4405460357666, 22.69187356559607], [114.4379711151123, 22.700742197508013], [114.43453788757324, 22.699633649917875], [114.42947387695312, 22.70319680667106], [114.42295074462889, 22.701375649245513], [114.41891670227051, 22.70652233600077], [114.4200325012207, 22.71143130311116], [114.41582679748535, 22.716656784346625], [114.40621376037598, 22.714281590333755], [114.39788818359375, 22.726948815359574], [114.40269470214844, 22.727265480959215], [114.40355300903319, 22.734231938666262], [114.40990447998047, 22.74103972489772], [114.40973281860352, 22.755129182053118], [114.41608428955078, 22.75782026141394], [114.41333770751953, 22.761777634742167], [114.41728591918945, 22.763518842676692], [114.41522598266602, 22.766209756720222], [114.4112777709961, 22.77507356902285], [114.40149307250977, 22.783936805641865], [114.39496994018553, 22.78298720068814], [114.3896484375, 22.764152003693415], [114.38329696655273, 22.76051128775363], [114.38003540039062, 22.76272738727705], [114.36321258544922, 22.767950908134154], [114.35874938964844, 22.767950908134154], [114.34999465942383, 22.767159478426116], [114.34123992919922, 22.7571870710401], [114.33712005615233, 22.7549708816161], [114.33368682861328, 22.74673900612645], [114.33694839477539, 22.74515589629107], [114.3317985534668, 22.73454858740287], [114.32064056396483, 22.719665304253958], [114.33025360107422, 22.7107978978908], [114.32218551635742, 22.706047265326838], [114.31703567504881, 22.70430532542097], [114.31806564331053, 22.701454830506705], [114.30965423583984, 22.688626869300187], [114.30364608764648, 22.688151736561025], [114.30261611938477, 22.683558701829426], [114.29901123046875, 22.683875467786574], [114.2962646484375, 22.685617667466317], [114.29506301879883, 22.683875467786574], [114.28991317749023, 22.68260839956607], [114.28682327270506, 22.68149970526613], [114.2849349975586, 22.678807124638336], [114.28047180175781, 22.679440677778647], [114.27652359008789, 22.67643127428993], [114.27549362182617, 22.678331957861936], [114.2684555053711, 22.674213776825553], [114.26261901855469, 22.664234594560682], [114.26536560058594, 22.657422989879493], [114.27034378051756, 22.653145762996566], [114.27085876464844, 22.64823470853169], [114.28218841552733, 22.64284818876791], [114.28991317749023, 22.642214466671458], [114.2940330505371, 22.63556020814839], [114.30244445800781, 22.631757630008693], [114.30948257446288, 22.626528913268878], [114.31394577026367, 22.628905627354133], [114.31961059570312, 22.625895115905806], [114.32579040527344, 22.628113393891823], [114.33162689208984, 22.627796499228392], [114.33420717716217, 22.626850762373568], [114.33900833129883, 22.634451133727296], [114.34432983398436, 22.634352108790097], [114.35531616210938, 22.62541976596588], [114.36048746109007, 22.626746780437525], [114.36213970184326, 22.635124501407702], [114.37007904052734, 22.634807622910316], [114.36688184738159, 22.643660140931026], [114.37046527862549, 22.64686829520855], [114.38398361206055, 22.639362681056678], [114.3844985961914, 22.64496717579413], [114.42675948143005, 22.664892965756124]]]]
    }
  }, {
    "type": "Feature",
    "properties": {
      "name": "\u9f99\u5c97\u533a",
      "cp": [114.276099, 22.76945]
    },
    "geometry": {
      "type": "MultiPolygon",
    }
  }, {
    "type": "Feature",
    "properties": {
      "name": "\u798f\u7530\u533a",
      "cp": [114.055105, 22.55494]
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [[[[113.99062156677246, 22.524132811597127], [113.99405479431152, 22.523339975575478], [113.9992904663086, 22.525480622392287], [113.9981746673584, 22.52738339171736], [113.99971961975096, 22.528096923457284], [114.00306701660156, 22.528017642334856], [114.00744438171387, 22.525797752433142], [114.00993347167967, 22.52500492596603], [114.01336669921875, 22.522388566344084], [114.01542663574219, 22.522467850696913], [114.02332305908203, 22.519375727226112], [114.02907371520996, 22.514063456144665], [114.02907371520996, 22.513349851936567], [114.03173446655273, 22.50946460884571], [114.03104782104492, 22.507958056637694], [114.03482437133789, 22.506768661720322], [114.04126167297363, 22.505341374315076], [114.04581069946289, 22.50486560857298], [114.05113220214844, 22.502803938110215], [114.05447959899902, 22.503993367128068], [114.05662536621092, 22.505579256572318], [114.05688285827637, 22.509543900612464], [114.05885696411133, 22.513349851936567], [114.06246185302734, 22.51612495871825], [114.06675338745117, 22.517631421923767], [114.0721607208252, 22.518820723381683], [114.07525062561035, 22.522705703482472], [114.0765380859375, 22.527621236040204], [114.07868385314941, 22.530951013558354], [114.08271789550781, 22.532140200360722], [114.08658027648926, 22.534359988327974], [114.0886402130127, 22.536817569098286], [114.09318923950195, 22.53761032775788], [114.09653663635254, 22.53539059204079], [114.09936904907225, 22.53515276109746], [114.09920811653136, 22.57035719001917], [114.09873604774475, 22.570307654495966], [114.09787774085997, 22.56946554787822], [114.0956461429596, 22.568365847961545], [114.08829689025879, 22.566701420590856], [114.08698797225952, 22.566612254271767], [114.08553957939148, 22.569227775666594], [114.08393025398254, 22.5708723584051], [114.08206343650818, 22.572328689388932], [114.07854437828064, 22.572695246464367], [114.07780408859253, 22.57265561871943], [114.07630205154419, 22.572328689388932], [114.07453179359435, 22.571298361577583], [114.07397389411926, 22.570911986662725], [114.07258987426758, 22.57179371244819], [114.07179594039917, 22.5737552844127], [114.07055139541626, 22.574983729406178], [114.07010078430174, 22.576430110281347], [114.06930685043335, 22.57769815773783], [114.0690279006958, 22.578748250704837], [114.06695723533629, 22.58169044969449], [114.06419992446898, 22.583503288494533], [114.06100273132324, 22.588238350523334], [114.05407190322876, 22.589922329157808], [114.05179738998413, 22.588713828929844], [114.0485143661499, 22.58760437676114], [114.04838562011717, 22.584751458718937], [114.04746294021606, 22.584157093355916], [114.04233455657959, 22.584850519363435], [114.04033899307251, 22.586554351298265], [114.03587579727171, 22.586336420482088], [114.03379440307617, 22.58540525765613], [114.03128385543822, 22.58540525765613], [114.02909517288208, 22.585167512947105], [114.02501821517943, 22.583186291081116], [114.02306556701659, 22.583958970998342], [114.0186882019043, 22.584038219975564], [114.01673555374146, 22.582532481612215], [114.01396751403809, 22.58175979369395], [114.00791645050047, 22.581878669040382], [114.00298118591307, 22.58068991096031], [114.00023460388184, 22.577955728451574], [114.00040626525877, 22.570862451338908], [113.99843215942381, 22.568207331934854], [113.9985179901123, 22.56452178293408], [114.00032043457031, 22.55877530032342], [113.99246692657469, 22.557348550295494], [113.99311065673828, 22.555683989943713], [113.99332523345947, 22.552552976764677], [113.99452686309814, 22.551998106257468], [113.99319648742676, 22.55148286735981], [113.9912223815918, 22.549857870540936], [113.99182319641112, 22.5469249010131], [113.99152278900145, 22.54518094363431], [113.99147987365721, 22.53986966496475], [113.99250984191893, 22.536579740612826], [113.99248838424681, 22.53493474903956], [113.99012804031372, 22.53531131510519], [113.99002075195312, 22.534756375281635], [113.9907717704773, 22.534498723891176], [113.9902138710022, 22.532893346706057], [113.98907661437988, 22.53293298587362], [113.9879822731018, 22.530296956452545], [113.9889907836914, 22.525797752433142], [113.98917317390442, 22.524479675925946], [113.99014949798584, 22.52417245327878], [113.99036407470703, 22.52417245327878]]]]
    }
  }, {
    "properties": {
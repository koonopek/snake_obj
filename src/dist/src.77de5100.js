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
})({"Board.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BLOCK_SIZE = 20;
exports.BOARD_SIZE = 300;
exports.BOARD_COLOR = "red";

class Board {
  constructor(idCanvasElement, boardColor = exports.BOARD_COLOR, boardSize = exports.BOARD_SIZE, blockSize = exports.BLOCK_SIZE) {
    this.canvas = document.getElementById(idCanvasElement);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.backgroundColor = boardColor;
    this.canvas.width = boardSize;
    this.canvas.height = boardSize;
    this.boardSize = boardSize;
    this.blockSize = blockSize;
  }

  drawBlock(x, y) {
    this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
    this.ctx.stroke();
  }

  drawFood(x, y) {
    this.ctx.fillStyle = "#3370d4";
    this.ctx.beginPath();
    this.ctx.arc(x, y, exports.BLOCK_SIZE / 2, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.boardSize, this.boardSize);
    this.ctx.stroke();
  }

}

exports.default = Board;
},{}],"Snake.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class Snake {
  constructor(step) {
    this.step = step;
    this.direction = Direction.Right;
    this.head = {
      prev: {
        prev: null,
        x: 1 * step,
        y: 2 * step
      },
      x: 10 * step,
      y: 3 * step
    };
  }

  push(block = {
    x: 0,
    y: 0,
    prev: null
  }) {
    let start = this.head;

    while (start.prev !== null) {
      start = start.prev;
    }

    start.prev = block;
  }

  [Symbol.iterator]() {
    let curr = this.head;
    return {
      next: function () {
        console.log('in iterator');
        if (curr.prev === null) return {
          value: null,
          done: true
        };else {
          curr = curr.prev;
          return {
            value: curr,
            done: false
          };
        }
      }.bind(this)
    };
  }

  checkForDirections(dir) {
    console.log(`this.dir : ${this.direction} dir: ${dir}`);
    if (dir === Direction.Down && this.direction === Direction.Up) return false;
    if (dir === Direction.Up && this.direction === Direction.Down) return false;
    if (dir === Direction.Left && this.direction === Direction.Right) return false;
    if (dir === Direction.Right && this.direction === Direction.Left) return false;
    return true;
  }

  changeDirection(dir) {
    if (!this.checkForDirections(dir)) return false;
    this.direction = dir;
  }

  move() {
    const dir = this.direction;
    let tmpBox = {
      x: this.head.prev.x,
      y: this.head.prev.y,
      prev: this.head.prev.prev
    };

    switch (dir) {
      case Direction.Right:
        tmpBox.x += this.step;
        break;

      case Direction.Left:
        tmpBox.x -= this.step;
        break;

      case Direction.Up:
        tmpBox.y -= this.step;
        break;

      case Direction.Down:
        tmpBox.y += this.step;
    }

    let newPositions = [];

    for (const block of this) {
      if (block.prev !== null) {
        newPositions.push({
          x: block.x,
          y: block.y
        });
      }
    }

    let i = 0;

    for (const block of this) {
      if (this.head.prev === block) continue;
      block.x = newPositions[i].x;
      block.y = newPositions[i].y;
      i++;
    }

    this.head.prev = tmpBox;
    return true;
  }

  eat() {
    let curr = this.head;

    while (curr.prev !== null) {
      curr = curr.prev;
    }

    curr.prev = {
      x: curr.x,
      y: curr.y,
      prev: null
    };
  }

}

exports.default = Snake;
var Direction;

(function (Direction) {
  Direction[Direction["Up"] = 0] = "Up";
  Direction[Direction["Down"] = 1] = "Down";
  Direction[Direction["Left"] = 2] = "Left";
  Direction[Direction["Right"] = 3] = "Right";
})(Direction = exports.Direction || (exports.Direction = {}));
},{}],"Game.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Board_1 = __importStar(require("./Board"));

const Snake_1 = __importStar(require("./Snake"));

var State;

(function (State) {
  State[State["Playing"] = 0] = "Playing";
  State[State["Pause"] = 1] = "Pause";
  State[State["Win"] = 2] = "Win";
  State[State["GameOver"] = 3] = "GameOver";
})(State || (State = {})); //to export


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} //do exportu


class Game {
  constructor(idCanvasElement, boardColor = Board_1.BOARD_COLOR, boardSize = Board_1.BOARD_SIZE, blockSize = Board_1.BLOCK_SIZE) {
    this.board = new Board_1.default(idCanvasElement);
    this.state = State.Pause;
    this.snake = new Snake_1.default(Board_1.BLOCK_SIZE);
  }

  checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
      this.snake.changeDirection(Snake_1.Direction.Up);
    } else if (e.keyCode == '40') {
      // down arrow
      this.snake.changeDirection(Snake_1.Direction.Down);
    } else if (e.keyCode == '37') {
      // left arrow
      this.snake.changeDirection(Snake_1.Direction.Left);
    } else if (e.keyCode == '39') {
      // right arrow
      this.snake.changeDirection(Snake_1.Direction.Right);
    }
  }

  render() {
    for (const block of this.snake) {
      this.board.drawBlock(block.x, block.y);
    }

    this.board.drawBlock(this.food.x, this.food.y);
  }

  checkForCollision() {
    if (this.snake.head.prev.x < -Board_1.BLOCK_SIZE) return true;
    if (this.snake.head.prev.y < -Board_1.BLOCK_SIZE) return true;
    if (this.snake.head.prev.x > Board_1.BOARD_SIZE) return true;
    if (this.snake.head.prev.y > Board_1.BOARD_SIZE) return true;

    for (const block of this.snake) {
      if (this.snake.head.prev.x === block.x && this.snake.head.prev.y === block.y && this.snake.head.prev !== block) {
        return true;
      }
    }

    return false;
  }

  checkEat() {
    // console.log(`Check eat: x:${(this.food.x - BsLOCK_SIZE) - this.snake.head.prev.x}  y:${this.food.y + BLOCK_SIZE - this.snake.head.prev.y} `)
    if (this.snake.head.prev.x === this.food.x && this.snake.head.prev.y === this.food.y) return true;
    return false;
  }

  generateFood() {
    let x = Math.floor(Math.random() * (Board_1.BOARD_SIZE / 10)) * Board_1.BLOCK_SIZE % Board_1.BOARD_SIZE;
    let y = Math.floor(Math.random() * (Board_1.BOARD_SIZE / 10)) * Board_1.BLOCK_SIZE % Board_1.BOARD_SIZE;
    console.log(x, y);
    this.food = {
      x,
      y
    };
  }

  handleGameState() {
    switch (this.state) {
      case State.GameOver:
        this.gameOver();
        break;

      case State.Win:
        this.win();
        break;

      default:
        break;
    }
  }

  gameOver() {
    this.board.clear();
    this.board.canvas.style.backgroundColor = "black";
  }

  win() {
    this.board.clear();
    this.board.canvas.style.backgroundColor = "green";
  }

  start(delay = 200) {
    return __awaiter(this, void 0, void 0, function* () {
      document.onkeydown = this.checkKey.bind(this);
      this.generateFood();
      this.state = State.Playing;
      this.snake.eat();
      this.snake.eat();
      this.snake.eat();
      this.snake.eat();

      while (this.state === State.Playing) {
        this.board.clear();
        this.render();
        this.snake.move();

        if (this.checkForCollision()) {
          this.state = State.GameOver;
          break;
        }

        if (this.checkEat()) {
          this.snake.eat();
          this.generateFood();
        }

        yield sleep(delay);
      }

      this.handleGameState();
    });
  }

}

exports.default = Game;
},{"./Board":"Board.ts","./Snake":"Snake.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Game_1 = __importDefault(require("./Game"));

const game = new Game_1.default('canvas');
console.log(game);
game.start(100);
},{"./Game":"Game.ts"}],"../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34797" + '/');

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
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map
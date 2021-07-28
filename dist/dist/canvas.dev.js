"use strict";

// Drawing canvas number tracker
var _drawi_cavas_nube = 0;
var Direction;

(function (Direction) {
  Direction[Direction["Up"] = 1] = "Up";
  Direction[Direction["Down"] = 2] = "Down";
  Direction[Direction["Left"] = 3] = "Left";
  Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));

var DrawingCanvas =
/** @class */
function () {
  function DrawingCanvas() {
    // Variable initialization
    this.canvas = document.createElement('canvas');
    this._canvasNumber = _drawi_cavas_nube;
    this.canvas.setAttribute('id', 'drawing-canvas-' + _drawi_cavas_nube++);
    this.context = this.canvas.getContext('2d');
    this.boundingDiv = document.createElement('div');
    this.leftToolbar = document.createElement('div');
    this.topToolbar = document.createElement('div');
    this.bottomToolbar = document.createElement('div');
    this.rightToolbar = document.createElement('div');
    this.boundingDiv.appendChild(this.canvas);
    this.boundingDiv.appendChild(this.leftToolbar);
    this.boundingDiv.appendChild(this.topToolbar);
    this.boundingDiv.appendChild(this.bottomToolbar);
    this.boundingDiv.appendChild(this.rightToolbar);
    this.currentAction = 'draw';
    this.lines = new Array();
    this.drawings = new Array(); // Canvas initialization

    this.canvas.width = this.canvas.getBoundingClientRect().width;
    this.canvas.height = this.canvas.getBoundingClientRect().height;
    this.canvas.addEventListener("mousemove", this.findxy, false);
    this.canvas.addEventListener("mousedown", this.findxy, false);
    this.canvas.addEventListener("mouseup", this.findxy, false);
    this.canvas.addEventListener("mouseout", this.findxy, false);
  }

  DrawingCanvas.prototype.setCanvasWidth = function (w) {
    this.canvas.width = w;
  };

  DrawingCanvas.prototype.setCanvasHeight = function (h) {
    this.canvas.height = h;
  };

  DrawingCanvas.prototype.addButton = function (funct, side, img) {
    // Adds a button to one of the sides
    var newButton = document.createElement('button');
    newButton.id = 'drawing-canvas-' + name;

    if (img != null) {
      var buttonImg = document.createElement('img');
      buttonImg.src = img;
      newButton.appendChild(buttonImg);
    }

    if (funct != null) newButton.setAttribute('functionality', funct);

    switch (side) {
      case Direction.Up:
        this.topToolbar.appendChild(newButton);
        break;

      case Direction.Down:
        this.bottomToolbar.appendChild(newButton);
        break;

      case Direction.Left:
        this.leftToolbar.appendChild(newButton);
        break;

      case Direction.Right:
        this.rightToolbar.appendChild(newButton);
        break;
    } // this.boundingDiv.appendChild(newButton);

  };

  DrawingCanvas.prototype.addColorWheel = function (side) {
    var newColorWheel = document.createElement('input');
    newColorWheel.setAttribute('type', 'color');

    switch (side) {
      case Direction.Up:
        this.topToolbar.appendChild(newColorWheel);
        break;

      case Direction.Down:
        this.bottomToolbar.appendChild(newColorWheel);
        break;

      case Direction.Left:
        this.leftToolbar.appendChild(newColorWheel);
        break;

      case Direction.Right:
        this.rightToolbar.appendChild(newColorWheel);
        break;
    }
  }; // ====================== DRAWING TOOLS ======================


  DrawingCanvas.prototype.drawTool = function () {
    this.currentAction = 'draw';
  };

  DrawingCanvas.prototype.boxTool = function () {
    this.currentAction = 'box';
  };

  DrawingCanvas.prototype.circleTool = function () {
    this.currentAction = 'circle';
  };

  DrawingCanvas.prototype.eraserTool = function () {
    this.currentAction = 'eraser';
  };

  DrawingCanvas.prototype.clearCanvas = function () {
    this.lines = Array();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  DrawingCanvas.prototype.drawPoint = function (point) {
    this.currentLine.points.push({
      x: this.currentPoint.x,
      y: this.currentPoint.y
    }); // Draws point

    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.fillRect(point.x, point.y, this.lineWidth, this.lineWidth);
    this.context.closePath();
  };

  DrawingCanvas.prototype.drawLine = function (line) {
    this.context.beginPath();
    this.context.moveTo(line.points[0][0], line.points[0][1]);
    this.context.lineTo(line.points[1][0], line.points[1][1]);
    this.context.strokeStyle = "black";
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  };

  DrawingCanvas.prototype.drawLines = function () {
    var _this = this;

    var p_point = {
      x: -1,
      y: -1
    };
    this.lines.forEach(function (line) {
      line.points.forEach(function (point) {
        if (p_point.x == -1 || p_point.y == -1) {
          _this.drawPoint(point);

          p_point.x = point.x, p_point.y = point.y;
        } else {
          var tempLine = {
            points: Array(),
            originalLine: Array(),
            sortedLine: Array()
          };
          tempLine.points.push(p_point);
          tempLine.points.push(point);

          _this.drawLine(tempLine);

          p_point.x = point.x, p_point.y = point.y;
        }
      });
    });
  };

  DrawingCanvas.prototype.draw = function () {
    this.currentLine.points.push({
      x: this.currentPoint.x,
      y: this.currentPoint.y
    }); // Draws line

    this.context.beginPath();
    this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.context.lineTo(this.currentPoint.x, this.currentPoint.y);
    this.context.strokeStyle = "black";
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  };

  DrawingCanvas.prototype.attachToElement = function (elem) {
    elem.appendChild(this.boundingDiv);
  };

  DrawingCanvas.prototype.getBoundingDiv = function () {
    return this.boundingDiv;
  };

  DrawingCanvas.prototype.resetCanvasProperties = function () {
    this.canvas = document.getElementById('drawing-canvas-' + this._canvasNumber);
  };

  DrawingCanvas.prototype.findxy = function (e) {
    if (e.type === 'mousedown') {
      console.log(this.canvas);
      console.log(document.getElementById('drawing-canvas' + this._canvasNumber));
      this.currentPoint.x = Math.floor(e.clientX - document.getElementById('drawing-canvas' + this._canvasNumber).offsetLeft
      /* - dialogRect.x */
      );
      this.currentPoint.y = Math.floor(e.clientY - document.getElementById('drawing-canvas' + this._canvasNumber).offsetTop
      /* - dialogRect.y */
      );
      this.lastPoint.x = this.currentPoint.x;
      this.lastPoint.y = this.currentPoint.y;
      this.mouseDownFlag = true;
      if (this.currentAction == 'draw') this.drawPoint(this.currentPoint);else if (this.currentAction == 'line') {
        var line = {
          points: Array(),
          originalLine: Array(),
          sortedLine: Array()
        };
        line.points.push(this.lastPoint);
        line.points.push(this.currentPoint);
        this.drawLine(line);
      }
    }

    if (e.type === 'mouseup') {
      this.mouseDownFlag = false;

      if (this.currentAction == 'draw') {
        // Sorts coordinates by x then y
        var originalLine = this.currentLine.points.map(function (x) {
          return x;
        }); // line.sort((a, b) => {
        //   if(a[0] == b[0]) return a[1] - b[1];
        //   return a[0] - b[0];
        // });
        // this.lines.push({points: originalLine, line: originalLine, sortedLine: line});
        // line = [];
      }
    }

    if (e.type === 'mousemove') {
      if (this.mouseDownFlag) {
        this.lastPoint.x = this.currentPoint.x;
        this.lastPoint.y = this.currentPoint.y;
        this.currentPoint.x = Math.floor(e.clientX - this.canvas.offsetLeft
        /* - dialogRect.x */
        );
        this.lastPoint.y = Math.floor(e.clientY - this.canvas.offsetTop
        /* - dialogRect.y */
        );
        if (this.currentAction == 'draw') this.draw();else if (this.currentAction == 'erase')
          /* this.erase(); */
          console.log('todo');else if (this.currentAction == 'line')
          /* this.line(); */
          console.log('todo');
      }
    }
  };

  return DrawingCanvas;
}();
/*
// Binary search which returns range where values lie
function searchRange(arr, target, start_index=0, end_index=arr.length-1) {
  var upperLowerBounds = [];
  upperLowerBounds.push(leftmost(arr, start_index, end_index, target));
  upperLowerBounds.push(rightmost(arr, start_index, end_index, target));
  return upperLowerBounds;
}
// Binary search function for leftmost target
function leftmost(array, min, max, target) {
  if (min == max) return min;
  var mid = Math.floor((min + max) / 2);
  if (array[mid] < target) return leftmost(array, mid + 1, max, target);
  else return leftmost(array, min, mid, target);
}
// Binary search function for rightmost target
function rightmost(array, min, max, target)
{
  if (min == max) return min;
  var mid = Math.floor((min + max + 1) / 2);
  if (array[mid] > target) return rightmost(array, min, mid - 1, target);
  else return rightmost(array, mid, max, target);
}
// Figures out if a number is between to values
function between(x, min, max) {
  return x >= min && x <= max;
}

function erase() {
  var toRemove = [];
  // BINARY SEACH IMPLEMENTATION: NOT WORKING
  // lines.forEach(line => {
  //   if(line.line.length == 0) return;
  //   var xRange = searchRange(line.sortedLine.map(point => point[0]), Math.floor(x));
  //   // var yRange = searchRange(line.sortedLine.map(point => point[1]), Math.floor(y), xRange[0], xRange[1]);
  //   // var range = [Math.min(xRange[0], yRange[0]), Math.max(xRange[1], yRange[1])];
  //   var range = xRange;
  //   for(var i = range[0]; i <= range[1]; i++)
  //     if(between(Math.floor(x), line.sortedLine[i][0] - 10, line.sortedLine[i][0] + 10) && between(Math.floor(y), line.sortedLine[i][1] - 10, line.sortedLine[i][1] + 10)) toRemove.push(line);
  // });
  lines.forEach(line =>{
    if(line.line.length == 0) return;
    line.line.forEach(point => {
      if(between(point[0], Math.min(prevX, x), Math.max(prevX, x)) &&
      between(point[1], Math.min(prevY, y), Math.max(prevY, y))) {
        toRemove.push(line);
      }
    });
  });
  var beforeLength = lines.length;
  lines = lines.filter((el) => !toRemove.includes(el));
  if(beforeLength != lines.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
  }
}

function lineTool() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLines();
  drawLine(lineStartX, lineStartY, x, y);
}

function findxy(res, e) {
  if (res === 'down') {
    prevX = x;
    prevY = y;
    x = Math.floor(e.clientX - canvas.offsetLeft - dialogRect.x);
    y = Math.floor(e.clientY - canvas.offsetTop - dialogRect.y);
    flag = true;
    if(currentAction == 'draw') drawPoint();
    else if(currentAction == 'line') {
      lineStartX = x;
      lineStartY = y;
      lineTool();
    }
  }
  if (res === 'up') {
    flag = false;
    if (currentAction == 'draw') {
      // Sorts coordinates by x then y
      var originalLine = line.map(x => x);
      line.sort((a, b) => {
        if(a[0] == b[0]) return a[1] - b[1];
        return a[0] - b[0];
      });
      lines.push({line: originalLine, sortedLine: line});
      line = [];
    }
  }
  if (res === 'move') {
    if (flag) {
      prevX = x;
      prevY = y;
      x = Math.floor(e.clientX - canvas.offsetLeft - dialogRect.x);
      y = Math.floor(e.clientY - canvas.offsetTop - dialogRect.y);
      if(currentAction == 'draw') draw();
      else if(currentAction == 'erase') erase();
      else if(currentAction == 'line') lineTool();
    }
  }
}

canvas.addEventListener("mousemove", function (e) {
  findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function (e) {
  findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {
  findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function (e) {
  findxy('out', e)
}, false);

$(document).on('click', '.dialog-draw-pencil-tool', e => {
  currentAction = 'draw';
});
$(document).on('click', '.dialog-draw-eraser-tool', e => {
  currentAction = 'erase';
});
$(document).on('click', '.dialog-draw-line-tool', e => {
  currentAction = 'line';
});
$(document).on('click', '.dialog-draw-clear-tool', e => {
  clearCanvas();
});
});

$(document).on('click', '.dialog-draw-cancel', function(e) {
  $(".dialog-draw").hide(0);
});
});
*/
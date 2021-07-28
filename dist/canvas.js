/*
// Drawing canvas number tracker
var _drawi_cavas_nube = 0;

interface Point {
  x: number;
  y: number;
}

interface Drawing {
  points: Array<Point>;
  sortedPoints: Array<Point>;
}

enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

class DrawingCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  boundingDiv: HTMLDivElement;
  leftToolbar: HTMLDivElement;
  topToolbar: HTMLDivElement;
  bottomToolbar: HTMLDivElement;
  rightToolbar: HTMLDivElement;
  
  currentAction: String;
  drawings: Array<Drawing>;
  currentDrawing: Drawing;
  lineWidth: number;
  drawingToggle: boolean; // For circle, box and line
  strokeColor: string;
  private currentPoint: Point;
  private lastPoint: Point;
  private mouseDownFlag: Boolean;
  
  constructor() {
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
    this.drawings = new Array<Drawing>();
    this.currentPoint = {x: -1, y: -1};
    this.lastPoint = {x: -1, y: -1};
    this.drawingToggle = true;
    this.strokeColor = 'black';
    this.currentDrawing = {points: Array<Point>(), sortedPoints: Array<Point>()};
    
    // Canvas initialization
    this.canvas.width = this.canvas.getBoundingClientRect().width;
    this.canvas.height = this.canvas.getBoundingClientRect().height;
    
    this.canvas.addEventListener("mousemove", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mousedown", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mouseup", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mouseout", (e) => this.findxy(e), false);
  }
  
  setCanvasWidth(w: number): void {
    this.canvas.width = w;
  }
  
  setCanvasHeight(h: number): void {
    this.canvas.height = h;
  }
  
  addButton(funct: string, side: Direction, img: string) {
    // Adds a button to one of the sides
    let newButton = document.createElement('button');
    newButton.onclick = () => this.setCurrentAction(funct);
    newButton.id = 'drawing-canvas-button' + this._canvasNumber + funct;
    if(img != null) {
      let buttonImg = document.createElement('img');
      buttonImg.src = img;
      newButton.appendChild(buttonImg);
    }
    switch(side) {
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
    }
  }
  
  addClearButton(side: Direction, img: string) {
    let newButton = document.createElement('button');
    newButton.onclick = () => this.clearCanvas();
    newButton.id = 'drawing-canvas-button' + this._canvasNumber + 'clear';
    if(img != null) {
      let buttonImg = document.createElement('img');
      buttonImg.src = img;
      newButton.appendChild(buttonImg);
    }
    switch(side) {
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
    }
  }
  
  addColorWheel(side: Direction): void {
    let newColorWheel = document.createElement('input');
    newColorWheel.setAttribute('type', 'color');
    
    newColorWheel.id = 'drawing-canvas-button' + this._canvasNumber + 'color-wheel';
    switch(side) {
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
  }
  
  // ====================== DRAWING TOOLS ======================
  setCurrentAction(action: string): void {
    var possibleActions = ['circle', 'draw', 'line', 'box', 'erase'];
    if(!possibleActions.includes(action)) return;
    this.currentAction = action;
  }
  
  clearCanvas(): void {
    this.drawings = Array<Drawing>();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawingToggle = false;
  }
  
  drawPoint(point: Point): void {
    this.currentDrawing.points.push(this.currentPoint);
    
    // Draws point
    this.context.beginPath();
    this.context.fillStyle = (document.getElementById('drawing-canvas-button' + this._canvasNumber + 'color-wheel') as HTMLInputElement).value;
    this.context.fillRect(point.x, point.y, this.lineWidth, this.lineWidth);
    this.context.closePath();
  }
  
  drawLine(pp: Point, cp: Point): void {
    this.context.beginPath();
    this.context.moveTo(pp.x, pp.y);
    this.context.lineTo(cp.x, cp.y);
    this.context.strokeStyle = (document.getElementById('drawing-canvas-button' + this._canvasNumber + 'color-wheel') as HTMLInputElement).value;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  drawDrawing(drawing: Drawing): void {
    var p_point = {x: -1, y: -1};
    drawing.points.forEach(point => {
      if(p_point.x == -1 || p_point.y == -1) {
        this.drawPoint(point);
        p_point.x = point.x, p_point.y = point.y;
      } else {
        this.drawLine(p_point, point);
        p_point.x = point.x, p_point.y = point.y;
      }
    });
  }
  
  drawDrawings(): void {
    this.drawings.forEach((drawing) => this.drawDrawing(drawing));
  }
  
  draw() {
    this.currentDrawing.points.push(this.currentPoint);
    
    // Draws line
    this.context.beginPath();
    this.context.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.context.lineTo(this.currentPoint.x, this.currentPoint.y);
    this.context.strokeStyle = (document.getElementById('drawing-canvas-button' + this._canvasNumber + 'color-wheel') as HTMLInputElement).value;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  redrawCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawDrawings();
  }
  
  __searchRange(arr, target, start_index=0, end_index=arr.length-1) {
    var upperLowerBounds = [];
    upperLowerBounds.push(this.__leftmost(arr, start_index, end_index, target));
    upperLowerBounds.push(this.__rightmost(arr, start_index, end_index, target));
    return upperLowerBounds;
  }
  // Binary search function for leftmost target
  __leftmost(array, min, max, target) {
    if (min == max) return min;
    var mid = Math.floor((min + max) / 2);
    if (array[mid] < target) return this.__leftmost(array, mid + 1, max, target);
    else return this.__leftmost(array, min, mid, target);
  }
  // Binary search function for rightmost target
  __rightmost(array, min, max, target)
  {
    if (min == max) return min;
    var mid = Math.floor((min + max + 1) / 2);
    if (array[mid] > target) return this.__rightmost(array, min, mid - 1, target);
    else return this.__rightmost(array, mid, max, target);
  }
  // Figures out if a number is between to values
  __between(x, min, max) {
    return x >= min && x <= max;
  }
  
  erase() {
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
    this.drawings.forEach(drawing =>{
      if(drawing.points.length == 0) return;
      drawing.points.forEach(point => {
        if(this.__between(point[0], Math.min(this.lastPoint.x, this.currentPoint.x), Math.max(this.lastPoint.x, this.currentPoint.x)) &&
        this.__between(point[1], Math.min(this.lastPoint.y, this.currentPoint.y), Math.max(this.lastPoint.x, this.currentPoint.x))) {
          toRemove.push(drawing);
        }
      });
    });
    var beforeLength = this.drawings.length;
    this.drawings = this.drawings.filter((el) => !toRemove.includes(el));
    if(beforeLength != this.drawings.length) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawDrawings();
    }
  }
  
  __distance(p1: Point, p2: Point) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  }
  
  circle() {
    this.context.beginPath();
    console.log(this.__distance(this.lastPoint, this.currentPoint));
    this.context.arc(this.lastPoint.x, this.lastPoint.y, this.__distance(this.lastPoint, this.currentPoint), 0, 2 * Math.PI);
    this.context.strokeStyle = (document.getElementById('drawing-canvas-button' + this._canvasNumber + 'color-wheel') as HTMLInputElement).value;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  box() {
    this.context.beginPath();
    this.context.rect(this.lastPoint.x, this.lastPoint.y, this.currentPoint.x - this.lastPoint.x, this.currentPoint.y - this.lastPoint.y);
    this.context.strokeStyle = (document.getElementById('drawing-canvas-button' + this._canvasNumber + 'color-wheel') as HTMLInputElement).value;
    this.context.lineWidth = this.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  attachToElement(elem: HTMLElement): void {
    elem.appendChild(this.boundingDiv);
  }
  
  getBoundingDiv() {
    return this.boundingDiv;
  }
  
  findxy(e): void {
    if (e.type === 'mousedown') {
      this.mouseDownFlag = true;
      if(this.currentAction == 'draw') {
        this.currentPoint.x = Math.floor(e.clientX);
        this.currentPoint.y = Math.floor(e.clientY);
        this.lastPoint.x = this.currentPoint.x;
        this.lastPoint.y = this.currentPoint.y;
        this.drawPoint(this.currentPoint);
      }
      else if(this.currentAction == 'line') {
        this.currentPoint.x = Math.floor(e.clientX);
        this.currentPoint.y = Math.floor(e.clientY);
        this.lastPoint.x = this.currentPoint.x;
        this.lastPoint.y = this.currentPoint.y;
        this.drawLine(this.lastPoint, this.currentPoint);
      } else if (this.currentAction == 'circle') {
        this.currentPoint.x = Math.floor(e.clientX);
        this.currentPoint.y = Math.floor(e.clientY);
        this.lastPoint.x = this.currentPoint.x;
        this.lastPoint.y = this.currentPoint.y;
        this.circle();
      }
    }
    
    if (e.type === 'mouseup') {
      this.mouseDownFlag = false;
      
      // Sorts coordinates by x then y
      var sortedDrawing = JSON.parse(JSON.stringify(this.currentDrawing));
      sortedDrawing.points.sort((a, b) => {
        if(a.x == b.x) return a.y - b.y;
        return a.x - b.x;
      });

      var newDrawing = {points: this.currentDrawing.points, sortedPoints: sortedDrawing.points};
      this.drawings.push(newDrawing);
      this.currentDrawing = {points: Array<Point>(), sortedPoints: Array<Point>()};
    }
    
    if (e.type === 'mousemove') {
      if (this.mouseDownFlag) {
        if(this.currentAction == 'draw') {
          this.lastPoint.x = this.currentPoint.x;
          this.lastPoint.y = this.currentPoint.y;
          this.currentPoint.x = Math.floor(e.clientX);
          this.currentPoint.y = Math.floor(e.clientY);
          this.draw();
        } else if(this.currentAction == 'erase') {
          this.erase();
        } else if(this.currentAction == 'line') {
          this.redrawCanvas();
          this.currentPoint.x = Math.floor(e.clientX);
          this.currentPoint.y = Math.floor(e.clientY);
          var line = {points: Array<Point>(), sortedLine: Array<Point>()};
          line.points.push(this.lastPoint);
          line.points.push(this.currentPoint);
          this.drawLine(this.lastPoint, this.currentPoint);
        } else if(this.currentAction == 'circle') {
          this.redrawCanvas();
          this.currentPoint.x = Math.floor(e.clientX);
          this.currentPoint.y = Math.floor(e.clientY);
          this.circle();
        } else if(this.currentAction == 'box') {
          this.box();
        } else if(this.currentAction == 'line' && !this.drawingToggle) {
          this.currentPoint.x = Math.floor(e.clientX);
          this.currentPoint.y = Math.floor(e.clientY);
          var line = {points: Array<Point>(), sortedLine: Array<Point>()};
          line.points.push(this.lastPoint);
          line.points.push(this.currentPoint);
          this.drawLine(this.lastPoint, this.currentPoint);
        }
      }
    }
  }
}
*/ 

// Start implementation with tool width
interface Point {
  x: number;
  y: number;
  color: string;
  lineWidth: number;
}

interface HandDrawnLine {
  type: 'hand_drawn_line';
  points: Array<Point>;
  color: string;
  lineWidth: number;
}

interface Line {
  type: 'line';
  start: Point;
  end: Point;
  color: string;
  lineWidth: number;
}

interface Circle {
  type: 'circle';
  center: Point;
  radius: number;
  color: string;
  lineWidth: number;
}

interface Box {
  type: 'box';
  start: Point;
  width: number;
  height: number;
  color: string;
  lineWidth: number;
}

type Drawing = Box | Circle | Line | HandDrawnLine;

class DrawingCanvas {
  // DOM variables
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private layoutTable: HTMLTableElement;
  private leftToolbar: HTMLDivElement;
  private topToolbar: HTMLDivElement;
  private bottomToolbar: HTMLDivElement;
  private rightToolbar: HTMLDivElement;
  
  // State variables
  private currentAction: string;
  private lineWidth: number;
  
  // Drawing variables
  private currentPoint: Point;
  private lastPoint: Point;
  private drawings: Array<Drawing>;
  private currentDrawing: Drawing;
  private static _canvasNumber: number = 0;
  private _canvasID: number;
  private mouseDownFlag: Boolean;
  
  constructor() {
    // Bounding div initialization; for widget bars and canvas
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'drawing-canvas-' + DrawingCanvas._canvasNumber);
    this._canvasID = DrawingCanvas._canvasNumber;
    DrawingCanvas._canvasNumber += 1;
    this.context = this.canvas.getContext('2d');
    this.layoutTable = document.createElement('table');
    this.layoutTable.createTHead();
    let tableHeader = document.createElement('td');
    tableHeader.setAttribute('colspan', '3');
    this.layoutTable.tHead.appendChild(tableHeader);
    this.layoutTable.insertRow();
    this.layoutTable.rows[0].appendChild(document.createElement('td'));
    this.layoutTable.rows[0].appendChild(document.createElement('td'));
    this.layoutTable.rows[0].appendChild(document.createElement('td'));
    this.layoutTable.createTFoot();
    let tableFooter = document.createElement('td');
    tableFooter.setAttribute('colspan', '3');
    this.layoutTable.tFoot.appendChild(tableFooter);
    this.layoutTable.rows[0].cells[1].appendChild(this.canvas);
    
    this.currentAction = 'draw';
    this.drawings = new Array<Drawing>();
    this.currentPoint = {x: null, y: null, color: null, lineWidth: this.lineWidth};
    this.lastPoint = {x: null, y: null, color: null, lineWidth: this.lineWidth};
    this.currentDrawing = {points: Array<Point>(), type: null, color: null, lineWidth: this.lineWidth};
    
    this.canvas.addEventListener("mousemove", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mousedown", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mouseup", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mouseout", (e) => this.findxy(e), false);
  }
  
  // Access Functions ===========================================================================
  appendDrawingCanvasToElement(elem: HTMLElement): void {
    elem.appendChild(this.layoutTable);
  }
  
  // Canvas Modifying Functions =================================================================
  setCanvasWidth(w: number): void {
    this.canvas.width = w;
  }
  
  setCanvasHeight(h: number): void {
    this.canvas.height = h;
  }
  
  // Toolbar Modifying Functions ================================================================
  addToolbar(side: string): void {
    let validSides = ['top', 'bottom', 'left', 'right'];
    if(!validSides.includes(side)) {
      throw 'addToolbar not given valid side' + validSides;
    }
    
    let newToolbar = document.createElement('div');
    // TODO: flex container for left and right columns
    newToolbar.setAttribute('id', 'drawing-canvas-' + this._canvasID + '-' + side + '-toolbar');
    
    switch(side) {
      case 'top':
      this.topToolbar = newToolbar;
      this.layoutTable.tHead.getElementsByTagName('td')[0].appendChild(newToolbar);
      break;
      case 'bottom':
      this.bottomToolbar = newToolbar;
      this.layoutTable.tFoot.getElementsByTagName('td')[0].appendChild(newToolbar);
      break;
      case 'left':
      this.leftToolbar = newToolbar;
      this.layoutTable.rows[0].getElementsByTagName('td')[0].appendChild(newToolbar);
      break;
      case 'right':
      this.bottomToolbar = newToolbar;
      this.layoutTable.rows[0].getElementsByTagName('td')[2].appendChild(newToolbar);
      break;
    }
  }
  
  addButton(funct: string, side: string, img: string): void {
    // Adds a button to one of the sides
    
    // Checks for parameter input errors
    let validSides = ['top', 'bottom', 'left', 'right'];
    if(!validSides.includes(side)) {
      throw 'addButton not given valid side; sides are' + validSides;
    }
    let validActions = ['draw', 'circle', 'line', 'box', 'clear', 'erase'];
    if(!validActions.includes(funct)) {
      throw 'allowable action not set for button; actions are ' + validActions;
    }
    
    let newButton = document.createElement('button');
    if(funct === 'clear') newButton.onclick = () => this.resetCanvas();
    else newButton.onclick = () => this.setCurrentAction(funct);
    newButton.id = 'drawing-canvas-button' + this._canvasID + '-' + funct;
    
    if(img != null) {
      // let buttonImg = document.createElement('i');
      // img.split(' ').forEach((cls) => buttonImg.classList.add(cls));
      
      let buttonImg = document.createElement('img');
      buttonImg.src = img;
      newButton.appendChild(buttonImg);
    }
    
    switch(side) {
      case 'top':
      this.topToolbar.appendChild(newButton);
      break;
      case 'bottom':
      this.bottomToolbar.appendChild(newButton);
      break;
      case 'left':
      this.leftToolbar.appendChild(newButton);
      break;
      case 'right':
      this.rightToolbar.appendChild(newButton);
      break;
    }
  }

  addElementToToolbar(elem: HTMLElement, side: string) {
    let validSides = ['top', 'bottom', 'left', 'right'];
    if(!validSides.includes(side)) {
      throw 'addButton not given valid side; sides are' + validSides;
    }

    switch(side) {
      case 'top':
      this.topToolbar.appendChild(elem);
      break;
      case 'bottom':
      this.bottomToolbar.appendChild(elem);
      break;
      case 'left':
      this.leftToolbar.appendChild(elem);
      break;
      case 'right':
      this.rightToolbar.appendChild(elem);
      break;
    }
  }
  
  addColorWheel(side: string): void {
    let newColorWheel = document.createElement('input');
    newColorWheel.setAttribute('type', 'color');
    newColorWheel.id = 'drawing-canvas-button-' + this._canvasID + '-color-wheel';
    
    switch(side) {
      case 'top':
      this.topToolbar.appendChild(newColorWheel);
      break;
      case 'bottom':
      this.bottomToolbar.appendChild(newColorWheel);
      break;
      case 'left':
      this.leftToolbar.appendChild(newColorWheel);
      break;
      case 'right':
      this.rightToolbar.appendChild(newColorWheel);
      break;
    }
  }

  addLineWidthSlider(side: string): void {
    let defaultLineWidth = 2;
    let sliderDiv = document.createElement('div');
    let newSlider = document.createElement('input');
    let sliderValue = document.createElement('p');
    newSlider.setAttribute('type', 'range');
    newSlider.id = 'drawing-canvas-button-' + this._canvasID + '-slider';
    newSlider.setAttribute('min', '1');
    newSlider.setAttribute('max', '10');
    newSlider.setAttribute('value', '' + defaultLineWidth);
    this.lineWidth = defaultLineWidth;
    sliderValue.innerHTML = newSlider.value;
    newSlider.oninput = () => { 
      sliderValue.innerHTML = newSlider.value; 
      this.lineWidth = +newSlider.value;
    };

    sliderDiv.appendChild(newSlider);
    sliderDiv.appendChild(sliderValue);
    
    switch(side) {
      case 'top':
      this.topToolbar.appendChild(sliderDiv);
      break;
      case 'bottom':
      this.bottomToolbar.appendChild(sliderDiv);
      break;
      case 'left':
      this.leftToolbar.appendChild(sliderDiv);
      break;
      case 'right':
      this.rightToolbar.appendChild(sliderDiv);
      break;
    }

  }
  
  // State Changing Functions ===================================================================
  setCurrentAction(funct: string) {
    this.currentAction = funct;
  }
  
  // Event Listener Helper Function ============================================================
  findxy(e: MouseEvent): void {
    if(e.type === 'mouseout') {
      if(this.currentAction !== 'erase' && this.mouseDownFlag) {
        console.log('saving drawing: ', this.currentDrawing);
        this.drawings.push(this.currentDrawing);
        this.currentDrawing = undefined;
      }
      this.mouseDownFlag = false;
    }
    
    if (e.type === 'mousedown') {
      this.currentPoint.x = Math.floor(e.clientX - this.__getTableDialogRect().x);
      this.currentPoint.y = Math.floor(e.clientY - this.__getTableDialogRect().y);
      let color: string = (document.getElementById('drawing-canvas-button-' + this._canvasID + '-color-wheel') as HTMLInputElement).value;
      this.currentPoint.color = color;
      this.lastPoint = {x: this.currentPoint.x, y: this.currentPoint.y, color: (document.getElementById('drawing-canvas-button-' + this._canvasID + '-color-wheel') as HTMLInputElement).value, lineWidth: this.lineWidth};
      this.mouseDownFlag = true;
      
      if(this.currentAction == 'draw') {
        this.currentDrawing = {type: 'hand_drawn_line', points: Array<Point>(), color: color, lineWidth: this.lineWidth.valueOf()} as HandDrawnLine;
        (this.currentDrawing as HandDrawnLine).points.push(JSON.parse(JSON.stringify(this.currentPoint)));
        this.drawCircle({type: 'circle', center: this.currentPoint, radius: (this.lineWidth / 10), color: color, lineWidth: this.lineWidth.valueOf()});
      } else if(this.currentAction == 'line') {
        this.currentDrawing = {type: 'line', start: JSON.parse(JSON.stringify(this.currentPoint)), end: undefined, color: color, lineWidth: this.lineWidth.valueOf()} as Line;
      } else if (this.currentAction == 'circle') {
        this.currentDrawing = {type: 'circle', center: JSON.parse(JSON.stringify(this.currentPoint)), radius: undefined, color: color, lineWidth: this.lineWidth.valueOf()} as Circle;
      } else if (this.currentAction == 'box') {
        this.currentDrawing = {type: 'box', start: JSON.parse(JSON.stringify(this.currentPoint)), width: undefined, height: undefined, color: color, lineWidth: this.lineWidth.valueOf()} as Box;
      } else if (this.currentAction == 'erase') {
        this.erase();
      }
    }
    
    if (e.type === 'mouseup') {
      this.mouseDownFlag = false;
      if(this.currentAction !== 'erase') {
        console.log('saving drawing: ', this.currentDrawing);
        this.drawings.push(this.currentDrawing);
        this.currentDrawing = undefined;
      }
    }
    
    if (e.type === 'mousemove') {
      this.lastPoint = JSON.parse(JSON.stringify(this.currentPoint));
      this.currentPoint.x = Math.floor(e.clientX - this.__getTableDialogRect().x);
      this.currentPoint.y = Math.floor(e.clientY - this.__getTableDialogRect().y);
      if (this.mouseDownFlag) {
        if(this.currentAction == 'draw') { 
          (this.currentDrawing as HandDrawnLine).points.push(JSON.parse(JSON.stringify(this.currentPoint)));
          this.drawLine({type: 'line', start: this.lastPoint, end: this.currentPoint, color: this.currentDrawing.color, lineWidth: this.lineWidth}); 
        } else if(this.currentAction == 'erase') { 
          this.erase();
        } else if(this.currentAction == 'line') {
          this.redrawCanvas();
          (this.currentDrawing as Line).end = JSON.parse(JSON.stringify(this.currentPoint));
          this.drawLine(this.currentDrawing as Line);
        } else if(this.currentAction == 'circle') {
          this.redrawCanvas();
          (this.currentDrawing as Circle).radius = this.__distance(this.currentPoint, (this.currentDrawing as Circle).center)
          this.drawCircle(this.currentDrawing as Circle);
        } else if(this.currentAction == 'box') {
          this.redrawCanvas();
          (this.currentDrawing as Box).width = (this.currentPoint.x - (this.currentDrawing as Box).start.x);
          (this.currentDrawing as Box).height = (this.currentPoint.y - (this.currentDrawing as Box).start.y);
          this.drawBox(this.currentDrawing as Box);
        }
      }
    }
  }
  
  // Drawing Helper Functions ===================================================================
  //------------------
  // Drawing functions
  //------------------
  drawPoint(point: Point): void {
    this.context.beginPath();
    this.context.fillStyle = point.color;
    this.context.fillRect(point.x, point.y, this.lineWidth, point.lineWidth);
    this.context.closePath();
  }
  
  drawLine(line: Line): void {
    // Used when drawing line and hand drawn line
    this.context.lineCap = 'round';
    this.context.beginPath();
    this.context.moveTo(line.start.x, line.start.y);
    this.context.lineTo(line.end.x, line.end.y);
    this.context.strokeStyle = line.color;
    this.context.lineWidth = line.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  drawBox(box: Box) {
    this.context.beginPath();
    this.context.rect(box.start.x, box.start.y, box.width, box.height);
    this.context.strokeStyle = box.color;
    this.context.lineWidth = box.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  drawCircle(circle: Circle): void {
    this.context.beginPath();
    this.context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
    this.context.strokeStyle = circle.color;
    this.context.lineWidth = circle.lineWidth;
    this.context.stroke();
    this.context.closePath();
  }
  
  drawDrawings(): void {
    this.drawings.forEach((drawing) => {
      this.drawDrawing(drawing);
    });
  }
  
  drawDrawing(drawing: Drawing): void {
    switch(drawing.type) {
      case 'hand_drawn_line':
      this.drawHandDrawnLine(drawing);
      break;
      case 'line':
      this.drawLine(drawing);
      break;
      case 'circle':
      this.drawCircle(drawing);
      break; 
      case 'box':
      this.drawBox(drawing);
      break;
    }
  }
  
  drawHandDrawnLine(drawing: HandDrawnLine): void {
    var p_point = {x: -1, y: -1, color: drawing.color, lineWidth: drawing.lineWidth};
    drawing.points.forEach(point => {
      if(p_point.x == -1 || p_point.y == -1) {
        this.drawCircle({type: 'circle', center: point, radius: (this.lineWidth / 10), color: drawing.color, lineWidth: drawing.lineWidth});
      } else {
        this.drawLine({type: 'line', start: p_point, end: point, color: drawing.color, lineWidth: drawing.lineWidth});
      }
      p_point = {x: point.x, y: point.y, color: drawing.color, lineWidth: drawing.lineWidth};
    });
  }
  
  //-------------------------------
  // Clearing / redrawing functions
  //-------------------------------
  resetCanvas(): void {
    this.deleteDrawings();
    this.clearCanvas();
  }
  
  clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  deleteDrawings(): void {
    this.drawings = Array<Drawing>();
  }
  
  redrawCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawDrawings();
  }
  
  erase(): void {
    var toErase: Array<Drawing> = [];
    this.drawings.forEach((drawing) => {
      if(drawing.type == 'hand_drawn_line') {
        for(var i = 0; i < drawing.points.length; i++) {
          if(i == 0) {
            continue;
          } else if (this.__distanceBetweenLineAndPoint(this.currentPoint, drawing.points[i - 1], drawing.points[i]) <= drawing.lineWidth) {
            console.log('erase');
            toErase.push(drawing);
          }
        }
      } else if(drawing.type == 'box') {
        var A: Point = drawing.start;
        var B: Point = {x: drawing.start.x + drawing.width, y: drawing.start.y, color: drawing.color, lineWidth: this.lineWidth};
        var C: Point = {x: drawing.start.x + drawing.width, y: drawing.start.y + drawing.height, color: drawing.color, lineWidth: this.lineWidth};
        var D: Point = {x: drawing.start.x, y: drawing.start.y + drawing.height, color: drawing.color, lineWidth: this.lineWidth};
        if(this.__distanceBetweenLineAndPoint(this.currentPoint, A, B) <= drawing.lineWidth ||
           this.__distanceBetweenLineAndPoint(this.currentPoint, B, C) <= drawing.lineWidth ||
           this.__distanceBetweenLineAndPoint(this.currentPoint, C, D) <= drawing.lineWidth ||
           this.__distanceBetweenLineAndPoint(this.currentPoint, D, A) <= drawing.lineWidth ) {
             console.log('erase');
             toErase.push(drawing);
           }
      } else if (drawing.type == 'circle') {
        if(Math.abs(Math.sqrt(this.__sqr(this.currentPoint.x - drawing.center.x) + this.__sqr(this.currentPoint.y - drawing.center.y)) - drawing.radius) <= drawing.lineWidth) {
          console.log('erase');
          toErase.push(drawing);
        }
      } else if (drawing.type == 'line') {
        if(this.__distanceBetweenLineAndPoint(this.currentPoint, drawing.start, drawing.end) <= drawing.lineWidth) {
          console.log('erase');
          toErase.push(drawing);
        }
      }
    });
    this.drawings = this.drawings.filter((element) => { return !toErase.includes(element); });
    this.redrawCanvas();
  }
  
  // General Helper Functions ===================================================================
  __distance(p1: Point, p2: Point): number {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  }
  
  __distanceBetweenLineAndPoint(p: Point, p1: Point, p2: Point): number {
    var A = p.x - p1.x;
    var B = p.y - p1.y;
    var C = p2.x - p1.x;
    var D = p2.y - p1.y;
    
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
    param = dot / len_sq;
    
    var xx, yy;
    
    if (param < 0) {
      xx = p1.x;
      yy = p1.y;
    }
    else if (param > 1) {
      xx = p2.x;
      yy = p2.y;
    }
    else {
      xx = p1.x + param * C;
      yy = p1.y + param * D;
    }
    
    var dx = p.x - xx;
    var dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  __sqr(n: number): number {
    return n * n;
  }
  
  __getTableDialogRect(): DOMRect {
    return this.canvas.getClientRects()[0];
  }
}
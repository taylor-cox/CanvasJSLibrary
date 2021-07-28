interface Point {
  x: number;
  y: number;
}

interface Drawing {
  points: Array<Point>;
}

class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private layoutTable: HTMLTableElement;
  private leftToolbar: HTMLDivElement;
  private topToolbar: HTMLDivElement;
  private bottomToolbar: HTMLDivElement;
  private rightToolbar: HTMLDivElement;
  
  private currentAction: String;
  private lineWidth: number;
  
  private currentPoint: Point;
  private lastPoint: Point;
  private drawings: Array<Drawing>;
  private currentDrawing: Drawing;
  private static _canvasNumber: number;
  private _canvasID: number;
  
  constructor() {
    // Bounding div initialization; for widget bars and canvas
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'drawing-canvas-' + DrawingCanvas._canvasNumber);
    this._canvasID = DrawingCanvas._canvasNumber;
    DrawingCanvas._canvasNumber = DrawingCanvas._canvasNumber++;
    this.context = this.canvas.getContext('2d');
    this.layoutTable = document.createElement('table');
    this.layoutTable.createTHead();
    this.layoutTable.insertRow();
    this.layoutTable.createTFoot();
    this.layoutTable.rows[0].appendChild(document.createElement('td'));
    this.layoutTable.rows[0].appendChild(document.createElement('td'));
    this.layoutTable.rows[0].appendChild(document.createElement('td'));
    
    this.currentAction = 'draw';
    this.drawings = new Array<Drawing>();
    this.currentPoint = undefined;
    this.lastPoint = undefined;
    this.currentDrawing = {points: Array<Point>()};

    this.canvas.addEventListener("mousemove", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mousedown", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mouseup", (e) => this.findxy(e), false);
    this.canvas.addEventListener("mouseout", (e) => this.findxy(e), false);
  }

  // Canvas Modifying Functions
  setCanvasWidth(w: number): void {
    this.canvas.width = w;
  }

  setCanvasHeight(h: number): void {
    this.canvas.height = h;
  }

  // Toolbar Modifying Functions
  addToolbar(side: string): void {
    let validSides = ['top', 'bottom', 'left', 'right'];
    if(!validSides.includes(side)) {
      throw 'addToolbar not given valid side: top, bottom, left, right';
    }

    let newToolbar = document.createElement('div');
    newToolbar.setAttribute('style', '');
    switch(side) {
      case 'top':
        break;
      case 'bottom':
        break;
      case 'left':
        break;
      case 'right':
        break;
    }
    this.boundingDiv.appendChild(newToolbar);
  }

  addButton(funct: string, side: string, img: string): void {
    // Adds a button to one of the sides
    let validSides = ['top', 'bottom', 'left', 'right'];
    if(!validSides.includes(side)) {
      throw 'addButton not given valid side: top, bottom, left, right';
    }
    let newButton = document.createElement('button');
    newButton.onclick = () => this.setCurrentAction(funct);
    newButton.id = 'drawing-canvas-button' + this._canvasID + funct;
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

  // Event Listener Helper Functions
  private findxy(e): void {
    return;
  }

  // Drawing Helper Functions

}
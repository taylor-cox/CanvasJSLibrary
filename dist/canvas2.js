var DrawingCanvas = /** @class */ (function () {
    function DrawingCanvas() {
        var _this = this;
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
        this.drawings = new Array();
        this.currentPoint = undefined;
        this.lastPoint = undefined;
        this.currentDrawing = { points: Array() };
        this.canvas.addEventListener("mousemove", function (e) { return _this.findxy(e); }, false);
        this.canvas.addEventListener("mousedown", function (e) { return _this.findxy(e); }, false);
        this.canvas.addEventListener("mouseup", function (e) { return _this.findxy(e); }, false);
        this.canvas.addEventListener("mouseout", function (e) { return _this.findxy(e); }, false);
    }
    // Canvas Modifying Functions
    DrawingCanvas.prototype.setCanvasWidth = function (w) {
        this.canvas.width = w;
    };
    DrawingCanvas.prototype.setCanvasHeight = function (h) {
        this.canvas.height = h;
    };
    // Toolbar Modifying Functions
    DrawingCanvas.prototype.addToolbar = function (side) {
        var validSides = ['top', 'bottom', 'left', 'right'];
        if (!validSides.includes(side)) {
            throw 'addToolbar not given valid side: top, bottom, left, right';
        }
        var newToolbar = document.createElement('div');
        newToolbar.setAttribute('style', '');
        switch (side) {
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
    };
    DrawingCanvas.prototype.addButton = function (funct, side, img) {
        var _this = this;
        // Adds a button to one of the sides
        var validSides = ['top', 'bottom', 'left', 'right'];
        if (!validSides.includes(side)) {
            throw 'addButton not given valid side: top, bottom, left, right';
        }
        var newButton = document.createElement('button');
        newButton.onclick = function () { return _this.setCurrentAction(funct); };
        newButton.id = 'drawing-canvas-button' + this._canvasID + funct;
        if (img != null) {
            var buttonImg = document.createElement('img');
            buttonImg.src = img;
            newButton.appendChild(buttonImg);
        }
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
        }
    };
    // Event Listener Helper Functions
    DrawingCanvas.prototype.findxy = function (e) {
        return;
    };
    return DrawingCanvas;
}());

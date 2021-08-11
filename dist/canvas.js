var DrawingCanvas = /** @class */ (function () {
    function DrawingCanvas() {
        var _this = this;
        // Bounding div initialization; for widget bars and canvas
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'drawing-canvas-' + DrawingCanvas._canvasNumber);
        this._canvasID = DrawingCanvas._canvasNumber;
        DrawingCanvas._canvasNumber += 1;
        this.context = this.canvas.getContext('2d');
        this.layoutTable = document.createElement('table');
        this.layoutTable.createTHead();
        var tableHeader = document.createElement('td');
        tableHeader.setAttribute('colspan', '3');
        this.layoutTable.tHead.appendChild(tableHeader);
        this.layoutTable.insertRow();
        this.layoutTable.rows[0].appendChild(document.createElement('td'));
        this.layoutTable.rows[0].appendChild(document.createElement('td'));
        this.layoutTable.rows[0].appendChild(document.createElement('td'));
        this.layoutTable.createTFoot();
        var tableFooter = document.createElement('td');
        tableFooter.setAttribute('colspan', '3');
        this.layoutTable.tFoot.appendChild(tableFooter);
        this.layoutTable.rows[0].cells[1].appendChild(this.canvas);
        this.currentAction = 'draw';
        this.drawings = new Array();
        this.currentPoint = { x: null, y: null, color: null };
        this.lastPoint = { x: null, y: null, color: null };
        this.currentDrawing = { points: Array(), type: null, color: null };
        this.canvas.addEventListener("mousemove", function (e) { return _this.findxy(e); }, false);
        this.canvas.addEventListener("mousedown", function (e) { return _this.findxy(e); }, false);
        this.canvas.addEventListener("mouseup", function (e) { return _this.findxy(e); }, false);
        this.canvas.addEventListener("mouseout", function (e) { return _this.findxy(e); }, false);
    }
    // Access Functions ===========================================================================
    DrawingCanvas.prototype.appendDrawingCanvasToElement = function (elem) {
        elem.appendChild(this.layoutTable);
    };
    // Canvas Modifying Functions =================================================================
    DrawingCanvas.prototype.setCanvasWidth = function (w) {
        this.canvas.width = w;
    };
    DrawingCanvas.prototype.setCanvasHeight = function (h) {
        this.canvas.height = h;
    };
    // Toolbar Modifying Functions ================================================================
    DrawingCanvas.prototype.addToolbar = function (side) {
        var validSides = ['top', 'bottom', 'left', 'right'];
        if (!validSides.includes(side)) {
            throw 'addToolbar not given valid side' + validSides;
        }
        var newToolbar = document.createElement('div');
        // TODO: flex container for left and right columns
        newToolbar.setAttribute('id', 'drawing-canvas-' + this._canvasID + '-' + side + '-toolbar');
        switch (side) {
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
    };
    DrawingCanvas.prototype.addButton = function (funct, side, img) {
        // Adds a button to one of the sides
        var _this = this;
        // Checks for parameter input errors
        var validSides = ['top', 'bottom', 'left', 'right'];
        if (!validSides.includes(side)) {
            throw 'addButton not given valid side; sides are' + validSides;
        }
        var validActions = ['draw', 'circle', 'line', 'box', 'clear', 'erase'];
        if (!validActions.includes(funct)) {
            throw 'allowable action not set for button; actions are ' + validActions;
        }
        var newButton = document.createElement('button');
        if (funct === 'clear')
            newButton.onclick = function () { return _this.resetCanvas(); };
        else
            newButton.onclick = function () { return _this.setCurrentAction(funct); };
        newButton.id = 'drawing-canvas-button' + this._canvasID + '-' + funct;
        if (img != null) {
            var buttonImg = document.createElement('img');
            buttonImg.src = img;
            newButton.appendChild(buttonImg);
        }
        switch (side) {
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
    };
    DrawingCanvas.prototype.addElementToToolbar = function (elem, side) {
        var validSides = ['top', 'bottom', 'left', 'right'];
        if (!validSides.includes(side)) {
            throw 'addButton not given valid side; sides are' + validSides;
        }
        switch (side) {
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
    };
    DrawingCanvas.prototype.addColorWheel = function (side) {
        var newColorWheel = document.createElement('input');
        newColorWheel.setAttribute('type', 'color');
        newColorWheel.id = 'drawing-canvas-button-' + this._canvasID + '-color-wheel';
        switch (side) {
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
    };
    DrawingCanvas.prototype.addSlider = function (side) {
        var _this = this;
        var sliderDiv = document.createElement('div');
        var newSlider = document.createElement('input');
        var sliderValue = document.createElement('p');
        newSlider.setAttribute('type', 'range');
        newSlider.id = 'drawing-canvas-button-' + this._canvasID + '-slider';
        newSlider.setAttribute('min', '1');
        newSlider.setAttribute('max', '10');
        newSlider.setAttribute('value', '2');
        sliderValue.innerHTML = newSlider.value;
        newSlider.oninput = function () {
            sliderValue.innerHTML = newSlider.value;
            _this.lineWidth = +newSlider.value;
        };
        sliderDiv.appendChild(newSlider);
        sliderDiv.appendChild(sliderValue);
        switch (side) {
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
    };
    // TODO: Allow users to create custom buttons; implicit functions, image, pass in button
    // State Changing Functions ===================================================================
    DrawingCanvas.prototype.setCurrentAction = function (funct) {
        this.currentAction = funct;
    };
    // Event Listener Helper Function ============================================================
    DrawingCanvas.prototype.findxy = function (e) {
        if (e.type === 'mouseout') {
            if (this.currentAction !== 'erase' && this.mouseDownFlag) {
                console.log('saving drawing: ', this.currentDrawing);
                this.drawings.push(this.currentDrawing);
                this.currentDrawing = undefined;
            }
            this.mouseDownFlag = false;
        }
        if (e.type === 'mousedown') {
            this.currentPoint.x = Math.floor(e.clientX - this.__getTableDialogRect().x);
            this.currentPoint.y = Math.floor(e.clientY - this.__getTableDialogRect().y);
            var color = document.getElementById('drawing-canvas-button-' + this._canvasID + '-color-wheel').value;
            this.currentPoint.color = color;
            this.lastPoint = { x: this.currentPoint.x, y: this.currentPoint.y, color: document.getElementById('drawing-canvas-button-' + this._canvasID + '-color-wheel').value };
            this.mouseDownFlag = true;
            if (this.currentAction == 'draw') {
                this.currentDrawing = { type: 'hand_drawn_line', points: Array(), color: color };
                this.currentDrawing.points.push(JSON.parse(JSON.stringify(this.currentPoint)));
                this.drawPoint(this.currentPoint);
            }
            else if (this.currentAction == 'line') {
                this.currentDrawing = { type: 'line', start: JSON.parse(JSON.stringify(this.currentPoint)), end: undefined, color: color };
            }
            else if (this.currentAction == 'circle') {
                this.currentDrawing = { type: 'circle', center: JSON.parse(JSON.stringify(this.currentPoint)), radius: undefined, color: color };
            }
            else if (this.currentAction == 'box') {
                this.currentDrawing = { type: 'box', start: JSON.parse(JSON.stringify(this.currentPoint)), width: undefined, height: undefined, color: color };
            }
            else if (this.currentAction == 'erase') {
                this.erase();
            }
        }
        if (e.type === 'mouseup') {
            this.mouseDownFlag = false;
            if (this.currentAction !== 'erase') {
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
                if (this.currentAction == 'draw') {
                    this.currentDrawing.points.push(JSON.parse(JSON.stringify(this.currentPoint)));
                    this.drawLine({ type: 'line', start: this.lastPoint, end: this.currentPoint, color: this.currentDrawing.color });
                }
                else if (this.currentAction == 'erase') {
                    this.erase();
                }
                else if (this.currentAction == 'line') {
                    this.redrawCanvas();
                    this.currentDrawing.end = JSON.parse(JSON.stringify(this.currentPoint));
                    this.drawLine(this.currentDrawing);
                }
                else if (this.currentAction == 'circle') {
                    this.redrawCanvas();
                    this.currentDrawing.radius = this.__distance(this.currentPoint, this.currentDrawing.center);
                    this.drawCircle(this.currentDrawing);
                }
                else if (this.currentAction == 'box') {
                    this.redrawCanvas();
                    this.currentDrawing.width = (this.currentPoint.x - this.currentDrawing.start.x);
                    this.currentDrawing.height = (this.currentPoint.y - this.currentDrawing.start.y);
                    this.drawBox(this.currentDrawing);
                }
            }
        }
    };
    // Drawing Helper Functions ===================================================================
    //------------------
    // Drawing functions
    //------------------
    DrawingCanvas.prototype.drawPoint = function (point) {
        this.context.beginPath();
        this.context.fillStyle = point.color;
        this.context.fillRect(point.x, point.y, this.lineWidth, this.lineWidth);
        this.context.closePath();
    };
    DrawingCanvas.prototype.drawLine = function (line) {
        // Used when drawing line and hand drawn line
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.context.moveTo(line.start.x, line.start.y);
        this.context.lineTo(line.end.x, line.end.y);
        this.context.strokeStyle = line.color;
        this.context.lineWidth = this.lineWidth;
        this.context.stroke();
        this.context.closePath();
    };
    DrawingCanvas.prototype.drawBox = function (box) {
        this.context.beginPath();
        this.context.rect(box.start.x, box.start.y, box.width, box.height);
        this.context.strokeStyle = box.color;
        this.context.lineWidth = this.lineWidth;
        this.context.stroke();
        this.context.closePath();
    };
    DrawingCanvas.prototype.drawCircle = function (circle) {
        this.context.beginPath();
        this.context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
        this.context.strokeStyle = circle.color;
        this.context.lineWidth = this.lineWidth;
        this.context.stroke();
        this.context.closePath();
    };
    DrawingCanvas.prototype.drawDrawings = function () {
        var _this = this;
        this.drawings.forEach(function (drawing) {
            _this.drawDrawing(drawing);
        });
    };
    DrawingCanvas.prototype.drawDrawing = function (drawing) {
        switch (drawing.type) {
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
    };
    DrawingCanvas.prototype.drawHandDrawnLine = function (drawing) {
        var _this = this;
        var p_point = { x: -1, y: -1, color: drawing.color };
        drawing.points.forEach(function (point) {
            if (p_point.x == -1 || p_point.y == -1) {
                _this.drawPoint(point);
            }
            else {
                _this.drawLine({ type: 'line', start: p_point, end: point, color: drawing.color });
            }
            p_point = { x: point.x, y: point.y, color: drawing.color };
        });
    };
    //-------------------------------
    // Clearing / redrawing functions
    //-------------------------------
    DrawingCanvas.prototype.resetCanvas = function () {
        this.deleteDrawings();
        this.clearCanvas();
    };
    DrawingCanvas.prototype.clearCanvas = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    DrawingCanvas.prototype.deleteDrawings = function () {
        this.drawings = Array();
    };
    DrawingCanvas.prototype.redrawCanvas = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawDrawings();
    };
    DrawingCanvas.prototype.erase = function () {
        var _this = this;
        var toErase = [];
        this.drawings.forEach(function (drawing) {
            if (drawing.type == 'hand_drawn_line') {
                for (var i = 0; i < drawing.points.length; i++) {
                    if (i == 0) {
                        continue;
                    }
                    else if (_this.__distanceBetweenLineAndPoint(_this.currentPoint, drawing.points[i - 1], drawing.points[i]) <= 2) {
                        console.log('erase');
                        toErase.push(drawing);
                    }
                }
            }
            else if (drawing.type == 'box') {
                var A = drawing.start;
                var B = { x: drawing.start.x + drawing.width, y: drawing.start.y, color: drawing.color };
                var C = { x: drawing.start.x + drawing.width, y: drawing.start.y + drawing.height, color: drawing.color };
                var D = { x: drawing.start.x, y: drawing.start.y + drawing.height, color: drawing.color };
                if (_this.__distanceBetweenLineAndPoint(_this.currentPoint, A, B) <= 2 ||
                    _this.__distanceBetweenLineAndPoint(_this.currentPoint, B, C) <= 2 ||
                    _this.__distanceBetweenLineAndPoint(_this.currentPoint, C, D) <= 2 ||
                    _this.__distanceBetweenLineAndPoint(_this.currentPoint, D, A) <= 2) {
                    console.log('erase');
                    toErase.push(drawing);
                }
            }
            else if (drawing.type == 'circle') {
                if (Math.abs(Math.sqrt(_this.__sqr(_this.currentPoint.x - drawing.center.x) + _this.__sqr(_this.currentPoint.y - drawing.center.y)) - drawing.radius) <= 2) {
                    console.log('erase');
                    toErase.push(drawing);
                }
            }
            else if (drawing.type == 'line') {
                if (_this.__distanceBetweenLineAndPoint(_this.currentPoint, drawing.start, drawing.end) <= 2) {
                    console.log('erase');
                    toErase.push(drawing);
                }
            }
        });
        this.drawings = this.drawings.filter(function (element) { return !toErase.includes(element); });
        this.redrawCanvas();
    };
    // General Helper Functions ===================================================================
    DrawingCanvas.prototype.__distance = function (p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    };
    DrawingCanvas.prototype.__distanceBetweenLineAndPoint = function (p, p1, p2) {
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
    };
    DrawingCanvas.prototype.__sqr = function (n) {
        return n * n;
    };
    DrawingCanvas.prototype.__getTableDialogRect = function () {
        return this.canvas.getClientRects()[0];
    };
    DrawingCanvas._canvasNumber = 0;
    return DrawingCanvas;
}());

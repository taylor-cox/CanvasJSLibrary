console.log('Hello world');

var drawingCanvas = new DrawingCanvas();

function start() {
    drawingCanvas.setCanvasHeight(300);
    drawingCanvas.setCanvasWidth(300);
    drawingCanvas.addButton('draw', Direction.Down, 'img/pencil-icon.png');
    drawingCanvas.addButton('line', Direction.Down, 'img/line-icon.png');
    drawingCanvas.addButton('circle', Direction.Down, 'img/line-icon.png');
    drawingCanvas.addButton('box', Direction.Down, 'img/line-icon.png');
    drawingCanvas.addClearButton(Direction.Down, 'img/clear-icon.png');
    drawingCanvas.addButton('erase', Direction.Down, 'img/eraser-icon.png');
    drawingCanvas.addColorWheel(Direction.Down)
    document.getElementsByClassName('example')[0].appendChild(drawingCanvas.getBoundingDiv());
}
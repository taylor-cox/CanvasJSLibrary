var drawingCanvas = new DrawingCanvas();

function start() {
    drawingCanvas.setCanvasHeight(300);
    drawingCanvas.setCanvasWidth(300);
    drawingCanvas.addToolbar('bottom');
    drawingCanvas.addButton('draw', 'bottom', 'img/pencil-icon.png');
    drawingCanvas.addButton('line', 'bottom', 'img/pencil-icon.png');
    drawingCanvas.addButton('circle', 'bottom', 'img/pencil-icon.png');
    drawingCanvas.addButton('box', 'bottom', 'img/pencil-icon.png');
    drawingCanvas.addButton('erase', 'bottom', 'img/clear-icon.png');
    drawingCanvas.addButton('clear', 'bottom', 'img/clear-icon.png');
    drawingCanvas.addColorWheel('bottom');
    drawingCanvas.addSlider('bottom');
    drawingCanvas.appendDrawingCanvasToElement(document.body);
}
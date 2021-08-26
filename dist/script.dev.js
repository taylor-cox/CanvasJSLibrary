"use strict";

var drawingCanvas = new DrawingCanvas();

function start() {
  drawingCanvas.setCanvasHeight(500);
  drawingCanvas.setCanvasWidth(500);
  drawingCanvas.addToolbar('bottom');
  drawingCanvas.addButton('draw', 'bottom', 'fa fa-pencil-alt');
  drawingCanvas.addButton('line', 'bottom', 'fas fa-pencil-ruler');
  drawingCanvas.addButton('circle', 'bottom', 'far fa-circle');
  drawingCanvas.addButton('box', 'bottom', 'far fa-square');
  drawingCanvas.addButton('erase', 'bottom', 'fas fa-eraser');
  drawingCanvas.addButton('clear', 'bottom', 'far fa-window-close');
  drawingCanvas.addDownloadButton('bottom', 'fas fa-download');
  drawingCanvas.addColorWheel('bottom');
  drawingCanvas.addLineWidthSlider('bottom');
  drawingCanvas.appendDrawingCanvasToElement(document.body);
}
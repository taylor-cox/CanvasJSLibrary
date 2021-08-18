"use strict";

var drawingCanvas = new DrawingCanvas();

function start() {
  drawingCanvas.setCanvasHeight(500);
  drawingCanvas.setCanvasWidth(500);
  drawingCanvas.addToolbar('bottom');
  drawingCanvas.addToolbar('left');
  drawingCanvas.addButton('draw', 'left', 'fa fa-pencil-alt');
  drawingCanvas.addButton('line', 'left', 'fas fa-pencil-ruler');
  drawingCanvas.addButton('circle', 'left', 'far fa-circle');
  drawingCanvas.addButton('box', 'left', 'far fa-square');
  drawingCanvas.addButton('erase', 'left', 'fas fa-eraser');
  drawingCanvas.addButton('clear', 'left', 'far fa-window-close');
  drawingCanvas.addColorWheel('bottom');
  drawingCanvas.addLineWidthSlider('bottom');
  drawingCanvas.appendDrawingCanvasToElement(document.body);
}
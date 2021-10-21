var placeholder = document.createElement('div');
placeholder.innerHTML = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />';
document.head.appendChild(placeholder.firstChild);

var html2canvasScript = document.createElement('script');
html2canvasScript.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
document.head.appendChild(html2canvasScript);

var overlay;

var script = document.createElement('script');
script.onload = function() {
    overlay = document.createElement('div');
    // overlay.style.backgroundColor = 'red';
    overlay.style.zIndex = '1';
    overlay.style.position = 'absolute';
    overlay.style.top = '0px';
    overlay.style.left = '0px';
    overlay.style.width = '100%';
    overlay.style.height = '95%';
    overlay.className = 'overlay';
    document.getElementsByClassName('v-main__wrap')[0].appendChild(overlay);

    var dc = new DrawingCanvas();
    dc.setCanvasHeight(parseInt(getComputedStyle(document.getElementsByClassName('overlay')[0]).height) - 50);
    dc.setCanvasWidth(parseInt(getComputedStyle(document.getElementsByClassName('overlay')[0]).width));
    dc.addToolbar('bottom');
    dc.addToolbar('left');
    dc.addButton('draw', 'bottom', 'fa fa-pencil-alt');
    dc.addButton('line', 'bottom', 'fas fa-pencil-ruler');
    dc.addButton('circle', 'bottom', 'far fa-circle');
    dc.addButton('box', 'bottom', 'far fa-square');
    dc.addButton('erase', 'bottom', 'fas fa-eraser');
    dc.addButton('clear', 'bottom', 'far fa-window-close');
    dc.addColorWheel('bottom');
    dc.addLineWidthSlider('bottom');
    dc.addDownloadButton('bottom', 'fas fa-download');
    dc.appendDrawingCanvasToElement(overlay);

    document.getElementById('drawing-canvas-0-bottom-toolbar').style.maxHeight = '30px';
    document.getElementById('drawing-canvas-button0-draw').style.borderStyle = 'solid none solid solid';
    document.getElementById('drawing-canvas-button0-draw').style.paddingLeft = '5px';
    document.getElementById('drawing-canvas-button0-draw').style.paddingRight = '5px';
    document.getElementById('drawing-canvas-button0-line').style.borderStyle = 'solid none solid none';
    document.getElementById('drawing-canvas-button0-line').style.paddingLeft = '5px';
    document.getElementById('drawing-canvas-button0-line').style.paddingRight = '5px';
    document.getElementById('drawing-canvas-button0-circle').style.borderStyle = 'solid none solid none';
    document.getElementById('drawing-canvas-button0-circle').style.paddingLeft = '5px';
    document.getElementById('drawing-canvas-button0-circle').style.paddingRight = '5px';
    document.getElementById('drawing-canvas-button0-box').style.borderStyle = 'solid none solid none';
    document.getElementById('drawing-canvas-button0-box').style.paddingLeft = '5px';
    document.getElementById('drawing-canvas-button0-box').style.paddingRight = '5px';
    document.getElementById('drawing-canvas-button0-erase').style.borderStyle = 'solid none solid none';
    document.getElementById('drawing-canvas-button0-erase').style.paddingLeft = '5px';
    document.getElementById('drawing-canvas-button0-erase').style.paddingRight = '5px';
    document.getElementById('drawing-canvas-button0-clear').style.borderStyle = 'solid solid solid none';
    document.getElementById('drawing-canvas-button0-clear').style.paddingLeft = '5px';
    document.getElementById('drawing-canvas-button0-clear').style.paddingRight = '5px';
    document.getElementById('drawing-canvas-button-0-color-wheel').style.height = 'auto';

    document.getElementById('drawing-canvas-0').style.border = '2px solid black';
    document.getElementsByClassName('overlay')[0].style.display = 'none';
    document.getElementById('drawing-canvas-0-bottom-toolbar').style.display = 'flex';

    document.getElementById('drawing-canvas-button-0-slider').parentElement.style.paddingRight = '800px';
};

script.src = 'https://cdn.jsdelivr.net/gh/taylor-cox/CanvasJSLibrary@main/dist/canvas-1.6.js';
document.head.appendChild(script);



var drawCloseButton = document.createElement('button');
var img = 'fa fa-pencil-alt';
let buttonImg = document.createElement('i');
img.split(' ').forEach((cls) => buttonImg.classList.add(cls));
buttonImg.style.width = '30px';
buttonImg.style.height = '30px';
drawCloseButton.appendChild(buttonImg);

drawCloseButton.onclick = function() {
    buttonImg.className = '';
    // if (overlay.style.pointerEvents === "none") {
    //     overlay.style.pointerEvents = "auto";
    // } else {
    //     overlay.style.pointerEvents = "none";
    // }

    // For hiding canvas completely
    if (overlay.style.display === "none") {
        overlay.style.display = "block";
        img = 'far fa-window-close';
    } else {
        overlay.style.display = "none";
        img = 'fa fa-pencil-alt';
    }
    img.split(' ').forEach((cls) => buttonImg.classList.add(cls));
}

drawCloseButton.style.width = '50px';
drawCloseButton.style.height = '50px';
drawCloseButton.style.position = 'absolute';
drawCloseButton.style.top = '70px';
drawCloseButton.style.right = '10px';
drawCloseButton.style.zIndex = '2';

document.body.appendChild(drawCloseButton);
document.body.style.overflow = 'hidden';
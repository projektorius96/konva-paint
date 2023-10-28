import { Stage, Layer, Node, KonvaImage } from './konva-components/index.js';
import { Pane } from "tweakpane";

export default void function () {

    const stateStack = [];
    let currentStateIndex = -1;
    
    let [pane, undoButton, redoButton] = [null, null, null];

    const Konva〵Node〵Defaults = new Node({
        width: window.innerWidth,
        height: window.innerHeight,
    })

    const stage = new Stage({
        container: 'app',
        ...Konva〵Node〵Defaults.getAttrs()
    });

    const layer = new Layer();
    stage.add(layer);

    const canvas = document.createElement('canvas');
        canvas.height = stage.height()
        canvas.width = stage.width()
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    if (canvas){

        pane = new Pane({container: canvas.previousSibling, title: canvas.tagName})
        undoButton = pane.addButton({
            title: 'Undo',
        }).on('click', () => {
            undo()
            layer.batchDraw();
        });
        redoButton = pane.addButton({
            title: 'Redo',
        }).on('click', () => {
            redo()
            layer.batchDraw();
        });
    }

    const image = new KonvaImage({
        image: canvas,
        draggable: true,
        ...Konva〵Node〵Defaults.getAttrs()
    });

    layer.add(image);
    
    function saveState() {
        const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
        currentStateIndex++;
        stateStack.splice(
            currentStateIndex, 
            stateStack.length - currentStateIndex,
            state
        );
    }

    function undo() {
        if (currentStateIndex > 0) {
            currentStateIndex--;
            const state = stateStack[currentStateIndex];
            ctx.putImageData(state, 0, 0);
        }
    }

    function redo() {
        if (currentStateIndex < stateStack.length - 1) {
            currentStateIndex++;
            const state = stateStack[currentStateIndex];
            ctx.putImageData(state, 0, 0);
        }
    }

    // Example drawing function (you can replace this with other canvas operations)
    function draw(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        saveState(); // Save the state after each drawing action
    }

    // press ctrl and move your mouse
    layer.getNativeCanvasElement().addEventListener('click', function(e){
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        draw(x, y);
        //** DEV_NOTE # this was a solution {@link https://konvajs.org/docs/sandbox/Native_Context_Access.html#How-to-access-native-2d-canvas-context-from-Konva|Image} */
        layer.batchDraw();
    });

}()
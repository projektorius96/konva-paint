import { Pane } from "tweakpane";
export function CanvasAPI(ctx, shape){

    const stateStack = [];
    
    let currentStateIndex = -1;
    let [pane, undoButton, redoButton] = [null, null, null];
    let canvas = ctx.getCanvas()._canvas;

    if(canvas){

        pane = new Pane({container: canvas.previousSibling, title: canvas.tagName})
            undoButton = pane.addButton({
                title: 'Undo',
            });
            redoButton = pane.addButton({
                title: 'Redo',
            });
    
    }

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
    canvas.addEventListener('mousemove', function(e){
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // DEV_NOTE # enable mousemove with ctrl onkeydown
        if (e.ctrlKey){
            draw(x, y);
        }
    });

    undoButton.on('click', () => {
        undo()
    });

    redoButton.on('click', () => {
        redo()
    });

    return this;

}
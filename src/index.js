import { Stage, Layer, Node, Shape } from './konva-components/index.js';
import { CanvasAPI } from './konva-components/callbacks/index.js';
export default void function(){

    const Konva〵Node〵Defaults = new Node({
            container: document.getElementById('app'),
            width: window.innerWidth,
            height: window.innerHeight,
    });

    if (Konva〵Node〵Defaults){

        new Stage({
            ...Konva〵Node〵Defaults,
        }).add(
            new Layer({draggable: true}).add(
                new Shape({
                    sceneFunc: function(...args){ CanvasAPI.call(this, ...args) }
                })
            )
        )
        
    }

}()
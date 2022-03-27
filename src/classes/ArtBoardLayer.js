import * as PIXI from 'pixi.js';
import InteractiveContainer from './InteractiveContainer';
import PointSetGroup from './PointSetGroup';
import VectorableGraphics from './VectorableGraphics';
import Draggable from './Draggable';
import Resizer from './Resizer';
import {PointTypes} from './PointSet';
// import PointSet from './PointSet';
const ArtBoardModes = {
    MOVE: 0,
    PEN: 1,
    POLYGON: 2,
    TEMPLATE: 3,
    RESIZE: 4
};
const LayerTypes = {
    UNSET: 0,
    PEN: 1,
    POLYGON: 2
};
export default class ArtBoardLayer extends InteractiveContainer{
    constructor({width, height, mode}){
        super();
        this.artBoardID = `art-board-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}`;
        this.currentTemplate = null;
        this.mode = mode ? mode : ArtBoardModes.PEN;
        this.layerType = LayerTypes.UNSET;
        this.editor = null;
        this.activeResizer = null;
        this.changeHandler = null;
        this.pointAddedHandler = null;
        this.pointRemovedHandler = null;
        this.shapeContainer = new Draggable();
        this.shapeContainer.onStart(() => {
            this.editor.visible = false;
        });
        this.shapeContainer.onEnd(() => {
            this.shiftPoints(this.shapeContainer.x, this.shapeContainer.y);
            this.shapeContainer.x = 0;
            this.shapeContainer.y = 0;
            this.editor.visible = true;
        });
        this.shape = null;
        this.interactive = false;
        this.surfaceContainer = new InteractiveContainer();
        this.addChild(this.shapeContainer);
        const surface = new PIXI.Graphics();
        surface.beginFill(0xffffff, .001);
        surface.drawRect(0,0,width,height);
        this.addChild(this.surfaceContainer);
        this.surfaceContainer.addChild(surface);
        const downMethod = (e) => {
            console.log('DOWN METHOD !!!!')
            const event = this.processEvent(e);
            switch(this.mode){
                case ArtBoardModes.MOVE:{
                    break;
                }
                case ArtBoardModes.RESIZE:{
                    if(this.editor){
                        this.editor.visible = false;
                    }
                    break;
                }
                case ArtBoardModes.PEN:
                case ArtBoardModes.TEMPLATE:{
                    if(this.editor){
                        this.editor.visible = true;
                    }
                    
                    this.layerType = LayerTypes.PEN;
                    if(!this.editor){
                        // this.editor = new PointSetGroup({x: event.x, y: event.y});
                        this.editor = this.penDown(event.x, event.y, 200, 200);
                        if(this.pointAddedHandler){
                            this.pointAddedHandler(this.editor.points[0]);
                        }
                        this.shape = new VectorableGraphics();
                        this.shapeContainer.addChild(this.shape);
                        this.editor.onChange((points) => {
                            if(points.length > 1){
                                this.shape.clear();
                                this.shape.beginFill(0xffffff, .001);
                                this.shape.lineStyle(1, 0x000000, 1);
                                console.log(points.map(item => item.pointType));
                                points.forEach((item, index) => {
                                    const coords = item.getAnchorPositions();
                                    if(index === 0){
                                        this.shape.moveTo(coords.x, coords.y);
                                    }
                                    const shouldCloseShape = index === points.length - 1 && this.editor.closed;
                                    const nextIndex = shouldCloseShape ? 0 : index + 1;
                                    const nextCoords = points[nextIndex] ? points[nextIndex].getAnchorPositions() : null;
                                    if(nextCoords){
                                        switch(item.pointType){
                                            case PointTypes.C:{
                                                this.shape.bezierCurveTo(coords.anchors.after.x, coords.anchors.after.y, nextCoords.anchors.before.x, nextCoords.anchors.before.y, nextCoords.x, nextCoords.y);
                                                break;
                                            }
                                            case PointTypes.Q:{
                                                this.shape.quadraticCurveTo(coords.anchors.after.x, coords.anchors.after.y, nextCoords.x, nextCoords.y);
                                                break;
                                            }
                                            case PointTypes.S:{
                                                this.shape.smoothQuadraticCurveTo(coords.anchors.after.x, coords.anchors.after.y, nextCoords.x, nextCoords.y);
                                                break;
                                            }
                                            case PointTypes.L:{
                                                this.shape.lineTo(nextCoords.x, nextCoords.y);
                                                break;
                                            }
                                            case PointTypes.T:{
                                                this.shape.smoothLineTo(nextCoords.x, nextCoords.y)
                                                break;
                                            }
                                            case PointTypes.V:{
                                                this.shape.verticalLineTo(nextCoords.x, nextCoords.y)
                                                break;
                                            }
                                            case PointTypes.H:{
                                                this.shape.horizontalLineTo(nextCoords.x, nextCoords.y)
                                                break;
                                            }
                                        }
                                    }
                                    
                                    
                                    this.surfaceContainer.interactive = !this.editor.closed;
                                    
                                });
                                this.shape.endFill();
                            }
                            if(this.changeHandler){
                                this.changeHandler({ shape: this.shape, editor: this.editor });
                            }
                            
                        });
                        this.addChild(this.editor);
                    }
                    else if(!this.editor.closed){
                        const pointAdded = this.editor.addPoint(event.x, event.y);
                        if(this.pointAddedHandler){
                            this.pointAddedHandler(pointAdded);
                        }
                    }
                    if(this.mode !== ArtBoardModes.PEN){
                        this.editor.changeHandler(this.editor.points);
                    }
                    break;
                }
                // case ArtBoardModes.POLYGON:{
                //     if(!shape){
                        
                //     }
                //     break;
                // }
            }
        }
        this.addContent = downMethod;
        this.surfaceContainer.on('mousedown', downMethod);
        this.surfaceContainer.on('touchstart', downMethod);

        // this.on('mousemove', this.move);
        // this.on('touchmove', this.move);
        // this.on('mouseup', this.up);
        // this.on('mouseupoutside', this.up);
        // this.on('touchend', this.up);
        // this.on('touchendoutside', this.up);
        this.resizeContainer = new PIXI.Container();
        this.addChild(this.resizeContainer);
    }
    
    setMode(mode){
        this.mode = mode;
        switch(this.mode){
            case ArtBoardModes.RESIZE:{
                console.log(this.shape);
                if(this.editor && this.shape){
                    this.editor.alpha = 0;
                    const shapeBounds = this.shape.getBounds();
                    const resizer = new Resizer({x: shapeBounds.x, y: shapeBounds.y, width: shapeBounds.width, height: shapeBounds.height});
                    this.activeResizer = resizer;
                    const basePositions = this.editor.points.map(item => {
                        return {
                            x: item.x - shapeBounds.x,
                            y: item.y - shapeBounds.y,
                            anchors:{
                                before: {x: item.anchors.before.x, y: item.anchors.before.y},
                                after: {x: item.anchors.after.x, y: item.anchors.after.y}
                            }
                        }
                    })
                    resizer.onChange((e) => {
                        console.log(e);
                        console.log(basePositions);
                        const ratios = {
                            width: e.current.width / e.base.width,
                            height: e.current.height / e.base.height
                        };
                        this.editor.points.forEach((item, index) => {
                            item.x = e.current.x + (basePositions[index].x * ratios.width);
                            item.y = e.current.y + (basePositions[index].y * ratios.height);
                            item.anchors.before.x = basePositions[index].anchors.before.x * ratios.width;
                            item.anchors.before.y = basePositions[index].anchors.before.y * ratios.height;
                            item.anchors.after.x = basePositions[index].anchors.after.x * ratios.width;
                            item.anchors.after.y = basePositions[index].anchors.after.y * ratios.height;
                        });
                        this.editor.changeHandler(this.editor.points);
                    });
                    this.resizeContainer.addChild(resizer);
                    // console.log(resizer);
                }
                break;
            }
            case ArtBoardModes.PEN:
            case ArtBoardModes.TEMPLATE:{
                this.activeResizer = null;
                if(this.editor){
                    this.editor.alpha = 1;
                    this.resizeContainer.removeChildren();
                }
            }
        }        
    }
    removePoint({ setID }){
        this.editor.removePoint({ setID });
        if(this.pointRemovedHandler){
            this.pointRemovedHandler();
        }

    }
    shiftPoints(x, y){
        this.editor.points.forEach(item => {
            item.x += x;
            item.y += y;
        });
        this.editor.changeHandler(this.editor.points);
    }
    penDown(x, y){
        let group = null;
        switch(this.mode){
            case ArtBoardModes.PEN:{
                group = new PointSetGroup({ x, y });
                break;
            }
            case ArtBoardModes.TEMPLATE:{
                group = new PointSetGroup({ x, y, template: this.currentTemplate });
            }
        }
        return group;
        
    }
    setTemplate(template){
        this.currentTemplate = template;
    }
    onChange(handler){
        this.changeHandler = handler;
    }
    onPointAdded(handler){
        this.pointAddedHandler = handler
    }
    onPointRemoved(handler){
        this.pointRemovedHandler = handler
    }
}
export {ArtBoardModes, LayerTypes};
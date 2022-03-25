import * as PIXI from 'pixi.js';
import Draggable from './Draggable';
export default class Resizer extends PIXI.Container{
    constructor({x, y, width, height}){
        super();
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this.startValues = {x, y, height, width};
        this.handleSize = 20;
        this.handles = {
            tl: this.handleSetup(this._x, this._y, 'tl'),
            tr: this.handleSetup(this._x + this._width, this._y, 'tr'),
            br: this.handleSetup(this._x + this._width, this._y + this._height, 'br'),
            bl: this.handleSetup(this._x, this._y + this._height, 'bl'),
            t: this.handleSetup(this._x + (this._width / 2), this._y, 't'),
            r: this.handleSetup(this._x + this._width, this._y + (this._height / 2), 'r'),
            b: this.handleSetup(this._x + (this._width / 2), this._y + this._height, 'b'),
            l: this.handleSetup(this._x, this._y + (this._height / 2), 'l')
        };
        this.currentHandle = null;
        this.changeHandler = null;
        
    }
    handleSetup (x, y, name) {
        const handle = new Draggable();
        handle.x = x;
        handle.y = y;
        const handleGraphic = new PIXI.Graphics();
        handleGraphic.beginFill(0xcc0000);
        handleGraphic.drawRect(this.handleSize * -.5, this.handleSize * -.5, this.handleSize, this.handleSize);
        handleGraphic.endFill();
        handle.addChild(handleGraphic);
        handle.onStart(() => {
            this.currentHandle = name;
        });
        handle.onMove(() => {
            console.log(this.currentHandle);
            if(this.currentHandle.includes('r')){
                this._width = Math.abs(this.handles.l.x - this.handles[this.currentHandle].x);
            }
            if(this.currentHandle.includes('l')){
                this._x = this.handles[this.currentHandle].x;
                this._width = Math.abs(this.handles[this.currentHandle].x - this.handles.r.x);
            }
            if(this.currentHandle.includes('t')){
                this._y = this.handles[this.currentHandle].y;
                this._height = Math.abs(this.handles.b.y - this.handles[this.currentHandle].y);
            }
            if(this.currentHandle.includes('b')){
                this._height = Math.abs(this.handles[this.currentHandle].y - this.handles.t.y);
            }
            this.placeHandle('tl', this._x, this._y);
            this.placeHandle('t', this._x + (this._width / 2), this._y);
            this.placeHandle('tr', this._x + this._width, this._y);
            this.placeHandle('bl', this._x, this._y + this._height);
            this.placeHandle('b', this._x + (this._width / 2), this._y + this._height);
            this.placeHandle('br', this._x + this._width, this._y + this._height);
            this.placeHandle('l', this._x, this._y + (this._height / 2));
            this.placeHandle('r', this._x + this._width, this._y + (this._height / 2));
            const center = {x: this._x + (this._width / 2), y: this._y + (this._height / 2)};
            this.handles.t.x = center.x;
            this.handles.b.x = center.x;
            this.handles.l.y = center.y;
            this.handles.r.y = center.y;
            if(this.changeHandler){
                this.changeHandler({base: this.startValues, current: {x: this._x, y: this._y, width: this._width, height: this._height}});
            }
        });
        this.addChild(handle);
        return handle;
    }
    placeHandle(name, x, y){
        if(name !== this.currentHandle){
            this.handles[name].x = x;
            this.handles[name].y = y;
        }
    }

    onChange(handler){
        this.changeHandler = handler;
    }
    
}
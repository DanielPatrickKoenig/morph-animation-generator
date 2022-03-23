import * as PIXI from 'pixi.js';
import ArtBoardLayer, {ArtBoardModes} from './ArtBoardLayer';
export default class ArtBoardGroup extends PIXI.Container{
    constructor({width, height, mode}){
        super();
        this.changeHandler = null;
        this.pointAddedHandler = null;
        this.pointRemovedHandler = null;
        this.artBoards = [];
        this.width = width;
        this.height = height;
        this.mode = mode;
        this.activeArtBoard = new ArtBoardLayer({width, height, mode});
        this.addChild(this.activeArtBoard);
        this.artBoards.push(this.activeArtBoard);
        this.activeArtBoard.onChange(() => {
            if(this.changeHandler){
                this.changeHandler(this.artBoards);
            }
        });
        this.activeArtBoard.onPointAdded((point) => {
            if(this.pointAddedHandler){
                this.pointAddedHandler(this.activeArtBoard, point);
            }
        });
        this.activeArtBoard.onPointRemoved(() => {
            if(this.pointRemovedHandler){
                this.pointRemovedHandler();
            }
        });
    }
    duplicateArtBoard(artBoard){
        const template = artBoard.editor.convertToTemplate();
        const board = this.addArtBoard();
        board.setMode(ArtBoardModes.TEMPLATE);
        board.setTemplate(template);
        board.addContent({x: 0, y: 0});
        return board;
    }
    artBoardFromTemplate(template){
        const board = this.activeArtBoard;
        board.setMode(ArtBoardModes.TEMPLATE);
        board.setTemplate(template);
        // const lastPoint = board.editor.points[board.editor.points.length - 1];
        board.addContent({x: 0, y: 0});
        const lastPoint = board.editor.points[board.editor.points.length - 1];
        lastPoint.selectedHandler(lastPoint);
        return board;
    }
    addArtBoard(){
        const board = new ArtBoardLayer({width: this.width, height: this.height});
        this.addChild(board);
        this.artBoards.push(board);
        board.onChange(() => {
            if(this.changeHandler){
                this.changeHandler(this.artBoards);
            }
        });
        return board;
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
    setActiveArtBoard(index){
        if(this.artBoards[index]){
            this.activeArtBoard = this.artBoards[index];
        }
    }
}
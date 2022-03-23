<template>
    <div>
        <ul v-if="timelineData.frames" class="tools">
            <li v-for="(tool, i) in appTools" :key="`tool-${i}`">
                <label>
                    <span>{{tool.label}}</span>
                    <input
                        type="radio"
                        name="tool"
                        :value="tool.mode"
                        v-model="currentTool"
                        @change="onToolSelected"
                    />
                </label>
            </li>
        </ul>
        <EditorStage 
            :width="1000" 
            :height="800"
            :current-frame="timelineData.currentFrame"
            @board-update="onBoardUpdate"
            @point-added="onPointAdded"
        />
        <TimelineInterface 
            v-if="timelineData.frameCount"
            :frames="timelineData.frames" 
            :frameCount="timelineData.frameCount"
            @active-index="onActiveIndex"
        />
        <div 
            v-if="timelineData.frames" 
            class="editors"
        >
            <template v-for="(frame, fIndex) in timelineData.frames">
                <div 
                    v-show="frame.board.artBoardID === currentArtboard.artBoardID"
                    :key="`frame-${fIndex}`"
                    style="margin-bottom: 200px;"
                >
                    <h2>{{frame.board.artBoardID}}</h2>
                    <template v-for="(values, k, i) in pointMatrix[frame.board.artBoardID]">
                        <PropertyEditor 
                            v-show="currentPoint && k === currentPoint.setID"
                            :key="`point-${fIndex}-${i}`"
                            :properties="values"
                            @value-change="onValueChange"
                        />
                    </template>
                </div>
            </template>
        </div>
        <!-- <PropertyEditor 
            v-if="timelineData.frameCount"
            :properties="currentPointData"
            @value-change="onValueChange"
        /> -->
    </div>
</template>

<script>
import EditorStage from './EditorStage.vue';
import TimelineInterface from './TimelineInterface.vue';
import PropertyEditor from './ProperyEditor.vue';
import {ArtBoardModes} from '../classes/ArtBoardLayer';
export default {
    components: {
        EditorStage,
        TimelineInterface,
        PropertyEditor
    },
    data(){
        return {
            timelineData:{
                frames: null,
                frameCount: 0,
                currentFrame: 0
            },
            currentPointData: [
                {type: 'imutable', value: '', name: 'ID'},
                {type: 'checkbox', value: false, name: 'Mirror Distance'},
                {type: 'checkbox', value: false, name: 'Mirror Ange'},
                {type: 'checkbox', value: false, name: 'Show Before Anchor'},
                {type: 'checkbox', value: false, name: 'Show After Anchor'},
                {type: 'number', value: 0, name: 'x'},
                {type: 'number', value: 0, name: 'y'},
                {type: 'number', value: 0, name: 'before x'},
                {type: 'number', value: 0, name: 'before y'},
                {type: 'number', value: 0, name: 'after x'},
                {type: 'number', value: 0, name: 'after y'}
            ],
            pointMatrix: {},
            appTools: [
                { mode: ArtBoardModes.PEN, label: 'Pen' },
                { mode: ArtBoardModes.RESIZE, label: 'Resize' }
            ],
            currentTool: ArtBoardModes.PEN
        }
    },
    computed:{
        currentArtboard(){
            return this.timelineData.frames.find(item => item.frame === this.timelineData.currentFrame).board;
        },
        currentPoint(){
            return this.currentArtboard.editor.selectedSet;
        }
    },
    methods:{
        
        onBoardUpdate(e){
            this.timelineData.frames = e.frames;
            this.timelineData.frameCount = e.frameCount;
            const currentBoard = this.currentArtboard;
            // const currentBoard = e.frames.find(item => item.frame === this.timelineData.currentFrame).board;
            if(currentBoard.editor && currentBoard.editor.selectedSet){
                this.updatePoint(currentBoard, currentBoard.editor.selectedSet);
                this.currentPointData[1].value = currentBoard.editor.selectedSet.mirrorDistance;
                this.currentPointData[2].value = currentBoard.editor.selectedSet.mirrorAngle;
                this.currentPointData[3].value = currentBoard.editor.selectedSet.anchors.before.visible;
                this.currentPointData[4].value = currentBoard.editor.selectedSet.anchors.after.visible;
                this.currentPointData[5].value = Number(currentBoard.editor.selectedSet.x);
                this.currentPointData[6].value = Number(currentBoard.editor.selectedSet.y);

                this.currentPointData[7].value = Number(currentBoard.editor.selectedSet.anchors.before.x);
                this.currentPointData[8].value = Number(currentBoard.editor.selectedSet.anchors.before.y);
                this.currentPointData[9].value = Number(currentBoard.editor.selectedSet.anchors.after.x);
                this.currentPointData[10].value = Number(currentBoard.editor.selectedSet.anchors.after.y);
                // this.currentPointData[4].value = currentBoard.editor.selectedSet.x;
                // this.currentPointData[5].value = currentBoard.editor.selectedSet.y;
            }
            if(this.currentArtboard){
                console.log(this.currentArtboard.shape);

            }
            
        },
        onActiveIndex(e){
            this.timelineData.currentFrame = e;
        },
        onValueChange(e){
            const currentBoard = this.timelineData.frames.find(item => item.frame === this.timelineData.currentFrame).board;
            this.currentPointData[e.index].value = e.value;
            currentBoard.editor.selectedSet.mirrorDistance = this.currentPointData[1].value;
            currentBoard.editor.selectedSet.mirrorAngle = this.currentPointData[2].value;
            currentBoard.editor.selectedSet.anchors.before.visible = this.currentPointData[3].value;
            currentBoard.editor.selectedSet.anchors.after.visible = this.currentPointData[4].value;
            currentBoard.editor.selectedSet.x = Number(this.currentPointData[5].value);
            currentBoard.editor.selectedSet.y = Number(this.currentPointData[6].value);

            currentBoard.editor.selectedSet.anchors.before.x = Number(this.currentPointData[7].value);
            currentBoard.editor.selectedSet.anchors.before.y = Number(this.currentPointData[8].value);
            currentBoard.editor.selectedSet.anchors.after.x = Number(this.currentPointData[9].value);
            currentBoard.editor.selectedSet.anchors.after.y = Number(this.currentPointData[10].value);
            currentBoard.editor.changeHandler(currentBoard.editor.points);

        },
        onPointAdded(e){
            const {board, point} = e;
            this.updatePoint(board, point);
        },
        updatePoint(board, point){
            if(!this.pointMatrix[board.artBoardID]){
                this.pointMatrix[board.artBoardID] = {};
            }
            this.pointMatrix[board.artBoardID][point.setID] = [
                {type: 'imutable', value: point.setID, name: 'ID'},
                {type: 'checkbox', value: point.mirrorDistance, name: 'Mirror Distance'},
                {type: 'checkbox', value: point.mirrorAngle, name: 'Mirror Ange'},
                {type: 'checkbox', value: point.anchors.before.visible, name: 'Show Before Anchor'},
                {type: 'checkbox', value: point.anchors.after.visible, name: 'Show After Anchor'},
                {type: 'number', value: point.x, name: 'x'},
                {type: 'number', value: point.y, name: 'y'},
                {type: 'number', value: point.anchors.before.x, name: 'before x'},
                {type: 'number', value: point.anchors.before.y, name: 'before y'},
                {type: 'number', value: point.anchors.after.x, name: 'after x'},
                {type: 'number', value: point.anchors.after.y, name: 'after y'}
            ];
            this.$forceUpdate();
        },
        onToolSelected(){
            this.currentArtboard.setMode(this.currentTool);
        }
    }

}
</script>

<style>

</style>
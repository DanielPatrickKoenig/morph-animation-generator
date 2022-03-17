<template>
    <div>
        <EditorStage 
            :width="1000" 
            :height="800"
            :current-frame="timelineData.currentFrame"
            @board-update="onBoardUpdate"
        />
        <TimelineInterface 
            v-if="timelineData.frameCount"
            :frames="timelineData.frames" 
            :frameCount="timelineData.frameCount"
            @active-index="onActiveIndex"
        />
        <PropertyEditor 
            v-if="timelineData.frameCount"
            :properties="currentPointData"
            @value-change="onValueChange"
        />
    </div>
</template>

<script>
import EditorStage from './EditorStage.vue';
import TimelineInterface from './TimelineInterface.vue';
import PropertyEditor from './ProperyEditor.vue';
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
                {type: 'checkbox', value: false, name: 'Mirror Distance'},
                {type: 'checkbox', value: false, name: 'Mirror Ange'},
                {type: 'number', value: false, name: 'X'},
                {type: 'number', value: false, name: 'Y'}
            ]
        }
    },
    methods:{
        onBoardUpdate(e){
            this.timelineData.frames = e.frames;
            this.timelineData.frameCount = e.frameCount;
            const currentBoard = e.frames.find(item => item.frame === this.timelineData.currentFrame).board;
            if(currentBoard.editor && currentBoard.editor.selectedSet){
                this.currentPointData[0].value = currentBoard.editor.selectedSet.mirrorDistance;
                this.currentPointData[1].value = currentBoard.editor.selectedSet.mirrorAngle;
                this.currentPointData[2].value = currentBoard.editor.selectedSet.x;
                this.currentPointData[3].value = currentBoard.editor.selectedSet.y;
            }
            
        },
        onActiveIndex(e){
            this.timelineData.currentFrame = e;
        },
        onValueChange(e){
            // console.log(e);
            const currentBoard = this.timelineData.frames.find(item => item.frame === this.timelineData.currentFrame).board;
            this.currentPointData[e.index].value = e.value;
            currentBoard.editor.selectedSet.mirrorDistance = this.currentPointData[0].value;
            currentBoard.editor.selectedSet.mirrorAngle = this.currentPointData[1].value;
            currentBoard.editor.selectedSet.x = Number(this.currentPointData[2].value);
            currentBoard.editor.selectedSet.y = Number(this.currentPointData[3].value);

        }
    }

}
</script>

<style>

</style>
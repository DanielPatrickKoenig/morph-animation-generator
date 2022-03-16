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
    </div>
</template>

<script>
import EditorStage from './EditorStage.vue';
import TimelineInterface from './TimelineInterface.vue';
export default {
    components: {
        EditorStage,
        TimelineInterface
    },
    data(){
        return {
            timelineData:{
                frames: null,
                frameCount: 0,
                currentFrame: 0
            }
        }
    },
    methods:{
        onBoardUpdate(e){
            this.timelineData.frames = e.frames;
            this.timelineData.frameCount = e.frameCount;
        },
        onActiveIndex(e){
            this.timelineData.currentFrame = e;
        }
    }

}
</script>

<style>

</style>
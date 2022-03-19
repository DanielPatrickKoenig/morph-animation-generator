<template>
    <div class="editor-stage">
        <div class="art-board">
            <svg>
                <path
                    v-for="(shape, i) in shapes"
                    :key="`shape-${i}`"
                    :d="shape"
                    :class="{'current-path': currentPathIndex === i}"
                />
            </svg>
            <canvas ref="canvas" />
        </div>
        <ul>
            <li><button @click="duplicating = true">Duplicate Current Frame</button></li>
        </ul>
        <DuplicateFrameModal 
            v-if="duplicating"
            @close="duplicating = false"
            @confirm="duplicate"
        />
    </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import ArtBoardTimeline from '../classes/ArtBoardTimeline';
import DuplicateFrameModal from './DuplicateFrameModal.vue';
export default {
    components: {
        DuplicateFrameModal
    },
    props: {
        width: {
            type: Number,
            default: 800
        },
        height: {
            type: Number,
            default: 600
        },
        currentFrame: {
            type: Number,
            default: 0,
        }
    },
    watch: {
        currentFrame(){
            this.boardStage.setActiveFrame(this.currentFrame);
        }
    },
    data () {
        return {
            boardStage: {},
            shapes: [],
            duplicating: false,
        }
    },
    computed: {
        currentPathIndex(){
            return this.boardStage.getArtBoardIndexByFrame(this.currentFrame);
        }
    },
    mounted () {
        const app = new PIXI.Application({
            view: document.querySelector('canvas'),
            width: this.width,
            height: this.height,
            transparent: true,
        });
        this.boardStage = new ArtBoardTimeline({width: this.width, height: this.height, frameCount: 100});
        app.stage.addChild(this.boardStage);
        this.boardStage.onChange(this.boardChange);
        this.boardStage.onPointAdded(this.pointAdded);
        this.boardStage.onPointRemoved(this.pointRemoved);
        this.boardUpdate();
    },
    methods: {
        boardChange(boards){
            this.shapes = boards.map(item => item.shape.vectorize());
            console.log(boards);
            this.boardUpdate();
        },
        pointAdded(board, point){
            console.log('point added');
            console.log(board);
            console.log(point);
            this.$emit('point-added', { board, point });
        },
        pointRemoved(board, point){
            console.log('point removed');
            this.$emit('point-removed', { board, point });
        },
        duplicate(e){
            this.boardStage.duplicateFrame(Number(e.sourceFrame), Number(e.targetFrame));
            this.boardUpdate();
        },
        boardUpdate(){
            this.$emit('board-update', this.boardStage);
        }
    }
}
</script>

<style>

</style>
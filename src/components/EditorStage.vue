<template>
    <div>
        <svg>
            <path
                v-for="(shape, i) in shapes"
                :key="`shape-${i}`"
                :d="shape"
            />
        </svg>
        <canvas ref="canvas" />
    </div>
</template>

<script>
import * as PIXI from 'pixi.js';
import ArtBoardTimeline from '../classes/ArtBoardTimeline';
export default {
    props: {
        width: {
            type: Number,
            default: 800
        },
        height: {
            type: Number,
            default: 600
        }
    },
    data () {
        return {
            boardStage: {},
            shapes: []
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
    },
    methods: {
        boardChange(boards){
            this.shapes = boards.map(item => item.shape.vectorize());
            console.log(boards);
        }
    }
}
</script>

<style>

</style>
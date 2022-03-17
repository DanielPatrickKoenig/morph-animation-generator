<template>
    <div class="timeline">
        <ul>
            <li 
                v-for="(frame, i) in frameList"
                :key="`frame-${i}`"
                :class="{ 'key-frame': activeFrames.includes(i), 'current-frame': currentFrame === i }"
                :style="{ width: `${100/frameCount}vw` }"
            >
                <a 
                    v-if="activeFrames.includes(i)"
                    @click="setActiveFrame(i)"
                >
                    {{i}}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        frames: {
            type: Object,
            required: true
        },
        frameCount: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            frameList: [...new Array(this.frameCount).keys()],
            currentFrame: 0
        }
    },
    computed: {
        activeFrames(){
            return this.frames.map(item => item.frame);
        }
    },
    methods: {
        setActiveFrame(index){
            this.currentFrame = index;
            this.$emit('active-index', index)
        }
    }
}
</script>

<style>

</style>
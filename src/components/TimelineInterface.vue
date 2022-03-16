<template>
    <div>
        <ul>
            <li 
                v-for="(frame, i) in frameList"
                :key="`frame-${i}`"
            >
                <a 
                    v-if="activeFrames.includes(i)"
                    @click="setActiveFrame(i)"
                >
                    ACTIVE
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
            frameList: [...new Array(this.frameCount).keys()]
        }
    },
    computed: {
        activeFrames(){
            return this.frames.map(item => item.frame);
        }
    },
    methods: {
        setActiveFrame(index){
            this.$emit('active-index', index)
        }
    }
}
</script>

<style>

</style>
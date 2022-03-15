<template>
    <ModalContent class="duplicate-frame">
        <div>
            <label>
                <span>
                    Source Frame
                </span>
                <input 
                    type="number"
                    v-model="sourceFrame"
                />
            </label>
            <label>
                <span>
                    Target Frame
                </span>
                <input 
                    type="number"
                    v-model="targetFrame"
                />
            </label>
        </div>
        <div>
            <button @click="close">Cancel</button>
            <button @click="confirm">OK</button>
        </div>
    </ModalContent>
</template>

<script>
import ModalContent from './ModalContent.vue';
export default {
    components: {
        ModalContent
    },
    props: {
        frame: {
            type: Number,
            default: 0
        }
    },
    data () {
        return{
            sourceFrame: this.frame,
            targetFrame: this.frame + 1
        }
    },
    methods: {
        close(){
            this.$emit('close');
        },
        confirm(){
            this.$emit('confirm', {sourceFrame: this.sourceFrame, targetFrame: this.targetFrame});
            this.close();
        }
    }
}
</script>

<style>

</style>
<template>
    <ModalContent class="template-frame">
        <div>
            <label>
                <span>Teplate</span>
                <select v-model="template">
                    <option value="none">Select a template</option>
                    <option v-for="(option, k, i) in templates" :key="`option-${i}`" :value="option">
                        {{k}}
                    </option>
                </select>
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
const templates = require('../assets/templates.json');
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
            targetFrame: this.frame + 1,
            templates,
            template: 'none'
        }
    },
    methods: {
        close(){
            this.$emit('close');
        },
        confirm(){
            this.$emit('confirm', {template: this.template, targetFrame: this.targetFrame});
            this.close();
        }
    }
}
</script>

<style>

</style>
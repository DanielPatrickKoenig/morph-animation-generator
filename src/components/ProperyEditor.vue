<template>
    <div>
        <div v-for="(property, i) in properties" :key="`property-${i}`">
            <label>
                <span>{{property.name}}</span>
                <input 
                    :type="property.type"
                    v-model="propertyList[i]"
                    @change="onChange(i)" 
                />
            </label>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        properties: {
            type: Array,
            required: true
        }
    },
    data(){
        return{
            propertyList: this.properties.map(item => item.value)
        }
    },
    watch: {
        properties: {
            handler(newValue) {
                this.propertyList = newValue.map(item => item.value);
            },
            deep: true
        }
    },
    methods: {
        onChange(index){
            // console.log(index);
            this.$emit('value-change', {index, value: this.propertyList[index]});
        }
    }
}
</script>

<style>

</style>
<template>
    <div>
        <div v-for="(property, i) in properties" :key="`property-${i}`">
            <label>
                <span>{{property.name}}: </span>
                <template v-if="controlType(property.type) === controlTypes.INPUT">
                    <input 
                        :type="property.type"
                        v-model="propertyList[i]"
                        @change="onChange(i)" 
                    />
                </template>
                <template v-else-if="controlType(property.type) === controlTypes.IMUTIBLE">
                    <span>{{propertyList[i]}}</span>
                </template>
            </label>
        </div>
    </div>
</template>

<script>
const ControlTypes = {
    INPUT: 0,
    SELECT: 1,
    IMUTIBLE: 3
}
export default {
    props: {
        properties: {
            type: Array,
            required: true
        }
    },
    data(){
        return{
            propertyList: this.properties.map(item => item.value),
            controlTypes: ControlTypes
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
    computed: {
        controlType(){
            return type => {
                if(['checkbox', 'number', 'text'].includes(type)){
                    return ControlTypes.INPUT;
                }
                else if(['select'].includes(type)){
                    return ControlTypes.SELECT;
                }
                else if(['imutable'].includes(type)){
                    return ControlTypes.IMUTIBLE;
                }
            }
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
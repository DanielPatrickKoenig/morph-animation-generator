<template>
  <div id="app">
    <MorphEditor />
  </div>
</template>

<script>
import MorphEditor from './components/MorphEditor.vue';

export default {
  name: 'App',
  components: {
    MorphEditor
  }
}
</script>

<style lang="scss">
  @import 'scss/app';
</style>

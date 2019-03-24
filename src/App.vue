<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="stylus">
    @import "./assets/css/global.styl"
    html, body, #app
        height 100%
        background-color $bg-color-main
</style>

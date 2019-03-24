<template>
    <div class="header">
        <h1>高速公路监测平台</h1>
    </div>
</template>

<script>
    export default {
        name: 'Header'
    }
</script>

<style lang="stylus" scoped>
    @import "~@/assets/css/global.styl"
    $header-height = 80px
    .header
        height $header-height
        background-color $bg-color-main
        background-image url('~@/assets/img/title.png')
        background-size 100% 100%

        h1
            font-size 35px
            text-align center
            height $header-height
            line-height $header-height
            color #fff
            font-family '华文中宋'
</style>

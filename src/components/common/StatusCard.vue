<template>
    <div class="card">
        <div class="icon"><i class="iconfont" :style="{color}">
            <slot></slot>
        </i></div>
        <div class="text">
            <p>{{ text }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StatusCard",
        props: ['text', 'color']
    }
</script>

<style lang="stylus" scoped>
    .card
        display flex
        width 300px
        height 60px

        .icon
            height 60px
            width 60px
            background-color #1043ff
            text-align center
            line-height 60px

            i
                font-size 45px

        .text
            box-sizing border-box
            margin-top 20px
            height 40px
            width 180px
            background-color #00186a
            position relative

            p
                padding-left 20px
                line-height 40px
                font-size 18px
                color #fff
                white-space nowrap
                position absolute
                z-index 1

            &:after
                content ''
                background-color #00186a
                width 29px
                height 25px
                display block
                position absolute
                left 166px
                top 8px
                transform rotate(53deg) skewX(7deg)
                z-index 0
</style>

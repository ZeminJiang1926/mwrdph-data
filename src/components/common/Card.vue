<template>
    <div class="card">
        <div class="card-content">
            <h3 class="card-title">
                <i class="iconfont">
                    <slot name="icon-code"></slot>
                </i>
                {{title}}
            </h3>
            <slot></slot>
        </div>
    </div>


</template>

<script>
    export default {
        name: "Card",
        props: ['title']
    }
</script>

<style lang="stylus" scoped>
    @import "~@/assets/css/global.styl"
    $box-title-height = 35px
    .card
        box-sizing border-box
        padding 10px
        height 100%
        color #fff

        .card-content
            box-sizing border-box
            height 100%
            border 1px solid $bg-color-second
            position relative

            .card-title
                font-family '华文中宋'
                box-sizing border-box
                height $box-title-height
                padding-left 20px
                padding-right 20px

                position absolute
                top -14px
                left calc(50% - 80px)
                z-index 999

                border-radius $box-title-height

                background-color $bg-color-second
                text-align center
                line-height $box-title-height

                &, i
                    font-size 18px

</style>

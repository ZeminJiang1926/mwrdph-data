<template>
    <div class="main">
        <m-header/>
        <div class="content">
            <div class="left">
                <detector-status/>
            </div>
            <div class="center">
                <detector-distribution/>
            </div>
            <div class="right">
                <event-list/>
            </div>
        </div>
        <div class="bottom">
            <div class="left">
                <volume-and-speed/>
            </div>
            <div class="right">
                <camera/>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '@/components/Header'
    import DetectorStatus from "@/components/middle/SystemStatusCard";
    import DetectorDistribution from "@/components/middle/PointDistributeCard";
    import EventList from "@/components/middle/IncidentListCard";
    import VolumeAndSpeed from "@/components/bottom/RealDataCard";
    import Camera from "@/components/bottom/IncidentCard";

    export default {
        name: 'Home',
        components: {
            mHeader: Header,
            DetectorStatus,
            DetectorDistribution,
            EventList,
            VolumeAndSpeed,
            Camera
        }
    }
</script>

<style lang="stylus" scoped>
    @import "~@/assets/css/global.styl"
    $mid-height = 520px
    $bottom-height = 420px

    .content
        overflow hidden
        padding-top 25px
        display flex
        justify-content space-around
        background-color $bg-color-main

        .left
            width 25%
            height $mid-height

        .center
            width 50%
            height $mid-height

        .right
            width 25%
            height $mid-height

    .bottom
        margin-top 25px
        display flex
        justify-content space-around
        background-color $bg-color-main

        .left
            width 45%
            height $bottom-height

        .right
            width 55%
            height $bottom-height

</style>

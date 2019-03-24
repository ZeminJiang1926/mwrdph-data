<template>
    <card title="监测点分布">
        <template slot="icon-code">&#xe67a;</template>
        <template is="div">
            <div class="content">
                <div class="menu">
                    <select v-model='menuSection' v-if="sectionMenu != null">
                        <option v-for="section in sectionMenu" :value="section['id']">
                            {{ section['name']}}
                        </option>
                    </select>
                    <select v-model='menuPoint' v-if="pointMenu != null">
                        <option v-for="point in pointMenu" v-if="point['section']['id']===menuSection"
                                :value="point['id']">{{ point['name'] }}
                        </option>
                    </select>
                </div>
                <el-amap :zoom="zoom"
                         :center="center"
                         :doubleClickZoom="false"
                         :mapStyle="mapStyle"
                         :resizeEnable="true"
                         :jogEnable="true"
                >
                    <el-amap-marker v-for="(point, index) in pointMenu"
                                    :position="[point.lng, point.lat]"
                                    :vid="point"
                                    :title="point.name"
                                    :events="events"
                    ></el-amap-marker>
                </el-amap>
                <div class="summary">
                    <h2>总流量：<span>{{ totalVolume }}</span> 辆</h2>
                    <h2>总事件：<span>{{ totalIncident }}</span> 起</h2>
                </div>
                <radar-card @close="closeDetailCard" v-if="this.currentDetector != null" :point="currentDetector"/>
            </div>
        </template>
    </card>
</template>

<script>
    import RadarCard from "@/components/middle/PointDetailCard";
    import IntervalManager from '@/assets/js/intervalUtils.js'
    import moment from "moment";

    function buildSectionMenu(list) {
        let map = new Map();
        list.forEach((point) => {
            map.set(point['section']['id'], {id: point['section']['id'], name: point['section']['name']});
        });
        let res = [];
        map.forEach((value) => {
            res.push(value)
        });
        return res;
    }

    export default {
        name: "PointDistributeCard",
        components: {RadarCard},
        data() {
            return {
                mapStyle: "amap://styles/ad4de1df792a059b478677b551bb807d",
                center: [118.006694, 36.811226],
                zoom: 16,
                // 二级列表联动
                menuSection: null,
                menuPoint: null,
                isSectionChange: true,
                // 列表内容
                sectionMenu: [],
                pointMenu: [],
                // 当前检测器
                currentDetector: null,
                totalVolume: 0,
                totalIncident: 0,
                interval: new IntervalManager(),
                // 事件
                events: {
                    click: (e) => {
                        this.currentDetector = e.target['Uh']['vid'];
                    }
                }
            }
        },
        watch: {
            menuSection(val) {
                let pointInfo = null;
                for (let i = 0; i < this.pointMenu.length; i++) {
                    if (this.pointMenu[i]['section']['id'] === val) {
                        pointInfo = this.pointMenu[i];
                        this.menuPoint = pointInfo['id'];
                        break;
                    }
                }
                this.zoom = 8;
                this.center = [pointInfo['section']['lng'], pointInfo['section']['lat']];
                this.isSectionChange = true;
            },
            menuPoint(val) {
                let pointInfo = null;
                for (let i = 0; i < this.pointMenu.length; i++) {
                    if (this.pointMenu[i]['id'] === val) {
                        pointInfo = this.pointMenu[i];
                        break;
                    }
                }
                this.center = [pointInfo['lng'], pointInfo['lat']]
                if (!this.isSectionChange) {
                    this.zoom = 16;
                }
                this.isSectionChange = false;
            }
        },
        methods: {
            closeDetailCard() {
                this.currentDetector = null;
            },
            fetchAndUpdatePointData() {
                this.$http.get("/v1/front_api/monitoring_points")
                    .then(resp => {
                        this.pointMenu = resp.data;
                        this.sectionMenu = buildSectionMenu(resp.data);
                        if (this.menuSection == null) {
                            this.menuSection = this.sectionMenu[0]['id'];
                            this.menuPoint = this.pointMenu[0]['id'];
                        }
                    });
            },
            fetchIncidentData() {
                return this.$http.get("/v1/front_api/incidents/total", {
                    params:
                        {
                            start: moment().utc(true).format("YYYY-MM-DD") + " 00:00:00",
                            end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss")
                        }
                })
            },
            fetchVolumeData() {
                return this.$http.get("/v1/front_api/statistic/volume/total", {
                    params: {
                        start: moment().utc(true).format("YYYY-MM-DD") + " 00:00:00",
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss")
                    }
                });
            },
            fetchAndUpdateIncidentAndVolume() {
                this.$http.all([
                    this.fetchVolumeData(),
                    this.fetchIncidentData()
                ]).then(this.$http.spread((volume, incident) => {
                    this.totalVolume = volume.data;
                    this.totalIncident = incident.data;
                }))
            }
        },
        mounted() {
            this.interval.setInterval(this.fetchAndUpdatePointData, 5 * 1000);
            this.interval.setInterval(this.fetchAndUpdateIncidentAndVolume, 5 * 1000);
        },
        beforeDestroy() {
            this.interval.clearAll();
        }
    }
</script>

<style lang="stylus" scoped>
    .content
        height 100%
        position relative

        .menu
            margin-left 4px
            margin-top 4px
            position absolute
            z-index 1
            top 0
            left 0

            select
                height 40px;
                line-height 40px;
                border none
                background-color rgba(0, 24, 106, 0.51)
                color #FFF
                font-size 16px
                padding 0 10px

        .summary
            margin 10px
            position absolute
            bottom 0
            left 0

            h2
                font-size 20px
                line-height 40px
                font-family "华文中宋"

                span
                    font-size 36px
                    color #03fde4

    >>> a.amap-logo
        display none !important
</style>

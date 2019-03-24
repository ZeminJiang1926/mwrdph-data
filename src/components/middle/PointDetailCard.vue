<template>
    <div class="radar-card">
        <!--头部-->
        <div class="header">
            <h4>{{ point.name}}</h4>
            <button @click="handleClickCloseButton"><i class="iconfont">&#xe626;</i></button>
        </div>
        <!--主体-->
        <div class="body">
            <div class="top">
                <div class="video">
                    <video-player :options="playerOptions"></video-player>
                </div>
                <div class="incident">
                    <table>
                        <thead>
                        <tr>
                            <th>类型</th>
                            <th>详情信息</th>
                            <th>上传时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="incident in data.incidents">
                            <td>{{ incident['type_name'] }}</td>
                            <td>{{ incident['info'] }}</td>
                            <td>{{ incident['timestamp'] | timeFromNow}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bottom">
                <div id="speedChart" class="chart"></div>
                <div id="volumeChart" class="chart"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import G2 from '@antv/g2';
    import moment from 'moment';
    import IntervalManger from '@/assets/js/intervalUtils';
    import { videoPlayer } from 'vue-video-player'
    import 'videojs-flash'
    import "video.js/dist/video-js.css"

    function getStartTime(arr, defaultV, unit) {
        let start;
        if (arr.length !== 0) {
            start = arr[arr.length - 1]['time'];
        } else {
            start = moment().utc(true).subtract(defaultV, unit).format("YYYY-MM-DD HH:mm:ss")
        }
        return start;
    }

    function initSpeedChart(id) {
        let chart = new G2.Chart({
            container: id,
            forceFit: true,
            height: 190,
            padding: [30, 30, 30, 30],
            animate: false
        });
        chart.axis('speed', {
            label: null,
            line: null,
            grid: false
        });
        chart.axis('index', {
            line: {
                stroke: '#b9b9b9'
            },
            label: {
                textStyle: {
                    fill: '#cdcdcd'
                }
            },
        });
        chart.source([], {
            index: {
                alias: '时间',
                type: 'timeCat',
                nice: false,
                range: [0, 1],
                mask: 'HH:mm:ss',
                tickCount: 5
            },
            speed: {
                alias: '速度',
                min: 40,
                max: 140
            }
        });
        chart.line().position('index*speed').shape('smooth').color('#29a858');
        chart.area().position('index*speed').shape('smooth').color('#29a858');
        chart.render();
        return chart;
    }

    function initVolumeChart(id) {
        let chart = new G2.Chart({
            container: id,
            forceFit: true,
            height: 190,
            padding: [30, 30, 30, 30]
        });
        chart.axis('volume', {
            label: null,
            line: null,
            grid: false
        });
        chart.axis('index', {
            line: {
                stroke: '#b9b9b9'
            },
            label: {
                textStyle: {
                    fill: '#cdcdcd'
                }
            }
        });
        chart.source([], {
            index: {
                alias: '时间',
                type: 'timeCat',
                nice: false,
                range: [0, 1],
                mask: 'HH:mm:ss',
                tickCount: 10
            },
            speed: {
                alias: '速度',
                tickInterval: 6
            }
        });
        chart.guide().text({
            content: '今日总流量 689 辆',
            top: true,
            position: ['median', 'end'],
            style: {
                fontSize: 20,
                fill: '#FFF',
                fontFamily: '华文中宋',
            }
        });
        chart.interval().position('index*volume').color('#157ee4');
        chart.render();
        return chart;
    }

    function updateHistory(aim, newData) {
        if (aim.length === 0) {
            aim.push(...newData);
        } else {
            for (let item of newData) {
                aim.push(item);
                aim.shift();
            }
        }
    }

    export default {
        name: "PointDetailCard",
        props: ['point'],
        components: {videoPlayer},
        data() {
            return {
                interval: new IntervalManger(),
                data: {
                    incidents: [],
                    speeds: [],
                    volumes: []
                },
                charts: {speed: null, volume: null},
                totalVolume: 0,
                playerOptions: {
                    live: true,
                    autoplay: true,
                    muted: true,
                    fluid: true,
                    preload: true,
                    sources: [{
                        type: "rtmp/flv",
                        src: "rtmp://132.232.23.142/stream/1"
                    }],
                    //poster:"https://note.youdao.com/yws/api/personal/file/E703507A93D6429C99D4BE33BD5065FE?method=download&shareKey=36f160197b8d031ca3ea56bfa18d4b9b",
                    techOrder:['flash'],
                    controls: false
                }

            }
        },
        methods: {
            handleClickCloseButton() {
                this.$emit("close")
            },
            fetchAndUpdateSpeedData() {
                this.$http.get("/v1/front_api/statistic/speed/" + this.point.id, {
                    params: {
                        start: getStartTime(this.data.speeds, 3, 'minute'),
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss"),
                        period: 3,
                    }
                }).then((resp) => {
                    if (resp.data.length === 0) {
                        return;
                    }
                    this.charts.speed.guide().clear();
                    this.charts.speed.guide().text({
                        content: '当前车速 ' + resp.data[resp.data.length - 1]['speed'] + ' km/h',
                        top: true,
                        position: ['median', 'end'],
                        style: {
                            fontSize: 20,
                            fill: '#FFF',
                            fontFamily: '华文中宋',
                        }
                    });
                    updateHistory(this.data.speeds, resp.data);
                    this.charts.speed.source(this.data.speeds);
                    this.charts.speed.repaint();
                })
            },
            getVolumeList() {
                return this.$http.get("/v1/front_api/statistic/volume/" + this.point.id, {
                    params: {
                        start: moment().utc(true).subtract(1, 'hour').format("YYYY-MM-DD HH:mm:ss"),
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss"),
                        period: 60 * 5,
                    }
                })
            },
            getTotalVolume() {
                return this.$http.get("/v1/front_api/statistic/volume/total/" + this.point.id, {
                    params: {
                        start: moment().utc(true).subtract(1, 'hour').format("YYYY-MM-DD") + " 00:00:00",
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss"),
                    }
                })
            },
            fetchAndUpdateVolumeData() {
                this.$http.all([
                    this.getVolumeList(),
                    this.getTotalVolume()
                ]).then(this.$http.spread((listResp, totalResp) => {
                    if (listResp.data.length === 0) {
                        return;
                    }
                    this.charts.volume.guide().clear();
                    this.charts.volume.guide().text({
                        content: '今日总流量 ' + totalResp.data + ' 辆',
                        top: true,
                        position: ['median', 'end'],
                        style: {
                            fontSize: 20,
                            fill: '#FFF',
                            fontFamily: '华文中宋',
                        }
                    });
                    this.charts.volume.source(listResp.data);
                    this.charts.volume.repaint();
                }))
            },
            fetchAndUpdateIncidentData() {
                this.$http.get("/v1/front_api/incidents/" + this.point.id, {
                    params: {
                        limit: 6,
                    }
                }).then(resp => {
                    this.data.incidents = resp.data;
                });
            }
        },
        mounted() {
            this.charts.speed = initSpeedChart('speedChart');
            this.charts.volume = initVolumeChart('volumeChart');
            this.interval.setIntervals([
                this.fetchAndUpdateSpeedData,
                this.fetchAndUpdateVolumeData,
                this.fetchAndUpdateIncidentData], 3200);
        },
        beforeDestroy() {
            this.interval.clearAll();
        }
    }
</script>

<style lang="stylus" scoped>
    @import "~@/assets/css/global.styl"
    .radar-card
        position absolute
        top 0
        left 0
        height 100%
        width 100%
        background-color #00186a
        z-index 99

        .header
            display flex
            justify-content space-between
            color white

            h4
                font-size 20px
                margin-left 10px
                margin-top 10px
                text-align center
                line-height 30px
                width 250px
                height 30px
                background-image url("~@/assets/img/box_title.png")
                background-size contain

            button
                margin-top 10px
                margin-right 10px
                width 60px
                height 30px
                background-color #0e69b3
                border none
                color #fff

                &:hover
                    background-color #0e478e

        .body
            padding 10px

            .top, .bottom
                display flex
                justify-content space-between

            .top
                .video
                    width 380px
                    height 225px

                .incident
                    width 500px

                    table
                        width 100%
                        /*background-color orange*/
                        text-align center

                        thead
                            font-size 16px
                            line-height 30px
                            border-bottom 1px solid aqua

                        tbody
                            line-height 30px

            .bottom
                display flex

                .chart
                    margin-top 20px
                    width 400px
</style>

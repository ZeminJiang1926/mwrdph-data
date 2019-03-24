<template>
    <card title="流量/车速 Top10">
        <template slot="icon-code">&#xe61d;</template>
        <div class="content">
            <div id="volumeChart"></div>
            <div id="speedChart"></div>
        </div>
    </card>
</template>
<script>
    import G2 from '@antv/g2';
    import moment from 'moment';

    export default {
        name: "RealDataCard",
        data() {
            return {
                charts: {speed: null, volume: null},
                interval: null,
            }
        },
        methods: {
            initSpeedChart(id, yField) {
                let chart = new G2.Chart({
                    container: id,
                    forceFit: true,
                    height: 190,
                    padding: [40, 20, 50, 20],
                });
                chart.scale({
                    name: {
                        type: 'cat',
                        alias: '监测点名'
                    },
                    speed: {
                        type: 'linear',
                        alias: '速度',
                        tickCount: 4
                    },
                    volume: {
                        type: 'linear',
                        alias: '流量',
                        tickCount: 4
                    }
                });
                chart.axis('speed', {
                    line: null,
                    label: null,
                    grid: false
                });
                chart.axis('volume', {
                    line: null,
                    label: null,
                    grid: false
                });
                chart.axis('name', {
                    label: {
                        textStyle: {
                            fill: '#b9b9b9'
                        }
                    },
                    grid: false
                });
                chart.interval().position('name*' + yField).label(yField, {
                    offset: 8,
                    textStyle: {
                        fill: '#FFF'
                    }
                });
                chart.render();
                return chart;
            },
            fetchAndUpdateData() {
                this.$http.get('/v1/front_api/statistic/top', {
                    params: {
                        start: moment().utc(true).format('YYYY-MM-DD') + " 00:00:00",
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss"),
                        by: 'volume',
                        limit: 10
                    }
                }).then((resp) => {
                    this.charts.volume.changeData(resp.data);
                });

                this.$http.get('/v1/front_api/statistic/top', {
                    params: {
                        start: moment().format('YYYY-MM-DD') + " 00:00:00",
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss"),
                        by: 'speed',
                        limit: 10
                    }
                }).then((resp) => {
                    this.charts.speed.changeData(resp.data);
                });
            }
        },
        mounted() {
            this.charts.volume = this.initSpeedChart('volumeChart', 'volume');
            this.charts.speed = this.initSpeedChart('speedChart', 'speed');
            this.fetchAndUpdateData();
            setInterval(this.fetchAndUpdateData, 5 * 1000);
        },
        beforeDestroy() {
            clearInterval(this.interval);
        }
    }
</script>

<style lang="stylus" scoped>
    @import "~@/assets/css/global.styl"
    .content
        width 100%
        height 100%
</style>

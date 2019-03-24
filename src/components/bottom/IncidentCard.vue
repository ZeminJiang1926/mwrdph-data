<template>
    <card title="事件展示">
        <template slot="icon-code">&#xe615;</template>
        <template>
            <div class="content">
                <div id="type">
                </div>
            </div>
        </template>
    </card>
</template>

<script>
    import G2 from '@antv/g2';
    import DataSet from '@antv/data-set/';
    import moment from 'moment';

    const typeName = {
        low_speed: '低速',
        speeding: '超速',
        retrograde: '逆行',
        occupy_emergency_lane: '占用应急车道'
    };

    export default {
        name: "IncidentCard",
        data() {
            return {
                chart: null,
                incidents: [],
                interval: null
            }
        },
        methods: {
            initSpeedChart() {
                this.chart = new G2.Chart({
                    container: 'type',
                    forceFit: true,
                    height: 380,
                    padding: [60, 60, 80, 60]
                });
                this.chart.axis('number', {
                    label: {
                        textStyle: {
                            fill: '#b9b9b9'
                        }
                    },
                    grid: false,
                });
                this.chart.axis('name', {
                    label: {
                        textStyle: {
                            fill: '#b9b9b9'
                        }
                    }
                })
                this.chart.intervalStack().position('name*number').color('incident');
                this.chart.render();
            },
            fetchAndUpdateSystemStatusData() {
                this.$http.get("/v1/front_api/incidents/top", {
                    params: {
                        start: moment().utc(true).format('YYYY-MM-DD') + " 00:00:00",
                        end: moment().utc(true).format("YYYY-MM-DD HH:mm:ss"),
                        limit: 10
                    }
                }).then((resp) => {
                    let ds = new DataSet();
                    let dv = ds.createView().source(resp.data);
                    dv.transform({
                        type: 'fold',
                        fields: ['low_speed', 'speeding', 'retrograde', 'occupy_emergency_lane'], // 展开字段集
                        key: 'incident',
                        value: 'number'
                    });
                    dv.transform({
                        type: 'map',
                        callback(row) {
                            row.incident = typeName[row['incident']]
                            return row
                        }
                    })
                    this.chart.changeData(dv)
                })
            }
        },
        mounted() {
            this.initSpeedChart();
            this.fetchAndUpdateSystemStatusData();
            this.interval = setInterval(this.fetchAndUpdateSystemStatusData, 5 * 1000);
        },
        beforeDestroy() {
            clearInterval(this.interval);
        }
    }
</script>

<style lang="stylus" scoped>
    .content
        overflow hidden
</style>

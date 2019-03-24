<template>
    <card title="平台概况">
        <template slot="icon-code">&#xe620;</template>
        <template>
            <div class="content">
                <div id="chart1"></div>
                <div id="chart2"></div>
            </div>
        </template>
    </card>
</template>

<script>
    import G2 from '@antv/g2';
    import StatusCard from "@/components/common/StatusCard";
    import IntervalManager from '@/assets/js/intervalUtils';

    G2.Shape.registerShape('point', 'pointer', {
        drawShape(cfg, group) {
            let point = cfg.points[0];
            let center = this.parsePoint({
                x: 0,
                y: 0
            });
            let target = this.parsePoint({
                x: point.x,
                y: 0.80
            });
            let dir_vec = {
                x: center.x - target.x,
                y: center.y - target.y
            };
            //normalize
            let length = Math.sqrt(dir_vec.x * dir_vec.x + dir_vec.y * dir_vec.y);
            dir_vec.x *= 1 / length;
            dir_vec.y *= 1 / length;
            //rotate dir_vector by -90 and scale
            let angle1 = -Math.PI / 2;
            let x_1 = Math.cos(angle1) * dir_vec.x - Math.sin(angle1) * dir_vec.y;
            let y_1 = Math.sin(angle1) * dir_vec.x + Math.cos(angle1) * dir_vec.y;
            //rotate dir_vector by 90 and scale
            let angle2 = Math.PI / 2;
            let x_2 = Math.cos(angle2) * dir_vec.x - Math.sin(angle2) * dir_vec.y;
            let y_2 = Math.sin(angle2) * dir_vec.x + Math.cos(angle2) * dir_vec.y;
            //polygon vertex
            let path = [['M', target.x + x_1 * 1, target.y + y_1 * 1], ['L', center.x + x_1 * 3, center.y + y_1 * 3], ['L', center.x + x_2 * 3, center.y + y_2 * 3], ['L', target.x + x_2 * 1, target.y + y_2 * 1], ['Z']];
            let tick = group.addShape('path', {
                attrs: {
                    path: path,
                    fill: cfg.color
                }
            });
            return tick;
        }
    });

    /**
     * 刷新仪表盘文字信息
     * @param chart 仪表
     * @param alive 活动量
     * @param total 总量
     * @param title 标题
     */
    function refreshGuidInfo(chart, alive, total, title) {
        let ratio = alive / total;
        chart.guide().clear();
        // 绘制仪表盘背景
        chart.guide().arc({
            zIndex: 0,
            top: false,
            start: [0, 0.965],
            end: [1, 0.965],
            style: { // 底灰色
                stroke: '#CBCBCB',
                lineWidth: 20
            }
        });
        // 绘制指标
        chart.guide().arc({
            zIndex: 1,
            start: [0, 0.965],
            end: [ratio, 0.965],
            style: {
                stroke: '#1e87ec',
                lineWidth: 20
            }
        });
        // 绘制指标数字
        let text = `${title} ${alive}/${total}`;
        chart.guide().html({
            position: ['50%', '95%'],
            html: `<div style="width: 300px;text-align: center;">
                       <p style="font-size: 25px;color: #FFF;margin-top: 10px;"> ${Math.round(ratio * 100)}%</p>
                       <p style="font-size: 18px; color: #dddddd;margin-top: 10px">${text}</p>
                    </div>`
        });
        chart.changeData([{value: ratio}]);
    };

    /**
     * 初始化仪表数据
     * @param id 容器id
     * @returns {G2.Chart}
     */
    function initChart(id) {
        let chart = new G2.Chart({
            container: id,
            forceFit: true,
            height: 240,
            padding: [10, 0, 30, 0],
            animate: false
        });
        chart.source([{value: 0}]);
        chart.coord('polar', {
            startAngle: -9 / 8 * Math.PI,
            endAngle: 1 / 8 * Math.PI,
            radius: 0.75
        });
        chart.scale('value', {
            alias: '上线率',
            type: 'linear',
            min: 0,
            max: 1,
            tickInterval: 0.2
        });
        chart.axis('1', false);
        chart.axis('value', {
            zIndex: 2,
            line: null,
            label: {
                offset: -20,
                formatter: (val) => val * 100,
                textStyle: {
                    fontSize: 18,
                    textAlign: 'center',
                    fill: '#adadad'
                }
            }
        });
        chart.legend(false);
        chart.point().position('value*1').shape('pointer').color('#d8d8d8').active(false);
        chart.render();
        return chart;
    }


    export default {
        name: 'SystemStatusCard',
        components: {StatusCard},
        data() {
            return {
                status: {},
                interval: new IntervalManager(),
                charts: {radar: null, camera: null}
            }
        },
        methods: {
            fetchAndUpdateSystemStatusData() {
                this.$http.get("/v1/front_api/system/status")
                    .then(resp => {
                        this.status = resp.data;
                    });
            }
        },
        watch: {
            status() {
                refreshGuidInfo(this.charts.radar, this.status['radar_alive_total'], this.status['radar_total'], '雷达上线');
                refreshGuidInfo(this.charts.camera, this.status['camera_alive_total'], this.status['camera_total'], '摄像头上线');
            }
        },
        mounted() {
            this.charts.radar = initChart('chart1');
            this.charts.camera = initChart('chart2');
            this.interval.setInterval(this.fetchAndUpdateSystemStatusData, 5 * 1000)
        },
        beforeDestroy() {
            this.interval.clearAll();
        }
    }
</script>

<style lang="stylus" scoped>
    .content-item
        margin 25px auto
</style>

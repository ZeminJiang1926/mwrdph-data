<template>
    <card title="最新事件">
        <template slot="icon-code">&#xe61b;</template>
        <template>
            <table>
                <thead>
                <tr>
                    <th>类型</th>
                    <th>位置</th>
                    <th>上传时间</th>
                </tr>
                </thead>
                <transition-group tag="tbody" class="animated fadeIn">
                    <tr v-for="incident in incidents" :key="incident['id']">
                        <td>{{ incident['type_name'] }}</td>
                        <td>{{ incident['info'] }}</td>
                        <td>{{ incident['timestamp'] | timeFromNow }}</td>
                    </tr>
                </transition-group>
            </table>
        </template>
    </card>
</template>

<script>
    export default {
        name: "IncidentListCard",
        data() {
            return {
                incidents: [],
                interval: null
            }
        },
        methods: {
            fetchAndSetData() {
                this.$http.get("/v1/front_api/incidents", {params: {limit: 11}})
                    .then(resp => {
                        this.incidents = resp.data;
                    });
            }
        },
        mounted() {
            this.fetchAndSetData();
            this.interval = setInterval(this.fetchAndSetData, 10000);
        },
        beforeDestroy() {
            clearInterval(this.interval);
        }
    };
</script>

<style lang="stylus" scoped>
    table
        width 100%
        text-align center
        font-size 16px
        height 40px
        line-height 40px

        thead th
            background-color rgba(8, 31, 122, 0.4)
            padding-top 15px

        tbody tr
            color #fff

            &:hover
                background-color #00186a
</style>

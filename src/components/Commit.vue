<template>
  <el-row style="margin-bottom: 20px">
    <el-col :span="18">
      <p style="color: gray">
        Attention: all time terms are based on <span style="font-weight: bold">UTC+0</span>.
      </p>
    </el-col>
    <el-col :span="6">
      <el-button @click="handleClickChangeSmooth" type="primary">Change Smooth</el-button>
    </el-col>
  </el-row>

  <div style="display: flex;justify-content: center">
    <div id="hour"
         style="width: 85%;height:350px;display: flex;justify-content: center"/>
  </div>
  <el-divider style="margin: 0 0 30px 0"/>
  <div style="display: flex;justify-content: center">
    <div id="weekday"
         style="width: 85%;height:350px;display: flex;justify-content: center"/>
  </div>
  <el-divider style="margin: 0 0 30px 0"/>
  <div style="display: flex;justify-content: center">
    <div id="month"
         style="width: 85%;height:350px;display: flex;justify-content: center"/>
  </div>
</template>

<script>
import axios from 'axios';
import {useStore} from "vuex";
import {onBeforeUnmount, onMounted, reactive} from "vue";
import * as echarts from 'echarts';

export default {
  name: "Commit",
  setup() {
    const store = useStore()
    const distribution = reactive({
      hour: [],
      month: [],
      weekday: [],
    })
    let is_smooth = false
    let repo_name = store.state.repo_name
    let timer = null

    function refresh() {
      axios.get(`http://localhost:8080/api/commits/distributions?repoName=${repo_name}`)
          .then(response => {
            const data = response.data
            distribution.hour = data.hour
            distribution.month = data.month
            distribution.weekday = data.weekday

            const hour_x = [
              '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
              '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
              '12:00', '13:00', '13:00', '15:00', '16:00', '17:00',
              '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',]
            const weekday_x = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            const month_x = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const ids = ['hour', 'weekday', 'month']
            const titles = ['Hour Analysis', 'Weekday Analysis', 'Month Analysis']
            draw_chart(ids[0], hour_x, distribution.hour, titles[0])
            draw_chart(ids[1], weekday_x, distribution.weekday, titles[1])
            draw_chart(ids[2], month_x, distribution.month, titles[2])
          })
          .catch(error => console.log(error))
    }

    function draw_chart(id, label_x, data, title) {
      const chartDom = document.getElementById(id);
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          valueFormatter: value => value + ' commits',
        },
        xAxis: [
          {
            type: 'category',
            data: label_x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data,
            type: 'line',
            smooth: is_smooth
          }
        ]
      };
      option && myChart.setOption(option);
    }

    onMounted(() => {
      refresh()
      timer = setInterval(() => {
        const new_name = store.state.repo_name
        if (new_name !== repo_name) {
          repo_name = new_name
          refresh()
        }
      }, 200)
    })

    function handleClickChangeSmooth() {
      is_smooth = !is_smooth
      refresh()
    }

    onBeforeUnmount(() => {
      clearInterval(timer)
      timer = null
    })

    return {
      handleClickChangeSmooth
    }
  }
}
</script>

<style scoped>

</style>
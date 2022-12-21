<template>
  <div style="display: flex;justify-content: center">
    <div id="count"
         style="width: 400px;height:400px;"/>
  </div>
  <el-divider style="margin: 30px 0 30px 0"/>
  <div style="display: flex;justify-content: center">
    <div id="duration"
         style="width: 85%;height:600px;"/>
  </div>
  <el-divider style="margin: 0 0 30px 0"/>
  <div style="display: flex;justify-content: center;">
    <div id="words"
         style="width: 85%;height:400px;"/>
  </div>
</template>


<script lang="ts">
import axios from 'axios';
import {useStore} from "vuex";
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import * as echarts from "echarts";
import 'echarts-wordcloud';

export default {
  name: "Issue",
  setup() {
    const store = useStore()
    let repo_name = store.state.repo_name
    const count = reactive({
      open: 0,
      closed: 0,
    })
    let durations = ref([])
    let timer = null
    let wordsFrequency = ref([])

    async function refresh() {
      await axios.get(`http://localhost:8080/api/issues/count?repoName=${repo_name}&state=open`)
          .then(response => count.open = response.data)
          .catch(error => console.log(error))
      await axios.get(`http://localhost:8080/api/issues/count?repoName=${repo_name}&state=closed`)
          .then(response => count.closed = response.data)
          .catch(error => console.log(error))
      await axios.get(`http://localhost:8080/api/issues/durations?repoName=${repo_name}`)
          .then(response => durations.value = response.data)
          .catch(error => console.log(error))
      await axios.get(`http://localhost:8080/api/words/frequency?repoName=${repo_name}`)
          .then(response => wordsFrequency.value = response.data)
          .catch(error => console.log(error))
      drawCount()
      drawDurations()
      drawWordsCloud()
    }

    function drawCount() {
      const chartDom = document.getElementById('count');
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Issue State',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          valueFormatter: value => value + ' issues'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['open', 'closed'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'log',
          }
        ],
        series: [
          {
            name: 'count',
            type: 'bar',
            barWidth: '30%',
            data: [count.open, count.closed]
          }
        ]
      };

      option && myChart.setOption(option);
    }

    function getDays(number) {
      const temp = (number / (60 * 60 * 24))
      let ans
      if (temp > 1000) {
        ans = temp.toFixed(0)
      } else if (temp > 100)
        ans = temp.toFixed(1)
      else if (temp > 1) {
        ans = temp.toFixed(2)
      } else {
        ans = temp.toFixed(4)
      }
      return ans + ' days'
    }

    function calculateVariance() {
      let arr = []
      for (let i = 0; i < durations.value.length; i++) {
        arr.push(durations.value[i] / 24 / 60 / 60)
      }
      var sum = 0;
      var s = 0;
      for (var i = 0; i < arr.length; i++) {
        sum += arr[i]
      }
      let ave = sum / arr.length;
      for (var j = 0; j < arr.length; j++) {
        s += Math.pow((ave - arr[j]), 2);
      }
      return Math.sqrt(s / arr.length).toFixed(2)
    }

    function drawDurations() {
      const data = []
      for (let i = 1; i <= durations.value.length; i++) {
        data.push([i, durations.value[i]]);
      }
      const chartDom = document.getElementById('duration');
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'Resolution Time Distribution',
          subtext: `Variance: ${calculateVariance()} days`,
          left: 'center',
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'log',
          axisLabel: {
            formatter: value => getDays(value)
          }
        },
        series: [
          {
            symbolSize: 5,
            data: data,
            type: 'scatter',
            markLine: {
              data: [
                {
                  type: 'average',
                  name: 'average value',
                  valueIndex: 1,
                  label: {
                    formatter: value => getDays(value.value)
                  }
                }, {
                  type: 'min',
                  name: 'min value',
                  valueIndex: 1,
                  label: {
                    formatter: value => value.value + ' seconds'
                  }
                }, {
                  type: 'max',
                  name: 'max value',
                  valueIndex: 1,
                  label: {
                    formatter: value => getDays(value.value)
                  }
                }
              ]
            }
          }
        ]
      };
      option && myChart.setOption(option);
    }

    function getRandomColor() {
      return 'rgb(' + [
        Math.round(Math.random() * 160),
        Math.round(Math.random() * 160),
        Math.round(Math.random() * 160)
      ].join(',') + ')';
    }

    function drawWordsCloud() {
      const data = []
      for (let i = 0; i < wordsFrequency.value.length; i++) {
        data.push({
          name: wordsFrequency.value[i].text,
          value: wordsFrequency.value[i].count,
          textStyle: {
            color: getRandomColor(),
          }
        })
      }
      const chart = echarts.init(document.getElementById('words'));
      console.log(data)
      chart.setOption({
        series: [{
          type: 'wordCloud',
          shape: 'circle', //circle cardioid diamond triangle-forward triangle
          left: 0,
          right: 0,
          top: 0,
          width: '100%',
          height: '100%',
          sizeRange: [10, 50], //word的字体大小区间，单位像素
          rotationRange: [-40, 40], //word的可旋转角度区间
          rotationStep: 5,
          gridSize: 5, //值越大，word间的距离越大，单位像素
          drawOutOfBound: false,
          shrinkToFit: false,
          layoutAnimation: true,
          data: data,
        }],
      });
    }


    onMounted(() => {
      refresh()
      timer = setInterval(() => {
        const new_repo = store.state.repo_name
        if (new_repo !== repo_name) {
          repo_name = new_repo
          refresh()
        }
      }, 200)
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
      timer = null
    })

    return {}
  }
}
</script>

<style scoped>

</style>
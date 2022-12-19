<template>
  <div style="display: flex;justify-content: center">
    <div id="overview"
         style="width: 85%;height:600px;display: flex;justify-content: center"/>
  </div>
  <el-divider style="margin: 30px 0 30px 0"/>
  <div style="display: flex;justify-content: center">
    <div id="top"
         style="width: 100%;height:600px;display: flex;justify-content: center"/>
  </div>
</template>

<script>
// 基于准备好的dom，初始化echarts实例
import {computed, onBeforeMount, onMounted} from "vue";
import * as echarts from "echarts";
import {useStore} from "vuex";
import axios from 'axios';

export default {
  name: "Developer",
  setup() {
    const store = useStore()
    let repo_name = computed(() => store.state.repo_name)

    function initializeOverview() {
      axios.get(`http://localhost:8080/api/developers/all?repoName=${repo_name.value}`)
          .then(response => {
            const developers = response.data
            let all_contributions = 0
            let developer_count = 0
            developers.forEach(developer => all_contributions += developer.contributions)
            const pre_chart_data = []
            developers.forEach(developer => {
              developer_count++
              pre_chart_data.push({
                value: developer.contributions,
                name: developer.account
              })
            })
            let others_contributions = 0.0
            const chart_data = []
            for (let i = 0; i < pre_chart_data.length; i++) {
              if (pre_chart_data[i].value / all_contributions > 0.0085) {
                chart_data.push(pre_chart_data[i])
              } else {
                others_contributions += pre_chart_data[i].value
              }
            }
            chart_data.push({value: others_contributions, name: "others"})
            drawOverview(chart_data, all_contributions, developer_count)
          })
          .catch(error => {
            console.log(error)
          })
    }

    function drawOverview(data, all_contributions, developer_count) {
      const chartDom = document.getElementById('overview');
      const myChart = echarts.init(chartDom);
      let option;
      option = {
        title: {
          text: 'Developers Overview',
          subtext: `Total ${developer_count} developers`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          valueFormatter: (value) => `${value} contributions`
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          left: 'left',
          type: 'scroll',
        },
        series: [
          {
            name: 'Developer',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      option && myChart.setOption(option);
    }

    function initializeTop() {
      axios.get(`http://localhost:8080/api/developers/top?repoName=${repo_name.value}`)
          .then(response => {
            const developers = response.data
            const accounts = []
            const contributions = []
            const avatars = []
            const homepages = []
            developers.forEach(developer => {
              accounts.push(developer.account)
              contributions.push(developer.contributions)
              avatars.push(developer.avatar)
              homepages.push(developer.homepage)
            })
            drawTop(accounts, contributions, avatars, homepages)
          })
          .catch(error => {
            console.log(error)
          })
    }

    function drawTop(accounts, contributions, avatars, homepages) {
      const chartDom = document.getElementById('top');
      const myChart = echarts.init(chartDom);
      const avatar_height = 40
      const option = {
        title: {
          text: 'Top 5 Developers',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
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
            data: accounts,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              formatter: function (value, index) {
                return `{${index}|}\n{name|${value}}`
              },
              rich: {
                name: {
                  lineHeight: 30,
                  align: 'center',
                  color: 'black',
                }
                , 0: {
                  height: avatar_height,
                  align: 'center',
                  backgroundColor: {
                    image: avatars[0]
                  }
                },
                1: {
                  height: avatar_height,
                  align: 'center',
                  backgroundColor: {
                    image: avatars[1]
                  }
                },
                2: {
                  height: avatar_height,
                  align: 'center',
                  backgroundColor: {
                    image: avatars[2]
                  }
                },
                3: {
                  height: avatar_height,
                  align: 'center',
                  backgroundColor: {
                    image: avatars[3]
                  }
                },
                4: {
                  height: avatar_height,
                  align: 'center',
                  backgroundColor: {
                    image: avatars[4]
                  }
                },
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '50%',
            data: contributions
          }
        ]
      }
      option && myChart.setOption(option);
      myChart.on('click', function (params) {
        window.open(homepages[params.dataIndex])
      })
    }

    onMounted(() => {
      initializeOverview()
      initializeTop()
    })

    return {
      repo_name,
    }
  }
}
</script>

<style scoped>

</style>
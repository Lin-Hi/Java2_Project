<template>
  <h3>{{ `${releases.times.length} releases up to now!` }}</h3>
  <el-timeline>
    <el-timeline-item v-for="(time, index) in releases.times" :timestamp="time" placement="top">
      <el-card>
        <h4>Release {{ releases.versions[index] }}</h4>
        <p v-if="index===releases.times.length-1">{{ releases.intervals[index] }} commits since creation.</p>
        <p v-else>{{ releases.intervals[index] }} commits since last release.</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import axios from 'axios';
import {useStore} from "vuex";
import {onBeforeUnmount, onMounted, reactive} from "vue";

export default {
  name: "Release",
  setup() {
    const store = useStore()
    let releases = reactive({
      times: [],
      versions: [],
      intervals: [],
    })

    let last_repo
    let timer = null


    async function refresh() {
      await axios.get(`http://localhost:8080/api/releases/all?repoName=${store.state.repo_name}`)
          .then(response => {
            const data = response.data
            const new_times = []
            const new_versions = []
            data.forEach(release => {
              new_times.push(release.releaseTime)
              new_versions.push(release.version)
            })
            releases.times = new_times
            releases.versions = new_versions
          })
          .catch(error => {
            console.log(error)
          })
      await axios.get(`http://localhost:8080/api/releases/intervals?repoName=${store.state.repo_name}`)
          .then(response => {
            releases.intervals = response.data
          })
          .catch(error => {
            console.log(error)
          })
    }

    onMounted(() => {
      refresh()
      last_repo = store.state.repo_name
      timer = setInterval(() => {
        if (last_repo !== store.state.repo_name) {
          last_repo = store.state.repo_name
          refresh()
        }
      }, 250)
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
      timer = null
    })

    return {
      releases,
    }
  }
}
</script>

<style scoped>

</style>
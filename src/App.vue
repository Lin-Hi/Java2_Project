<template>
  <el-container style="display: flex;flex-direction: column;min-height: 100%;">
    <el-header height="60px" style="background-color: black;">
      <el-row :gutter="20">
        <el-col :span="2" style="text-align: center">
          <el-image
              style="width: 50px; height: 50px;margin-top: 5px;"
              src='https://th.bing.com/th/id/OIP.5unJMCvQFXAXd-tPS1be7AHaHa?w=159&h=180&c=7&r=0&o=5&pid=1.7'
              fit="cover"
          />
        </el-col>
        <div style="
        position: absolute;
        float: right;
        right: 30px;
        margin-top: 15px;
        vertical-align: middle;
        color: white"
        >
          By Lin Yuhang, Zeng Xianqing : )
        </div>


        <el-divider direction="vertical" border-style=" solid" style="height: 50px;margin-top: 5px;"/>
        <div style="
          line-height:60px;
          vertical-align: middle;
          letter-spacing: 2px;
          font-size: 22px;
          color: white;
          margin-left: 20px;
          font-weight: bold;"
        >
          Github Repository Information Display
        </div>
      </el-row>
    </el-header>
    <!--  </el-container>-->
    <el-main style="flex: 1">
      <div style="width: 90%;position: relative;transform: translateX(5%);">
        <el-container>
          <el-header>
            <el-menu
                class="el-menu-demo"
                mode="horizontal"
                default-active="openai"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="height: 100%"
            >
              <el-menu-item index="openai" @click="change_to_openai"><h3>openai/gym</h3></el-menu-item>
              <el-menu-item index="babysor" @click="change_to_babysor"><h3>babysor/MockingBird</h3></el-menu-item>
            </el-menu>
          </el-header>
          <el-main>
            <div class="common-layout">
              <el-container>
                <el-header style="height: 70px">
                  <h3 style="margin-right: 5px;">
                    <span style="vertical-align: 22%">Statistics</span>
                    <el-icon size="30px" style="margin-left: 5px">
                      <DataAnalysis/>
                    </el-icon>
                  </h3>
                </el-header>
                <hr class="style-three" style="margin-bottom: 0">
                <el-container>

                  <el-aside width="20%">
                    <div>
                      <el-row class="tac">

                        <!--                        <el-col :span="12">-->
                        <el-menu
                            active-text-color="#ffd04b"
                            background-color="#545c64"
                            class="el-menu-vertical-demo"
                            default-active="1"
                            text-color="#fff"
                            style="width: 100%;height: 100%"
                            :router="true"
                        >
                          <!--              :router="true"-->
                          <el-menu-item index="/developer">
                            <span>Developers</span>
                          </el-menu-item>
                          <el-menu-item index="/issue">
                            <span>Issues</span>
                          </el-menu-item>
                          <el-menu-item index="/release">
                            <span>Releases</span>
                          </el-menu-item>
                          <el-menu-item index="/commit">
                            <span>Commits</span>
                          </el-menu-item>
                        </el-menu>
                        <!--              </el-col>-->
                      </el-row>
                    </div>
                  </el-aside>
                  <el-main>
                    <div>
                      <router-view/>
                    </div>
                  </el-main>
                </el-container>
              </el-container>
            </div>
          </el-main>
        </el-container>
      </div>
    </el-main>
    <!--  <el-container>-->
    <el-footer style="background-color: black;margin-top: 100px;color :white;">
      <p style="text-align: center">???????????????</p>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import {useStore} from "vuex";

export default {
  name: 'App',
  setup() {
    const store = useStore()

    return {
      change_to_babysor: () => store.dispatch('set_repo_to_babysor'),
      change_to_openai: () => store.dispatch('set_repo_to_openai'),
    }
  }
}
</script>

<style scoped>
:deep(.el-menu-item) {
  font-size: 19px;
  font-weight: 500;
  color: #dbe2ef;
}

:deep(.el-collapse-item__header) {
  font-size: 18px;
  font-weight: 700;
  color: #364f6b;
}

/*??????*/
hr.style-three {
  width: 100%;
  margin: 0 auto;
  border: 0;
  height: 5px;
  background: #333 linear-gradient(to right, #ccc, #333, #ccc);
}
</style>
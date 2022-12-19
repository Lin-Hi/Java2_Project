import {createStore} from 'vuex'
import {ref} from "vue";

//创建并暴露store
export default createStore({
    state() {
        return {
            repo_name: 'openai/gym'
        }
    },


    actions: {
        set_repo_to_openai(context) {
            context.commit('SET_REPO_TO_OPENAI')
        },
        set_repo_to_babysor(context) {
            context.commit('SET_REPO_TO_BABYSOR')
        }
    },


    mutations: {
        SET_REPO_TO_OPENAI(state) {
            state.repo_name = 'openai/gym'
        },
        SET_REPO_TO_BABYSOR(state) {
            state.repo_name = 'babysor/MockingBird'
        },
    }
})
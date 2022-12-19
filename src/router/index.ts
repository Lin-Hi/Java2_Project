import {createRouter, createWebHashHistory} from "vue-router";
import Developer from '../components/Developer.vue'
import Issue from '../components/Issue.vue'
import Release from '../components/Release.vue'
import Commit from '../components/Commit.vue'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/developer',
            component: Developer,
        }, {
            path: '/issue',
            component: Issue,
        }, {
            path: '/release',
            component: Release
        }, {
            path: '/commit',
            component: Commit
        }, {
            path: '/',
            redirect: '/developer',
        }
    ]
})
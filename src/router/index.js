import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Profile from '@/components/Profile'
import Terms from '@/components/Terms'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Main',
      component: Main,
      ref: 'main'
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/terms',
      name: 'Terms',
      component: Terms
    }
  ]
})

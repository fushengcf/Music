<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title class="text-right">
            <q-avatar>
            <img :src ="person.length!==0 ?person.profile.avatarUrl:defaultImg "  >
          </q-avatar>
          {{person.length!==0?person.profile.nickname:'未登录'}}
         <q-btn :label="person.length!==0?'退出账号':'请登录'" color="primary" @click="loginOut()"/>
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
     热门歌单
     <q-list bordered>
      <q-item clickable v-ripple v-for="item in hotlist" :key='item.id'>
        <q-item-section avatar>
          <q-avatar>
            <img :src="item.picUrl">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{item.name}}</q-item-section>
         <q-btn dense flat round icon="add" @click="right = !right" />
      </q-item>
       </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
    个人歌单
     <q-list v-if="personlist" bordered>
      <q-item clickable v-ripple v-for="item in personlist" :key='item.id'>
        <q-item-section avatar>
          <q-avatar>
            <img :src="item.al.picUrl">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{item.name}}</q-item-section>
      </q-item>
       </q-list>
    </q-drawer>
    <q-dialog
      v-model="small"
    >
      <q-card style="width: 300px;backgoundColor:white">
       <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        type="number"
        v-model="phone"
        label="Your phone *"
        hint="Name and surname"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        type="password"
        v-model="password"
        label="Your password *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
        ]"
      />
      <q-toggle v-model="accept" label="我同意用户条款" />
      <div class="text-center">
        <q-btn label="登录" type="submit" color="primary"/>
        <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import axios from 'axios'
import store from '../store'
export default {
  name: 'PageIndex',
  data () {
    return {
      small: false,
      phone: null,
      password: null,
      accept: false,
      tab: 'phone',
      left: false,
      right: false,
      token: store.fetch(),
      person: store.fetch(),
      defaultImg: 'https://cdn.quasar.dev/logo/svg/quasar-logo.svg',
      hotlist: [],
      personlist: []
    }
  },
  watch: {
    person: {
      handler: function (val, oldVal) {
        store.save(val)
      },
      deep: true
    }
  },
  methods: {
    hotList () {
      axios
        .get('http://10.7.7.31:4000/dj/hot')
        .then(response => {
          this.hotlist = response.data.djRadios
          console.log(this.hotlist)
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '你应该同意用户条款'
        })
      } else {
        this.loginPhone()
        this.small = false
      }
    },
    loginPhone () {
      let url = 'http://10.7.7.31:4000/login/cellphone?phone=' + this.phone + '&password=' + this.password
      axios
        .get(url)
        .then(response => {
          this.person = response.data
          // this.items.push(item)
          this.personalList(this.person.account.id)
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    loginOut () {
      if (this.person.length !== 0) {
        this.person = []
        axios
          .get('http://10.7.7.31:4000/logout')
          .then(response => {
            this.person = []
            this.personlist = []
            store.clear()
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Loading failed',
              icon: 'report_problem'
            })
          })
      } else {
        this.small = true
      }
    },
    personalList (id) {
      axios
        .get('http://10.7.7.31:4000/user/playlist?uid=' + id)
        .then(responseuid => {
          axios
            .get('http://10.7.7.31:4000/playlist/detail?id=' + responseuid.data.playlist[1].id)
            .then(responsemid => {
              this.personlist = responsemid.data.playlist.tracks
              console.log(this.personlist)
            })
            .catch(() => {
              this.$q.notify({
                color: 'negative',
                position: 'top',
                message: 'Loading failed',
                icon: 'report_problem'
              })
            })
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
    },
    onReset () {
      this.phone = null
      this.password = null
      this.accept = false
    }
  },
  mounted () {
    this.hotList()
    if (this.person.length !== 0) {
      this.personalList(this.person.account.id)
    }
  }
}
</script>

<template>
  <q-layout view='hHh LpR fFf'>
    <q-header elevated class='bg-primary text-white'>
      <q-toolbar>
        <q-btn dense flat round icon='menu' @click='left = !left' />

        <q-toolbar-title class='text-right'>
          <q-avatar>
            <img :src='person.length!==0 ?person.profile.avatarUrl:defaultImg ' />
          </q-avatar>
          {{person.length!==0?person.profile.nickname:'未登录'}}
          <q-btn :label="person.length!==0?'退出账号':'请登录'" color='primary' @click='loginOut()' />
        </q-toolbar-title>
        <q-btn dense flat round icon='menu' @click='right = !right' />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model='left' side='left' bordered>
      热门歌单
      <div id='q-app'>
        <div class='q-pa-md' style='max-width: 350px'>
          <q-list bordered v-for='item in hotlist' :key='item.id'>
            <q-expansion-item
              group='somegroup'
              header-class='text-primary'
              @click='hotPersonList(item.dj.userId)'
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src='item.picUrl' />
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{item.name}}</q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <div class='text-left'>
                    <q-item
                      clickable
                      v-ripple
                      v-for='selitem in hotPersonData.slice(0, 10)'
                      :key='selitem.id'
                    >
                      <q-item-section avatar>
                        <q-avatar   @click='goplay(selitem)'>
                          <img :src='selitem.al.picUrl' />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>{{selitem.name}}</q-item-section>
                      <q-btn dense flat round icon='add' @click='addtolist(selitem)' />
                    </q-item>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-separator></q-separator>
          </q-list>
        </div>
      </div>
    </q-drawer>

    <q-drawer show-if-above v-model='right' side='right' bordered>
      个人歌单
      <div id='q-app'>
        <div class='q-pa-md' style='max-width: 350px'>
          <q-list bordered v-for='item in personlist' :key='item.id'>
            <q-expansion-item
              group='somegroup'
              header-class='text-primary'
              @click='personListData(item.id)'
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src='item.coverImgUrl' />
                  </q-avatar>
                </q-item-section>
                <q-item-section>{{item.name}}</q-item-section>
              </template>
              <q-card>
                <q-card-section>
                  <div class='text-left'>
                    <q-item
                      clickable
                      v-ripple
                      v-for='item in personlistData'
                      :key='item.id'
                    >
                      <q-item-section avatar>
                        <q-avatar  @click='goplay(item)'>
                          <img :src='item.al.picUrl' />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>{{item.name}}</q-item-section>
                       <q-btn dense flat round label="—" @click='removefromlist(item)' />
                    </q-item>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-separator></q-separator>
          </q-list>
        </div>
      </div>
    </q-drawer>

    <q-dialog v-model='small'>
      <q-card style='width: 300pxbackgoundColor:white'>
        <q-form @submit='onSubmit' @reset='onReset' class='q-gutter-xs-lg' style="padding:20px">
          <q-input
            filled
            type='number'
            v-model='phone'
            label='Your phone *'
            hint='Name and surname'
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-input
            filled
            type='password'
            v-model='password'
            label='Your password *'
            lazy-rules
            :rules="[
          val => val !== null && val !== '' || 'Please type your age',
        ]"
          />
          <q-toggle v-model='accept' label='我同意用户条款' />
          <div class='text-center' style="padding:20px">
            <q-btn label='登录' type='submit' color='primary' />
            <q-btn label='重置' type='reset' color='primary' flat class='q-ml-sm' />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <div class='text-center' style='padding-top:200px'>
      <aplayer
        class='text-center'
        autoplay
        :music="{
        title: playlist[0].title,
        artist: playlist[0].author,
        src: playlist[0].url,
        pic: playlist[0].img,
        lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
        }"
        @ended="nextMusic()"
      ></aplayer>
      <q-btn color='primary' label="上一首" @click='nextMusic()' />
       <q-btn color='primary' label="下一曲" @click='nextMusic()' />
    </div>
  </q-layout>
</template>

<script>
import axios from 'axios'
import store from '../store'
import Aplayer from 'vue-aplayer'
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true
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
      person: store.fetch(),
      defaultImg: 'https://cdn.quasar.dev/logo/svg/quasar-logo.svg',
      hotlist: [],
      personlist: [],
      personlistData: [],
      hotPersonData: [],
      musicIndex: 0,
      playlist: [
        {
          title: '义勇军进行曲',
          author: '中国人民解放军军乐团',
          img: 'http://p1.music.126.net/ru3yX-LScQStq7-UpLLrtQ==/112150186048251.jpg',
          url: 'http://m8.music.126.net/20190917172941/5afee5ae8b2e6c11f376e0703fd9ce70/ymusic/1c18/c0e0/9e32/d73757706a8b44e2d0e90cbbc3029a88.mp3'
        }
      ]
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
  components: {
    Aplayer
  },
  methods: {
    hotList () {
      axios
        .get('/dj/hot')
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
      let url =
        '/login/cellphone?phone=' + this.phone + '&password=' + this.password
      axios
        .get(url)
        .then(response => {
          this.person = response.data
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
          .get('/logout')
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
        .get('/user/playlist?uid=' + id)
        .then(responseuid => {
          this.personlist = responseuid.data.playlist
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
    hotPersonList (id) {
      this.hotPersonData = []
      // let responseuid = await axios.get('/user/playlist?uid=' + id)
      // let hotpersondata = await axios.get('/playlist/detail?id=' + responseuid.data.playlist[1].id)
      // this.hotPersonData = hotpersondata.data
      axios
        .get('/user/playlist?uid=' + id)
        .then(responseuid => {
          axios
            .get(
              '/playlist/detail?id=' +
                responseuid.data.playlist[0].id +
                '&limit=10'
            )
            .then(responsemid => {
              this.hotPersonData = responsemid.data.playlist.tracks
              console.log(this.hotPersonData)
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
    personListData (id) {
      axios
        .get('/playlist/detail?id=' + id)
        .then(responsemid => {
          this.personlistData = responsemid.data.playlist.tracks
          console.log(this.personlistData)
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
    },
    goplay (item) {
      let music = { img: '', author: '', title: '', url: '' }
      music.img = item.al.picUrl
      music.author = item.ar[0].name
      music.title = item.name
      axios
        .get('/song/url?id=' + item.id)
        .then(response => {
          music.url = response.data.data[0].url
          let index = this.playlist.findIndex(
            selectItem => selectItem.url === music.url
          )
          if (index === -1) {
            this.playlist.unshift(music)
          } else {
            this.playlist.splice(index, 1)
            this.playlist.unshift(music)
          }
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
    addtolist (item) {
      console.log(item)
      if (this.person.length !== 0) {
        axios
          .get('/playlist/tracks?op=add&pid=2904796730&tracks=' + item.id)
          .then(response => {
            alert('添加成功')
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
        alert('请先登录')
      }
    },
    removefromlist (item) {
      console.log(item)
      axios
        .get('/playlist/tracks?op=del&pid=2904796730&tracks=' + item.id)
        .then(response => {
          alert('删除成功')
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
      this.personalList(this.person.account.id)
    },
    nextMusic () {
      let frist = this.playlist[0]
      this.playlist.splice(0, 1)
      this.playlist.push(frist)
      console.log(this.playlist)
    },
    propMusic () {
      let frist = this.playlist.pop()
      this.playlist.unshift(frist)
      console.log(this.playlist)
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

<template>
<q-layout view="hHh lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />
        <q-toolbar-title class='text-right'>
            <q-btn label="登录" color="primary" @click="small = true"/>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
<q-dialog
      v-model="small"
    >
      <q-card style="width: 300px;backgoundColor:white">
       <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
  <!-- <q-tab-panel name="phone">

  <p>dianhua</p> -->
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
       <!-- </q-tab-panel> -->

       <!-- <q-tab-panel name="phone">
         <p>yoxiang</p>
          </q-tab-panel> -->
      <q-toggle v-model="accept" label="我同意用户条款" />
      <div class="text-center">
        <q-btn label="登录" type="submit" color="primary"/>
        <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
    <!-- <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
      >
        <q-tab class="text-orange" name="phone" icon="phone" label="电话登录" />
        <q-tab class="text-purple" name="mails" icon="mail" label="邮箱登录" />
     </q-tabs>  -->
      </q-card>
    </q-dialog>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <!-- drawer content -->
      left
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>
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

<style>
</style>

<script>
import axios from 'axios'
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
      right: false
    }
  },
  methods: {
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
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fas fa-check-circle',
          message: 'Submitted'
        })
        console.log(this.phone + this.password)
      }
    },
    loginPhone () {
      let url = 'http://10.7.7.31:4000/login/cellphone?phone=' + this.phone + '&password=' + this.password
      axios
        .get(url)
        .then(response => {
          // this.dataList = response.data.data
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
  }
}
</script>

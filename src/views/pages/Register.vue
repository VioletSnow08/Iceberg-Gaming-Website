<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto center">
<!--              <img src="@/assets/images/pages/armaRegister.jpg" alt="register" class="mx-auto">-->
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
              <div class="px-8 pt-8 register-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Create Account</h4>
                  <p>Fill the below form to create a new account.</p>
                  <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                      <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Username" v-model="username" />
                    </div>
                  </div>
                  <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                      <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Email" v-model="email" />
                    </div>
                  </div>
                  <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                      <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label="Password" v-model="password" />
                    </div>
                  </div>
                  <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                      <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label="Confirm Password" v-model="password2" />
                    </div>
                  </div>
                  <div class="vx-row mb-6">
                    <div class="vx-col w-full">
                      <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-hash" icon-no-border label="Discord ID" v-model="discord_id" />
                    </div>
                  </div>
                  <div class="flex flex-wrap justify-between my-5">
                    <router-link to="">Need help getting your Discord ID? Click here</router-link>
                  </div>
                  <div class="vx-row">
                    <div class="vx-col w-full">
                      <vs-button @click="register" class="mr-3 mb-2">Submit</vs-button>
                      <vs-button color="warning" type="border" class="mb-2" @click="email = password = password2 = username = discord_id = ''; check4 = false;">Cancel</vs-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>


import {mapActions} from 'vuex'

export default {
  data () {
    return {
      username: '',
      email: '',
      password: '',
      password2: '',
      discord_id: ''
    }
  },
  methods: {
    ...mapActions(['registerUser']),
    register () {
      if (this.password !== this.password2) {
        alert('Passwords do not match!')
      } else {
        this.registerUser([this.username, this.email, this.password, this.discord_id])
      }
    }
  },
  components: {}
}
</script>

<style lang="scss">
.register-tabs-container {
  min-height: 517px;

  .con-tab {
    padding-bottom: 23px;
  }
  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>

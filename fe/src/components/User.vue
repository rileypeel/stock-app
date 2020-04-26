<template>
  <div class="user">
    <div class="icon" v-if="loading">
      <i class="el-icon-loading"></i>
    </div>
    <div  v-else>
      <el-container>
        <el-header>
          <h1>Account Details</h1>

        </el-header>
        <el-main>
          Date joined: {{user.date_joined}}<br>
          Email: {{user.email}}<br>
          <el-button @click="changePassword()" class="top-margin" icon="el-icon-edit">Change Password</el-button>
        </el-main>
            <el-aside>
            <h1>{{user.name}}</h1>
            <el-image
              style="width: 100px; height: 100px"
              :src="url"
              fit="contain">
            </el-image>

        <el-upload
          :file-list="files"
          action=""
          name="profile_pic"
          :show-file-list="false"
          :http-request="submitPicture"
          :auto-upload="true"
        >
          <el-button icon="el-icon-upload2">Upload new pic</el-button>

        </el-upload>
        </el-aside>
      </el-container>
    </div>
  </div>  
</template>

<script>
import userService from '../services/user.js'
export default {
  name: "User",
  data () {
    return {
      url: require('../../public/default-profile.png'),
      imageDetails: '',
      user: {},
      loading: true,
      files: []
    }
  },
  components : {
  },
  methods: {
    uploadSuccess() {
      this.$user.go()
    },
    submitPicture(file) {
      userService.postProfilePic(file['file']).then(() => {
        this.$router.go()
      })
    },
    changePassword() {
      this.$prompt('New Password', 'Change Password', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputType: 'password'
      }).then((passwordInput) => {
        userService.patchUser({password: passwordInput.value}).then((res) => {

          if(res == 201) {
            
            this.$notify({
              title: 'Success',
              message: 'You have successfully changed the password',
              type: 'success',
              duration: 2000
            });
          }
        })
      }).catch(() => {
        console.log("cancel")
      })
    }
  },
  mounted: function() {
    userService.getProfilePic().then((data) => {
      if(data) {
        this.url = '0.0.0.0:8000'.concat(data['profile_pic'])
        this.url = data
      } else {
        this.url = require('../../public/default-profile.png')
      }
    });
    userService.getUser().then((data) => {
      this.user = data;
      this.loading = false;
      
    })
  }
}
</script>

<style>
.user {
  font-weight: bold;

}

.top-margin {
  margin-top: 50px;
}


</style>
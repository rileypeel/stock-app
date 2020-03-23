<template>
  <div class="login">
    <el-row>
      <el-col :offset="9" :span="6">
        <h1>Very Cool Stock Application</h1>
        <el-form status-icon :model="userCredentials" ref='loginForm'>
          <el-form-item :rules="[{required: true, message: 'Email address is required', trigger:'blur'}, {type: 'email', message: 'please enter valid email address', trigger:['blur', 'change']}]" prop="email" label="Email">
            <el-input  v-model="userCredentials.email"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true, message: 'Password is required', trigger:'blur'}]" prop="password" label="Password">
            <el-input type="password" v-model="userCredentials.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm" class="button" type="primary">Login</el-button>
          </el-form-item>
        </el-form>
        <p>Don't have an account? Register <router-link to='/register'>here</router-link></p>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import userService from '../services/user.js';
export default {
  name: "Login",
  data () {
    return {
      userCredentials: {
        email: '',
        password: ''
      },
    }
  },
  methods: {
    submitForm() {
      this.$refs['loginForm'].validate((valid) => {
        if(valid) {
          userService.login(this.userCredentials).then((success) => {
            if(success) {
              this.$notify({
                title: 'Success',
                message: '',
                type: 'success',
                duration: 2000
              });
              this.$router.push("User");
            } else {
              this.$notify({
                title: 'Error',
                message: 'Login failed, please try again.',
                type: 'error',
                duration: 2000
              });
            }
          });         
        } else {
          this.$notify({
            title: 'Error',
            message: 'Please enter valid username and password.',
            type: 'error',
            duration: 2000
          });
        }
      });
    }
  }
}

</script>

<style>
.login {
  font-weight:bold;
}
</style>
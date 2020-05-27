<template>
  <div class="register">
    <el-row>
      <el-col :offset="9" :span="6">
        <h1>Very Cool Stock Application</h1>
        <el-form status-icon :model="userCredentials" ref='registerForm'>
          <el-form-item :rules="[{required: true, message: 'Name is required', trigger:'blur'}]" prop="name" label="Name">
            <el-input  v-model="userCredentials.name"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true, message: 'Email address is required', trigger:'blur'}, {type: 'email', message: 'please enter valid email address', trigger:['blur', 'change']}]" prop="email" label="Email">
            <el-input  v-model="userCredentials.email"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true, message: 'Password is required', trigger:'blur'}]" prop="password" label="Password">
            <el-input type="password" v-model="userCredentials.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm" class="button" type="primary">Register</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <p>Already have an account? Login <router-link to='/login'>here</router-link></p>
  </div>  
</template>

<script>
import userService from '../services/user.js'
export default {
  name: "Register",
  data () {
    return {
      userCredentials: {
        name: '',
        email: '',
        password: ''
      },
    }
  },
  methods: {
    submitForm() {
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          userService.newUser(this.userCredentials).then((success) => {
            if (success) {
              this.$notify({
                title: 'Success',
                message: 'You have successfully created an account.',
                type: 'success',
                duration: 2000
              })
              this.$router.push("Login")
            } else {
              this.$notify({
                title: 'Error',
                message: 'Account was not created, Email address may already be taken.',
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          this.$notify({
            title: 'Error',
            message: 'Please enter valid input.',
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>


<style>
.register {
	font-weight:bold;
} 
</style>
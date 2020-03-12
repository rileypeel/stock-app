<template>
  <div class="login">
    <el-row>
      <el-col offset="9" span="6">
        <h1>Very Cool Stock Application</h1>
        <el-form status-icon :model="userCredentials">
          <el-form-item :rules="[{required: true, message: 'Email address is required', trigger:'blur'}, {type: 'email', message: 'please enter valid email address', trigger:['blur', 'change']}]" prop="email" label="Email">
            <el-input  v-model="userCredentials.email"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-input type="password" v-model="userCredentials.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm" id="submit-button" type="primary" >Submit</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>

</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      userCredentials: {
        email:'',
        password:''
      },
    }
  },
  methods: {
    submitForm() {
    	// not sure what to do here 
    }  	
  }
}

</script>

<style>
.login {
  font-weight: bold;
}
#submit-button{
	border-radius:30px;
	background-color:rgba(37,33,83,.6);
	border-color:rgba(37,33,83,.6);
}

</style>
<template>
  <div class="slider">
    <div class="block">
        <span >Show data from: </span>
        <el-date-picker
          v-model="date"
          type="datetime"
          placeholder="Pick a date and time"
          :picker-options="pickerOptions"
          @change="updateDate"
          default="2020-01-01">
        </el-date-picker>
      </div>
  </div>
</template>

<script>
import Cfg from '../../services/cfg'
import View from '../../services/view/view'

export default {
  name: 'DatePicker',
  data() {
    var cfg = Cfg()
    var view = View()
    return {
      cfg,
      view,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },

        shortcuts: [{
          text: '30 minutes',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 1800 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '1 hour',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '1 day',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '5 days',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 5);
            picker.$emit('pick', date);
          }
        }, {
          text: '1 month',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', date);
          }
        }, {
          text: '6 month',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', date);
          }  
        }, {
          text: '1 year',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', date);
          }  
        }, {
          text: '5 year',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 365 * 5);
            picker.$emit('pick', date);
          }  
        }]
      },
      date: new Date("2020-01-01")
    }
  },
  methods: {
    // TODO(kieran) Change these so they don't call view update directly
    updateDate() { //RILEY be careful here if < hourly data is selected
      this.cfg.startDate = this.date ? this.parseDate() : '2020-01-01-0-0-0'
      this.view.update()

    },

    parseDate() {
      return `${this.date.getFullYear()}-${this.date.getMonth()+1}-${this.date.getDate()}-${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}`
    }
  
  }
}
</script>

<style>

</style>
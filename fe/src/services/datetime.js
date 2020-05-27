
import { OFFSETS } from '../constants/view.js'

const timeService = {

  lastMarketOpen() {
    var date = new Date()
    if (date.getDay() == 0 || date.getDay() == 6) {
      var offset = date.getDay() == 0 ? 2 : 1  
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset, 13, 0, 0)
    } else {
      if (date.getHours() < 4 || date.getHours() > 14 || (date.getHours() == 14 && date.getMinutes > 29)) {
        if (date.getHours() < 4) {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate()-1, 13, 0, 0)
        } else {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0, 0)
        }
      } 
    }
    return date
  },
  getStartDate(timeframe) {
    var ret_val = Math.round(new Date(this.lastMarketOpen().getTime() - OFFSETS[timeframe] * 1000).getTime()/1000)
    return ret_val
  }
}

export default timeService
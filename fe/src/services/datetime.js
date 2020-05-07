
import { OFFSETS } from '../constants/view.js'

const timeService = {

  lastMarketOpen() {
    var date = new Date()
    if(date.getDay() == 0 || date.getDay() == 6) {
      var offset = date.getDay() == 0 ? 2 : 1  
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - offset, 16, 30, 0)
    } else {
      if(date.getHours() < 4 || date.getHours() > 14 || (date.getHours() == 14 && date.getMinutes > 29)) {
        if(date.getHours() < 4) {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate()-1, 16, 30, 0)
        } else {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 30, 0)
        }
      } 
    }
    return date
  },
  getStartDate(timeframe) {
    return Math.round(new Date(this.lastMarketOpen().getTime() - OFFSETS[timeframe] * 1000).getTime()/1000)
  }
}

export default timeService
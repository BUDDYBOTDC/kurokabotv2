const findFirstUtil = require("../utils/findFirstUtil")

const parseTime = async (time) => {

    const utilsTime = [{
        letter: "y", 
        value: 32140800000,
        text: "year"
      }, {
        letter: "M", 
        value: 2678400000,
        text: "month"
      }, {
        letter: "w", 
        value: 604800000, 
        text: "week"
      }, {
        letter: "d", 
        value: 86400000,
        text: "day"
      }, {
        letter: "h", 
        value: 3600000,
        text: "hour",
        maxValue: 24
      }, {
        letter: "m", 
        value: 60000,
        text: "minute",
        maxValue: 60
      }, {
        letter: "s", 
        value: 1000,
        text: "second",
        maxValue: 60
    }]
    
    let text = []
    
    let usedLetters = []
    
    let values = []
    
    let ms = 0
    
    for (const t of utilsTime) {
      let find = await findFirstUtil(time, usedLetters)
      
      if (find.message) {
        return {
          message: find.message
        }
      } else {
        usedLetters = find.usedLetters
        
        if (find.code === 404) {
          
        } else {
          time = time.replace(find.value + find.util.letter, "")
          ms += (find.util.value * find.number)
          if (find.number === 1) {
            find.util.text = `${find.value} ${find.util.text}`
          } else {
            find.util.text = `${find.value} ${find.util.text}s`
          }
          
          values.push(find.util)
        }
      }
    }
    
    for (const value of values.sort((x, y) => y.value - x.value)) {
      text.push(value.text)
    }
    
    return {
      text: text.join(" "), 
      ms: ms
    }
  }

module.exports = parseTime
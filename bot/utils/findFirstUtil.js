
const findFirstUtil = async (time, usedLetters) => {
  
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
    
    let y = utilsTime.length
    
    for (const t of utilsTime) {
      
      let d = time.split(t.letter)[0]
      
      if (!d) return {
        code: 404
      }
      
      let n = Number(d)
      
      if (t.maxValue && n > t.maxValue) {
        return {
          message: `❌ ${t.text}s can't be longer than ${t.maxValue}`
        }
      }
      
      if (!isNaN(n)) {
        if (usedLetters.includes(t.letter)) return {
          message: `❌ Could not parse ${time}.`
        }
        
        usedLetters.push(t.letter)

        return {
          util: t,
          number: n, 
          value: d, 
          usedLetters: usedLetters
        }
      } else {
        y--
          
        if (y === 0) {
          return {
            message: `❌ Could not parse ${time}.`
          }
        }
      }
    }
  }

module.exports = findFirstUtil
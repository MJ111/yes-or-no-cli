const chalk = require('chalk')
const DraftLog = require('draftlog')
const readline = require('readline')
const https = require('https')

DraftLog(console)
DraftLog.defaults.canReWrite = false

const bannerStr = ' YES OR NO? YES OR NO? YES OR NO? YES OR NO?'.split('')

console.log()
console.log(chalk.dim('*'.repeat(bannerStr.length)))
const update = console.draft()
console.log(chalk.dim('*'.repeat(bannerStr.length)))
console.log()

setInterval(function () {
  bannerStr.push(bannerStr.shift())
  update(chalk.yellow(bannerStr.join('')))
}, 100)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

askQuestion()

function askQuestion () {
  console.log(chalk.cyan('What do you want to ask?'))
  rl.prompt()
}

rl.on('line', (line) => {
  if (line.trim()) {
    https.get('https://yesno.wtf/api', (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const jsonResp = JSON.parse(data)
          loadingLog(jsonResp.answer, askQuestion)
        } catch (e) {
          console.error(e.message)
        }
      });
    })
  } else {
    askQuestion()
  }
}).on('close', () => {
  console.log(chalk.red('Have a great day!'))
  process.exit(0)
})

function loadingLog (answer, callback) {
  let frame = 0
  const frames = ['-', '\\', '|', '/']
  function Loading (text) {
    frame = (frame + 1) % frames.length
    return `${chalk.blue(frames[frame])} ${chalk.yellow(text)} ${chalk.blue(frames[frame])}`
  }

  console.log()
  console.log()
  const updateLoading = console.draft()

  const loadingInterval = setInterval(function () {
    updateLoading(Loading('Calculating your question...'))
  }, 100)

  const steps = ['calling to my friends..', 'searching to google..', 'reading books..', 'almost done..', 'ok, got it!']
  const stepsInterval = setInterval(function () {
    console.log(' > ' + chalk.cyan(steps.shift()))

    if (steps.length <= 0) {
      console.log()
      console.log()
      console.log(`*** ${chalk.red(answer.toUpperCase()+'!')} ***\n`)
      clearInterval(loadingInterval)
      clearInterval(stepsInterval)
      callback()
    }
  }, 1000)
}

const {Command} = require('@oclif/command')
const {summarize} = require('../spotify-transact')

class SummarizeCommand extends Command {
  async run() {
    summarize().then(logResults => {
      logResults.forEach(item => {
        this.log(item)
      })
    })
  }
}

SummarizeCommand.description = 'Prints out a summary of your gauntlet.'

module.exports = SummarizeCommand

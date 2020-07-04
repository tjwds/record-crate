const {Command} = require('@oclif/command')
const {
  elvisTest,
} = require('../spotify-transact')

class MoveCommand extends Command {
  async run() {
    elvisTest()
  }
}

MoveCommand.description = 'Uses the spotify-web-api-node example to make sure your credentials work.  Doesn\'t step on your blue suede shoes.'

module.exports = MoveCommand

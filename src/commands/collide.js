const {Command} = require('@oclif/command')
const {
  gauntletIds,
  playlistCollider,
} = require('../spotify-transact')

class CollideCommand extends Command {
  async run() {
    const collision = await playlistCollider(gauntletIds)
    const collisionKeys = Object.keys(collision)
    if (collisionKeys.length) {
      collisionKeys.forEach(key => {
        const item = collision[key]
        // eslint-disable-next-line no-irregular-whitespace
        this.log(`${item.artist} — ${item.name} appears on:`)
        item.playlists.forEach(playlist => {
          this.log(playlist.owner, playlist.name)
        })
        this.log('')
      })
    } else {
      this.log('No collisions to report!')
    }
  }
}

CollideCommand.description = 'Displays duplicates which exist across playlists.'

module.exports = CollideCommand

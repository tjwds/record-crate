const {Command, flags} = require('@oclif/command')
const {
  addTracksToPlaylist,
  gauntletIds,
  getPlaylistTracksWithOffset,
  processPlaylistTracksResponse,
  removeTracksFromPlaylist,
} = require('../spotify-transact')

class MoveCommand extends Command {
  async run() {
    const {flags} = this.parse(MoveCommand)
    const from = Number(flags.from)
    const to = Number(flags.to)
    const album = Number(flags.album)
    if (!(from > -1) || !(to > -1) || !(album > -1)) {
      this.error('We need a from and to location, as well as an album number')
    }
    const fromBody = await getPlaylistTracksWithOffset(gauntletIds[from])
    const albumSummaries = await processPlaylistTracksResponse(fromBody)
    const albumSummary = albumSummaries[album]
    const tracks = albumSummary.tracks
    // eslint-disable-next-line no-irregular-whitespace
    this.log(`Moving ${albumSummary.artist} — ${albumSummary.title} to playlist ${to}`)
    if (flags.really) {
      addTracksToPlaylist(gauntletIds[to], tracks)
      removeTracksFromPlaylist(gauntletIds[from], tracks)
    } else {
      this.log('If that looks right, try again with --really.')
    }
  }
}

MoveCommand.description = 'Move an album between playlists.'

MoveCommand.flags = {
  really: flags.boolean({char: 'r', description: 'really do it'}),
  from: flags.string({}),
  to: flags.string({}),
  album: flags.string({}),
}

module.exports = MoveCommand

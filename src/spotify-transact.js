/* eslint-disable no-console */
// eslint-disable-next-line import/extensions
const SpotifyWebApi = require('spotify-web-api-node')
const {CREDENTIALS, gauntletIds} = require('./credentials.js')

const api = new SpotifyWebApi(CREDENTIALS)

// TODO:  this isn't great.
const outputLog = []

const getPlaylistTracksWithOffset = async (playlistId, items, offset) => {
  const responseBody = await api.getPlaylistTracks(playlistId, {
    offset: offset || 0,
  }).catch(error => {
    console.log(error)
  })
  const nextItems = items ? [
    ...items,
    ...responseBody.body.items,
  ] :
    responseBody.body.items
  responseBody.body.items = nextItems
  if (responseBody.body.next) {
    return getPlaylistTracksWithOffset(
      playlistId,
      nextItems,
      offset ? offset + 100 : 100,
    )
  }
  return responseBody
}

const processPlaylistTracksResponse = data => {
  const albums = {}
  const albumSummaries = []
  const {items} = data.body
  items.forEach(item => {
    const {album} = item.track
    if (!(typeof albums[album.id] === 'number')) {
      albums[album.id] = albumSummaries.length
      albumSummaries.push({
        artist: album.artists[0].name, // TODO:  multiple artists
        title: album.name,
        tracks: [],
      })
    }
    // albums[album.id] is the index of the album in albumSumamries; push uri
    // to its track list
    albumSummaries[albums[album.id]].tracks.push(item.track.uri)
  })
  return albumSummaries
}

const generateHumanOutput = (albumSummaries, playlistIndex) => {
  if (albumSummaries.length) {
    outputLog.push(`Playlist ${playlistIndex} includes the following items:`)
    outputLog.push('-------------')
    outputLog.push(' ')
    albumSummaries.forEach((albumSummary, index) => {
      // eslint-disable-next-line no-irregular-whitespace
      outputLog.push(`${index}. ${albumSummary.artist} — ${albumSummary.title}`)
    })
    outputLog.push(' ')
  } else {
    outputLog.push(`No songs in playlist ${playlistIndex}.`)
    outputLog.push('-------------')
    outputLog.push(' ')
  }
}

const summarize = async () => {
  return Promise.all(gauntletIds.map(
    async gauntletId => getPlaylistTracksWithOffset(gauntletId),
  )).then(playlistTracksBodies => {
    playlistTracksBodies.forEach((playlistTracksBody, playlistIndex) => {
      const albumSummaries = processPlaylistTracksResponse(playlistTracksBody)
      generateHumanOutput(albumSummaries, playlistIndex)
    })

    return outputLog
  }).catch(error => {
    outputLog.push('uh-oh!', error)
  })
}

const elvisTest = () => {
  api.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
  .then(function (data) {
    console.log('Artist albums', data.body)
  }, function (err) {
    console.error(err)
  })
}

const addTracksToPlaylist = async (playlist, tracks) => {
  api.addTracksToPlaylist(playlist, tracks)
}

const removeTracksFromPlaylist = async (playlist, tracks) => {
  // ewwww.
  const removeTracks = tracks.map(track => ({uri: track}))
  api.removeTracksFromPlaylist(playlist, removeTracks).catch(error => {
    console.log(error)
  })
}

module.exports = {
  addTracksToPlaylist,
  elvisTest,
  gauntletIds,
  getPlaylistTracksWithOffset,
  processPlaylistTracksResponse,
  removeTracksFromPlaylist,
  summarize,
}

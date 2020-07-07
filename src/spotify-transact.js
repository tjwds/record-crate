/* eslint-disable no-console */
// eslint-disable-next-line import/extensions
const SpotifyWebApi = require('spotify-web-api-node')
const fs = require('fs')
const path = require('path')
let {CREDENTIALS, gauntletIds} = require('./credentials.js')

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
  const playlistInfo = await api.getPlaylist(playlistId)
  responseBody.playlistInformation = {
    name: playlistInfo.body.name,
    owner: playlistInfo.body.owner.id,
    playlistId,
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

const playlistCollider = async playlistIds => {
  const allTracks = {}
  const duplicateTracks = {}

  return Promise.all(playlistIds.map(playlist =>
    getPlaylistTracksWithOffset(playlist)
  )).then(playlistBodies => {
    playlistBodies.forEach(playlistBody => {
      playlistBody.body.items.forEach(trackBody => {
        const track = trackBody.track
        if (allTracks[track.id]) {
          if (duplicateTracks[track.id]) {
            // just append the playlist to the list of playlists
            duplicateTracks[track.id].playlists.push(
              playlistBody.playlistInformation,
            )
          } else {
            duplicateTracks[track.id] = {
              name: track.name,
              artist: track.album.artists[0].name, // TODO:  multiple artists
              playlists: [
                ...allTracks[track.id],
                playlistBody.playlistInformation,
              ],
            }
          }
        } else {
          allTracks[track.id] = [playlistBody.playlistInformation]
        }
      })
    })
    return duplicateTracks
  })
}

const refreshToken = async () => {
  const nextTime = new Date()
  nextTime.setHours(nextTime.getHours() - 1)
  if (!CREDENTIALS.nextTime || nextTime < CREDENTIALS.nextTime) {
    const refreshBody = await api.refreshAccessToken()
    const accessToken = refreshBody.body.access_token
    CREDENTIALS = {
      ...CREDENTIALS,
      accessToken,
      nextTime: new Date(),
    }
    // write to credentials file
    fs.writeFileSync(
      path.join(__dirname, '../credentials.js'),
      `const CREDENTIALS = ${JSON.stringify(CREDENTIALS)}
const gauntletIds = ${JSON.stringify(gauntletIds)}

module.exports = {CREDENTIALS, gauntletIds}
`
    )
  }
}

// TODO:  playEligibleGauntletAlbum
// TODO:  "get ready to advance this one" command
// TODO:  …or, auto-advance mode!!

module.exports = {
  addTracksToPlaylist,
  elvisTest,
  gauntletIds,
  getPlaylistTracksWithOffset,
  playlistCollider,
  processPlaylistTracksResponse,
  refreshToken,
  removeTracksFromPlaylist,
  summarize,
}

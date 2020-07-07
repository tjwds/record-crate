const {Command, flags} = require('@oclif/command')
const SpotifyWebApi = require('spotify-web-api-node')
const open = require('open')
const {cli} = require('cli-ux')
const fs = require('fs')
const path = require('path')
let {CREDENTIALS, gauntletIds} = require('../credentials')
const {refreshToken} = require('../spotify-transact')

const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
]

class AuthorizeCommand extends Command {
  async run() {
    const {flags} = this.parse(AuthorizeCommand)
    // open the browser with the API route
    const api = new SpotifyWebApi(CREDENTIALS)

    if (flags.refresh) {
      await refreshToken()
    } else {
      const authURL = api.createAuthorizeURL(SCOPES, 'cli-scoping')
      open(authURL)
      const tokenCode = await cli.prompt(`Please authorize the application for your Spotify account.

This will redirect you to joewoods.dev, with a "code" in the query parameters.  Please input that code`)

      const grantBody = await api.authorizationCodeGrant(tokenCode)
      const accessToken = grantBody.body.access_token
      const refreshAccessToken = grantBody.body.refresh_token

      CREDENTIALS = {
        ...CREDENTIALS,
        accessToken,
        refreshToken: refreshAccessToken,
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

    this.log('🕺🏻 great job.')
  }
}

AuthorizeCommand.description = 'Authorize an account with the CLI.'

AuthorizeCommand.flags = {
  refresh: flags.boolean({char: 'r', description: 'Refresh an existing access token'}),
}

module.exports = AuthorizeCommand

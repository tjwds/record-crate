record-crate
============

move albums around spotify playlists

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/record-crate.svg)](https://npmjs.org/package/record-crate)
[![Downloads/week](https://img.shields.io/npm/dw/record-crate.svg)](https://npmjs.org/package/record-crate)
[![License](https://img.shields.io/npm/l/record-crate.svg)](https://github.com/tjwds/record-crate/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g record-crate
$ record-crate COMMAND
running command...
$ record-crate (-v|--version|version)
record-crate/1.0.0 darwin-x64 node-v14.4.0
$ record-crate --help [COMMAND]
USAGE
  $ record-crate COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`record-crate authorize`](#record-crate-authorize)
* [`record-crate collide`](#record-crate-collide)
* [`record-crate elvis-test`](#record-crate-elvis-test)
* [`record-crate help [COMMAND]`](#record-crate-help-command)
* [`record-crate move`](#record-crate-move)
* [`record-crate summarize`](#record-crate-summarize)

## `record-crate authorize`

Authorize an account with the CLI.

```
USAGE
  $ record-crate authorize

OPTIONS
  -r, --refresh  Refresh an existing access token
```

_See code: [src/commands/authorize.js](https://github.com/tjwds/record-crate/blob/v1.0.0/src/commands/authorize.js)_

## `record-crate collide`

Displays duplicates which exist across playlists.

```
USAGE
  $ record-crate collide
```

_See code: [src/commands/collide.js](https://github.com/tjwds/record-crate/blob/v1.0.0/src/commands/collide.js)_

## `record-crate elvis-test`

Uses the spotify-web-api-node example to make sure your credentials work.  Doesn't step on your blue suede shoes.

```
USAGE
  $ record-crate elvis-test
```

_See code: [src/commands/elvis-test.js](https://github.com/tjwds/record-crate/blob/v1.0.0/src/commands/elvis-test.js)_

## `record-crate help [COMMAND]`

display help for record-crate

```
USAGE
  $ record-crate help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `record-crate move`

Move an album between playlists.

```
USAGE
  $ record-crate move

OPTIONS
  -r, --really   really do it
  --album=album
  --from=from
  --to=to
```

_See code: [src/commands/move.js](https://github.com/tjwds/record-crate/blob/v1.0.0/src/commands/move.js)_

## `record-crate summarize`

Prints out a summary of your gauntlet.

```
USAGE
  $ record-crate summarize
```

_See code: [src/commands/summarize.js](https://github.com/tjwds/record-crate/blob/v1.0.0/src/commands/summarize.js)_
<!-- commandsstop -->

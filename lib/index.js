'use strict';

const util = require('util');
const fs = require('fs');
const { Client } = require('irc');

const CHANNEL = '#mylife-core';
const NICK = 'mylife-home-logger-draft';

exports.start = function(remote, logfile) {

  const client = new Client(remote, NICK, { channels: [CHANNEL], autoRejoin: true });
  client.on('error', err => writeLog('error', err));
  client.on('registered', () => writeLog('registered'));

  client.on('names', (channel, nicks) => checkChannel(channel) && writeLog('names', Object.keys(nicks)));
  client.on('join', (channel, nick, message) => checkChannel(channel) && writeLog('join', formatNick(nick)));
  client.on('part', (channel, nick, reason, message) => checkChannel(channel) && writeLog('part', formatNick(nick)));
  client.on('quit', (nick, reason, channels, message) => checkChannels(channels) && writeLog('quit', formatNick(nick)));
  client.on('kick', (channel, nick, by, reason, message) => checkChannel(channel) && writeLog('kick', formatNick(nick)));
  client.on('kill', (nick, reason, channels, message) => checkChannels(channels) && writeLog('kill', formatNick(nick)));
  client.on('nick', (oldnick, newnick, channels, message) => checkChannels(channels) && writeLog('nick', [formatNick(oldnick), formatNick(newnick)]));


  function writeLog(type, data) {
    const line = util.format(new Date().valueOf(), type, JSON.stringify(data));
    console.log(line);
    fs.appendFileSync(logfile, line + '\n');
  }
}

function formatNick(nick) {
  if(typeof nick === 'string') {
    return nick;
  }
  return nick.nick;
}

function checkChannel(channel) {
  return channel === CHANNEL;
}

function checkChannels(channels) {
  return channels.includes(CHANNEL);
}

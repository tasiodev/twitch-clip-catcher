require('dotenv').config()
var express = require('express');
var app = express();
var socketIo = require("socket.io");
var tmi = require('tmi.js');
var helpers = require("./helpers");


const opts = {
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_SECRET
  },
  channels: []
};

const twitchClient = new tmi.client(opts);
twitchClient.connect();

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.get("/:channel", function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

var io = socketIo(listener);
var channels = []

io.on("connection", socket => {
  console.log("Connection");

  socket.on("channel", (channel) => {
    findAndRemoveSocketIdOnChannel(socket.id);

    if (channels.filter(x => x.name === channel).pop()) {
      let index = channels.findIndex(x => x.name === channel);
      channels[index].clients.push(socket.id);
    } else {
      twitchClient.join(channel);
      channels.push({
        name: channel,
        clients: [socket.id]
      })
      console.log("add channel: ", channel);
    }
    console.log(channels);
    socket.join(channel);
  });

  socket.on("disconnect", () => {

    findAndRemoveSocketIdOnChannel(socket.id);

    console.log(channels);
    console.log("Disconnection?");
  });
});

twitchClient.on('message', (target, context, msg, self) => {
  if (self) { return; }
  let clip = helpers.getClipFromMessage(msg);
  if (clip) {
    io.to(target.replace("#", "")).emit('clip', { userInfo: context, clipId: clip.id });

  }
});

function findAndRemoveSocketIdOnChannel(socketId) {
  let channelFoundIndex = null;
  channels.map((ch, i) => {
    if (!channelFoundIndex && ch.clients.includes(socketId)) {
      channelFoundIndex = i;
    }
  })
  if (channelFoundIndex !== null) {
    let channelName = channels[channelFoundIndex].name
    if (channels[channelFoundIndex].clients.length === 1) {
      channels.splice(channelFoundIndex, 1);
      twitchClient.part(channelName);
      console.log("remove channel: ", channelName);
    } else {
      channels[channelFoundIndex].clients = channels[channelFoundIndex].clients.filter(x => x !== socketId)
    }
  }
}
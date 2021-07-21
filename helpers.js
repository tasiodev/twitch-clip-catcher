const fetch = require("node-fetch");

function getClipFromMessage(message) {
  let regex = /(?:https:\/\/)(?:www)\.twitch\.tv\/(?:\S+)\/(?:clip)\/(.+?(?=[^a-z0-9\-\_]|https|$))/i;
  let result = message.match(regex);
  if (result) {
    return { id: result[1].replace("/", "") };
  } else {
    let regex = /(?:https:\/\/)(?:clips)\.twitch\.tv\/(.+?(?=[^a-z0-9\-\_]|https|$))/i;
    let result = message.match(regex);
    if (result) {
      return { id: result[1].replace("/", "") };
    }

  }
  return null;
}

module.exports = {
  getClipFromMessage
};
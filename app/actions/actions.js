export const getClipInfo = (clipId) => {
  var options = {
    method: 'GET',
    headers: {
      "Client-ID": process.env.TWITCH_APP_CLIENTID,
      "Accept": "application/vnd.twitchtv.v5+json"
    }
  };
  return fetch('https://api.twitch.tv/kraken/clips/' + clipId, options).then(function (response) {
    return response.json().then(data => {
      console.log(data)
      console.log(response)
      return { data: data, response: response }
    });
  })
    .then(({ data, response }) => {
      if (response.status === 200) {
        return data;
      }
      return null;
    });
}
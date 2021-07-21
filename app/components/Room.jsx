import React, { useState, useEffect } from "react";
import openSocket from 'socket.io-client';
import * as actions from "../actions/actions";
import Clip from "./Clip";
import ReactTooltip from "react-tooltip";
import PageTitle from "./PageTitle";
const socket = openSocket();

const Room = (props) => {

  const [clips, setClips] = useState(null)
  useEffect(() => {
    socket.emit("channel", props.match.params.channel.toLowerCase());
    setClips(JSON.parse(localStorage.getItem(props.match.params.channel.toLowerCase() + "_clips")));
    socket.on('clip', (clip) => {
      setClips((prevClips) => {
        let duplicatedClipIndex = !prevClips ? -1 : prevClips.findIndex(x => x.clipId === clip.clipId);
        if (duplicatedClipIndex !== -1) {
          let clipsUpdated = prevClips ? [...prevClips] : [clip];
          if (!clipsUpdated[duplicatedClipIndex].users.find(x => x.username === clip.userInfo.username)) {
            clipsUpdated[duplicatedClipIndex].times = !clipsUpdated[duplicatedClipIndex].times ? 2 : clipsUpdated[duplicatedClipIndex].times + 1;
            clipsUpdated[duplicatedClipIndex].users.push({ username: clip.userInfo.username, displayName: clip.userInfo["display-name"], mod: clip.userInfo.mod, subscriber: clip.userInfo.subscriber });
            localStorage.setItem(props.match.params.channel.toLowerCase() + "_clips", JSON.stringify(clipsUpdated));
          }
          return clipsUpdated;
        } else {
          let preparedClip = clip;
          preparedClip.times = 1;
          preparedClip.users = [{ username: clip.userInfo.username, displayName: clip.userInfo["display-name"], mod: clip.userInfo.mod, subscriber: clip.userInfo.subscriber }];
          delete preparedClip.userInfo;
          let clipsUpdated = prevClips ? [...prevClips, preparedClip] : [preparedClip];
          localStorage.setItem(props.match.params.channel.toLowerCase() + "_clips", JSON.stringify(clipsUpdated));
          return clipsUpdated;
        }
      })

    });
    return () => {
      socket.off("clip");
    };
  }, [props.match.params.channel])

  useEffect(() => {
    if (clips) {
      let clipsUpdated = clips.slice();
      clips.map((clip, i) => {
        if (!clip.info) {
          actions.getClipInfo(clip.clipId).then((res) => {
            if (res) {
              clipsUpdated[i].info = res;
              setClips(clipsUpdated);
            } else {
              clipsUpdated = clipsUpdated.filter(x => x.clipId !== clip.clipId);
              setClips(clipsUpdated);
            }
          })
        }
      })
      localStorage.setItem(props.match.params.channel.toLowerCase() + "_clips", JSON.stringify(clipsUpdated));
    }
  }, [clips])

  const openClipHandler = (clipId) => {
    setClipViewed(clipId)
    window.open("https://clips.twitch.tv/" + clipId);
  }

  const setClipViewed = (clipId) => {
    setClips(clips => {
      let clipsUpdated = clips.slice();
      let index = clipsUpdated.findIndex(x => x.clipId === clipId);
      clipsUpdated[index].viewed = true;
      return clipsUpdated;
    })
  }

  return (<div>
    <div className="channelTitle">
      <div className="inline vtop width50">{props.match.params.channel.toLowerCase()}</div>
      <div className="inline vmiddle width50 clearDataDiv"><button onClick={() => { localStorage.removeItem(props.match.params.channel.toLowerCase() + "_clips"); setClips(null) }}>Clear data</button></div>
    </div>
    <div className="inline vtop width50">

      <div className="title">CLIPS</div>
      <div className="clipsContainer">
        {clips && clips.filter(x => !x.viewed).sort((a, b) => a.times > b.times ? -1 : 1).map((clip, i) => clip.info &&
          <Clip key={clip.clipId} clip={clip} openClipHandler={openClipHandler} />
        )}
        <div className="noClipsText loadingDots">Capturing clips from chat</div>
      </div>
    </div>
    <div className="inline vtop width50">
      <div className="title">WATCHED CLIPS</div>
      <div className="clipsContainer">
        {clips && clips.filter(x => x.viewed).sort((a, b) => a.times > b.times ? 1 : -1).map((clip, i) => clip.info &&
          <Clip key={clip.clipId} clip={clip} openClipHandler={openClipHandler} />
        )}
        {(!clips || clips.filter(x => x.viewed).length === 0) && <div className="noClipsText">No watched clips</div>}
      </div>
    </div>
    <ReactTooltip
      id="general"
    />
    <PageTitle title={"Reaclips - " + props.match.params.channel} />
  </div>)
}

export default Room;
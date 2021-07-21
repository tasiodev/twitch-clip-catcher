import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faStar, faGavel, faEye, faTag, faClock } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from "react-tooltip";
const Clip = (props) => {
    const { clip, openClipHandler } = props;
    return (
        clip.info &&
        <div className={clip.viewed ? "clip clipViewed" : "clip"} onClick={() => openClipHandler(clip.clipId)}>
            <div className="inline vtop clipImage">
                {clip.info.thumbnails && <img src={clip.info.thumbnails.small} />}
            </div>
            <div className="inline vtop clipText">
                <div className="clipTitle" title={clip.info.title}>{clip.info.title.length <= 77 ? clip.info.title : clip.info.title.substring(0, 74) + "..."}</div>
                {clip.info.broadcaster && <div className="clipAuthor">{clip.info.broadcaster.display_name}</div>}
            </div>
            <div className="inline vtop clipTimes">
                <div data-tip data-for={clip.clipId} ><FontAwesomeIcon icon={faUsers} /> {clip.times ? clip.times : 1}</div>
                {clip.users.filter(x => x.mod).pop() && <div data-tip="At least one moderator has shared this clip" style={{ color: "#9147FF" }}><FontAwesomeIcon icon={faGavel} /></div>}
                {clip.users.filter(x => x.subscriber).pop() && <div data-tip="At least one subscriber has shared this clip" style={{ color: "yellow" }}><FontAwesomeIcon icon={faStar} /></div>}

            </div>
            <div className="bottomBar">
                <div className="inline vmiddle hideMvl" style={{ marginRight: 10 }}><FontAwesomeIcon icon={faClock} style={{ paddingRight: 3 }} />{clip.info.duration}</div>
                <div className="inline vmiddle gameDiv" title={clip.info.game}><FontAwesomeIcon icon={faTag} style={{ paddingRight: 3 }} />{clip.info.game}</div>
                <div className="inline vmiddle creatorDiv" title={clip.info.curator.display_name}><FontAwesomeIcon icon={faUser} style={{ paddingRight: 3 }} />{clip.info.curator.display_name}</div>
                <div className="inline vmiddle"><FontAwesomeIcon icon={faEye} style={{ paddingRight: 3 }} />{clip.info.views}</div>
            </div>
            <ReactTooltip
                id={clip.clipId}
                getContent={() => clip.users.map((usr) =>
                    <div key={usr.username}>
                        {usr.mod && <span style={{ color: "#9147FF", paddingRight: 3 }}><FontAwesomeIcon icon={faGavel} /></span>}
                        {usr.subscriber && <span style={{ color: "yellow", paddingRight: 3 }}><FontAwesomeIcon icon={faStar} /></span>}
                        {usr.displayName}
                    </div>
                )}
            />
            <ReactTooltip />
        </div>
    )
}

export default Clip;
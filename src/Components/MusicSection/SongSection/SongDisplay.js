import React from "react"
import '../../../css/Spinner.css'
import reactLogo from '../../../reactlogo.svg'

function SongDisplay({songInfo, gettingNewSong}) {
    return (
        <div id="song_display" style={{justifyContent: gettingNewSong ? 'center' : 'space-between'}}>
            {!songInfo.trackName && !songInfo.albumCover && !gettingNewSong &&
                <div id="song_display_text" style={{maxWidth: '320px', margin: 'auto', padding: '0'}}>
                    <p>Discover music based on your preferences!</p>
                    <p>Choose a musical Genre,<br></br>set the six filter sliders,<br></br>& hit “New Song”</p>
                </div>
            }
            {!gettingNewSong ?
                songInfo.trackName && 
                    <>
                        <div id="song_display_image" style={{ minWidth: '139.057689px' }}><img src={songInfo.albumCover} alt="<album cover unavailable>"/></div>
                        <div id="song_display_text">
                            <p>TRACK: {songInfo.trackName}</p>
                            <p>ARTIST: {songInfo.artistName}</p>
                            <p>ALBUM: {songInfo.albumName}</p>
                            <p><a href={songInfo.trackLink} rel="noreferrer" target="_blank">Listen on Spotify</a></p>
                        </div>
                    </>
            :   
                    <div>
                        <img src={reactLogo} id="loading_spinner" alt="Loading..." />
                    </div>
            }
        </div>
        
    )
}

export default SongDisplay
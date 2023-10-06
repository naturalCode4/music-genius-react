import React from "react"
import { callServerForNewSong } from "../../../utilities/api.js"

function NewSongButton({filterLevels, selectedGenre, setSongInfo, setGettingNewSong}) {

    const formattedFilters = {
        genre: selectedGenre,
        danceability: filterLevels.danceability.disabled ? null : filterLevels.danceability.value,
        energy: filterLevels.energyLevel.disabled ? null : filterLevels.energyLevel.value,
        valence: filterLevels.mood.disabled ? null : filterLevels.mood.value,
        acousticness: filterLevels.acousticness.disabled ? null : filterLevels.acousticness.value,
        instrumentalness: filterLevels.vocalPresence.disabled ? null : filterLevels.vocalPresence.value,
        popularity: filterLevels.popularity.disabled ? null : filterLevels.popularity.value,
    }

    const getNewSong = async () => {
        setGettingNewSong(true)
        try {
            console.log('requesting server for new song')
            const newSong = await callServerForNewSong(formattedFilters)
            setSongInfo(newSong.data)
            console.log('newSong.data: ', newSong.data)
            setGettingNewSong(false)
        } catch (err) {
            console.log('Error calling getNewSong ==>:', err)
        }
    }


    return (
        <div 
            id="new_song_button"
            onClick={getNewSong}
            >New Song
        </div>
    )
}

export default NewSongButton
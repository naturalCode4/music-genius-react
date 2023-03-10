import express from 'express'
import cors from 'cors'
import axios from 'axios'

import {createRequestConfigurationForSpotifySongRecommendation, tokenRequestAuthOptions, spotifyTokenGrantTypeParameter, spotifyTokenURL, spotifyRecommendationBaseURL} from './src/utilities/spotifyAuthorization.js'

const app = express()
app.use(express.json())
app.use(cors())


app.post('/songRec', async (req, res) => {
    try {
        console.log('try /songRec')
        const songRecommendation = await getSongRecommendation(req.body.filters)
        res.status(200).send(JSON.stringify(songRecommendation))
    }
    catch (err) {
        console.log('Error @ /songRec endpoint ==>:', err.response.status)
        res.status(400).send()
    }
})

const requestSpotifyOAuthToken = async (spotifyTokenURL, spotifyTokenGrantTypeParameter, tokenRequestAuthOptions) => {
    const response = await axios.post(spotifyTokenURL, spotifyTokenGrantTypeParameter, tokenRequestAuthOptions) 
    return response.data.access_token
}

let hasCalledGetSongRecommendationTwice = false
let spotifyOAuthToken = await requestSpotifyOAuthToken(spotifyTokenURL, spotifyTokenGrantTypeParameter, tokenRequestAuthOptions)

const getSongRecommendation = ({ genre, danceability, energy, valence, acousticness, instrumentalness, popularity }) => {
    
    const generateVariator = () => {
        let variator = Math.random() < .5 ? -1 : 1
        variator = variator*.25*Math.random()
        return variator
    }

    const reverseFilterValue = (value, mid) => mid-(value-mid)

    let parameters = `?limit=1`
    if (genre) parameters += `&seed_genres=${genre.toLowerCase()}`
    if (danceability) parameters += `&target_danceability=${(danceability/100)+generateVariator()}`
    if (energy) parameters += `&target_energy=${(energy/100)+generateVariator()}`
    if (valence) parameters += `&target_valence=${(valence/100)+generateVariator()}`
    if (acousticness) parameters += `&target_acousticness=${(acousticness/100)+generateVariator()}`
    if (instrumentalness) parameters += `&target_instrumentalness=${((reverseFilterValue(instrumentalness, 50)/100)+generateVariator())}`
    if (popularity) parameters += `&target_popularity=${(Math.floor(((popularity/100)+generateVariator())*100))}`

    return new Promise((resolve, reject) => {

        console.log('parameters:', parameters);

        axios.get(`${spotifyRecommendationBaseURL}${parameters}`, createRequestConfigurationForSpotifySongRecommendation(spotifyOAuthToken))
            .then(res => {

            const trackName = res.data.tracks[0].name
            const artistName = res.data.tracks[0].artists[0].name
            const albumName = res.data.tracks[0].album.name
            const trackLink = res.data.tracks[0].external_urls.spotify
            const albumCover = res.data.tracks[0].album.images[1].url
            const sampleLink = res.data.tracks[0].preview_url

            console.log('.then of getSongRecommendation. song: ', res.data.tracks[0].name)
            
            resolve ({trackName, artistName, albumName, trackLink, albumCover, sampleLink})
            
            })
            .catch(async err => {
                console.log('Error resolving spotifyRecommendation call ==>:', err.response.status, err.message)
                if (err.response.status === 401 && !hasCalledGetSongRecommendationTwice) {
                    hasCalledGetSongRecommendationTwice = true
                    try {
                        spotifyOAuthToken = await requestSpotifyOAuthToken(spotifyTokenURL, spotifyTokenGrantTypeParameter, tokenRequestAuthOptions) 
                        console.log('new spotifyOAuthToken:', spotifyOAuthToken)
                    }
                    catch(err) {
                        console.log('Error retrying spotifyOAuthToken request ', err.response.status)
                        return
                    }
                    const retriedSongRecommendation = await getSongRecommendation({genre, danceability, energy, valence, acousticness, instrumentalness, popularity})
                    resolve (retriedSongRecommendation)
                }
            })
            .finally(() => {
                hasCalledGetSongRecommendationTwice = false
            })
    })
}

const port = process.env.PORT || 1447

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
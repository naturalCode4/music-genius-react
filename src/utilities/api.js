import axios from "axios";

const serverBaseURL = 'https://the-music-genius-server-75fc67467b5d.herokuapp.com'

export const callServerForNewSong = async (filters) => await axios.post(serverBaseURL + '/songRec', {filters})
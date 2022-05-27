const axios = require('axios');
const {pack, unpack} = require( 'msgpackr');
const {VERSION, PLATFORM, CHARACTERS} = require('./constants')

const instance = axios.create({
    baseURL: "https://ggst-game.guiltygear.com/api/",
    timeout: 2000,
    headers:{
        'User-Agent': 'Steam',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
    },
    responseType: 'arraybuffer'
})

function apiRequest(url, data){
    let params = new URLSearchParams({data: pack(data).toString('hex')})
    return instance.post(url, params.toString())
        .then((response)=>{
            return unpack(response.data)
        })
}

function userLogin(steamID){
    return apiRequest("user/login", [["", "", 6, VERSION, PLATFORM['PC']],
    [1, steamID.toString(), steamID.toString(16), 256, ""]]);
}

module.exports = {
    apiRequest: apiRequest,
    userLogin: userLogin,
}
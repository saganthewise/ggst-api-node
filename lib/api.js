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

function userLogin(steamID, platform='PC'){
    return apiRequest("user/login", [["", "", 6, VERSION, PLATFORM[platform]],
    [1, steamID.toString(), steamID.toString(16), 256, ""]]);
}

function getRcode(striveID, platform='PC'){
    return apiRequest("/statistics/get", [["", "", 6, VERSION, PLATFORM[platform]],
    [striveID, 7, -1, -1, -1, -1]]).then(data=>{
        return JSON.parse(data[1][1])
    });
}

function getMatchStats(striveID,character="All",platform='PC'){
    return apiRequest("/statistics/get", [["", "", 6, VERSION, PLATFORM[platform]],
    [striveID, 1, 1, CHARACTERS[character], -1, -1]]).then(data=>{
        return JSON.parse(data[1][1])
    });
}

function getSkillStats(striveID,character="All",platform='PC'){
    return apiRequest("/statistics/get", [["", "", 6, VERSION, PLATFORM[platform]],
    [striveID, 2, 1, CHARACTERS[character], -1, -1]]).then(data=>{
        return JSON.parse(data[1][1])
    });
}

module.exports = {
    apiRequest: apiRequest,
    userLogin: userLogin,
    getRcode: getRcode,
    getMatchStats: getMatchStats,
    getSkillStats: getSkillStats,
}
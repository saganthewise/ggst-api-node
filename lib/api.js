const axios = require('axios');
const {pack, unpack} = require( 'msgpackr');
const {VERSION, PLATFORM, CHARACTERS} = require('./constants')

const instance = axios.create({
    baseURL: "https://ggst-game.guiltygear.com/api/",
    timeout: 3000,
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

/**
* @namespace getHistory
* @property {string} striveID - ID of the user you want to search for
* @property {number} target - Whose matches to look for in relation to striveID:
* - 0 = Everyone (ignore striveID)
* - 1 = striveID,
* - 2 = striveID's follows
* - 3 = striveID's rivals
* - 4 = striveID's favorites
*/
function getHistory(striveID,target=0){
    return apiRequest("/catalog/get_replay", [
        [striveID, 0, 6, VERSION, 3],
        [1, 0, 127, [-1, target, 1, 99, [], -1, -1, 0, 0, 1], 6]
    ])
        .then((response) => {
            return response[1][3];
        });
}

module.exports = {
    apiRequest: apiRequest,
    userLogin: userLogin,
    getRcode: getRcode,
    getMatchStats: getMatchStats,
    getSkillStats: getSkillStats,
    getHistory: getHistory,
}
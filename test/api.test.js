require('dotenv').config();
const ggstApi = require('../lib/api');
const steamApi = require('../lib/steam-api');

var striveID;
var striveToken;
var striveLoginToken;
var steamID;

test('should return a steamID and authentication token', async ()=>{
    const data = await steamApi.SteamLogin(process.env.REACT_APP_STEAM_TOKEN, process.env.REACT_APP_STEAM_USER, process.env.REACT_APP_STEAM_PASS);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('token');

    steamID = BigInt(data['id']);
    striveToken = data['token'];
})

test('should return an array', ()=>{
    return ggstApi.userLogin(steamID, striveToken).then(data =>{
        expect(data[1][1][0]).toBeDefined();

        striveLoginToken = data[0][0];
        striveID = data[1][1][0];

        console.log(`Logged in to Strive's servers: ${striveID} -- ${striveLoginToken}`);
    })
})

test('should return valid rcode profile', ()=>{
    return ggstApi.getRcode(striveID).then(data => {
        expect(data['Update_Year']).toBeGreaterThan(2020);
    })
})

test('should return valid match stats', ()=>{
    return ggstApi.getMatchStats(striveID).then(data => {
        expect(data['HighRound']).toBeDefined();
    })
})

test('should return valid skills stats', ()=>{
    return ggstApi.getSkillStats(striveID).then(data => {
        expect(data['BRScore_Attack']).toBeDefined();
    })
})

test('should return some match history', ()=>{
    return ggstApi.getHistory(striveID, striveLoginToken, 1, 2, 0).then(data => {
        expect(data).toBeDefined();
    })
})
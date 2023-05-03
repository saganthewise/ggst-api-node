require('dotenv').config();
const ggstApi = require('../lib/api');

/*test('should return an array', ()=>{
    return ggstApi.userLogin(process.env.testSteamID).then(data =>{
        expect(Array.isArray(data)).toBe(true);
    })
})*/

test('should return valid rcode profile', ()=>{
    return ggstApi.getRcode(process.env.testStriveID).then(data => {
        expect(data['Update_Year']).toBeGreaterThan(2020);
    })
})

test('should return valid match stats', ()=>{
    return ggstApi.getMatchStats(process.env.testStriveID).then(data => {
        expect(data['HighRound']).toBeDefined();
    })
})

test('should return valid skills stats', ()=>{
    return ggstApi.getSkillStats(process.env.testStriveID).then(data => {
        expect(data['BRScore_Attack']).toBeDefined();
    })
})
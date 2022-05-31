require('dotenv').config();
const ggstApi = require('../lib/api');

test('should return an array', ()=>{
    return ggstApi.userLogin(process.env.testSteamID).then(data =>{
        expect(Array.isArray(data)).toBe(true);
    })
})

test('should return valid rcode profile', ()=>{
    return ggstApi.getRcode(process.env.testStriveID).then(data => {
        expect(data['Update_Year']).toBeGreaterThan(2020);
    })
})
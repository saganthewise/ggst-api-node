require('dotenv').config();
const ggstApi = require('../lib/api');

test('should return an array', ()=>{
    return ggstApi.userLogin(process.env.testSteamID).then(data =>{
        expect(Array.isArray(data)).toBe(true);
    })
})
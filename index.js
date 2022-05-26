const axios = require('axios');
const {pack, unpack} = require( 'msgpackr');

const instance = axios.create({
    baseURL: "https://ggst-game.guiltygear.com",
    timeout: 5000,
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

const request = [["", "", 6, '0.1.1', 3],
[1, '76561198000363145', '11000010263D689', 256, ""]]
const apiUrl = "/api/user/login"
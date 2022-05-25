import axios from 'axios';
import querystring from 'querystring';
import {pack, unpack} from 'msgpackr';


const instance = axios.create({
    timeout: 5000,
    headers:{
        'User-Agent': 'Steam',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
    },
    responseType: 'arraybuffer'
})
const apiData = pack([["", "", 6, '0.1.1', 3],
[1, '76561198000363145', '11000010263D689', 256, ""]]).toString('hex')
const apiUrl = "https://ggst-game.guiltygear.com/api/user/login"
console.log(apiData)
const params = new URLSearchParams({data: apiData})
instance.post('https://ggst-game.guiltygear.com/api/user/login', params.toString())
    .then((response)=>{
        console.log(unpack(response.data));
    })
console.log();
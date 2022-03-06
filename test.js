require('dotenv').config();
const ys = require('ytdl-core');
const yURL = 'https://www.youtube.com/watch?v=-xKM3mGt2pE';
/**************
***********
***********
const axios = require('axios');
let _f = {};

_f.getY_url = async (name, cb) => {
    try{
        let m_name = name.replace(' ', '_');
        let y_fetch_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${m_name}&type=video&videoType=any&key=${process.env.YOUTUBE_API_KEY}`;
        axios.get(y_fetch_url)
            .then(response => {
                const { id , snippet } = response.data.items[0];
                const data = {
                    id: id.videoId,
                    title: snippet.title,
                    image: snippet.thumbnails.default.url,
                }
                console.log(data);
            })
            .catch(e => {
                // console.log('freddy> error: ', e);
                throw e;
            })
    }catch(e){
        console.log('freddy> error: ', e);
        cb(false);
    }
}

*/

/****
_f.getY_url('take on me', (url) => {
    console.log(url);
});
*/

/**************

    let m_name='take_on_me';
    let y_fetch_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${m_name}&type=video&videoType=any&key=${process.env.YOUTUBE_API_KEY}`;
    axios.get(y_fetch_url, {
        headers: {
            'Accept': 'application/json',
        }
    })
        .then(response => {
            console.log(response.data);
            const { id , snippet } = response.data.items[0];
            const data = {
                id: id.videoId,
                title: snippet.title,
                image: snippet.thumbnails.default.url,
            }
            cb(data);
        })
        .catch(e => {
            // console.log('freddy> error: ', e);
            throw e;
        })
************/

/****** 
console.log('request for: ', process.argv[2]);
ys.getInfo(process.argv[2])
	.then(data => console.log(data.formats[data.formats.length-1]))
	.catch(e => console.error(e));
*/
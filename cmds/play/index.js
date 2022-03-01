const ytdl = require('ytdl-core');
const axios = require('axios');
const validUrl = require('valid-url');
let _f = {};


_f.getY_url = async (name, cb) => {
    try{
        // console.log(name);
        let m_name = name.replace(' ', '_');
        // console.log(m_name);
        let y_fetch_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${m_name}&type=video&videoType=any&key=${process.env.YOUTUBE_API_KEY}`;
        axios.get(y_fetch_url, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(response => {
                // console.log(response.data);
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
    }catch(e){
        console.log('freddy> error: ', e);
        cb(false);
    }
}

_f.getFormat = (url, cb) => {
    ytdl.getInfo(url)
        .then(data => {
            let v_format = data.formats[data.formats.length-1];
            cb(v_format);
        })
        .catch(e => {
            console.error(e)
            cb(false);
        });
}

_f.call_ytdl = (data, cb) => {
   /************************
    *
    * {
    *   id: 'djV11Xbc914',
    *     title: 'a-ha - Take On Me (Official Video) [Remastered in 4K]',
    *       image: 'https://i.ytimg.com/vi/djV11Xbc914/default.jpg'
    *       }
    *
    *****/
    let y_url = `https://www.youtube.com/watch?v=${data.id}`;
    try{
        _f.getFormat(y_url, (v_format) => {
            if(v_format){
                data['url'] = `/music/${data.id}` || v_format.url;
                data['codecs'] = v_format.codecs;
                data['type'] = v_format.container;
                data['sampleRate'] = v_format.audioSampleRate;
                data['channels'] = v_format.audioChannels;

                console.log('freddy> MUSIC_DATA: ', data);
                cb(false, data);
            }else{
                console.log('freddy> Error: failed to fetch youtube video format');
            }
        });
    }catch(e){
        console.log(e);
        cb(e, false);
    }
};

_f.call_help = (cb) => {

}

const init = ({flags, line}, cb) => {
    // console.log(data);
    //
    if(validUrl.isUri(line[1])){
        // received url from user
        // play from url
    }else{
        let music_name = '';
        for(let i=1; i<line.length-1; i++)
            music_name += line[i] + ' ';
        music_name += line[line.length-1];
        
        _f.getY_url(music_name, (url) => {
            if(url){
                _f.call_ytdl(url, (err, g_url_data) => {
                    if(!err && g_url_data){
                        cb(g_url_data, 'freddy:music:data', true);
                    }else{
                        cb({
                            error: `Sorry, Something went wrong please, try again`,
                        }, 'freddy:error', false);
                    }
                });
            }else{
                cb({
                    error: `We do not have ${music_name} please, try different music name`
                }, 'freddy:error',false);
            }
        })
    }
};

module.exports = init;

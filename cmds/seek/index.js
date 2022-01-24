const init(data, cb) => {
    let time = data[1].toString().trim();
    let error = time.indexOf(':') > 0 ? false : true;
    if(!error){
        let t = time.split(':');
        try{
            let min = parseInt(t[0]);
            let sec = parseInt(t[1]) + (min * 60);
            cb({to:sec}, 'freddy:seek_plz', true);
        }catch(e){
            cb({ error: 'Invalid Input \n please provide [min:sec] format to seek \n use: $seek --help'}, 'freddy:error', false);
        }
    }else{
        cb({ error: 'Invalid Input \n please provide [min:sec] format to seek \n use: $seek --help'}, 'freddy:error', false);
    }
}

module.exports = init;

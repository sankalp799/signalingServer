const help = 'play command \n usage: $play <song_name> \n usage: $play <youtube_url> \n usage: $play <spotify_url> \n $play | --help\n';

const init = (cb) => {
    console.log(`freddy> $play help request ${help}`);
    cb(help, 'freddy:kind', true);
};

module.exports = init;

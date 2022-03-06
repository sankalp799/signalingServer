const help = 'play command \n usage: $play [song_name] \n flags: \n --p: for listening in private \n $play | --help\n';

const init = (cb) => {
    console.log(`freddy> $play help request ${help}`);
    cb(help, 'freddy:kind', true);
};

module.exports = init;

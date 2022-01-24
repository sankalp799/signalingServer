const help = 'cmd: $seek \n usage: $seek <min>:<sec> \n usage: $seek --help \n';

const init = (cb) => {
    console.log(`freddy> $seek help request ${help}`);
    cb(help, 'freddy:kind', true);
};

module.exports = init;

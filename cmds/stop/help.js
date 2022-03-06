const help = 'cmd: $stop \n usage: $stop \n usage: $stop --help\n';

const init = (cb) => {
    console.log(`freddy> $stop help request ${help}`);
    cb(help, 'freddy:kind', true);
};

module.exports = init;

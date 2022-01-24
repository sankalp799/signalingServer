const help = `cmd: $help\n
commands:-\n`;

const init = (data, cb) => {
    cb(help, 'freddy:kind', true);
}

module.exports = init;

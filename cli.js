const fs = require('fs');
const path = require('path');
const cmd_path = path.join(__dirname, 'cmds/');
let freddy = {};
freddy.prefix = '$';

freddy._fetch_cmd = async (cmd, callback) => {
    try {
        cmd = cmd.toLowerCase();
        if(cmd.indexOf(freddy.prefix) >= 0){
            cmd = cmd.slice(cmd.indexOf(freddy.prefix)+1);
            console.log('Freddy> ' + cmd);
        }
        fs.exists(cmd_path + cmd + '/index.js', callback);
        // console.log(exist);
        // callback(exist);
    } catch (err) {
        console.log(err);
        callback(false);
    }
}

freddy._process = (line, cb) => {
    
    line[0] = line[0].slice(line[0].indexOf(freddy.prefix)+1);
    // console.log(line);
    let flags = line.filter(w => w.trim().indexOf('--') == 0);

    line = line.filter(w => w.trim().indexOf('--') < 0);
    
    freddy._fetch_cmd(line[0], (exist) => {
        
        if(exist){
            if((flags.find(f => f.toLowerCase() == '--help')) !== undefined){
                let help_path = cmd_path + `${line[0]}/help.js`; 
                const _helper = require(help_path);
                if(typeof(_helper) == 'function'){
                    console.log('freddy> $' + line[0] + ' asking for help');
                    _helper(cb);
                }
            }else{ 
                // get function from index
                let index_path = cmd_path + `${line[0]}/index.js`;
                // console.log(index_path);
                const _handler = require(index_path);
                // console.logg(_handler);
                if(typeof(_handler) == 'function'){
                    console.log('freddy> handler called');
                    // call function here
                    _handler({flags, line}, cb);
                }
            }
        }else{
            cb({
                error: 'Command Not Found',
            }, 'freddy:error', false);
        }
    });
};


freddy._input = (data, cb) => {
    let line = typeof(data['line']) == 'string' && data['line'].trim().length ? data['line'].trim().split(' ') : false;
    line = line.filter(s => s != ' ');
    if(line){
        freddy._process(line, cb);
    }else
        cb({ error: 'Command Not Fond' }, 'freddy:error', false);
}

module.exports = freddy;

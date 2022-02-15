const path = require('path')
const fs = require('fs')

const get_help_string = (cb) => {

    let helper = `cmd: $help\n
    commands:-\n`;

    let cmds_dir = path.join(__dirname, '../');
    // list commands we have in cmds
    fs.readdir(cmds_dir, (c_err, c_list) => {
        if(!c_err && c_list){
            // set list of commands in helper
            c_list.forEach(c_md => helper += `\$${c_md.toLowerCase()} \n`);

            // then 
            helper += `To Know How to Use specific commands please request \n`;
            helper += '$[command_name] --help \n';
            helper += `You can ask for help from any command by using --help flag at last \n \n`

            // then
            helper += `\ntry, our play command to list music \n`;
            helper += `\$play [song-name]`;

            cb(helper);
            
        }else{
            cb(false);
            console.log('freddy_issue> ', c_err);
        }
    })

}

const init = (data, cb) => {
    const help = get_help_string(help_str => {
        if(help_str){
            console.log('freddy> ', help_str);
            cb(help_str, 'freddy:kind', false);
        }else{
            console.log('freddy_issue> failed to provide $help service to client');
            cb('use $help command to know about all commands \n also, how to use freddy for listen music', 'freddy:kind', false);
        }
    });
}

module.exports = init;

var spawn = require('child_process').spawn;
var path = require('path');
var applescript = require('applescript');

var cmd = path.resolve(__dirname, '../bin/terminal-notifier/Contents/MacOS/terminal-notifier');

var script = ['id of app "', 'Terminal', '"'];

function pluckAsArg (options, prop) {
  if (options[prop]) {
    return [
      '-' + prop,
      options[prop]
    ];
  }

  return [];
}

function notify (args) {
  if (typeof args === 'object') {
    if ((args.sender && !args.sender.match(/^com\./)) || (args.activate && !args.activate.match(/^com\./))) {
      script[1] = args.sender || args.activate;
      applescript.execString(script.join(''), function(err, rtn) {
        if (err) {
          console.log(err);
        }
        if (args.sender) args.sender = rtn;
        if (args.activate) args.activate = rtn;
        notifyWithOptions(args);
      });
    }else {
      notifyWithOptions(args);
    }
  }else if (typeof args === 'string') {
    notifyWithMessage(args);
  }
}

function notifyWithMessage (message) {

  var options = {
    message: message
  }

  notifyWithOptions(options);
}

function notifyWithOptions (options) {

  var args = []
    .concat(pluckAsArg(options, 'message'))
    .concat(pluckAsArg(options, 'title'))
    .concat(pluckAsArg(options, 'subtitle'))
    .concat(pluckAsArg(options, 'sound'))
    .concat(pluckAsArg(options, 'group'))
    .concat(pluckAsArg(options, 'remove'))
    .concat(pluckAsArg(options, 'list'))
    .concat(pluckAsArg(options, 'activate'))
    .concat(pluckAsArg(options, 'sender'))
    .concat(pluckAsArg(options, 'open'))
    .concat(pluckAsArg(options, 'execute'));

  var opts = {
    detached: true,
    stdio: [ 'ignore', 'ignore', 'ignore' ]
  };

  var child = spawn(cmd, args, opts);

  child.on('exit', function(code) {
    if (code !== 0) {
      console.log(code);
    }
  });

}

module.exports = notify;

'use strict';

require('colors');
var exec = require('child_process').exec;
var conf = {
  'branch': String(' <val> '.redBG).white,
  'M': String(' M <val> '.blue).inverse,
  'A': String(' A <val> '.green).inverse,
  'D': String(' D <val> '.blue).inverse,
  'R': String(' R <val> '.blue).inverse,
  'C': String(' C <val> '.blue).inverse,
  'U': String(' U <val> '.blue).inverse,
  '?': String(' ? <val> '.red).inverse,
  'push': String(' ⌃ <val> '.magenta).inverse,
  'pull': String(' ⌄ <val> '.magenta).inverse,
  'separator': ' · '.white
};
var customConf = process.env.AVETISK_GIT_PROMPT;

if (customConf) {
  customConf = JSON.parse(customConf);

  for (var i = 0, key, keys = Object.keys(customConf), len = keys.length; i < len; i += 1) {
    key = keys[i];
    conf[key] = customConf[key];
  }
}

var current = {
  'branch': null,
  '?': 0,
  'M': 0,
  'A': 0,
  'D': 0,
  'R': 0,
  'C': 0,
  'U': 0,
  'push': 0,
  'pull': 0
};

var print = function () {
  var prompt = [];
  var val;

  for (var i3 = 0, key, keys = Object.keys(current), len3 = keys.length; i3 < len3; i3 += 1) {
    key = keys[i3];
    val = current[key];

    if (val) {
      prompt.push(conf[key].replace('<val>', val));
    }
  }

  process.stdout.write(prompt.join(conf['separator']));
};

exec('git rev-parse --is-inside-work-tree', function (err, stdout) {
  if (err || stdout.trim() !== 'true') {
    return;
  }

  exec('git rev-parse --abbrev-ref HEAD', function (err, stdout) {
    if (err) {
      stdout = 'master';
    }

    current['branch'] = stdout.trim();

    exec('git log `git remote`/' + current.branch + '..HEAD --pretty=online | wc -l', function (err, stdout) {
      if (err) {
        return;
      }

      current['push'] += parseInt(stdout, 10);

      exec('git status --porcelain', function (err, stdout) {
        if (err) {
          return;
        }

        /*jshint quotmark: true*/
        var stats = stdout.trim().split("\n");
        /*jshint quotmark: single*/
        var stat;

        for (var i = 0, len = stats.length; i < len; i += 1) {
          stat = stats[i].split(' ')[0].split('');

          for (var i2 = 0, len2 = stat.length; i2 < len2; i2 += 1) {
            if (stat[i2] === 'M') {
              current['M'] += 1;
            }

            if (stat[i2] === 'A') {
              current['A'] += 1;
            }

            if (stat[i2] === 'D') {
              current['D'] += 1;
            }

            if (stat[i2] === 'R') {
              current['R'] += 1;
            }

            if (stat[i2] === '?') {
              current['?'] += 1;
              i2 += 1;
            }
          }
        }

        print();
      });
    });
  });
});

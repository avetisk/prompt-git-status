const exec = require('child_process').exec

/* eslint-disable no-template-curly-in-string */
const colorize = firstColor => (firstStr, secondStr = '') =>
    `%{$fg[black]$bg[${firstColor}]%}${firstStr}%{\${reset_color}%}%{$fg[black]$bg[white]%}${secondStr}%{\${reset_color}%}`
/* eslint-enable no-template-curly-in-string */
const colorizeInfo = colorize('blue')
const colorizePrimary = colorize('blue')
const colorizeWarn = colorize('red')

const customConf = process.env.AVETISK_GIT_PROMPT
const defaultConf = {
  '?': ({ staged }) => colorizeWarn(' \\? ', ` ${staged} `),
  A: ({ staged, unstaged }) =>
    colorizePrimary(
      ' A ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
    ),
  C: ({ staged, unstaged }) =>
    colorizeWarn(
      ' C ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
    ),
  D: ({ staged, unstaged }) =>
    colorizePrimary(
      ' D ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
    ),
  M: ({ staged, unstaged }) =>
    colorizePrimary(
      ' M ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
    ),
  R: ({ staged, unstaged }) =>
    colorizePrimary(
      ' R ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
    ),
  U: ({ staged, unstaged }) =>
    colorizeWarn(
      ' U ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
    ),
  diff: ({ local, remote }) =>
    colorizeInfo(
      ' != ', ` ${local ? `+${local}` : ''}${local && remote ? '/' : ''}${remote ? `-${remote}` : ''} `
    ),
  separator: ' ',
  branch: ({ branch }) => colorize('green')(` ${branch} `),
}
const config = Object.assign(
  {},
  defaultConf,
  // eslint-disable-next-line import/no-dynamic-require
  customConf ? require(customConf) : {}
)

const print = status => process.stdout.write(
  Object
    .entries(status)
    .filter(([, values]) => Object.entries(values).filter(([, val]) => val).length)
    .map(([labelKey, values]) => config[labelKey](values))
    .filter(x => x)
    .join(config.separator)
    .trim()
)

new Promise((resolve, reject) => {
  exec('git rev-parse --is-inside-work-tree', (err, stdout) => (err || stdout.trim() !== 'true'
    ? reject()
    : resolve())
  )
})
  .then(() => new Promise(resolve => exec('git rev-parse --abbrev-ref HEAD', (err, stdout) =>
    resolve(err ? '\\?\\?\\?' : stdout.trim())
  )))
  .then(branch => Promise.all([
    new Promise((resolve, reject) =>
      exec(`git log $(git remote)/${branch}..HEAD --pretty=oneline | wc -l`, (err, stdout) =>
        (err ? reject() : resolve(Number.parseInt(stdout, 10)))
      )
    ),
    new Promise((resolve, reject) =>
      exec(`git log HEAD..$(git remote)/${branch} --pretty=oneline | wc -l`, (err, stdout) =>
        (err ? reject() : resolve(Number.parseInt(stdout, 10)))
      )
    ),
    new Promise((resolve, reject) =>
      exec('git status --porcelain', (err, stdout) => (
        err
          ? reject()
          : resolve(
            stdout
              .trim()
              .split('\n')
              .reduce((status, [first, last]) => {
                const result = Object.assign({}, status)

                if (result[first]) result[first].staged += 1
                if (result[last]) result[last].unstaged += 1

                return result
              }, {
                U: { staged: 0, unstaged: 0 },
                C: { staged: 0, unstaged: 0 },
                R: { staged: 0, unstaged: 0 },
                D: { staged: 0, unstaged: 0 },
                A: { staged: 0, unstaged: 0 },
                M: { staged: 0, unstaged: 0 },
                '?': { staged: 0, unstaged: 0 },
                branch: { branch },
              })
          ))
      )
    ),
  ]))
  .then(([push, pull, status]) => Object.assign({}, status, { diff: { local: push, remote: pull } }))
  .then(print)
  .catch(() => process.stdout.write('ERR: no git status'))

process.stdout.on('error', ({ code }) => code === 'EPIPE' && process.exit(0))

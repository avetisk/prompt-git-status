const exec = require('child_process').exec

/* eslint-disable no-template-curly-in-string */
const colorize = color => (firstStr, secondStr = '') =>
    `%{$fg[black]$bg[${color}]%}${firstStr}%{\${reset_color}%}%{$fg[black]$bg[white]%}${secondStr}%{\${reset_color}%}`
/* eslint-enable no-template-curly-in-string */
const colorizeInfo = colorize('blue')
const colorizeWarn = colorize('red')

const customConf = process.env.AVETISK_GIT_PROMPT
const defaultConf = {
  order: ['U', 'C', 'D', 'R', '?', 'A', 'M', 'branch'],
  errors: {
    /* eslint-disable no-template-curly-in-string */
    notGitRepo: '%{$fg[black]$bg[white]%} ø git %{${reset_color}%}',
    /* eslint-enable no-template-curly-in-string */
  },
  labels: {
    '?': ({ staged }) => colorizeWarn(' \\? ', ` ${staged} `),
    A: ({ staged, unstaged }) =>
      colorizeInfo(
        ' A ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
      ),
    C: ({ staged, unstaged }) =>
      colorizeWarn(
        ' C ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
      ),
    D: ({ staged, unstaged }) =>
      colorizeInfo(
        ' D ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
      ),
    M: ({ staged, unstaged }) =>
      colorizeInfo(
        ' M ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
      ),
    R: ({ staged, unstaged }) =>
      colorizeInfo(
        ' R ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
      ),
    U: ({ staged, unstaged }) =>
      colorizeWarn(
        ' U ', ` ${staged ? `+${staged}` : ''}${staged && unstaged ? '/' : ''}${unstaged ? `-${unstaged}` : ''} `
      ),
    separator: ' ',
    branch: ({ branch, local, remote }) =>
      colorize('green')(
        ` ${branch} `,
        local || remote
          ? ` ${local ? `+${local}` : ''}${local && remote ? '/' : ''}${remote ? `-${remote}` : ''} `
          : ''
      ),
  },
}
const config = Object.assign(
  {},
  defaultConf,
  // eslint-disable-next-line import/no-dynamic-require
  customConf ? require(customConf) : {}
)

const print = status => process.stdout.write(
  config
    .order
    .filter(label => Object.values(status[label]).some(value => value))
    .map(label => config.labels[label](status[label]))
    .join(config.labels.separator)
    .trim()
)

new Promise((resolve, reject) => {
  exec('git rev-parse --is-inside-work-tree', (err, stdout) => (err || stdout.trim() !== 'true'
    ? reject(new Error('not_git_repo'))
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
  .then(([local, remote, status]) =>
    Object.assign({}, status, { branch: { local, remote, branch: status.branch.branch } }))
  .then(print)
  .catch(err => process.stdout.write(
    `${err}` === 'Error: not_git_repo'
      ? config.errors.notGitRepo
      : 'ERR: no git status'
  ))

process.stdout.on('error', ({ code }) => code === 'EPIPE' && process.exit(0))

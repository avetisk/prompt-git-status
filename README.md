# Description
Basic git status for prompt

**DEPRECATED!!!*

Use https://github.com/avetisk/zsh-git-prompt instead. This new version is written in python, using libgit2, and thus is blazing fast compared to the node version (mainly because node takes too much time to start).

# Custom format
Default format is made for ZSH, but you can easily make you own for BASH, KSH, etc.

```sh
export AVETISK_GIT_PROMPT=/absolute/path/to/config.js
```

Configuration file should be something like this:

```javascript
const colorize = color => (firstStr, secondStr = '') =>
    `%{$fg[black]$bg[${color}]%}${firstStr}%{\${reset_color}%}%{$fg[black]$bg[white]%}${secondStr}%{\${reset_color}%}`
const colorizeInfo = colorize('blue')
const colorizeWarn = colorize('red')

export default {
  order: ['U', 'C', 'D', 'R', '?', 'A', 'M', 'branch'],
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
```

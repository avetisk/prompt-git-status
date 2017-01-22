# Description
Basic git status for prompt

# Custom format
Default format is made for ZSH, but you can easily make you own for BASH, KSH, etc.

```sh
export AVETISK_GIT_PROMPT=/absolute/path/to/config.js
```

Configuration file should be something like this:

```javascript
const colorize = firstColor => (firstStr, secondStr = '') =>
    `%{$fg[black]$bg[${firstColor}]%}${firstStr}%{\${reset_color}%}%{$fg[black]$bg[white]%}${secondStr}%{\${reset_color}%}`
const colorizeInfo = colorize('blue')
const colorizePrimary = colorize('blue')
const colorizeWarn = colorize('red')

export default {
  '?': count => colorizeWarn(' \\? ', ` ${count} `),
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
  branch: ({ branch }) => colorize('red')(` ${branch} `),
}
```

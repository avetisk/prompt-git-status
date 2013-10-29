# Description
Basic git status for prompt

# Custom format
Default format is made for ZSH, but you can easily make you own for BASH, KSH, etc.

Simply export a stringified JSON:

```sh
export AVETISK_GIT_PROMPT='{"branch":"[<val>]","M":"M <val>"}';
```

Default JSON is:

```javascript
{
  "branch": "%{$fg[white]$bg[red]%} <val> %{${reset_color}%}",
  "M": "%{$fg[white]$bg[blue]%} M <val> %{${reset_color}%}",
  "A": "%{$fg[white]$bg[green]%} A <val> %{${reset_color}%}",
  "D": "%{$fg[white]$bg[blue]%} D <val> %{${reset_color}%}",
  "R": "%{$fg[white]$bg[blue]%} R <val> %{${reset_color}%}",
  "C": "%{$fg[white]$bg[blue]%} C <val> %{${reset_color}%}",
  "U": "%{$fg[white]$bg[blue]%} U <val> %{${reset_color}%}",
  "?": "%{$fg[white]$bg[red]%} \\? <val> %{${reset_color}%}",
  "push": "%{$fg[white]$bg[magenta]%} ⌃ <val> %{${reset_color}%}",
  "pull": "%{$fg[white]$bg[magenta]%} ⌄ <val> %{${reset_color}%}",
  "separator": " %{$fg[white]%}·%{${reset_color}%} "
}
```

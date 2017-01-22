module.exports = {
  extends: 'airbnb',
  rules: {
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-nested-ternary': 'off',
    semi: ['error', 'never'],
  },
}

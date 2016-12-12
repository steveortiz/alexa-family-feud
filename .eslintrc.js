module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
    'mocha',
    'sinon',
  ],
  rules: {
    'mocha/no-exclusive-tests': 'error',
  },
  env: {
    mocha: true,
  },
  globals: {
    sinon: true,
    should: true,
  },
};

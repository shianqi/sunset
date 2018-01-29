module.exports = {
  extends: "standard",
  env: {
    "es6": true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
  },
  env: {
    browser: true
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-unused-vars': 1,
    'comma-dangle': [2, "only-multiline"],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  }
};

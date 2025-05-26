const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  roots: ['<rootDir>/src'],
  moduleDirectories: [
    'node_modules',
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, "frontend", 'node_modules'),
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  // Adicione esta linha:
  moduleNameMapper: {
    "^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
};
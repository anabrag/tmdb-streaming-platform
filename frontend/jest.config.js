module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)",
    "/node_modules/(?!(axios|some-other-lib)/)" 
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  }
};

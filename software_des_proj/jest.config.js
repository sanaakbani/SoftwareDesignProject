module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.tests.js' }],
    },
};

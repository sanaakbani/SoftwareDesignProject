module.exports = function (api) {
    if (api.env('test')) {
      return {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-react',
        ],
      };
    } else {
      return {};
    }
};


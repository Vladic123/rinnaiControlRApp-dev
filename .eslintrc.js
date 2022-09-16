module.exports = {
    root: true,
    extends: '@react-native-community',
    rules: {
        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: '@react-native-firebase/analytics',
                        message: 'Please use analytics service from /services/analytics instead.',
                    },
                ],
                patterns: [
                    {
                        group: ['**/services/API/**', '**/API', '!**/services/API'],
                        message: 'Please use the top level API object at /services/API instead',
                    },
                ],
            },
        ],
    },
    overrides: [
        {
            files: ['src/services/analytics.js'],
            rules: {
                'no-restricted-imports': 'off',
            },
        },
    ],
};

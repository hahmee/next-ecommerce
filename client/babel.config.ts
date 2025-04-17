module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-react',
        '@babel/preset-typescript',
        ['next/babel', {'preset-env': {
                modules: false, // ESM을 처리
                },
            },
        ],
    ],

};

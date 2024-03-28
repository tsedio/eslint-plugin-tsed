process.env.SEMANTIC_RELEASE_PACKAGE = "Eslint plugin Ts.ED";

export default {
  branch: 'main',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: [
          'package.json',
          'yarn.lock'
        ]
      }
    ],
    [
      'semantic-release-slack-bot',
      {
        markdownReleaseNotes: true,
        notifyOnSuccess: true
      }
    ]
  ]
}

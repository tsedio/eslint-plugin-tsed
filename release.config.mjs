process.env.SEMANTIC_RELEASE_PACKAGE = 'Eslint plugin Ts.ED'

export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        //npmPublish: false
      }
    ],
    '@semantic-release/github',
    [
      '@semantic-release/github',
      {
        assets: [
          'package.json',
          'yarn.lock'
        ],
        'message': 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
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

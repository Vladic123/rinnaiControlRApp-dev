const {google} = require('googleapis');
const fs = require('fs');
const util = require('util');

module.exports = async function (packageName, apiKeyLocation) {
  const artifactPath =
    './android/app/build/outputs/bundle/release/app-release.aab';
  const bundle = fs.readFileSync(artifactPath);

  const client = await google.auth.getClient({
    keyFilename: apiKeyLocation,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });

  const androidpublisher = google.androidpublisher({
    version: 'v3',
    auth: client,
  });

  const insertResponse = await androidpublisher.edits.insert({
    packageName,
  });

  if (!insertResponse.data.id) {
    throw new Error(
      `failed to create new edit. returned: ${util.inspect(insertResponse)}`,
    );
  }

  const uploadResponse = await androidpublisher.edits.bundles.upload({
    packageName,
    editId: insertResponse.data.id,
    media: {
      body: bundle,
    },
  });

  const editTrackResponse = await androidpublisher.edits.tracks.update({
    editId: insertResponse.data.id,
    packageName,
    track: 'internal',
    requestBody: {
      releases: [
        {
          status: 'completed',
          versionCodes: [ uploadResponse.data.versionCode ]
        }
      ]
    }
  });

  if (uploadResponse.status !== 200) {
    throw new Error(
      `failed to upload. returned: ${util.inspect(uploadResponse)}`,
    );
  }

  const commitResponse = await androidpublisher.edits.commit({
    packageName,
    editId: insertResponse.data.id,
  });

  if (commitResponse.status !== 200) {
    throw new Error(
      `failed to commit edit. returned: ${util.inspect(commitResponse)}`,
    );
  }
}

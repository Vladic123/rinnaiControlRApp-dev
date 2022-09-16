const publish = require('./publish');

function main() {
  if (process.argv.length < 4) {
    throw new Error(
      'Package name or api key location not provided...',
    );
  }

  const packageName = process.argv[2];
  const apiKeyLocation = process.argv[3];

  return publish(packageName, apiKeyLocation)
}

main();

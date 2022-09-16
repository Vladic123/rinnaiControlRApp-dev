const core = require('@actions/core');
const publish = require('./publish');

function main() {
    const packageName = core.getInput('package-name');
    const apiKeyLocation = core.getInput('api-key-location');

    return publish(packageName, apiKeyLocation)
}

main();

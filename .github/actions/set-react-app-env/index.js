const core = require('@actions/core');
const fs = require("fs");

try {
    const apiBaseUrl = core.getInput('api-base-url');
    const migrationApiBaseUrl = core.getInput('migration-api-base-url')
    const migrationApiKey = core.getInput('migration-api-key')
    const envFilePath = './src/env.json';
    const envFile = {};
    envFile.API_BASE_URL = apiBaseUrl;
    envFile.MIGRATION_API_BASE_URL = migrationApiBaseUrl;
    envFile.MIGRATION_API_KEY = migrationApiKey;
    fs.writeFileSync(envFilePath, JSON.stringify(envFile), undefined, 2);
} catch (error) {
    core.setFailed(error.message);
}

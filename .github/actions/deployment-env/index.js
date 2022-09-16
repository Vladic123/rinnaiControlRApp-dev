const core = require('@actions/core');

const config = {
    staging: {
        apiBaseUrl: 'https://klxspjc39h.execute-api.us-east-1.amazonaws.com/Prod',
        migrationApiBaseUrl: 'https://vlbekxul63.execute-api.us-east-1.amazonaws.com/Prod',
        region: 'us-east-1',
        iotRegion: 'us-east-1',
        iotEndpoint: 'iot.us-east-1.amazonaws.com',
        iotDataEndpoint: 'a3ltghp21wfk1c-ats.iot.us-west-2.amazonaws.com',
        graphqlEndpoint: 'https://vaosmn7ro5dell7mqiajj5ut4q.appsync-api.us-east-1.amazonaws.com/graphql',
        graphqlAppId: '6l2y72zpkjf77naht6odmvdi7m',
        amplifyAppId: 'd5wf80ssre413',
        iosApplicationIdentifier: "com.rinnai.heater-staging",
        iosProvisioningProfileIdentifier: 'ba22a805-d5dc-4442-a9b7-83d0b0a74d48',
        androidApplicationIdentifier: 'com.controlr.staging'
    },
    production: {
        apiBaseUrl: 'https://698suy4zs3.execute-api.us-east-1.amazonaws.com/Prod',
        migrationApiBaseUrl: 'https://1gadw43eec.execute-api.us-east-1.amazonaws.com/Prod',
        region: 'us-east-1',
        iotRegion: 'us-east-1',
        iotEndpoint: 'iot.us-east-1.amazonaws.com',
        iotDataEndpoint: 'a2ac1jff6fsuqp-ats.iot.us-east-1.amazonaws.com',
        graphqlEndpoint: 'https://s34ox7kri5dsvdr43bfgp6qh6i.appsync-api.us-east-1.amazonaws.com/graphql',
        graphqlAppId: 'ho2l5e3jvbd63avacjdvxni6ni',
        amplifyAppId: 'd3dhglj04wagiy',
        iosApplicationIdentifier: 'com.rinnai.heater-dev',
        iosProvisioningProfileIdentifier: '00434c68-f88b-4b65-9418-ede1145bed91',
        androidApplicationIdentifier: 'com.controlr'
    }
};

try {
    const githubRef = core.getInput('github-ref');

    let env;
    if (githubRef.toLowerCase().includes('staging')) {
        env = 'staging';
    } else if (githubRef.toLowerCase().includes('master')) {
        env = 'production'
    } else if (githubRef.toLowerCase().includes('dev')) {
        env = 'dev'
    } else {
        core.setFailed("Target deployment environment is not setup");
    }

    core.setOutput("api-base-url", config[env].apiBaseUrl);
    core.setOutput("migration-api-base-url", config[env].migrationApiBaseUrl);
    core.setOutput('amplify-region', config[env].region);
    core.setOutput("deployment-env", env);

    core.setOutput("graphql-endpoint", config[env].graphqlEndpoint);
    core.setOutput("graphql-app-id", config[env].graphqlAppId);

    core.setOutput("iot-region", config[env].iotRegion);
    core.setOutput("iot-endpoint", config[env].iotEndpoint);
    core.setOutput("iot-data-endpoint", config[env].iotDataEndpoint);

    core.setOutput("amplify-app-id", config[env].amplifyAppId);
    core.setOutput('ios-application-identifier', config[env].iosApplicationIdentifier);
    core.setOutput('android-application-identifier', config[env].androidApplicationIdentifier);
    core.setOutput('ios-provisioning-profile-identifier', config[env].iosProvisioningProfileIdentifier)
} catch (error) {
    core.setFailed(error.message);
}

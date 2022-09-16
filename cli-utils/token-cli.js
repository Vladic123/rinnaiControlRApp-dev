import Amplify, {Auth} from 'aws-amplify';
import awsconfig from '../src/aws-exports.js';

export async function main() {
    Amplify.configure(awsconfig);

    const username = process.argv[2];
    const password = process.argv[3];

    const res = await Auth.signIn({
        username,
        password,
    });

    console.log(JSON.stringify(res, null, 2));
}

main().then(() => console.log('success....'));

import axios from 'axios';
import {moduleConfig} from '../../config';

const scheme = 'http';

export default {
    checkAyla: function () {
        const url = getUrlForLegacyResource('status.json');

        return axios
            .get(url)
            .then((res) => res.data)
            .catch(errorLoggingInterceptor);
    },
    getV2Resource: function (resource) {
        const url = getUrlForResource(resource);

        return axios
            .get(url)
            .then((res) => res.data)
            .catch(errorLoggingInterceptor);
    },
    postResource: function (resource, data) {
        const url = getUrlForResource(resource);
        // all current module post requests put the data in the url params as opposed to the body
        const body = null;
        const params = data;
        return axios.post(url, body, {params}).catch(errorLoggingInterceptor);
    },
};

function getUrlForLegacyResource(resource) {
    return `${scheme}:${moduleConfig.internalStaticIP}/${resource}`;
}

function getUrlForResource(resource) {
    return `${scheme}:${moduleConfig.internalStaticIP}/api/${resource}`;
}

function errorLoggingInterceptor(err) {
    console.warn(err);
    throw err;
}

// import {device} from 'aws-iot-device-sdk-v2';
// const awsIot = require('aws-iot-device-sdk-v2');
const awsIot = require('aws-iot-device-sdk');

//load the settings file that contains the location of the device certificates and the clientId of the sensor
var settings = require('./settings.json');
const thingName = 'CR_bd471005-e321-4ce8-9570-8df41312c199';

//constants used in the application
const SHADOW_TOPIC = `$aws/things/${thingName}/shadow/update`;

//initialize the IOT device
var controlR = awsIot.device(settings);
//shadow document to be transmitted at statup

var shadowDocument = {
    state: {
        desired: {
            set_domestic_temperature: 120,
        },
    },
};

console.log('connected to IoT Hub');

//publish the shadow document for the sensor

controlR.publish(SHADOW_TOPIC, JSON.stringify(shadowDocument));

console.log('published to shadow topic ' + SHADOW_TOPIC + ' ' + JSON.stringify(shadowDocument));

controlR.on('error', function (error) {
    console.log('Error: ', error);
});

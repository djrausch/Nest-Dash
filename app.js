vars = require('./vars');
dash_button = require('node-dash-button');
nest = require('unofficial-nest-api');

var device;
var structure;
var dash = dash_button(vars.AMAZON_DASH_BUTTON_MAC);

console.log("Nest API Connecting...");
nest.login(vars.NEST_USER_NAME, vars.NEST_PASSWORD, function (err, data) {
    if (err) {
        console.log(err.message);
        process.exit(1);
        return;
    }
    console.log('Logged in!');
    listenForDash();
});

function fetchNestStatus(callback) {
    nest.fetchStatus(function (data) {
        structure = data.structure[vars.NEST_STRUCTURE_ID];
        for (var deviceId in data.device) {
            if (data.device.hasOwnProperty(deviceId)) {
                device = data.shared[deviceId];
            }
        }
        callback();
    });
}

function listenForDash() {
    console.log("Listening For Dash Button...");
    dash.on("detected", function () {
        console.log("Button Pressed!");
        fetchNestStatus(function () {
            console.log("Current Temp: " + nest.ctof(device.current_temperature));
            if (structure.away) {
                console.log("Nest is set to Away. Setting to home.");
                nest.setHome();
            } else {
                console.log("Nest is set to home.");
            }
        });

    });
}

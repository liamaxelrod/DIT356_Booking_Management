const mqtt = require('mqtt')
const subscriber = require('../booking-management/subscriber')
const publisher = require('../booking-management/publisher')
const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'group6_dentistimo',
  password: 'dentistimo123!',
  reconnectPeriod: 1000,
})


//subscriber
subscriber.subscribe_topic()

//publisher
//publisher.publish_topic()


// Handle errors
client.on("error", function (error) {
    console.log("Error occurred: " + error);
    if(err.code == "ENOTFOUND") {
      console.log("Network error, make sure you have an active internet connection")
  }
});

// Notify reconnection
client.on("reconnect", function () {
    console.log("Reconnection starting");
});

// Notify offline status
client.on("offline", function () {
    console.log("Currently offline. Please check internet!");
});

client.on("close", function() {
  console.log("Connection closed by client")
});
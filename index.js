const mqtt = require('mqtt')
<<<<<<< HEAD
const pipe1 = require('./filterBooking')
=======
const subscriber = require('../booking-management/subscriber')
const publisher = require('../booking-management/publisher')
>>>>>>> origin/main
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

<<<<<<< HEAD
const topic = 'my/test/topic'
const topic1 = '/nodejs/albin'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
    console.log(clientId)
  })
  client.subscribe([topic1], () => {
    console.log(`Subscribe to topic '${topic1}'`)
    console.log(clientId)
  })
  client.publish(topic, 'nodejs mqtt test', { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  var message = payload.toString()
    if(topic == 'my/test/topic'){
    pipe1.filterTopic(topic, message)
  }else if(topic1 == '/nodejs/albin'){
    console.log(message)
  }else{
    console.log("Does not work")
  }
  

})
=======

//subscriber
subscriber.subscribe_topic()

//publisher
//publisher.publish_topic()

>>>>>>> origin/main

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
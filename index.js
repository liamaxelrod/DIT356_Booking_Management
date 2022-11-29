const mqtt = require('mqtt')

const subscriber = require('../booking-management/subscriber')
const publisher = require('../booking-management/publisher')
const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const mongoose = require("mongoose");
const dentistOffices = require('../booking-management/models/dentistOffice')
const booking = require('../booking-management/models/booking')

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'group6_dentistimo',
  password: 'dentistimo123!',
  reconnectPeriod: 1000,
})

// Set up default mongoose connection

//Remote
//var mongoURI = process.env.MONGODB_URI ;

//local
var mongoURI = "mongodb://localhost:27017/Dentistimo";

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
      console.error(err.stack);
      process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  }
);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));


//subscriber
subscriber.subscribe_topic()

//publisher
//publisher.publish_topic()

const new_office = new dentistOffices({ id: 2 });

// Save the new model instance, passing a callback
new_office.save((err) => {
    if (err) return handleError(err);
    // saved!
  });


// async function run() {
//   // Delete the document by its _id
//   await booking.findOneAndDelete({"userid": 1})
// }

// run();


// async function findBooking() {
//   // Delete the document by its _id
//   const somebooking = await booking.findById("6385d7d20677863636b6de74")
//   console.log(somebooking)
// }

// findBooking();


// async function deleteBooking() {
//   // Delete the document by its _id
//   const deleteSomeBooking = await booking.deleteOne({_id: "6385d7d20677863636b6de74"})
//   console.log(deleteSomeBooking)
// }

// deleteBooking();


// Handle errors
client.on("error", function (error) {
    console.log("Error occurred: " + error);
    if(error.code == "ENOTFOUND") {
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
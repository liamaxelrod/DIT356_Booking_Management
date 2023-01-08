require('dotenv').config()
const mqtt = require('mqtt')
const subscriber = require('../booking-management/subscriber')
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const mongoose = require('mongoose')
const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000
})
// const dentistOffices = require('../booking-management/models/dentistOffice')

// Set up default mongoose connection
const mongoURI = process.env.MONGODB_URI

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`)
      console.error(err.stack)
      process.exit(1)
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`)
  }
)

// Get the default connection
const db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// subscriber
subscriber.subscribeTopic()

// Add dentist office registry
// dentistOffices.addToDentistDb()

// Handle errors
client.on('error', function (error) {
  console.log('Error occurred: ' + error)
  if (error.code === 'ENOTFOUND') {
    console.log('Network error, make sure you have an active internet connection')
  }
})

// Notify reconnection
client.on('reconnect', function () {
  console.log('Reconnection starting')
})

// Notify offline status
client.on('offline', function () {
  console.log('Currently offline. Please check internet!')
})

client.on('close', function () {
  console.log('Connection closed by client')
})

process.on('uncaughtException', function () {
})

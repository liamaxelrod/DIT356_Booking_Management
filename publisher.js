const mqtt = require('mqtt')
const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
// const dentistOffices = require('../booking-management/models/dentistOffice')

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'group6_dentistimo',
  password: 'dentistimo123!',
  reconnectPeriod: 1000
})

const topic = 'my/test/topic'

function publishTopic () {
  // const topic1 = '/nodejs/albin'
  client.on('connect', () => {
    client.publish(topic, 'nodejs mqtt test', { qos: 1, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
}

// Post deleted bookings
function publishDeletedBooking (topic) {
  const pubMessage = 'Booking has succesfully been removed'
  client.publish(topic, pubMessage, { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish message when a successfull booking has been made
function publishBookingDate (topic, message) {
  topic = 'dentistimo/booking/succesfull-booking'
  const pubUserId = message.userid
  const pubRequestId = message.requestid
  const pubTime = message.time
  const pubMessage = ({ userId: pubUserId, requestId: pubRequestId, time: pubTime })

  client.publish(topic, JSON.stringify(pubMessage), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// Publish all available dentist offices
async function publishAllOffices (message) {
  const dentistTopic = 'dentistimo/dentist-office/get-all'
  client.publish(dentistTopic, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

module.exports = { publishTopic, publishDeletedBooking, publishBookingDate, publishAllOffices }

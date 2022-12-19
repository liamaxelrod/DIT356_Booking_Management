<<<<<<< publisher.js
module.exports = { publishTopic, publishDeletedBooking, publishBookingDate, publishBreakFika, publishAllOffices, publishOneOffice, publishFilteredOffices }
=======
module.exports = { publishTopic, publishDeletedBooking, publishBookingDate, publishBreakFika, publishAllOffices, publishOneOffice, publishFilteredOffices, publishAllDentistAppointments, publishAllDentistAppointmentsDay }
>>>>>>> publisher.js
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
  topic = 'dentistimo/booking/succesful-booking'
  let pubMessage
  if (message !== null) {
    const pubUserId = message.userid
    const pubRequestId = message.requestid
    const pubDate = message.date
    const pubTime = message.time
    pubMessage = ({ userId: pubUserId, requestId: pubRequestId, date: pubDate, time: pubTime })
  } else {
    pubMessage = 'Booking unavailable'
  }
  client.publish(topic, (JSON.stringify(pubMessage)), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

// This method will publish breaks to the frontend and topic will differ depending on break or lunch in the 'breakType' attribute
function publishBreakFika (topic, message) {
  let breakTopic = ''
  if (message.breakType === 'break') {
    breakTopic = 'dentistimo/dentist/break-booked'
  } else if (message.breakType === 'lunch') {
    breakTopic = 'dentistimo/dentist/lunch-booked'
  }
  const pubMessage = ({ dentistid: message.dentistid, breakType: message.breakType, date: message.date, time: message.time })
  console.log(breakTopic)
  client.publish(breakTopic, (JSON.stringify(pubMessage)), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}
// Publish all available dentist offices
function publishAllOffices (message) {
  const dentistTopic = 'dentistimo/dentist-office/get-all'
  client.publish(dentistTopic, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

function publishOneOffice (message) {
  const foundOfficeTopic = 'dentistimo/dentist-office/one-office'
  client.publish(foundOfficeTopic, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

<<<<<<< publisher.js
function publishFilteredOffices (message) {
  const filteredOfficeTopic = 'dentistimo/dentist-office/filtered-office'
  client.publish(filteredOfficeTopic, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
=======
function publishAllDentistAppointments (message) {
  const foundAppointments = 'dentistimo/dentist-appointment/all-appointments'
  client.publish(foundAppointments, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}
function publishAllDentistAppointmentsDay (message) {
  const foundAppointments = 'dentistimo/dentist-appointment/all-appointments-day'
  client.publish(foundAppointments, JSON.stringify(message), { qos: 1, retain: false }, (error) => {
>>>>>>> publisher.js
    if (error) {
      console.error(error)
    }
  })
}

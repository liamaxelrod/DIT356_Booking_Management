module.exports = { subscribeTopic }

const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipeBooking = require('../booking-management/Filter/filterBooking')
const pipeDentist = require('../booking-management/Filter/filterDentist')
const pipeOffice = require('../booking-management/Filter/filterOffice')
const timeAppointments = require('../booking-management/publishAppointments')

const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'group6_dentistimo',
  password: 'dentistimo123!',
  reconnectPeriod: 1000
})
function subscribeTopic () {
  // User booking appointments
  const topic1 = 'dentistimo/booking/create-booking'
  const topic2 = 'dentistimo/booking/delete-booking'
  const timeAvailability = 'dentistimo/appointment/free'

  // Dentist breaks
  const topic3 = 'dentistimo/dentist/breaks'
  const topic4 = 'dentistimo/dentist-appointment/get-all-appointments'
  const topic5 = 'dentistimo/dentist-appointment/get-all-appointments-day'

  // Dentist Office topics:
  const officeTopic = 'dentistimo/dentist-office/fetch-all'
  const officeTopic2 = 'dentistimo/dentist-office/fetch-one'
  const officeAvailability = 'dentistimo/dentist-office/fetch-availability'

  client.on('connect', () => {
    console.log('Connected')
    client.subscribe([officeAvailability], () => {
      console.log(`Subscribe to topic '${officeAvailability}'`)
      console.log(clientId)
    })
    client.subscribe([topic1], () => {
      console.log(`Subscribe to topic '${topic1}'`)
      console.log(clientId)
    })
    client.subscribe([topic2], () => {
      console.log(`Subscribe to topic '${topic2}'`)
      console.log(clientId)
    })
    client.subscribe([topic3], () => {
      console.log(`Subscribe to topic '${topic3}'`)
    })
    client.subscribe([officeTopic], () => {
      console.log(`Subscribe to topic '${officeTopic}'`)
      console.log(clientId)
    })
    client.subscribe([officeTopic2], () => {
      console.log(`Subscribe to topic '${officeTopic2}'`)
      console.log(clientId)
    })
    client.subscribe([timeAvailability], () => {
      console.log(`Subscribe to topic '${timeAvailability}'`)
      console.log(clientId)
    })
    client.subscribe([topic4], () => {
      console.log(`Subscribe to topic '${topic4}'`)
    })
    client.subscribe([topic5], () => {
      console.log(`Subscribe to topic '${topic5}'`)
    })
  })
}

// Filtering the different topics
client.on('message', (topic, payload) => {
  if (topic === 'dentistimo/dentist-office/fetch-availability') {
    pipeOffice.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/create-booking') {
    console.log(JSON.stringify(payload))
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/delete-booking') {
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist/breaks') {
    pipeDentist.filterTopic(topic, payload)
    // console.log(message)
  } else if (topic === 'dentistimo/dentist-office/fetch-all') {
    // console.log(message)
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-office/fetch-one') {
    // console.log(message)
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/appointment/free') {
    timeAppointments.testFunction(topic, payload)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments') {
    // console.log(message)
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments-day') {
    // console.log(message)
    pipeDentist.filterTopic(topic, payload)
  } else {
    console.log('Not a correct topic')
  }
})

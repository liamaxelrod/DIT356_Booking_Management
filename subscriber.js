module.exports = { subscribeTopic }

const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipeBooking = require('./Filter/filterBooking')
const pipeDentist = require('../booking-management/Filter/filterDentist')

const host = 'e33e41c289ad4ac69ae5ef60f456e9c3.s2.eu.hivemq.cloud'
const port = '8883'

const connectUrl = `mqtts://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000
})
function subscribeTopic () {
  const topic = 'my/test/topic'
  const topic1 = 'dentistimo/booking/create-booking'
  const topic2 = 'dentistimo/booking/delete-booking'
  const topic3 = 'dentistimo/dentist/breaks'

  // Dentist Office topics:
  const officeTopic = 'dentistimo/dentist-office/fetch-all'
  const officeTopic2 = 'dentistimo/dentist-office/fetch-one'

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
  })
}

// Filtering the different topics
client.on('message', (topic, payload) => {
  if (topic === 'my/test/topic') {
    console.log(payload)
  } else if (topic === 'dentistimo/booking/create-booking') {
    console.log(JSON.stringify(payload))
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/delete-booking') {
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist/breaks') {
    pipeDentist.filterTopic(topic, payload)
    // console.log(message)
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-office/fetch-all') {
    // console.log(message)
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-office/fetch-one') {
    // console.log(message)
    pipeDentist.filterTopic(topic, payload)
  } else {
    console.log('Not a correct topic')
  }
})

module.exports = { subscribeTopic }

const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipe1 = require('../booking-management/filterBooking')

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
  const topic = 'my/test/topic'
  const topic1 = 'dentistimo/booking/create-booking'
  const topic2 = 'dentistimo/booking/delete-booking'
  const topic3 = 'dentistimo/dentist/breaks'


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
      console.log(clientId)
    })
  })
}

client.on('message', (topic, payload) => {
  // console.log('Received Message:', topic, payload.toString())
  if (topic === 'my/test/topic') {
    console.log(payload)
  } else if (topic === 'dentistimo/booking/create-booking') {
    pipe1.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/delete-booking') {
    console.log(payload)
    pipe1.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist/breaks') {
    console.log(payload)
    pipe1.filterTopic(topic, payload)
  } else {
    console.log('funkar ej')
  }
})

module.exports = { subscribeTopic }

const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipeBooking = require('../booking-management/Filter/filterBooking')
const pipeAppointment = require('../booking-management/Filter/filterAppointment')
const pipeDentist = require('../booking-management/Filter/filterDentist')
const pipeOffice = require('../booking-management/Filter/filterOffice')
const timeAppointments = require('../booking-management/publishAppointments')
const addNewDentist = require('../booking-management/addDentist')

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

const requestTopic = 'dentistimo/authentication'
const responseTopic = 'dentistimo/authentication/response'

async function verifyIdToken (payload, client) {
  // Extract the idToken from the payload
  const { idToken } = JSON.parse(payload)

  // Send a request to verify the idToken
  client.publish(requestTopic, JSON.stringify({ idToken }))

  // Wait for the response
  const response = await new Promise((resolve, reject) => {
    client.on('message', (topic, message) => {
      if (topic === responseTopic) {
        resolve(JSON.parse(message))
      }
    })
  })
  // Check the status of the response
  if (response.status === 'Unauthorized') {
    throw new Error('Unauthorized')
  } else if (response.status === 'Authorized') {
    return response
  }
}

function subscribeTopic () {
  // User booking appointments
  const topic1 = 'dentistimo/booking/create-booking'
  const topic2 = 'dentistimo/booking/delete-booking'
  const timeAvailability = 'dentistimo/appointment/free'

  // Dentist breaks
  const topic3 = 'dentistimo/dentist/breaks'
  const topic4 = 'dentistimo/dentist-appointment/get-all-appointments'
  const topic5 = 'dentistimo/dentist-appointment/get-all-appointments-day'
  const topic6 = 'dentistimo/user-appointment/get-all-appointments-day'
  const topic7 = 'dentistimo/user-appointment/get-all-appointments'
  const topic8 = 'dentistimo/booking/delete-break'

  // Dentist Office topics:
  const officeTopic = 'dentistimo/dentist-office/fetch-all'
  const officeTopic2 = 'dentistimo/dentist-office/fetch-one'
  const officeAvailability = 'dentistimo/dentist-office/fetch-availability'
  const addDentist = 'dentistimo/add-dentist'

  client.on('connect', () => {
    console.log('Connected')
    client.subscribe([officeAvailability], () => {
      console.log(`Subscribe to topic '${officeAvailability}'`)
    })
    client.subscribe([topic1], () => {
      console.log(`Subscribe to topic '${topic1}'`)
    })
    client.subscribe([topic2], () => {
      console.log(`Subscribe to topic '${topic2}'`)
    })
    client.subscribe([topic3], () => {
      console.log(`Subscribe to topic '${topic3}'`)
    })
    client.subscribe([officeTopic], () => {
      console.log(`Subscribe to topic '${officeTopic}'`)
    })
    client.subscribe([officeTopic2], () => {
      console.log(`Subscribe to topic '${officeTopic2}'`)
    })
    client.subscribe([timeAvailability], () => {
      console.log(`Subscribe to topic '${timeAvailability}'`)
    })
    client.subscribe([topic4], () => {
      console.log(`Subscribe to topic '${topic4}'`)
    })
    client.subscribe([topic5], () => {
      console.log(`Subscribe to topic '${topic5}'`)
    })
    client.subscribe([addDentist], () => {
      console.log(`Subscribe to topic '${addDentist}'`)
    })
    client.subscribe([topic6], () => {
      console.log(`Subscribe to topic '${topic6}'`)
    })
    client.subscribe([topic7], () => {
      console.log(`Subscribe to topic '${topic7}'`)
    })
    client.subscribe([topic8], () => {
      console.log(`Subscribe to topic '${topic8}'`)
    })
    client.subscribe([responseTopic], () => {
      console.log(`Subscribe to topic '${responseTopic}'`)
    })
  })
}

// Filtering the different topics
client.on('message', async (topic, payload) => {
  if (topic !== responseTopic && topic !== 'dentistimo/add-dentist') {
    try {
      const userID = await verifyIdToken(payload, client)
      payload = JSON.parse(payload)
      if (userID.role === 'Dentist') {
        payload.dentistid = userID.id
        // If the JWT is valid, execute the rest of the logic
        handleRequest(topic, payload)
      } else {
        payload.userid = userID.id
        // If the JWT is valid, execute the rest of the logic
        handleRequest(topic, payload)
      }
    } catch (error) {
      console.log(error.message)
    }
  } else {
    handleRequest(topic, payload)
  }
})

// Filtering the different topics
async function handleRequest (topic, payload) {
  if (topic === 'dentistimo/dentist-office/fetch-availability') {
    pipeOffice.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/create-booking') {
    pipeAppointment.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/delete-booking') {
    pipeAppointment.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist/breaks') {
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-office/fetch-all') {
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-office/fetch-one') {
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/appointment/free') {
    timeAppointments.testFunction(topic, payload)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments') {
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/dentist-appointment/get-all-appointments-day') {
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/user-appointment/get-all-appointments-day') {
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/user-appointment/get-all-appointments') {
    pipeBooking.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/booking/delete-break') {
    pipeDentist.filterTopic(topic, payload)
  } else if (topic === 'dentistimo/add-dentist') {
    addNewDentist.addDentist(topic, payload)
  } else if (topic === 'dentistimo/authentication/response') {
    console.log()
  } else {
    console.log('Not a correct topic')
  }
}

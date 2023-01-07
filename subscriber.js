module.exports = { subscribeTopic }

const mqtt = require('mqtt')
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const pipeBooking = require('../booking-management/Filter/filterBooking')
const pipeAppointment = require('../booking-management/Filter/filterAppointment')
const pipeDentist = require('../booking-management/Filter/filterDentist')
const pipeOffice = require('../booking-management/Filter/filterOffice')
const timeAppointments = require('../booking-management/publishAppointments')
const addNewDentist = require('../booking-management/addDentist')
const CircuitBreaker = require('opossum')
let myFuncCalls = 0

const host = 'broker.emqx.io'
const port = '1883'

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000
})

// Authentication topics
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

// Circuit breaker control options
const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 25, // When 25% of requests fail, trip the circuit
  resetTimeout: 15000 // After 15 seconds, try again.
}

// Checks amount of incoming messages
function loadChecker (topic, message) {
  return new Promise((resolve, reject) => {
    myFuncCalls++
    // console.log(myFuncCalls)
    if (myFuncCalls < 20) {
      tokenHandler(topic, message)
      resolve()
      loadTimer()
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject()
      loadTimer()
    }
  })
}

// Functions for putting a timer on the load balancing and making it 0 after a given time.
function loadTimer () {
  setTimeout(makeZero, 10000)
}
function makeZero () {
  myFuncCalls = 0
}

// Filtering the different topics
client.on('message', async (topic, payload) => {
  if (topic !== responseTopic && topic !== 'dentistimo/add-dentist') {
    try {
      // Circuit breaker for the booking functionality
      let state
      const circuitBreaker = new CircuitBreaker(loadChecker, options)

      circuitBreaker.fallback(() => 'Sorry, out of service right now')
      circuitBreaker.on('open', () => {
        if (state !== 'opened') {
          console.log('Circuitbreaker opened')
          state = 'opened'
        }
      })
      circuitBreaker.on('halfOpen', () => {
        if (state !== 'halfOpen') {
          console.log('Circuitbreaker halfOpen')
          state = 'halfOpen'
        }
      })
      circuitBreaker.on('success', () => {
        if (state !== 'closed') {
          circuitBreaker.close()
          // console.log('Circuitbreaker closed')
          state = 'closed'
        }
      }
      )
      circuitBreaker.fire(topic, payload)
    } catch (error) {
      console.log(error.message)
    }
  } else {
    handleRequest(topic, payload)
  }
})

async function tokenHandler (topic, payload) {
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
}

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

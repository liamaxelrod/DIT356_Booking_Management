module.exports = { filterTopic }

// const mongoose = require('mongoose')
// const dentistOffices = require('../booking-management/models/dentistOffice')
// const Office = require('../models/dentistOffice')

// Send to another filter
function filterTopic (topic, message) {
  if (topic === 'dentistimo/dentist-office/fetch-availability') {
    checkAvailabilityFilter(topic, message)
  } else {
    console.log('Unable to read topic')
  }
}

// This filter will check the availability, similarly to the booking appointment
function checkAvailabilityFilter (topic, message) {
  message = JSON.parse(message)
  let payloadFrom = JSON.stringify(message.from)
  payloadFrom = payloadFrom.replace('"', '')
  payloadFrom = payloadFrom.replace('"', '')

  let payloadTo = JSON.stringify(message.to)
  payloadTo = payloadTo.replace('"', '')
  payloadTo = payloadTo.replace('"', '')

  // const d = '12:00:00'

  // getOffices()
  getOffices(payloadFrom, payloadTo)

  // if (d >= payloadFrom.valueOf() && d <= payloadTo.valueOf()) {
  //   console.log('Works')
  // } else if (d <= payloadFrom.valueOf() || d >= payloadTo.valueOf()) {
  //   console.log('Incorrect values')
  // } else {d
  //   console.log('Wrong')
  // }
}

// Function for getting all offices
async function getOffices (fromInput, toInput) {
  // Find, at the moment, one office with matching opening hours on mondays
  let dent = dentists.find(dent => dent.openinghours.monday === '7:00-19:00')
  dent = dent.openinghours.monday
  const myArray = dent.split('-')

  // Identifying when that office opens and close
  let OfficeHourFrom = myArray[0]
  let OfficeHourTo = myArray[1]

  // Converting those hours into comparable variables, including the user inputs
  OfficeHourFrom = parseInt(OfficeHourFrom)
  OfficeHourTo = parseInt(OfficeHourTo)
  fromInput = parseInt(fromInput)
  toInput = parseInt(toInput)

  // Checking if those hours are within that gap
  if (OfficeHourFrom <= fromInput && toInput <= OfficeHourTo) {
    console.log('Step 2 works')
  } else {
    console.log('It does not work')
  }
  // if (dentists.find(dent => dent.openinghours.monday === '7:00-19:00')) {
  //   console.log('It works')
  // } else {
  //   console.log('does not work')
  // }
}

const dentists = [
  {
    id: 1,
    name: 'Your Dentist',
    owner: 'Dan Tist',
    dentists: 3,
    address: 'Spannmålsgatan 20',
    city: 'Gothenburg',
    coordinate: {
      longitude: 11.969388,
      latitude: 57.707619
    },
    openinghours: {
      monday: '9:00-17:00',
      tuesday: '8:00-17:00',
      wednesday: '7:00-16:00',
      thursday: '9:00-17:00',
      friday: '9:00-15:00'
    }
  },
  {
    id: 2,
    name: 'Tooth Fairy Dentist',
    owner: 'Tooth Fairy',
    dentists: 1,
    address: 'Slottskogen',
    city: 'Gothenburg',
    coordinate: {
      longitude: 11.942625,
      latitude: 57.685255
    },
    openinghours: {
      monday: '7:00-19:00',
      tuesday: '7:00-19:00',
      wednesday: '7:00-19:00',
      thursday: '7:00-19:00',
      friday: '7:00-19:00'
    }
  },
  {
    id: 3,
    name: 'The Crown',
    owner: 'Carmen Corona',
    dentists: 2,
    address: 'Lindholmsallén 19',
    city: 'Gothenburg',
    coordinate: {
      longitude: 11.940386,
      latitude: 57.709872
    },
    openinghours: {
      monday: '6:00-15:00',
      tuesday: '8:00-17:00',
      wednesday: '7:00-12:00',
      thursday: '7:00-17:00',
      friday: '8:00-16:00'
    }
  },
  {
    id: 4,
    name: 'Lisebergs Dentists',
    owner: 'Glen Hysén',
    dentists: 3,
    address: 'Liseberg',
    city: 'Gothenburg',
    coordinate: {
      longitude: 11.991153,
      latitude: 57.694723
    },
    openinghours: {
      monday: '10:00-18:00',
      tuesday: '10:00-18:00',
      wednesday: '10:00-18:00',
      thursday: '10:00-18:00',
      friday: '10:00-18:00'
    }
  }
]

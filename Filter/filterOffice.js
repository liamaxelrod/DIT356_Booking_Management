const dentistOffices = require('../models/dentistOffice')
const publisher = require('../publisher')

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
  const d = new Date(message.date)
  const day = d.getDay()

  // If weekday: continue. If weekend: Terminate
  if (day > 0 && day < 6) {
    const dayMap = new Map()
    dayMap.set(1, 'monday')
    dayMap.set(2, 'tuesday')
    dayMap.set(3, 'wednesday')
    dayMap.set(4, 'thursday')
    dayMap.set(5, 'friday')
    const weekday = dayMap.get(day)
    timeCleaner(topic, message, weekday)
  } else {
    console.log('Weekend')
  }
}

function timeCleaner (topic, message, weekday) {
  // Cleaning up the input
  let payloadFrom = JSON.stringify(message.from)
  payloadFrom = payloadFrom.replace('"', '')
  payloadFrom = payloadFrom.replace('"', '')

  let payloadTo = JSON.stringify(message.to)
  payloadTo = payloadTo.replace('"', '')
  payloadTo = payloadTo.replace('"', '')
  checkHours(payloadFrom, payloadTo, topic, message, weekday)
}

// Function for getting all offices
async function checkHours (fromInput, toInput, topic, payload, weekday) {
  // Find, at the moment, one office with matching opening hours on mondays
  const filteredArray = dentists.filter(function (obj) {
    let checkFrom = 0
    if (weekday === 'monday') {
      checkFrom = obj.openinghours.monday.split('-')
    } else if (weekday === 'tuesday') {
      checkFrom = obj.openinghours.tuesday.split('-')
    } else if (weekday === 'wednesday') {
      checkFrom = obj.openinghours.wednesday.split('-')
    } else if (weekday === 'thursday') {
      checkFrom = obj.openinghours.thursday.split('-')
    } else if (weekday === 'friday') {
      checkFrom = obj.openinghours.friday.split('-')
    } else {
      console.log('Does not work')
    }
    checkFrom = checkFrom[0]
    checkFrom = parseInt(checkFrom)
    fromInput = parseInt(fromInput)
    let checkTo = obj.openinghours.monday.split('-')
    checkTo = checkTo[1]
    checkTo = parseInt(checkTo)
    fromInput = parseInt(fromInput)
    toInput = parseInt(toInput)
    // console.log('office', checkFrom, checkTo)
    return (((checkFrom <= fromInput && checkTo >= fromInput) || (checkFrom <= toInput && checkTo >= toInput)))
  }).map(function (obj) {
    return obj.id
  })

  // Checking if those hours are within that gap
  for (let i = 0; i <= filteredArray.length - 1; i++) {
    const filter = { id: filteredArray[i] }
    const officesToPublish = await dentistOffices.find(filter)
    publisher.publishFilteredOffices(officesToPublish)
  }
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

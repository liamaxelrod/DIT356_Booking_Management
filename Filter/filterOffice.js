const dentistOffices = require('../models/dentistOffice')
const publisher = require('../publisher')
module.exports = { filterTopic }
// Testing
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

  // If weekday: continue. If weekend: Terminate, hashmap the days into matching day
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

// Cleaning up the input from user
function timeCleaner (topic, message, weekday) {
  let payloadFrom = JSON.stringify(message.from)
  payloadFrom = payloadFrom.replace('"', '')
  payloadFrom = payloadFrom.replace('"', '')

  let payloadTo = JSON.stringify(message.to)
  payloadTo = payloadTo.replace('"', '')
  payloadTo = payloadTo.replace('"', '')
  checkHours(payloadFrom, payloadTo, topic, message, weekday)
}

// Find offices with matching opening hours on given date
async function checkHours (fromInput, toInput, topic, payload, weekday) {
  const openingHoursDay = dentists.filter(function (obj) {
    let dentistOpenFrom
    let dentistClosing
    // Checking which weekday
    if (weekday === 'monday') {
      dentistOpenFrom = obj.openinghours.monday.split('-')
      dentistClosing = dentistOpenFrom[1]
    } else if (weekday === 'tuesday') {
      dentistOpenFrom = obj.openinghours.tuesday.split('-')
      dentistClosing = dentistOpenFrom[1]
    } else if (weekday === 'wednesday') {
      dentistOpenFrom = obj.openinghours.wednesday.split('-')
      dentistClosing = dentistOpenFrom[1]
    } else if (weekday === 'thursday') {
      dentistOpenFrom = obj.openinghours.thursday.split('-')
      dentistClosing = dentistOpenFrom[1]
    } else if (weekday === 'friday') {
      dentistOpenFrom = obj.openinghours.friday.split('-')
      dentistClosing = dentistOpenFrom[1]
    } else {
      console.log('Does not work')
    }
    // Identifying office opening hours, closing hours & checking user input time 'from' and 'to'
    dentistOpenFrom = dentistOpenFrom[0]
    dentistOpenFrom = parseInt(dentistOpenFrom)
    fromInput = parseInt(fromInput)
    dentistClosing = parseInt(dentistClosing)
    fromInput = parseInt(fromInput)
    toInput = parseInt(toInput)
    return (((dentistOpenFrom <= fromInput && dentistClosing >= fromInput) || (dentistOpenFrom <= toInput && dentistClosing >= toInput) || (dentistOpenFrom >= fromInput && dentistClosing <= toInput)))
  }).map(function (obj) {
    return obj.id
  })
  // Publish to the broker the offices that have passed the filtration
  for (let i = 0; i <= openingHoursDay.length - 1; i++) {
    const dentistOffice = openingHoursDay[i]
    const filter = { id: dentistOffice }
    const officesToPublish = await dentistOffices.find(filter)
    publisher.publishFilteredOffices(officesToPublish)
  }
}

// Temp array copy of the dentist offices
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

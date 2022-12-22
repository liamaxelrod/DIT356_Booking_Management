module.exports = { testFunction }
const Booking = require('../booking-management/models/booking')
// const dentistOffices = require('../models/dentistOffice')
// const publisher = require('../publisher')

// This filter will check the availability, similarly to the booking appointment
function testFunction (topic, message) {
  message = JSON.parse(message)
  console.log(message)
  const d = new Date(message.date)
  const day = d.getDay()
  console.log(day)
  // If weekday: continue. If weekend: Terminate, hashmap the days into matching day
  if (day > 0 && day < 6) {
    const dayMap = new Map()
    dayMap.set(1, 'monday')
    dayMap.set(2, 'tuesday')
    dayMap.set(3, 'wednesday')
    dayMap.set(4, 'thursday')
    dayMap.set(5, 'friday')
    const weekday = dayMap.get(day)
    checkHours(topic, message, weekday)
  } else {
    console.log('Weekend')
  }
}

// Find offices with matching opening hours on given date
function checkHours (topic, payload, weekday) {
  dentists.filter(async function (obj) {
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
    checkFrom = parseFloat(checkFrom)
    let checkTo = obj.openinghours.monday.split('-')
    checkTo = checkTo[1]
    checkTo = parseFloat(checkTo)
    const timeSlots = []
    for (let i = checkFrom; i <= checkTo - 1; i++) {
      timeSlots.push(i + ':00')
      timeSlots.push(i + ':30')
    }
    const inputDentistOfficeId = payload.dentistid
    console.log(inputDentistOfficeId)
    const inputDate = payload.date
    const allAppointments = await Booking.find({ date: inputDate, dentistid: inputDentistOfficeId }) // we must change date in the database for bookings
    const stringAppointment = (JSON.stringify(allAppointments))
    const freeTimeSlots = []
    for (let i = 0; i <= timeSlots.length - 1; i++) {
      if (!stringAppointment.includes(timeSlots[i])) {
        freeTimeSlots.push(timeSlots[i])
      }
    }
    availableTimeSlots(freeTimeSlots)
    // readInput(array)
    return (checkFrom, checkTo)
  }).map(function (obj) {
    return obj.id
  })
}

function availableTimeSlots (array) {
  console.log(array)
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

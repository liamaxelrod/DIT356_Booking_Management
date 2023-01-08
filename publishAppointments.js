module.exports = { testFunction }
const Booking = require('./models/booking')
const publisher = require('../booking-management/publisher')
const Office = require('../booking-management/models/dentistOffice')

// This filter will check the availability, similarly to the booking appointment
async function testFunction (topic, message) {
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
    await checkHours(message, weekday)
  } else {
    console.log('Weekend') // Add error message
  }
}

// Find offices with matching opening hours on given date
async function checkHours (payload, weekday) {
  dentists.filter(async function (obj) {
    let checkFrom = 0
    let numDentists = 0
    if ((weekday === 'monday') && (obj.id === payload.dentistOfficeId)) {
      checkFrom = obj.openinghours.monday.split('-')
      numDentists = obj.dentists
    } else if (weekday === 'tuesday' && obj.id === payload.dentistOfficeId) {
      checkFrom = obj.openinghours.tuesday.split('-')
      numDentists = obj.dentists
    } else if (weekday === 'wednesday' && obj.id === payload.dentistOfficeId) {
      checkFrom = obj.openinghours.wednesday.split('-')
      numDentists = obj.dentists
    } else if (weekday === 'thursday' && obj.id === payload.dentistOfficeId) {
      checkFrom = obj.openinghours.thursday.split('-')
      numDentists = obj.dentists
    } else if (weekday === 'friday' && obj.id === payload.dentistOfficeId) {
      checkFrom = obj.openinghours.friday.split('-')
      numDentists = obj.dentists
    } else {
      return
    }
    checkFrom = checkFrom[0]
    checkFrom = parseFloat(checkFrom)
    let checkTo = obj.openinghours.monday.split('-')
    checkTo = checkTo[1]
    checkTo = parseFloat(checkTo)
    const timeSlots = []

    const inputDentistOfficeId = payload.dentistOfficeId
    const inputDate = payload.date
    const allAppointments = await Booking.find({ date: inputDate, dentistOfficeId: inputDentistOfficeId })
    const idArray = []
    const timeArray = []

    for (let i = 0; i < allAppointments.length; i++) {
      idArray.push(allAppointments[i].dentistid)
      timeArray.push(allAppointments[i].time)
    }
    const freeTimeSlots = []
    const officeId = payload.dentistOfficeId
    let dentistLength = await Office.findOne({ id: officeId })
    dentistLength = dentistLength.dentists
    for (let i = checkFrom; i <= checkTo - 1; i++) {
      for (let j = 0; j < dentistLength; j++) {
        if (i < 10) {
          timeSlots.push('0' + i + ':00')
          timeSlots.push('0' + i + ':30')
        } else {
          timeSlots.push(i + ':00')
          timeSlots.push(i + ':30')
        }
      }
    }
    for (let i = 0; i <= timeSlots.length - 1; i++) {
      if (!timeArray.includes(timeSlots[i]) || timeArray.includes(timeSlots[i])) {
        freeTimeSlots.push(timeSlots[i])
      }
      if (timeArray.includes(timeSlots[i])) {
        if (timeArray.length >= numDentists) {
          freeTimeSlots.pop(timeSlots[i])
        }
      }
    }
    await removeDuplicates(freeTimeSlots, payload)

    // readInput(array)
    return (checkFrom, checkTo)
  }).map(function (obj) {
    return obj.id
  })
}

// If there are more than 1 dentist we still wanna publish only ONE available appointment until all dentists are booked,
// so we filter out duplicates when there are two available dentists for the frontend
function removeDuplicates (arr, payload) {
  const uniqueAppointments = []
  arr.forEach(element => {
    if (!uniqueAppointments.includes(element)) {
      uniqueAppointments.push(element)
    }
  })
  availableTimeSlots(uniqueAppointments, payload)
}

// Finished array ready to be sent to the frontend
function availableTimeSlots (array, payload) {
  publisher.publishAvailableAppointments(array, payload)
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

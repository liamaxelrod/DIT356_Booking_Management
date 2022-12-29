
const Booking = require('../models/booking')
const publisher = require('../publisher')
module.exports = { filterTopic, deleteFilter, availabilityFilter, filterMakeAppointment, saveAppointment }
const Office = require('../models/dentistOffice')

// Send to another filter
function filterTopic (topic, message) {
  message = JSON.parse(message)
  if (topic === 'dentistimo/booking/create-booking') {
    availabilityFilter(topic, message)
  } else if (topic === 'dentistimo/booking/delete-booking') {
    deleteFilter(message)
  } else if (topic === 'dentistimo/dentist-office/fetch-all') {
    OfficeFilter(message)
  } else if (topic === 'dentistimo/dentist-office/fetch-one') {
    OfficeFilter(message)
  } else {
    console.log('Unable to read topic 1')
  }
}

// Check date, time and dentist is available in databse
function availabilityFilter (topic, message) {
  async function checkAvailability (topic, message) {
    try {
      const checkDate = message.date
      const checkTime = message.time
      const checkDentist = await Booking.find({ date: checkDate, time: checkTime })
      if (!checkDentist) {
        console.log('error')
      }
      const checkDentistId = message.dentistOfficeId
      const listOfDentists = await Office.find({ id: checkDentistId })
      let idArray = []
      for (let i = 0; i < listOfDentists.length; i++) {
        idArray = (listOfDentists[i].listDentists)
      }
      const testArray = []
      for (let i = 0; i < checkDentist.length; i++) {
        testArray.push(checkDentist[i].dentistid)
      }
      const freeDentist = (compareArrays(idArray, testArray))

      const test = Math.floor(Math.random() * (freeDentist.length))

      const checkId = freeDentist[test]

      // Find booking with date, time and dentist as identifier
      Booking.findOne({ date: checkDate, time: checkTime, dentistid: checkId }, async function (_err, checkDate, checkTime, checkID) {
        message.dentistid = checkId
        if (checkId) {
          await filterMakeAppointment(topic, message)
        } else {
          console.log('Fan felix')
        }
      })
    } catch (e) {
      console.log(e.message)
    }
  }
  if (message.date === '' || null) {
    console.log('No date')
  } else {
    checkAvailability(topic, message)
  }
}

// Filter the amount of times the user has booked an appointment. It may not exceed 2 appointments
function filterMakeAppointment (topic, message) {
  const userIdInput = message.userid
  let keyCount = 0
  // Looking in the database for the userId, to count how many appointments this user has made
  Booking.find({ userid: userIdInput }, function (_err, userIdInput) {
    if (userIdInput != null) {
      keyCount = Object.keys(userIdInput).length
      if (keyCount < 2) {
        saveAppointment(topic, message)
      } else {
        console.log('Too many bookings')
      }
    } else {
      console.log('It is not available')
    }
  })
}

// This function will save the appointment in the database
function saveAppointment (topic, message) {
  const appointment = new Booking(message)
  appointment.save((_err) => {
    // saved!
  })
  // Publish message
  publisher.publishBookingDate(topic, message)
}

// Delete booking filter
function deleteFilter (message) {
  console.log(message.issuance)
  if (message.issuance != null) {
    deleteBooking(message)
  } else {
    console.log('Message does not include issuance')
  }
}

async function deleteBooking (message) {
  try {
    // Delete booking with issuance as identifier
    const findBooking = await Booking.findOne({ issuance: message.issuance })
    if (findBooking != null) {
      await Booking.deleteOne({ issuance: message.issuance })
      const deletedBookingTopic = 'dentistimo/booking/deleted-booking'
      publisher.publishDeletedBooking(deletedBookingTopic)
    } else {
      console.log('Could not find booking')
    }
  } catch (e) {
    console.log(e.message)
  }
}

function OfficeFilter (message) {
  if (message.message === 'get_all_offices') {
    getOffices()
  } else if (message.id != null) {
    getOneOffice(message)
  }
}

// Function for getting all offices
async function getOffices () {
  try {
    const filter = {}
    const allOffices = await Office.find(filter)
    publisher.publishAllOffices(allOffices)
  } catch (e) {
    console.log(e.message)
  }
}

// Function for getting one office
async function getOneOffice (message) {
  try {
    // Find office with id as identifier
    const findOffice = await Office.findOne({ id: message.id })
    if (findOffice != null) {
      publisher.publishOneOffice(findOffice)
    } else {
      publisher.publishOneOffice('Could not find the dentist office')
    }
  } catch (e) {
    console.log(e.message)
  }
}

function compareArrays (arr1, arr2) {
  // Create a Set from each array to remove duplicates
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  // Create a Set of the elements that are in one Set but not the other
  const difference = new Set(
    [...set1].filter(x => !set2.has(x))
  )

  // Add elements from the second Set that are not in the first Set
  for (const element of set2) {
    if (!set1.has(element)) {
      difference.add(element)
    }
  }

  // Return an array of the elements in the difference Set
  return [...difference]
}

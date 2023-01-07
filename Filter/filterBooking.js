const Booking = require('../models/booking')
const publisher = require('../publisher')
module.exports = { filterTopic, saveAppointment }
const Office = require('../models/dentistOffice')

// Send to another filter
function filterTopic (topic, message) {
  if (topic === 'dentistimo/dentist-office/fetch-all') {
    OfficeFilter(message)
  } else if (topic === 'dentistimo/dentist-office/fetch-one') {
    OfficeFilter(message)
  } else if (topic === 'dentistimo/user-appointment/get-all-appointments-day') {
    getAppointmentsUserDay(message)
  } else if (topic === 'dentistimo/user-appointment/get-all-appointments') {
    getAppointmentsUser(message)
  } else {
    console.log('Unable to read topic 1')
  }
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

function OfficeFilter (message) {
  if (message.message === 'get_all_offices') {
    getOffices()
  } else if (message.dentistOfficeId != null) {
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
    const idToken = message.idToken
    // Find office with id as identifier
    const idOffice = message.dentistOfficeId
    const findOffice = await Office.findOne({ id: idOffice })
    if (findOffice != null) {
      publisher.publishOneOffice(idToken, findOffice)
    } else {
      publisher.publishOneOffice('Could not find the dentist office')
    }
  } catch (e) {
    console.log(e.message)
  }
}

// Get all appointments for a user a certain day
async function getAppointmentsUserDay (message) {
  try {
    const idToken = message.idToken
    if (message.userid != null && message.date != null) {
      const AppointmentsDay = await Booking.find({ userid: message.userid, date: message.date })
      // Checks that the query response is not empty
      if (AppointmentsDay.length) {
        publisher.publishAllUserAppointmentsDay(AppointmentsDay, idToken)
      } else {
        console.log('Could not find any appointments that day')
        const message = 'Could not find any appointments that day'
        publisher.errorPublisher(message.idToken, message)
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}

// Get all appointments for a user
async function getAppointmentsUser (message) {
  try {
    if (message.userid != null) {
    // Find bookings with userid as identifier
      const filter = { userid: message.userid }
      const getAppointments = await Booking.find(filter)
      // Checks that the query response is not empty
      if (getAppointments.length) {
        const idToken = message.idToken
        publisher.publishAllUserAppointments(getAppointments, idToken)
      } else {
        console.log('Could not find any appointments')
        const message = 'Could not find any appointments'
        publisher.errorPublisher(message.idToken, message)
      }
    }
  } catch (e) {
    console.log(e.message)
  }
}

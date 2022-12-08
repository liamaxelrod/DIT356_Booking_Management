// const filterFunctions = require('../filterBooking')
// const chai = require('chai')
const { describe, it } = require('node:test')
// const expect = chai.expect
// const sinon = require("sinon")
// const mongoose = require("mongoose");
const assert = require('assert')
const Booking = require('../models/booking')
require('./mo_helper_test')

// const topic = 'dentistimo/booking/create-booking'
// const message =
// {
//   userid: 5,
//   requestid: 50981,
//   dentistid: 687381763,
//   issuance: 10009099191,
//   date: '14.09.22',
//   time: '14:00'
// }

describe('Test suit', function () {
  it('Test the saveAppointment function', function () {
    // const save = filterFunctions.saveAppointment(topic, message)
    // expect(save).to.be.true;
    const appointment = new Booking({ userid: 2 })
    console.log(appointment)
    appointment.save(
      // if (err) return handleError(err);
      // // saved!
    ).then(() => {
      assert(!appointment.isNew)
    })
      .catch(() => {
        console.log('error')
      })
  })

  // it('spy the checkAvailability function', function () {
  //   //  let spy = sinon.spy()
  // })
})

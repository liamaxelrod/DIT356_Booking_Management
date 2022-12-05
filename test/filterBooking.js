const filterFunctions = require('../filterBooking')
var chai = require("chai");
const { describe, it } = require('node:test');
var expect = chai.expect;
// var sinon = require("sinon")
//const mongoose = require("mongoose");
// const assert = require('assert')
const booking = require('../models/booking')


var topic = 'dentistimo/booking/create-booking'
var message =
{
    "userid": 5,
    "requestid": 50981,
    "dentistid": 687381763,
    "issuance": 10009099191,
    "date": "14.09.22",
    "time": "14:00"
}


describe("Test suit", function () {
    it("Test the saveAppointment function", function () {
        var result = filterFunctions.saveAppointment(topic, message)
        expect(result).to.be.true
    })

    // it("spy the checkAvailability function", function () {
    //     var spy = sinon.spy()
    // })

})


module.exports = { filterTopic, deleteFilter }
const mongoose = require("mongoose");
const dentistOffices = require('../booking-management/models/dentistOffice')
const booking = require('../booking-management/models/booking')
const publisher = require('../booking-management/publisher');
const { count } = require("../booking-management/models/dentistOffice");


//Send to another filter 
function filterTopic(topic, message){
    message = JSON.parse(message)
    if(topic == 'dentistimo/booking/create-booking'){
        availabilityFilter(topic, message)
    } else if (topic == 'dentistimo/booking/delete-booking') {
        deleteFilter(topic, message)
    } else {
        console.log("Unable to read topic")
    }
}


//Check time & date is available in databse
function availabilityFilter(topic, message){
        async function checkAvailability(message) {
        try {
            var checkDate = message.date
            var checkTime = message.time
            //Find booking with date and time as identifier
            booking.findOne({ date: checkDate, time: checkTime }, function (err, checkDate, checkTime) {
                if(checkDate == null && checkTime == null){
                    filterMakeAppointment(topic, message)
                }else{
                    console.log("It is not available")
                }});
        } catch (e) {
            console.log(e.message)
        }
    }
    if(message.date == "" || null){
        console.log("No date")
    }else{
        checkAvailability(message);
    }
}

//To check if it includes something specific  
function filterMakeAppointment(topic, message){
    var userIdInput = message.userid
    var keyCount = 0
    console.log("Testing id", userIdInput)
    console.log("Testing keycount", keyCount)
    booking.find({ userid: userIdInput }, function (err, userIdInput) {
        if(userIdInput != null){
            keyCount = Object.keys(userIdInput).length;
            console.log(keyCount)
            if(keyCount < 2){
                console.log(keyCount)
                console.log("Save booking")
                saveAppointment(topic, message)
            }else{
                console.log(keyCount)
                console.log("Too many bookings")
            }
        }else{
            console.log("It is not available")
        }
    })
}

//Print the message
function saveAppointment(topic, message) {
    const appointment = new booking(message);
    appointment.save((err) => {
        if (err) return handleError(err);
        // saved!
      });
    console.log("The appointment has been made!")

}


//Delete booking filter
function deleteFilter(topic, message) {
    message = JSON.parse(message)
    if (message.issuance != null) {
        async function deleteBooking() {
            try {
                console.log(message.issuance)
                //Delete booking with issuance as identifier
                await booking.deleteOne({ issuance: message.issuance })
                const deletedBookingTopic = 'dentistimo/booking/deleted-booking'
                publisher.publishDeletedBooking(deletedBookingTopic)
            } catch (e) {
                console.log(e.message)
            }
        }
        deleteBooking();
    }
}
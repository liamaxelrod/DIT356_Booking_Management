<<<<<<< HEAD
module.exports = {filterTopic}
const mongoose = require('mongoose');
const dentistOffices = require('../booking-management/models/dentistOffice')
const newAppointment = require('../booking-management/models/booking')


//Send to another filter 
function filterTopic(topic, message){
    message = JSON.parse(message)
    const appointment = new newAppointment(message);
    if(topic == 'Booking/newBooking'){
        
        messageFilter(topic, message)
    }else{
=======
module.exports = { filterTopic, deleteFilter }
const mongoose = require("mongoose");
const booking = require("./models/booking");
const publisher = require('../booking-management/publisher')

//Send to another filter 
function filterTopic(topic, message) {
    if (topic == 'my/test/topic') {
        console.log("Topic filter check")
        messageFilter(topic, message)
    } else if (topic == 'dentistimo/booking/delete-booking') {
        deleteFilter(topic, message)
    } else {
>>>>>>> origin/main
        console.log("Doesn't work")
    }
}

<<<<<<< HEAD
//To check if it doesn include something specific 
function messageFilter(topic, message){
    if(message.time == "14:00"){
        console.log(message.time)
    }else{
        console.log("Not working")
=======
//To check if it doesn't include something specific 
function messageFilter(topic, message) {
    if (!message.includes("name")) {
        console.log(message, "No name checker")
        messageFilter2(topic, message)
    } else if (!message.includes("contact")) {
        console.log(message, "contact checker")
>>>>>>> origin/main
    }
  console.log("It works!")
}

//To check if it includes something specific  
<<<<<<< HEAD
function filterMakeAppointment(topic, message){
    appointment.save((err) => {
        if (err) return handleError(err);
        // saved!
      });
    console.log("The appointment has been made!")
=======
function messageFilter2(topic, message) {
    if (message.includes("Albin")) {
        console.log("It is working perfectly")
        messageFilter3(topic, message)
    } else {
        console.log("Doesn't work at all")
    }
>>>>>>> origin/main
}

//Print the message
function messageFilter3(topic, message) {
    console.log("It is working perfectly")
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
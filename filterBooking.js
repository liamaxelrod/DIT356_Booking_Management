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
        console.log("Doesn't work")
    }
}

//To check if it doesn't include something specific 
function messageFilter(topic, message) {
    if (!message.includes("name")) {
        console.log(message, "No name checker")
        messageFilter2(topic, message)
    } else if (!message.includes("contact")) {
        console.log(message, "contact checker")
    }
}

//To check if it includes something specific  
function messageFilter2(topic, message) {
    if (message.includes("Albin")) {
        console.log("It is working perfectly")
        messageFilter3(topic, message)
    } else {
        console.log("Doesn't work at all")
    }
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
                //Delete booking with issuance as identifier:
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
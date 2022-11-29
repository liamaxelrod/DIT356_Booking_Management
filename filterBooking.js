module.exports = { filterTopic, deleteFilter }
const mongoose = require("mongoose");
const booking = require("./models/booking");

//Send to another filter 
function filterTopic(topic, message) {
    if (topic == 'my/test/topic') {
        console.log("Topic filter check")
        messageFilter(topic, message)
    } else if (topic == 'booking/deleteBooking') {
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
    if (message.includes("delete_booking")) {
        async function deleteBooking() {
            // Delete the document by its _id
            const deleteSomeBooking = await booking.deleteOne({_id: "6385dd490677863636b6de76"})
            console.log(deleteSomeBooking)
          }
          deleteBooking();
    } else {
        console.log("Doesn't work at all")
    }
}

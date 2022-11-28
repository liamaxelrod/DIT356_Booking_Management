module.exports = {filterTopic}


//Send to another filter 
function filterTopic(topic, message){
    if(topic == 'my/test/topic'){
      console.log("Topic filter check")
      messageFilter(topic, message)
    }else{
        console.log("Doesn't work")
    }
}

//To check if it doesn't include something specific 
function messageFilter(topic, message){
    if(!message.includes("name") ){
        console.log(message, "No name checker")
        messageFilter2(topic, message)
    }else if(!message.includes("contact")){
        console.log(message, "contact checker")
    }
}

//To check if it includes something specific  
function messageFilter2(topic, message){
    if(message.includes("Albin")){
        console.log("It is working perfectly")
        messageFilter3(topic, message)
    }else{
        console.log("Doesn't work at all")
    }
}


//Print the message
function messageFilter3(topic, message){
        console.log("It is working perfectly")
}

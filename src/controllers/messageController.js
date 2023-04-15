

// hello 
let hello = (req, res) => {
    console.log("This is hello from the messageController");
    res.send("Hello there")
}



//privateHello
let privateHello = (req, res) => {
    console.log("private hello in message conroller")
    res.send("Hello there, you are logged in")
}

module.exports = { hello, privateHello }
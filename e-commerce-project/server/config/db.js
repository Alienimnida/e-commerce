const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.MONGO_URI

async function connectToMongoDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB with Mongoose')
    } catch (err) {
        console.error('Error connecting to MongoDB:', err)
        process.exit(1)
    }
}

module.exports = connectToMongoDB
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const sellerProductRoutes = require('./routes/sellerProductRoutes');


const connectToMongoDB = require('./config/db')

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json('Welcome to GadgetNest Server')
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/seller/products', sellerProductRoutes);

connectToMongoDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error('Failed to start server:', err)
    })
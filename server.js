const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()
const http = require('http').createServer(app)

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:8080',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://localhost:3000'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}
// routes
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const boardRoutes = require('./api/board/board.routes')
const aiRoutes = require('./api/ai/ai.routes')
const { setupSocketAPI } = require('./services/socket.service')

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/ai', aiRoutes)

setupSocketAPI(http)


app.get('/**', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 3030
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
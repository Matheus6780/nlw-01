import express from 'express'
import routes from './routes'
import path from 'path'
import cors from 'cors'
import { errors } from 'celebrate'

const app = express()

const port = 5000

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

app.listen(port, () => console.log(`Server running on port ${port}...`))
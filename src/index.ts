import express from 'express'
import * as bodyParser from 'body-parser'

// create and setup express app
const app = express()
app.use(bodyParser.json())

// start express server
app.listen(3000, () => {
  console.log('Started server on port 3000')
})

import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import express from 'express'
import { dirname, join as pathJoin } from 'path'
import shortid from 'shortid'
import Stripe from 'stripe'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: pathJoin(__dirname, '../.env') })

const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY as string, {
  apiVersion: '2020-08-27',
})

const app = express()
const PORT = 8080

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/create-verification-session', async (req, res) => {
  try {
    const userId = shortid.generate()
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: userId,
      },
    })
    const clientSecret = verificationSession.client_secret
    res.status(200).json({
      userId,
      clientSecret,
    })
  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

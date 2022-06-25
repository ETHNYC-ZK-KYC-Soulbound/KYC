import cors from 'cors'
import * as dotenv from 'dotenv'
import { utils } from 'ethers'
import express from 'express'
import { dirname, join as pathJoin } from 'path'
import Stripe from 'stripe'
import { fileURLToPath } from 'url'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: pathJoin(__dirname, '../.env') })

const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY as string, {
  apiVersion: '2020-08-27',
  typescript: true,
})

const app = express()
const PORT = 8080

app.use(cors({ origin: '*' }))

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') express.raw({ type: '*/*' })(req, res, next)
  else express.json()(req, res, next)
})

app.get('/', (req, res) => {
  res.status(200)
})

interface VerificationSessionInput {
  address: string | undefined
}

app.post('/create-verification-session', async (req, res) => {
  try {
    const { address } = req.body as VerificationSessionInput

    // Check if address is provided and is legit
    if (typeof address !== 'string' || !utils.isAddress(address)) {
      return res.status(401).send('Invalid parameters')
    }

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: address,
      },
      // Additional options for configuring the verification session:
      options: {
        document: {
          allowed_types: ['driving_license', 'passport', 'id_card'],
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
    })
    const clientSecret = verificationSession.client_secret
    res.status(200).json({
      address,
      clientSecret,
    })
  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

app.post('/webhook', (req, res) => {
  let event
  const stripeEndpointSecret = process.env.STRIPE_TEST_WEBHOOK_KEY

  // Verify the event came from Stripe
  try {
    const sig = req.headers['stripe-signature']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    event = stripe.webhooks.constructEvent(req.body, sig, stripeEndpointSecret)
  } catch (err) {
    // On error, log and return the error message
    console.log(err)
    return res.status(400).send('Webhook Error')
  }

  // Successfully constructed event
  console.log(event)

  // If event is not the 'verified' event, skip it
  if (event.type !== 'identity.verification_session.verified') {
    if (event.type !== 'identity.verification_session.requires_input') {
      const verificationSession = event.data.object as Stripe.Identity.VerificationSession
      console.log('Verification check failed!')
      if (verificationSession?.last_error) console.log(verificationSession.last_error)
    }
    return res.json({ received: true }) // send back to webhook to end
  }

  // Verified!
  // https://stripe.com/docs/api/identity/verification_sessions/object#identity_verification_session_object-verified_outputs
  const verificationSession = event.data.object as Stripe.Identity.VerificationSession
  const { verified_outputs: verifiedOutputs } = verificationSession
  if (verifiedOutputs !== null) {
    const {
      address, dob, id_number: idNumber, first_name: firstName, last_name: lastName,
    } = verifiedOutputs
    if (!address) {
      console.log('Invalid address after verification!')
      console.log(verifiedOutputs)
      return res.json({ received: true }) // send back to webhook to end
    }

    const { city, state } = address
  }

  return res.json({ received: true }) // send back to webhook to end
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

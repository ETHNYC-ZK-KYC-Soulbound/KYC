import { loadStripe, Stripe } from '@stripe/stripe-js'
import React, { useEffect, useState } from 'react'

import Container from '../../components/Container'

// Stripe Verification process:
// https://stripe.com/docs/identity/verify-identity-documents?html-or-react=react

function VerifyButton() {
  const [stripe, setStripe] = useState<Stripe | null>()

  useEffect(() => {
    (async () => {
      const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_TEST_API_KEY as string)
      setStripe(stripePromise)
    })()
  }, [])

  return (
    <button type="button" role="link" className="btn btn-primary" disabled={!stripe}>
      Verify
    </button>
  )
}

export default function StartPageMain() {
  return (
    <Container>
      <VerifyButton />
    </Container>
  )
}

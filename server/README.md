1. Populate .env
2. Download stripe CLI (https://stripe.com/docs/webhooks/quickstart)
4. Run `stripe login` then `stripe listen --forward-to localhost:8080/webhook` in one window
5. Use the `Your webhook signing secret is: {{STRIPE_TEST_WEBHOOK_KEY}}` in `.env`
6. Run `npm start` in another window

Simulate:
`stripe trigger identity.verification_session.verified`

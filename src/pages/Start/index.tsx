import React from 'react'

import Container from '../../components/Container'

function VerifyButton() {
  return (
    <button type="button" role="link">
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

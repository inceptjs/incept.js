import { Link } from 'inceptjs/components'
import { Button } from '@chakra-ui/react'

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <Button variant="contained">
        <Link to="/">Home</Link>
      </Button>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <Button colorScheme="blue">
        <Link to="/">Home</Link>
      </Button>
    </div>
  )
}
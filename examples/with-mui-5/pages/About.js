import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

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
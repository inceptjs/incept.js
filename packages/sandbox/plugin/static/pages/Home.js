import { Link } from 'inceptjs/components'

//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <h1>Welcome to Incept.js</h1>
      <Link to="/about">About</Link> | <Link to="/admin">Admin</Link>
    </div>
  )
}
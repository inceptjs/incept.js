import { Link } from 'inceptjs/components'

import classes from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <h1 className={classes.title}>Welcome to Incept.js</h1>
      <Link to="/about">About</Link>
      <input placeholder="Look at this style" />
    </div>
  )
}
import { Link, Head } from 'inceptjs/components'
import { useEmit } from 'emitrpc-react'

export default function About() {
  const response = useEmit('company-detail', { id: 1 })
  return (
    <div>
      <Head>
        <title>About Us</title>
      </Head>
      {response && response.error && <h3>Error: {response.message}</h3>}
      {response && !response.error && <h1>About {response.results.name}</h1>}
      {!response && <h1>Loading...</h1>}
      <Link to="/">Home</Link>
    </div>
  )
}
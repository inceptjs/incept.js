import { Link, Head } from 'inceptjs/components'

export default function About({name}) {
  const title = `About ${name}`;
  return (
    <div>
      <Head>
        <title>About</title>
      </Head>
      <h1>{title}</h1>
      <Link to="/">Home</Link>
    </div>
  )
}

About.getStaticProps = function(req) {
  return { name: 'incept static'}
}

About.getServerProps = function(req) {
  return { name: 'incept static'}
}
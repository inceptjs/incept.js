export default function Icon({ name, size = 16, type = 'regular' }) {
  const [ src, setSource ] = React.useState(null)
  import(`./bx-alarm.svg`).then(src => setSource(src))
  return <>{src && <img src={src} width={size} height={size} />}</>
}
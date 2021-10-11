import Alarm from '@inceptjs/icons/regular/Alarm'
import Button from '../components/Button'

export default function Hello(props) {
  return (
    <div>
      <Button outline primary icon={Alarm}>Submit</Button>
    </div>
  )
}
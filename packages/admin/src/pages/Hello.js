import Alarm from '../components/Icon/regular/Alarm'
import Button from '../components/Button'
import theme from '../config/theme.css'

export default function Hello(props) {
  return (
    <div className={theme['theme-dark']}>
      <Button outline primary icon={Alarm}>Submit</Button>
    </div>
  )
}
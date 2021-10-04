import classes from './Form.module.css'

export default function Input({className, ...props}) {
  const classNames = [ classes['form-control'] ]
  if (className) {
    classNames.push(className)
  }
  return (
    <input 
      className={classNames.join(' ')} 
      {...props} 
    />
  )
}
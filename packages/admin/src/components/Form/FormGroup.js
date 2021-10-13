import classes from './Form.module.css'

export default function FormGroup(props) {
  const {label, name, error, children} = props
  const groupNames = [ classes['form-group'] ]
  if ('inline' in props) {
    groupNames.push(classes['form-group-inline'])
  }
  if (error) {
    groupNames.push(classes['form-group-error'])
  }
  return (
    <div className={groupNames.join(' ')}>
      {label && <label 
        className={classes['form-group-label']} 
        htmlFor={name}
      >
        {label}
      </label>}
      <div className={classes['form-group-field']}>
        {children}
      </div>
      {error && <div className={classes['form-group-error-text']}>
        {error}
      </div>}
    </div>
  )
}
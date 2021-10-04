import classes from './Form.module.css'

export default function Input({label, name, error, children}) {
  const groupNames = []
  if ('outline' in props) {
    groupNames.push(classes['form-group-outline'])
  } else {
    groupNames.push(classes['form-group'])
  }
  if (error) {
    groupNames.push(classes['form-group-error'])
  }
  return (
    <div className={groupNames.join(' ')}>
      {label && <label 
        className={classes['form-group-label']} 
        for={name}
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
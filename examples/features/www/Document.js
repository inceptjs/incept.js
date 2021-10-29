export default function Document(props) {
  const { 
    title,  meta, links,     scripts, 
    styles, App,  htmlProps, bodyProps 
  } = props

  return (
    <html {...htmlProps}>
      <head>
        {title}
        {meta}
        {links}
        {styles}
      </head>
      <body {...bodyProps}>
        <App />
        {scripts}
      </body>
    </html>
  )
}
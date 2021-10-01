import fs from 'fs'
export default function registerIconComponent(app) {
  const vfs = app.withVirtualFS
  const module = vfs.lookupModule('boxicons', __dirname)
  if (!module) {
    //we need boxicons module in order for this to work
    return;
  }

  const iconRoute = `${__dirname}/components/Icon/:type/:name`
  vfs.route(iconRoute, (filename, res) => {   
    //wait for .js so babel can parse it
    if (!/\.js$/.test(filename)) {
      return;
    }
    //extract the params from the filename
    const { params } = vfs.routeParams(filename, iconRoute)
    const type = params.type.toLowerCase()
    const name = params.name.substr(0, params.name.length - 3)
    let prefix = 'bx'
    if (type === 'logos') prefix += 'l'
    if (type === 'solid') prefix += 's'

    let svg = null
    try {
      svg = fs.readFileSync(
        `${module}/svg/${type}/${prefix}-${name.toLowerCase()}.svg`
      ).toString('utf8');
    } catch (e) {
      return
    }

    svg = svg.replace(/width="[0-9]*"/, 'width={size}')
    svg = svg.replace(/height="[0-9]*"/, 'height={size}')
    svg = svg.replace('<svg', '<svg className={className} style={style}')
  
    res.write(
      `export default function BoxIcon(props) {
        const { className, style, size } = props 
        return ${svg} 
      }`
    )
  })
}
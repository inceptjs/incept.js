//vendor imports
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
//self imports
import Notify from './Notify'
import PanelHead from './Head'
import PanelBody from './Body'
import PanelLeft from './Left'
import PanelRight from './Right'
import classes from './Panel.module.css'

//main component
export default function Panel(props) {
  const { 
    ambiance, 
    href,
    menu, 
    routes, 
    screens, 
    src, 
    title 
  } = props
  //states
  const [ menuShown, showMenu ] = useState(false)
  const [ crumbs, setCrumbs ] = useState([])
  const [ notification, setNotification ] = useState({})
  const { open, close, forward, backward } = screens.useDispatch()
  //actions
  const toggle = () => showMenu(!menuShown)
  const notify = (message, type) => setNotification({ message, type })
  const clear = () => setNotification({})
  //props
  const history = screens.get()
  //this is for the right panel
  const ref = React.createRef()
  useEffect(() => {
    //adjust right panel size on responsive
    function handleResize() {
      const scrollTo = Math.max(history.length - 1, 0) * ref.current.clientWidth
      ref.current.scrollLeft = scrollTo
    }

    //if there is a reference
    if (ref.current) {
      //set the screens container
      screens.setEffectsContainer(ref.current)
      window.addEventListener('resize', handleResize, true)
    }
    
    return () => window.removeEventListener('resize', handleResize, true)
  })

  const classStates = [ classes['panel'] ];
  if (menuShown) {
    classStates.push(classes['panel-left-open'])
  }

  //render
  return (
    <section className={classStates.join(' ')}>
      <PanelHead 
        ambiance={ambiance}
        toggle={toggle} 
        crumbs={crumbs} 
      />
      <PanelBody 
        routes={routes} 
        open={open} 
        close={close} 
        forward={forward} 
        backward={backward}
        crumbs={setCrumbs}
        notify={notify}
      />
      <PanelLeft 
        src={src} 
        href={href} 
        title={title}
        menu={menu} 
        open={menuShown} 
        toggle={toggle} 
      />
      <PanelRight 
        ref={ref} 
        screens={history} 
        close={close} 
      />
      <Notify 
        clear={clear}
        message={notification.message || ''} 
        severity={notification.type || 'info'} 
      />
    </section>
  )
}

Panel.propTypes = {
  src: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.string
}
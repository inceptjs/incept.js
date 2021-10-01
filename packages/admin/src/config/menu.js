import IconCode from '@material-ui/icons/Code'
import IconCamera from '@material-ui/icons/Camera'
import IconStorage from '@material-ui/icons/Storage'
import IconSettings from '@material-ui/icons/Settings'
import IconLocalCafe from '@material-ui/icons/LocalCafe'

export default [
  {
    icon: IconLocalCafe,
    title: 'Admin',
    children: [
      { title: 'Profile' },
      { title: 'Auth' },
      { title: 'Roles' }
    ]
  },
  {
    icon: IconCode,
    title: 'API',
    children: [
      { title: 'Applications' },
      { title: 'Sessions' },
      { title: 'Scopes' },
      { title: 'REST Calls' },
      { title: 'Webhooks' }
    ]
  },
  {
    icon: IconStorage,
    title: 'System',
    children: [
      { 
        title: 'Schemas',
        href: '/admin/schema/search'
      },
      { title: 'Fieldsets' }
    ]
  },
  {
    icon: IconSettings,
    title: 'Configuration',
    children: [
      { title: 'Languages' },
      { title: 'Settings' }
    ]
  },
  {
    icon: IconCamera,
    title: 'Template',
    href: '/admin/template'
  }
]
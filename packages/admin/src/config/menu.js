import IconCog from '../components/Icon/regular/Cog'
import IconData from '../components/Icon/regular/Data'
import IconCode from '../components/Icon/regular/code-alt'
import IconCamera from '../components/Icon/regular/Camera'
import IconCoffee from '../components/Icon/regular/Coffee'

export default [
  {
    icon: IconCoffee,
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
    icon: IconData,
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
    icon: IconCog,
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
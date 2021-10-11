import IconCog from '@inceptjs/icons/regular/Cog'
import IconData from '@inceptjs/icons/regular/Data'
import IconCode from '@inceptjs/icons/regular/code-alt'
import IconCamera from '@inceptjs/icons/regular/Camera'
import IconCoffee from '@inceptjs/icons/regular/Coffee'

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
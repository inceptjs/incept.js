const rows = [
  {
    id: 1,
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Nulla consectetur lacinia leo quis sagittis. Nam nec tellus 
    suscipit, ultrices dolor ac, consectetur enim. Curabitur interdum 
    ipsum sit amet arcu elementum interdum.`,
    active: 1,
    created: 'Dec 01, 2021 23:59:59',
    updated: 'Dec 01, 2021 23:59:59'
  },
  {
    id: 2,
    name: 'Jane Doe',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: `Quisque molestie dapibus tempus. Maecenas dignissim tortor 
    neque, in convallis ligula hendrerit et. Proin interdum, quam in 
    consequat malesuada, sapien sapien auctor lacus, dignissim maximus 
    dui purus non sapien`,
    active: 1,
    created: 'Dec 02, 2021 22:59:59',
    updated: 'Dec 02, 2021 22:59:59'
  },
  {
    id: 3,
    name: 'Jack Doe',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: `Praesent tempus feugiat sem non venenatis. Vestibulum 
    interdum, mi pellentesque consequat ornare, purus enim varius eros, 
    eget sodales arcu lectus non sem.`,
    active: 1,
    created: 'Dec 03, 2021 21:59:59',
    updated: 'Dec 03, 2021 21:59:59'
  },
  {
    id: 4,
    name: 'Jimmy Doe',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    bio: `Aliquam a pharetra diam, sed interdum mauris. In hac 
    habitasse platea dictumst. Vestibulum mi urna, suscipit non dolor 
    in, dictum placerat velit. Phasellus hendrerit placerat enim vel 
    lobortis.`,
    active: 1,
    created: 'Dec 04, 2021 20:59:59',
    updated: 'Dec 04, 2021 20:59:59'
  },
  {
    id: 5,
    name: 'Janet Doe',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    bio: `Morbi convallis, metus nec vestibulum facilisis, lectus 
    magna pulvinar lorem, eu hendrerit risus enim fermentum diam. 
    Nullam porta id odio et gravida.`,
    active: 1,
    created: 'Dec 05, 2021 19:59:59',
    updated: 'Dec 05, 2021 19:59:59'
  },
  {
    id: 6,
    name: 'Janey Doe',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Nulla consectetur lacinia leo quis sagittis. Nam nec tellus 
    suscipit, ultrices dolor ac, consectetur enim. Curabitur interdum 
    ipsum sit amet arcu elementum interdum.`,
    active: 1,
    created: 'Dec 06, 2021 23:59:59',
    updated: 'Dec 06, 2021 23:59:59'
  },
  {
    id: 7,
    name: 'Jeorge Doe',
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
    bio: `Quisque molestie dapibus tempus. Maecenas dignissim tortor 
    neque, in convallis ligula hendrerit et. Proin interdum, quam in 
    consequat malesuada, sapien sapien auctor lacus, dignissim maximus 
    dui purus non sapien`,
    active: 1,
    created: 'Dec 07, 2021 22:59:59',
    updated: 'Dec 07, 2021 22:59:59'
  },
  {
    id: 8,
    name: 'James Doe',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    bio: `Praesent tempus feugiat sem non venenatis. Vestibulum 
    interdum, mi pellentesque consequat ornare, purus enim varius eros, 
    eget sodales arcu lectus non sem.`,
    active: 1,
    created: 'Dec 08, 2021 21:59:59',
    updated: 'Dec 08, 2021 21:59:59'
  },
  {
    id: 9,
    name: 'Jessie Doe',
    image: 'https://randomuser.me/api/portraits/men/9.jpg',
    bio: `Aliquam a pharetra diam, sed interdum mauris. In hac 
    habitasse platea dictumst. Vestibulum mi urna, suscipit non dolor 
    in, dictum placerat velit. Phasellus hendrerit placerat enim vel 
    lobortis.`,
    active: 1,
    created: 'Dec 09, 2021 20:59:59',
    updated: 'Dec 09, 2021 20:59:59'
  },
  {
    id: 10,
    name: 'Jobert Doe',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
    bio: `Morbi convallis, metus nec vestibulum facilisis, lectus 
    magna pulvinar lorem, eu hendrerit risus enim fermentum diam. 
    Nullam porta id odio et gravida.`,
    active: 1,
    created: 'Dec 10, 2021 19:59:59',
    updated: 'Dec 10, 2021 19:59:59'
  },
  {
    id: 11,
    name: 'Jamie Doe',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Nulla consectetur lacinia leo quis sagittis. Nam nec tellus 
    suscipit, ultrices dolor ac, consectetur enim. Curabitur interdum 
    ipsum sit amet arcu elementum interdum.`,
    active: 1,
    created: 'Dec 11, 2021 23:59:59',
    updated: 'Dec 11, 2021 23:59:59'
  },
  {
    id: 12,
    name: 'Jan Doe',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    bio: `Quisque molestie dapibus tempus. Maecenas dignissim tortor 
    neque, in convallis ligula hendrerit et. Proin interdum, quam in 
    consequat malesuada, sapien sapien auctor lacus, dignissim maximus 
    dui purus non sapien`,
    active: 1,
    created: 'Dec 12, 2021 22:59:59',
    updated: 'Dec 12, 2021 22:59:59'
  }
]

export default {
  async get(id = 0) {
    if (!id) {
      return { 
        error: false, 
        results: { 
          rows: Array.from(rows), 
          total: rows.length
        } 
      }
    }

    if (!rows[id - 1]) {
      return { 
        error: true, 
        message: 'Not Found' 
      }
    }

    return { 
      errors: false, 
      results: Object.assign({}, rows[id - 1], {
        friends: Array.from(rows)
      }) 
    }
  },
  async update(id, row) {
    if (!rows[id - 1]) {
      return { 
        error: true, 
        message: 'Not Found' 
      }
    }
 
    const errors = getErrors(row)
    if (Object.keys(errors).length) {
      return { 
        error: true, 
        message: 'Invalid Parameters', 
        validation: errors 
      }
    }

    row.active = typeof row.active === 'number'? !!row.active : 1
    row.created = rows[id - 1].created
    row.updated = new Date().toISOString().slice(0, 19).replace('T', ' ')
    Object.assign(rows[id - 1], row || {})

    return { 
      errors: false, 
      results: row 
    }
  },
  async create(row) {
    const errors = getErrors(row)
    if (Object.keys(errors).length) {
      return { 
        error: true, 
        message: 'Invalid Parameters', 
        validation: errors 
      }
    }

    row.id = rows.length
    row.active = typeof row.active === 'number'? !!row.active : 1
    row.created = new Date().toISOString().slice(0, 19).replace('T', ' ')
    row.updated = new Date().toISOString().slice(0, 19).replace('T', ' ')
    rows.push(row)
    return { 
      errors: false, 
      results: row 
    }
  },
  async remove(id) {
    if (!rows[id - 1]) {
      return { error: true, message: 'Not Found' }
    }

    const row = rows[id - 1]
    rows.splice(id - 1, 1)
    return { 
      errors: false, 
      results: row 
    }
  },
  getErrors(row) {
    const errors = {}
    if (!row.name) errors.name = 'Required'
    if (!row.image) errors.image = 'Required'
    return errors
  }
}
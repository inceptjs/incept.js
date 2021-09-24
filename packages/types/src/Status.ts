/**
 * Status Codes
 */
export default {
  get ABORT(): Status {
    return { code: 308, text: 'Aborted' };
  },

  get ERROR(): Status {
    return { code: 500, text: 'Internal Error' };
  },

  get NOT_FOUND(): Status {
    return { code: 404, text: 'Not Found' };
  },

  get OK(): Status {
    return { code: 200, text: 'OK' };
  }
}

export interface Status {
  code: number, 
  text: string
}

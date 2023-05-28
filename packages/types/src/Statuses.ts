/**
 * Status Codes
 */
export default {
  get ABORT(): Status {
    return { code: 308, message: 'Aborted' };
  },

  get ERROR(): Status {
    return { code: 500, message: 'Internal Error' };
  },

  get NOT_FOUND(): Status {
    return { code: 404, message: 'Not Found' };
  },

  get OK(): Status {
    return { code: 200, message: 'OK' };
  }
}

export interface Status {
  code: number, 
  message: string
}
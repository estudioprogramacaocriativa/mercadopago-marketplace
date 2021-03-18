'use strict'

class Media {
  get validateAll() {
    return true;
  }

  get rules () {
    return {

    }
  }

  get messages() {
    return {

    }
  }

  async fail(message) {
    return this.ctx.response.status(402).json({ data: message })
  }
}

module.exports = Media

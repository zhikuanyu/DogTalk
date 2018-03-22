export default {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  api: {
    base: 'http://rapapi.org/mockjs/32373/',
    creations: 'api/creation',
    up: 'api/up',
    comment: 'api/comments',
    signup: 'api/u/signup',
    verify: 'api/u/verify'
  }
}
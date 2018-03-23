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
    verify: 'api/u/verify',
    signature: 'api/signature'
  },
  cloudinary: {
    cloud_name: 'dogtalk',
    api_key: '357395742967522',
    api_secret: 'e5dyHKCgIiKohvgiSD8xz6r2R1w',
    base: 'http://res.cloudinary.com/dogtalk',
    image: 'https://api.cloudinary.com/v1_1/dogtalk/image/upload',
    video: 'https://api.cloudinary.com/v1_1/dogtalk/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/dogtalk/raw/upload'
  }
}
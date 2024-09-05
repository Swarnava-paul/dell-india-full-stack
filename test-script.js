import http from 'k6/http'
import {sleep} from 'k6'

export const options = {
    vus: 1000,
    duration: '3m',
    cloud: {
      name: 'YOUR TEST NAME',
    },
  }
  
  export default function () {
    http.get('http://localhost:4000/service/getProduct?ram=8')
    sleep(120)
  }
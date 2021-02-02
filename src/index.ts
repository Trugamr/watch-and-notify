// Loading Environmental Variables
import dotenv from 'dotenv'
import { rptechAvailability } from './watchers/rptech'
dotenv.config()

rptechAvailability('https://rptechindia.in/nvidia-geforce-rtx-3060-ti.html')
  .then(data => console.log(data))
  .catch(error => console.log(error.message))

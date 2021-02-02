// Loading Environmental Variables
import dotenv from 'dotenv'
dotenv.config()

const getRandomNumber = (): number => {
  return Math.round(Math.random() * 100)
}

console.log(`Random number is ${getRandomNumber()}!`)

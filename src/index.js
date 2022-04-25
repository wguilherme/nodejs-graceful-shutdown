import { once } from 'node:events'
import { createServer } from 'node:http'

async function handler(request, response) {
  try {
    const data = JSON.parse(await once(request, 'data'))
    console.log('\nreceived', data)

    response.writeHead(200)
    response.end(JSON.stringify(data))

    // catch does not work here
    setTimeout(() => { throw new Error('will be handled on uncaught') }, 1000)

    // catch does not work here
    Promise.reject('meu error')

  } catch (error) {
    console.error('Error', error.stack)
    response.writeHead(500)
    response.end()


  }

}

const server = createServer(handler)
  .listen(3000)
  .on('listening', () => console.log('Server running at 3000'))


// catch not treated errors
// without this, the server will crash
process.on('uncaughtException', (error, origin) => {
  console.log(`${origin} signal received. \n${error.stack}`)
})

// catch unhandled promise rejections
// without this, the server will throw a warning
process.on('unhandledRejection', (error) => {
  console.log(`\nunhandledRejection signal received. \n${error}`)
})
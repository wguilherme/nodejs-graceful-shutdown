import { once } from 'node:events'
import { createServer } from 'node:http'

async function handler(request, response) {
  try {
    const data = JSON.parse(await once(request, 'data'))
    console.log('\nreceived', data)

    response.writeHead(200)
    response.end(JSON.stringify(data))

    setTimeout(() => { throw new Error('deu ruim') }, 1000)

  } catch (error) {
    console.error('Error', error.stack)
    response.writeHead(500)
    response.end()


  }

}

const server = createServer(handler)
  .listen(3000)
  .on('listening', () => console.log('Server running at 3000'))


  process.on('uncaughtException', (error, origin)=>{
    console.log(`${origin} signal received. \n${error.stack}`)
  } )
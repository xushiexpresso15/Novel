import { Server } from '@hocuspocus/server'

// Simple in-memory server for MVP. 
// In production, this would connect to a database extension.
const server = new Server({
    port: 1234,
    name: 'writepad-collab',
    async onConnect(data) {
        console.log(`New connection: ${data.documentName}`)
    },
})

server.listen()
console.log('Hocuspocus server running on port 1234')

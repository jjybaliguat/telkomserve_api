// import { MikroClient } from 'mikro-client'

// const options = {
//     host: process.env.MT_HOST,
//     port: 8728,
//     username: process.env.MT_USER,
//     password: process.env.MT_PASS,
//     timeout: 5000,
//   }
// const mikro = new MikroClient(options)

// const start = async() => {
//     await mikro
//     .talk(['/ppp/secret/print'])
//       .then((response) => {
//         console.log(response)
//       })
//       .catch((error) => {
//         console.error(error)
//       })
// }

// start()
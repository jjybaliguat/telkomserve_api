import { MikroClient } from 'mikro-client'
import asyncHanndler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()

const mikrooptions = {
    host: process.env.MT_HOST,
    port: 8728,
    username: process.env.MT_USER,
    password: process.env.MT_PASS,
    timeout: 5000,
  }

const mikro = new MikroClient(mikrooptions)

export const getPPPOE_Account = asyncHanndler(async (req, res) => {
        const response = await mikro.talk([`/ppp/secret/print`,
        ], 'object')
        res.status(200).json(response)
})

export const getPPPOE_Active = asyncHanndler(async (req, res) => {
        const response = await mikro.talk([`/ppp/active/print`,
        ], 'object')
        res.status(200).json(response)
})

// app.get('/api/v1/mikrotik/ppp/secret/disable', async(req, res) => {
//     const {id} = req.params
    
//     try {
//         await mikro.talk([`/ppp/secret/set`,
//         '=disabled=yes',
//         '=.id=1'
//         ])
//         res.status(200).json({
//             msg: "Account Disabled"
//         }
//         )
//     } catch (error) {
//         res.status(400)
//         throw new Error(error)
//     }
// })
// app.get('/api/v1/mikrotik/ppp/active/rm', async(req, res) => {
//     const {id} = req.params
    
//     try {
//         await mikro.talk([`/ppp/active/remove`,
//         '=.id=1'
//         ])
//         res.status(200).json({
//             msg: "Client disconnected"
//         }
//         )
//     } catch (error) {
//         res.status(400)
//         throw new Error(error)
//     }
// })
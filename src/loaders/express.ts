import express from 'express'
import cors from 'cors'
export default async function (app: express.Application) {
    app.use(express.json())
    app.use(cors())
}

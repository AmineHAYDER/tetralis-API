import express from 'express'
import expressLoader from './express'

export default async function (app: express.Application): Promise<void> {
    await expressLoader(app)
}

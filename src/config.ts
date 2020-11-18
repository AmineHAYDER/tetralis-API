import dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env`, encoding: 'utf8' })

export default {
    PORT: process.env.PORT || 5000,
    client_id: process.env.GOOGLE_OATH_CLIENTID || "",
    client_secret: process.env.GOOGLE_OATH_SECRET || "",
    redirect_uris: process.env.REDIRECT_URIS || ["http://localhost:5000/auth/authorized"],
    TOKEN_PATH: process.env.TOKEN_PATH || "",
    SCOPES:[process.env.SPREADSHEETS_SCOPE,process.env.DRIVE_SCOPE] || process.env.SPREADSHEETS_SCOPE
}

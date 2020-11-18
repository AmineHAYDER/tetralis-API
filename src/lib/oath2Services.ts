import config from "../config";
import {google} from 'googleapis'
import {arrayToMap} from "./index";


const {client_secret, client_id, redirect_uris} = config;
export const oAuth2Client: any = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

export async function authorize(req: any, res: any, next: any) {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {             // if token doesn't exists generate url for user
        req.body.url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: config.SCOPES,
        });
        next()
    }
    req.token = token
    next()

}

export function generateToken(req: any, res: any, next: any) {
    const {code} = req.query
    oAuth2Client.getToken(code, (err: any, token: any) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        req.body.token = token.access_token
        oAuth2Client.setCredentials(token);
        next()
    });
}




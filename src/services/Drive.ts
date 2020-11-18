import {oAuth2Client} from "../lib/oath2Services";
import {google} from "googleapis";

class DriveServices {
    public async getSpreadsheets(token:any ) {  //set user token for credentials and and request google drive for files with type spreadsheet
        oAuth2Client.setCredentials({
            access_token: token
        });
        const drive = google.drive({version: 'v3', auth: oAuth2Client});
        return (await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            spaces: 'drive',
        })).data;
    }
}

export default new DriveServices()

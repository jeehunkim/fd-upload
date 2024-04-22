import * as fs from 'fs';
import { promisify } from 'util';

export const createFile = async (
  path: string,
  fileName: string,
  //   data: string,
): Promise<void> => {
  const fileFullPath = `${path}/${fileName}`;

  const videoUrl = fileName.split('.')[0] + '.mp4';
  //   const videoFullUrl = `${path}/${videoUrl}`;
  const formData = await makeHtmlForm(videoUrl, videoUrl);

  const writeFile = promisify(fs.writeFile);
  return await writeFile(fileFullPath, formData, 'utf8');
};

const makeHtmlForm = (title, url) => {
  const form = `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${title}</title>
                </head>
                <body>

                <p><a href="${url}" download="${url}">
                <img src="https://api.4dist.com/3way/download.png" width="280" height="60"></a></p>
                <div><h2>DAILY CONTEST:</h2></div>
                <div><h2>IOT AGILITY REPLAY</h2></div>
                play and post your replay video on LinkedIn and tag all 3 @BeWhere @GSMA @4DReplay with a witty comment and the answer to 
                <b><i>"Which booth is the BeWhere 4D agility demo found at?"</i></b>
                To enter a draw to win either a BLE speaker, smart skipping rope or a Fitbit!
                <p><font size="1"> 1 prize per day. Contest ends each day at 4PM and winner will be announced by 4:30PM except Thursday which will be 3:30 PM announcement and 4PM pick up. Pick up your prize at the booth before Thursday Feb 29 at 4PM. Keep checking your post until then to see if you won! Winner will b e announced via a direct comment on the Winning Post.</font></p>
                    <div><img src="https://api.4dist.com/3way/gsma.png" width="120"></div>
                    <div><img src="https://api.4dist.com/3way/fd.png" width="150"><img src="https://api.4dist.com/3way/beWhere.png" width="150"></div>

                </body>
            </html>
    `;
  return form;
};

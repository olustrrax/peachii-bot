import * as functions from 'firebase-functions';
import express from "express"
// import bodyParser from "body-parser";
import * as Config from "./setting"
import * as Line from "@line/bot-sdk"
import { get } from 'lodash';
import HandleEvents from './line/handleEvents';

const app = express()

// app.use(bodyParser.json())
// .use(bodyParser.urlencoded({ extended: true }))

// app.post('/fulfillment', fulfillment);


app.post('/webhook', Line.middleware(Config.CONFIG_LINE), async (req, res) => {
	const events = get(req, ['body', 'events', '0']);
	const userId = get(events, ['source', 'userId']);
	console.log('events:',events)
	if (!Array.isArray(req.body.events)) {
    res.sendStatus(500)
    return
	}
	else{
		if(userId === Config.LINE_USERID) return res.send(200);
		return HandleEvents(req, res, events)
	}
})
app.listen(Config.PORT, () => {
  console.log(`🚀 server is listening on port ${Config.PORT}`);
});


export const LineBot = functions.https.onRequest(app);

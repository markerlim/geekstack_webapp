const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const dotenv = require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const PORT = 5000;
const HOST = "localhost";

const notion = new Client({ auth: `${process.env.NOTION_SECRET}`})

app.post('/submitErrorLog', jsonParser, async (req, res) => {
    const errorlogid = req.body.errorLogId;
    const cardid = req.body.cardId;
    const issue = req.body.issue;
    const report = req.body.reportDetails;

    try{
        const response = await notion.pages.create({
            parent: { database_id : `${process.env.NOTION_DATABASEID}` },
            properties: {
                "Error Log ID": {
                    title: [
                        {
                            text: {
                                content: errorlogid
                            }
                        }
                    ]
                },
                "CardId": {
                    "rich_text": [
                        {
                            "text": {
                                "content": cardid,
                                "link": null
                            }
                        }
                    ]
                },
                "ErrorType": {
                    "rich_text": [
                        {
                            "text": {
                                "content": issue,
                                "link": null
                            }
                        }
                    ]
                },
                "Report Details": {
                    "rich_text": [
                        {
                            "text": {
                                "content": report,
                                "link": null
                            }
                        }
                    ]
                }
            }
        })
        console.log(response);
        console.log("SUCCESS!");
    } catch(error) {
        console.log(error);
    }
});

app.listen(PORT,HOST, () => {
    console.log(`Server started on port ${PORT}`);
});
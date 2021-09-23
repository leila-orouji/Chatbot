//1. import dependencies
const express = require("express");
const router = express.Router();
const AssistantV2 = require("ibm-watson/assistant/v2");
const {IamAuthenticator} = require("ibm-watson/auth");

//2. create intance of assistance
//2.1. First authenticate
const authenticator = new IamAuthenticator({
    apikey:process.env.WATSON_ASSISTANT_APIKEY
});

//2.2. Connect to assistant
const assistant = new AssistantV2({
    version:"2019-02-28",
    authenticator: authenticator,
    url:process.env.WATSON_ASSISTANT_URL
});

//3.Route to handle session Tokens
//GET /api/watson/sesssion
router.get("/session",async(req, res)=>{
    //If success
    try{
        const session = await assistant.createSession({
            assistantId: process.env.WATSON_ASSISTANT_ID,
        });
        res.json(session['result']);
    }catch(err){
        res.send("Leila ! there wasan error processing your request!")
        console.log(err)
    }
});

//4. Handle Messages
// POST /api/watson/message
router.post("/message", async(req, res)=>{
    // Construct payload
    payload = {
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId:req.headers.session_id,
        input:{
            message_type:"text",
            text: req.body.input
        }
    }

    //if success
    try{
        const message = await assistant.message(payload);
        res.json(message["result"]);
    // if fail
    }catch(err){
        res.send("There was an error processing your request,");
        console.log(err);
    }
})

//5. Export routes
module.exports = router;
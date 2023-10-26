import { Box } from "@mui/material";
import React from "react";
import { useState } from "react";

const ErrorLog = ({ selectedCard, onSubmitSuccess  }) => {

    const [issue, setIssue] = useState("");
    const [selectedTranslIssue, setSelectedTranslIssue] = useState("");
    const [newTranslation, setNewTranslation] = useState("");
    const [details, setDetails] = useState("");

    const handleIssueChange = (e) => {
        setIssue(e.target.value);
        setSelectedTranslIssue("")
    }

    const handleTranslIssueChange = (e) => {
        setSelectedTranslIssue(selectedCard[e.target.value])
    }

    const handleNewTranslationChange = (e) => {
        setNewTranslation(e.target.value);
    }
    
    const handleDetailsChange = (e) => {
        setDetails(e.target.value);
    }

    const generateErrorLogId = () => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        return `${selectedCard.cardId}_${formattedDate}_${formattedTime}`;
    };

    const handleSubmit = () => {
        console.log("clicked")
        const errorLogID = generateErrorLogId();
        const reportDetails = issue === "Translation" ? newTranslation : details;
        fetch("http://localhost:5000/submitErrorLog",{
            method:'POST',
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                errorLogId: errorLogID,
                cardId: selectedCard.cardId,
                issue: issue,
                reportDetails: reportDetails
            })
        }).then(response => response.json())
        .then(data =>{
            console.log("success! ", data);
        }).catch((error) =>{
            console.log("Error: ", error);
        })
        onSubmitSuccess();
    };

    return (
        <Box sx={{ maxWidth: '800px', width: '80vw', height: '400px', padding: '30px', borderRadius: '20px', backgroundColor: '#f2f3f8', overflowY: 'auto' }} className="hide-scrollbar">
            <strong>Error Report</strong><br />
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span>{selectedCard.cardId}</span>
                <label htmlFor="dropdown" style={{ padding: '3px', backgroundColor: '#C8A2C8', color: '#121212', fontWeight: 900 }}>What's the issue?</label>
                <select id="dropdown" defaultValue="" name="Issue" style={{ width: '150px' }} onChange={handleIssueChange}>
                    <option value="" disabled hidden></option>
                    <option value="Translation">Translation Error</option>
                    <option value="Format">Format error</option>
                </select>
                {issue === "Translation" ? (
                    <>
                        <label htmlFor="transdropdown" style={{ padding: '3px', backgroundColor: '#C8A2C8', color: '#121212', fontWeight: 900 }}>Where is the error?</label>
                        <select id="transdropdown" defaultValue="" style={{ width: '150px' }} name="Issue" onChange={handleTranslIssueChange}>
                            <option value="" disabled hidden></option>
                            <option value="cardName">Name</option>
                            <option value="effect">Effects</option>
                            <option value="traits">Traits</option>
                            <option value="trigger">Trigger</option>
                        </select>
                        <span style={{ border: '1px black' }}>{selectedTranslIssue}</span>
                        <label htmlFor="newTranslation" style={{ padding: '3px', backgroundColor: '#C8A2C8', color: '#121212', fontWeight: 900 }}>Corrected Translation</label>
                        <textarea id="newTranslation" onChange={handleNewTranslationChange} style={{ height: "100px", resize: 'none' }} placeholder="Input..."></textarea>
                    </>
                ) : (
                    <>
                        <label htmlFor="details" style={{ padding: '3px', backgroundColor: '#C8A2C8', color: '#121212', fontWeight: 900 }}>Please elaborate</label>
                        <textarea id="details" onChange={handleDetailsChange} style={{ height: "100px", resize: 'none' }} placeholder="details"></textarea>
                    </>
                )}
                <button style={{
                    width: '100px', height: '30px', borderRadius: '10px', border: 'none',
                    backgroundColor: '#7C4FFF', color: '#f2f3f8', alignSelf: 'end', fontWeight: 900, cursor: 'pointer'
                }}
                onClick={handleSubmit}
                >Submit</button>
            </Box>
        </Box>
    )
}

export default ErrorLog;
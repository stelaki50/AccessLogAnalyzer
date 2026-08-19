import React, { useRef, useState } from "react";
import "./FileAccessLog.css";
import accessLogAnalyzer from "../LogParsers/accessLogAnalyzer"; 
import botDetector from "../LogParsers/botDetector"
import securityAnalysis from "../LogParsers/SecurityAnalysis"
import { setAnalysisData, setBotData, setSecurityData  } from "../services/fetchData";     

const FileInputAccessLogs = ({ onUploadSuccess }) => {
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const processFile = async (file) => {
    setIsProcessing(true);

    try {
        // 1. Read the file in the browser
        const fileContent = await file.text();



        const analysisResult = await accessLogAnalyzer(fileContent);
 
        const botAnalysisResult = botDetector(analysisResult);

        const securityAnalysisResult = securityAnalysis(analysisResult);


        setAnalysisData(analysisResult);
        setBotData(botAnalysisResult);
        setSecurityData(securityAnalysisResult);
        

        onUploadSuccess();

    } catch (error) {

        console.error(
            "Failed to analyze log file:",
            error
        );

        alert(
            "Something went wrong while analyzing the file."
        );

    } finally {
        setIsProcessing(false);
    }
};

    const handleOnChange = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            await processFile(file);
        }
    };

    const onChoseFile = () => {
        inputRef.current.click();
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    return (
        <div>
            <input type="file" ref={inputRef} onChange={handleOnChange} style={{ display: "none" }} />

            <button className="file-button" onClick={onChoseFile} disabled={isProcessing}>
                <span className="material-symbols-rounded">upload</span>
                {isProcessing ? "Analyzing..." : "Upload log File"}
            </button>

            {selectedFile && (
                <div className="selected-file">
                    <p>{selectedFile.name}</p>
                    <button onClick={removeFile}>
                        <span className="material-symbols-rounded">delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileInputAccessLogs;
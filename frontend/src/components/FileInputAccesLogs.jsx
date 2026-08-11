import React, { useRef, useState } from "react";
import "./FileAccessLog.css"


const FileInputAccessLogs = ({ onUploadSuccess }) => {
    
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleUpload = async () => {

        // If user has not selected a file stop execution
        if (!selectedFile) return alert("Please select a file");

        // Create a FormData object 
        const AccessLogData = new FormData();
        AccessLogData.append("logfile", selectedFile);

        await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: AccessLogData, 
        });

        // After backend successfully processes file notify parent component (App.js)
        onUploadSuccess();
    };

    const handleOnChange = async (event) => {

    if (event.target.files && event.target.files.length > 0) {

        const file = event.target.files[0];
        setSelectedFile(file);
        const formData = new FormData();

        formData.append("logfile", file);

        try {

            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data);
            onUploadSuccess();

        } catch (error) {

            console.error("Upload failed:", error);
        }
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
            <input type="file" ref={inputRef} onChange={handleOnChange} style={{display: "none"}} />

            
            <button className="file-button" onClick={onChoseFile} >
                <span className="material-symbols-rounded"> upload</span> Upload log File 
            </button>


          { selectedFile && <div className="selected-file">
                <p>{selectedFile.name}</p> 
            
                <button onClick={removeFile}>
                   <span className="material-symbols-rounded">delete</span>
                </button>
            </div> }

        </div>
    )
}

export default FileInputAccessLogs
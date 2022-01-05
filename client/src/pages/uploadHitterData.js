import React, { useState } from 'react';
import axios from 'axios';

function UploadHitterData() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState(null);

    const selectFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadFile = () => {
        if (!selectedFile) {
            setMessage('No file was selected.');
        } else {
            if (selectedFile.name === 'hitter_ratings.csv') {
                const formData = new FormData();
                formData.append('file', selectedFile);
                axios.post('/api/hitters', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(response => setMessage(response.data.message))
                    .catch(error => {
                        if (error.response) {
                            setMessage(error.response.data.message);
                        } else {
                            setMessage('An unknown error occurred. Please try your request again.');
                            console.log(error);
                        }
                    });
            } else {
                setMessage('The only uploaded file allowed is: "hitter_ratings.csv".');
            }
        }
    };

    return (
        <article className="container my-4">
            <h4 className="mb-4">This is the page to upload hitter data!</h4>

            <div className="mb-2">Keep these things in mind when trying to upload the Hitter Data:</div>
            <ul>
                <li>The only file allowed for upload is &quot;<span className="font-weight-bolder">hitter_ratings.csv</span>&quot;.</li>
                <li>The file must have the proper columns (ie: Year as the first column, INJ after HITTERS and RML Team at the end).</li>
                <li>This process will truncate the hitter_ratings table and replace it with the data in the uploaded file.</li>
            </ul>

            <div className="my-4">
                <div className="mb-2">
                    <label htmlFor="file-input">Select file for upload:</label>
                </div>
                <input id="file-input" className="" type="file" onChange={selectFile} />
                <button className="ml-4" onClick={uploadFile}>
                    Upload
                </button>
            </div>
            <div className="text-danger">
                {message}
            </div>
        </article>
    );
}

export default UploadHitterData;

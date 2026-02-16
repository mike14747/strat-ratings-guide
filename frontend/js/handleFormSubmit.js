export async function handleFormSubmit(event, uploadFilename, url) {
    event.preventDefault();

    // clear the message div upon submit
    const messageElement = document.getElementById('message');
    messageElement.className = '';
    messageElement.textContent = '';

    const fileUpload = document.getElementById('file-input');
    const file = fileUpload.files[0];

    // handle file related errors
    let fileErrorMessage = '';
    if (!file) {
        fileErrorMessage = 'Please select a file to upload.';
    } else if (file.name !== uploadFilename) {
        fileErrorMessage = 'The only uploaded file allowed is: "' + uploadFilename + '".';
    }
    if (!file || file.name !== uploadFilename) {
        messageElement.className = 'error';
        messageElement.textContent = fileErrorMessage;
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const dataJSON = await fetch(url, {
        method: 'POST',
        body: formData,
    }).then(res => res.json()).catch(error => console.error(error));

    // decide whether the upload was successful based upon whether any items were added to the database
    if (dataJSON?.added > 0) {
        messageElement.className = 'success';
    } else {
        messageElement.className = 'error';
    }

    messageElement.textContent = dataJSON?.message || 'An error occurred.';

    document.getElementById('file-upload-form').reset();
}

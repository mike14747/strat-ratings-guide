const UPLOAD_FILENAME = 'hitter_ratings.csv';

document.getElementById('filename').textContent = UPLOAD_FILENAME;

async function handleFormSubmit(event) {
    event.preventDefault();

    // clear the message div upon submit
    const messageElemenet = document.getElementById('message');
    messageElemenet.className = '';
    messageElemenet.textContent = '';

    const fileUpload = document.getElementById('file-input');
    const file = fileUpload.files[0];

    // handle file related errors
    let fileErrorMessage = '';
    if (!file) {
        fileErrorMessage = 'Please select a file to upload.';
    } else if (file.name !== UPLOAD_FILENAME) {
        fileErrorMessage = 'The only uploaded file allowed is: "' + UPLOAD_FILENAME + '".';
    }
    if (!file || file.name !== UPLOAD_FILENAME) {
        messageElemenet.className = 'error';
        messageElemenet.textContent = fileErrorMessage;
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = '/api/hitters';
    const dataJSON = await fetch(url, {
        method: 'POST',
        body: formData,
    }).then(res => res.json()).catch(error => console.error(error));

    // decide whether the upload was successful based upon whether any items were added to the database
    if (dataJSON?.added > 0) {
        messageElemenet.className = 'success';
    } else {
        messageElemenet.className = 'error';
    }

    messageElemenet.textContent = dataJSON?.message || 'An error occurred.';

    document.getElementById('file-upload-form').reset();
}

// add an event listener on the form element, then run the handleFormSubmit function if the submit button was clicked
const uploadForm = document.getElementById('file-upload-form');
uploadForm.addEventListener('submit', handleFormSubmit);

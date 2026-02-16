import { handleFormSubmit } from './handleFormSubmit';

const UPLOAD_FILENAME = 'pitcher_ratings.xlsx';
const URL = '/api/pitchers';

document.getElementById('filename').textContent = UPLOAD_FILENAME;

// add an event listener on the form element, then run the handleFormSubmit function if the submit button was clicked
const uploadForm = document.getElementById('file-upload-form');
uploadForm.addEventListener('submit', (event) => {
    handleFormSubmit(event, UPLOAD_FILENAME, URL);
});

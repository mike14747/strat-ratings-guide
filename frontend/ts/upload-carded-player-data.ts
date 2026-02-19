import { handleFormSubmit } from './handleFormSubmit.js';

const UPLOAD_FILENAME = 'carded_players.xlsx';
const URL = '/api/carded-players';

const filenameElement = document.getElementById('filename') as HTMLElement;
filenameElement.textContent = UPLOAD_FILENAME;

// add an event listener on the form element, then run the handleFormSubmit function if the submit button was clicked
const uploadForm = document.getElementById('file-upload-form') as HTMLFormElement;
uploadForm.addEventListener('submit', (event) => {
    handleFormSubmit(event, UPLOAD_FILENAME, URL);
});

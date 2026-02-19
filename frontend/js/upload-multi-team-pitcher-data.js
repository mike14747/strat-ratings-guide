import { handleFormSubmit } from './handleFormSubmit.js';
var UPLOAD_FILENAME = 'multi_team_pitchers.xlsx';
var URL = '/api/pitchers/multi-team';
var filenameElement = document.getElementById('filename');
filenameElement.textContent = UPLOAD_FILENAME;
// add an event listener on the form element, then run the handleFormSubmit function if the submit button was clicked
var uploadForm = document.getElementById('file-upload-form');
uploadForm.addEventListener('submit', function (event) {
    handleFormSubmit(event, UPLOAD_FILENAME, URL);
});

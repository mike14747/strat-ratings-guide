import { handleFormSubmit } from './handleFormSubmit.js';
var UPLOAD_FILENAME = 'pitcher_ratings.xlsx';
var URL = '/api/pitchers';
var filenameElement = document.getElementById('filename');
filenameElement.textContent = UPLOAD_FILENAME;
// add an event listener on the form element, then run the handleFormSubmit function if the submit button was clicked
var uploadForm = document.getElementById('file-upload-form');
uploadForm.addEventListener('submit', function (event) {
    handleFormSubmit(event, UPLOAD_FILENAME, URL);
});
//# sourceMappingURL=upload-pitcher-data.js.map
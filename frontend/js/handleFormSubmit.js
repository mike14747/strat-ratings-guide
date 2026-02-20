var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function handleFormSubmit(event, uploadFilename, url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        event.preventDefault();
        // clear the message div upon submit
        const messageElement = document.getElementById('message');
        const fileUpload = document.getElementById('file-input');
        const form = document.getElementById('file-upload-form');
        if (!messageElement || !fileUpload || !form) {
            console.error('Required DOM elements were not found!');
            return;
        }
        messageElement.className = '';
        messageElement.textContent = '';
        const file = (_a = fileUpload.files) === null || _a === void 0 ? void 0 : _a[0];
        // handle file related errors
        let fileErrorMessage = '';
        if (!file) {
            fileErrorMessage = 'Please select a file to upload.';
        }
        else if (file.name !== uploadFilename) {
            fileErrorMessage = 'The only uploaded file allowed is: "' + uploadFilename + '".';
        }
        if (!file || file.name !== uploadFilename) {
            messageElement.className = 'error';
            messageElement.textContent = fileErrorMessage;
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const dataJSON = yield fetch(url, {
            method: 'POST',
            body: formData,
        }).then(res => res.json()).catch(error => console.error(error));
        // decide whether the upload was successful based upon whether any items were added to the database
        if (!dataJSON || !dataJSON.added) {
            messageElement.className = 'error';
        }
        else if ((dataJSON === null || dataJSON === void 0 ? void 0 : dataJSON.added) > 0) {
            messageElement.className = 'success';
        }
        else {
            messageElement.className = 'error';
        }
        messageElement.textContent = (dataJSON === null || dataJSON === void 0 ? void 0 : dataJSON.message) || 'An error occurred.';
        form.reset();
    });
}

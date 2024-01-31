async function uploadFile() {
    const fileUpload = document.getElementById('file-input');
    const file = fileUpload.files[0];

    // make sure the file is of the correct name and type

    const formData = new FormData();
    formData.append('file', file);

    const url = '/api/hitters';
    const dataJSON = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => res.json().catch(error => console.error(error)));

    if (dataJSON) {
        document.getElementById('message').innerHTML = `<p class="success">${dataJSON.message}</p>`;
        return;
    }

    document.getElementById('message').innerHTML = `<p class="danger">File upload failed!</p>`;
}

const fileUploadForm = document.getElementById('file-upload-form');
fileUploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
});

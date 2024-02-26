const imagePickerElement = document.querySelector('#image-preview-control input');

const imagePreiviewElement = document.querySelector('#image-preview-control img');

function updateImagePreivew(){
    const files = imagePickerElement.files; // an array coz by default we may pick multiple files with input file picker.
    if(!files || files.length === 0){
        imagePreiviewElement.style.display = 'none';
        return;
    }

    const pickedFile = files[0];
    // generate a local URL for this file in browser side js
    imagePreiviewElement.src = URL.createObjectURL(pickedFile);
    imagePreiviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreivew);
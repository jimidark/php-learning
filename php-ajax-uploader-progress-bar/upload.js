var handleUpload = function() {
    event.preventDefault();
    event.stopPropagation();

    var fileInput = document.getElementById('file');

    var data = new FormData();

    for (var i = 0; i < fileInput.files.length; i++) {
        data.append('file[]', fileInput.files[i]);
    }

    var request = new XMLHttpRequest();

    request.upload.addEventListener('progress', function(event) {
        console.log(event);
        if (event.lengthComputable) {
            var percent = event.loaded / event.total;
            var progress = document.getElementById('upload-progress');

            while (progress.hasChildNodes()) {
                progress.removeChild(progress.firstChild);
            }

            progress.appendChild(document.createTextNode(Math.round(percent * 100) + '%'));
        }
    });

    request.addEventListener('load', function(event) {
        //document.getElementById('upload-progress').style.display = 'none';
    });

    request.addEventListener('error', function(event) {
        alert('Upload failed!');
    });

    document.getElementById('upload-progress').style.display = 'block';

    request.addEventListener('readystatechange', function(event) {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var links = document.getElementById('uploaded');
                var uploaded = JSON.parse(this.response);
                var div, a;

                for (var i = 0; i < uploaded.length; i++) {
                    div = document.createElement('div');
                    a = document.createElement('a');

                    a.setAttribute('href', 'files/' + uploaded[i]);
                    a.appendChild(document.createTextNode(uploaded[i]));

                    div.appendChild(a);
                    links.appendChild(div);
                }


            } else {
                console.log('Server replied with HTTP status: ' + this.status);
            }
        }
    });

    request.open('POST', 'index.php');
    request.setRequestHeader('Cache-Control', 'no-cache');

    if (data !== undefined) request.send(data);
};

window.addEventListener('load', function(event) {
    var submit = document.getElementById('submit');

    submit.addEventListener('click', handleUpload);
});
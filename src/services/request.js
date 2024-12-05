async function getMethod(url) {
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    return result
}

async function uploadSingleFile(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        var linkImage = await res.text();
        return linkImage;
    }
    else{
        return null;
    }
}


async function uploadMultipleFile(listFile) {
    const formData = new FormData()
    for (var i = 0; i < listFile.length; i++) {
        formData.append("file", listFile[i])
    }
    var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        return await res.json();
    } else {
        return [];
    }
}

var token = localStorage.getItem("token");
async function getMethodByToken(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response
}

async function getMethodPostByToken(url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response
}

async function getMethodPostPayload(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    return response
}

async function getMethodDeleteByToken(url) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response
}



export {getMethod,getMethodByToken, uploadSingleFile,uploadMultipleFile,getMethodPostByToken,getMethodDeleteByToken,getMethodPostPayload}
// Key: 417a1e73a2ee8a27a011923904da523b
// Secret: a3fc00cf68426992

// Globala element
const txtInpField = document.querySelector('#text-input-field');
const numInpField = document.querySelector('#num-input-field');
const sizeInpRadios = document.getElementsByName('img-size');
const sortationDropdown = document.querySelector('#select-dropdown');
const getBtn = document.querySelector('#submit-btn');
const alertUL = document.getElementById('alert-ul');
const loader = document.getElementById('loader');
let size = 0;

// Event listener till form
getBtn.addEventListener('click', getInputParameters);

// Animation
const loadAnimation = anime({
    targets: '#loader',
    rotate: '360deg',
    duration: 2000,
    easing: 'linear',
    loop: true,
    autoplay: false,
})

// Funktioner
// 1. Hämtar inputs från form, call:ar fetchURL
function getInputParameters(event) {
    event.preventDefault();

    for (let i = 0; i < sizeInpRadios.length; i++) {
        if (sizeInpRadios[i].checked == true)
            size = sizeInpRadios[i].value;
    }

    if (txtInpField.value != 0 && numInpField.value != 0 && sortationDropdown.value != 'none' && size != 0) {

        document.getElementById('image-container').innerHTML = ' ';
        alertUL.style.visibility = 'hidden';
        loader.style.visibility = 'visible';
        loadAnimation.play();

        const textInput = txtInpField.value;
        const numInput = numInpField.value;
        const sortInput = sortationDropdown.value;
        fetchURL(textInput, sortInput, numInput);
    }

    else showErrors('Alla fält är inte ifyllda');
}

// 2. Fetch:ar URL, call:ar showImages
function fetchURL(textPara, sortPara, numPara) {

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=417a1e73a2ee8a27a011923904da523b&text=${textPara}&sort=${sortPara}&per_page=${numPara}&format=json&nojsoncallback=1`;
    fetch(url).then(response => response.json()).then(data => {

        if (data.photos.photo != 0) {

            const photoArray = data.photos.photo;
            photoArray.forEach(element => {

                const server = element.server;
                const ID = element.id;
                const secret = element.secret;

                showImages(server, ID, secret, size);
            })

            size = 0;
            loader.style.visibility = 'hidden';
        }

        else showErrors('Inga foton matchade din sökning');
    })
        .catch(error => {
            showErrors(error.message);
        })
}

// 3 Skapar och lägger till bilderna till DOM:en
function showImages(serverPara, idPara, secretPara, sizePara) {

    const url = `https://live.staticflickr.com/${serverPara}/${idPara}_${secretPara}_${sizePara}.jpg`;
    const img = document.createElement('img');
    img.src = url;
    const card = document.createElement('div');
    card.classList.add('cards');
    document.getElementById('image-container').append(card);
    card.append(img);
    img.addEventListener('click', () => {
        window.open(url);
    })
}

// 4 Samlad error-funktion
function showErrors(felet) {

    const alertMessage = document.createElement('li');
    alertMessage.classList.add('alert-messages');
    alertMessage.innerText = felet;
    alertUL.append(alertMessage);
    alertUL.style.visibility = 'visible';
}
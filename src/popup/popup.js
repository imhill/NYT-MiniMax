/*const sizeInput = document.getElementById("sizeInput");
sizeInput.addEventListener("change",updateSize);*/

/*function updateSize(){
    chrome.runtime.sendMessage({data: (sizeInput.value)}, function(response){
        console.log(response);
    });
}*/

const infoSection = document.getElementById("extension-info");

const manifest = chrome.runtime.getManifest();
const extensionName = "NYT MiniMax";
const extensionVersion = manifest.version;

infoSection.innerHTML = `<hr><p class="info-title">Name: </p><p class="info-data">${extensionName}</p><br><p class="info-title">Version: </p><p class="info-data">${extensionVersion}</p>`;

const crosswordBaseLink = "https://www.nytimes.com/crosswords/game/mini/";

const datePicker = document.getElementById("date-picker");
datePicker.valueAsDate = new Date();
const gameLink = document.getElementById("game-link");

datePicker.addEventListener("change", updateGameLink);

function updateGameLink(){
    const selectedDate = datePicker.value;

    const formattedDate = selectedDate.replaceAll("-","/");

    gameLink.href = `${crosswordBaseLink}${formattedDate}`;
}

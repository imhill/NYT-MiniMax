// Update the extension version information
const infoSection = document.getElementById("extension-info");

const manifest = chrome.runtime.getManifest();
const extensionName = "NYT MiniMax";
const extensionVersion = manifest.version;

infoSection.innerHTML = `<hr><p class="info-title">Name: </p><p class="info-data">${extensionName}</p><br><p class="info-title">Version: </p><p class="info-data">${extensionVersion}</p>`;
//

// Set the "Go!" button link to today's date
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
//

// Implement the user size preferences
const sizeInput = document.getElementById("size-input");
sizeInput.addEventListener("change",updateSize);

async function updateSize(){
    const newSize = sizeInput.value;

    await chrome.storage.sync.set({"userPreferredHintSize":newSize});
    //console.log(`Updated size to ${newSize}`);
}

const uPSPromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
const userPreferredSize = uPSPromise.userPreferredHintSize;

sizeInput.value = userPreferredSize;
//

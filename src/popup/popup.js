// Update the extension version information
const infoSection = document.getElementById("extension-info");

const manifest = chrome.runtime.getManifest();
const extensionName = "NYT MiniMax";
const extensionVersion = manifest.version;

infoSection.innerHTML = `<p class="info-title">Name: </p><p class="info-data">${extensionName}</p><br><p class="info-title">Version: </p><p class="info-data">${extensionVersion}</p>`;
//

// Set the "Go!" button links to today's date
const miniBaseLink = "https://www.nytimes.com/crosswords/game/mini/";
const midiBaseLink = "https://www.nytimes.com/crosswords/game/midi/";

const datePicker = document.getElementById("date-picker");
datePicker.valueAsDate = new Date();
const miniGameLink = document.getElementById("mini-link");
const midiGameLink = document.getElementById("midi-link");

datePicker.addEventListener("change", updateGameLinks);

function updateGameLinks(){
    const selectedDate = datePicker.value;

    const formattedDate = selectedDate.replaceAll("-","/");

    miniGameLink.href = `${miniBaseLink}${formattedDate}`;
    midiGameLink.href = `${midiBaseLink}${formattedDate}`;
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

// Implement the user hint side preference

/*const sizeInput = document.getElementById("size-input");
sizeInput.addEventListener("change",updateSize);

async function updateSize(){
    const newSize = sizeInput.value;

    await chrome.storage.sync.set({"userPreferredHintSize":newSize});
    //console.log(`Updated size to ${newSize}`);
}

const uPSPromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
const userPreferredSize = uPSPromise.userPreferredHintSize;

sizeInput.value = userPreferredSize;*/
//

// implement menu button functionality

const homeButton = document.getElementById("home-button");
const settingsButton = document.getElementById("settings-button");
const aboutButton = document.getElementById("about-button");
homeButton.addEventListener("click",homeButtonPressed);
settingsButton.addEventListener("click",settingsButtonPressed);
aboutButton.addEventListener("click",aboutButtonPressed);

function homeButtonPressed(){
    switchTab("home");
}
function settingsButtonPressed(){
    switchTab("settings");
}
function aboutButtonPressed(){
    switchTab("about");
}

const homeTab = document.getElementById("home-page");
const settingsTab = document.getElementById("settings-page");
const aboutTab = document.getElementById("about-page");
const tabs = {"home":{"button": homeButton, "tab":homeTab},
              "settings":{"button": settingsButton, "tab":settingsTab},
              "about":{"button": aboutButton, "tab":aboutTab}};

function switchTab(tabName){
    for(const tab in tabs){
        if(tab == tabName){
            tabs[tab]["button"].style.fontWeight = "bold";
            tabs[tab]["tab"].style.display = "block";
        } else {
            tabs[tab]["button"].style.fontWeight = "400";
            tabs[tab]["tab"].style.display = "none";
        }
    }
}

//

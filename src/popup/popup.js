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
}

const userPreferredSizePromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
const userPreferredSize = userPreferredSizePromise.userPreferredHintSize;

sizeInput.value = userPreferredSize;

//

// Implement the user hint side preference
// 1 = right, -1 = left
const sideInput = document.getElementById("side-selector");
sideInput.addEventListener("change",updateSide);

async function updateSide(event){
    const sideSelected = (event?.target?.defaultValue);
    
    const newSide = (sideSelected == "Right") ? 1 : -1;

    await chrome.storage.sync.set({"userPreferredHintSide":newSide});
}

const userPreferredSidePromise = await chrome.storage.sync.get(["userPreferredHintSide"]);
const userPreferredSide = userPreferredSidePromise.userPreferredHintSide;

const rightSideInput = document.getElementById("right-side-input");
const leftSideInput = document.getElementById("left-side-input");

// 1 = right, -1 = left
if(userPreferredSide > 0){
    rightSideInput.checked = true;
} else {
    leftSideInput.checked = true;
}

//

// Implement the user dark mode preferences
const darkModeInput = document.getElementById("dark-mode-input");
const darkModeCheckboxLabel = document.getElementById("dark-mode-label");

darkModeInput.addEventListener("change", updateDarkMode);

async function updateDarkMode(){
    const darkModeActive = darkModeInput.checked;

    if(darkModeActive){
        darkModeCheckboxLabel.innerText = "On";
        document.body.classList.add("dark-mode");
    } else {
        darkModeCheckboxLabel.innerText = "Off";
        document.body.classList.remove("dark-mode");
    }

    await chrome.storage.sync.set({"userDarkMode":darkModeActive});
}

const userPreferredDarkModePromise = await chrome.storage.sync.get(["userDarkMode"]);
const userDarkMode = userPreferredDarkModePromise.userDarkMode;

if(userDarkMode){
    darkModeCheckboxLabel.innerText = "On";
    darkModeInput.checked = true;
    document.body.classList = "dark-mode";
} else {
    darkModeCheckboxLabel.innerText = "Off";
    darkModeInput.checked = false;
    document.body.classList = "";
}

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

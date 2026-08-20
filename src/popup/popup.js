/* Menu Setup */
// implement menu button functionality
const homeButton = document.getElementById("home-button");
homeButton.addEventListener("click",homeButtonPressed);

function homeButtonPressed(){
    switchTab("home");
}

const settingsButton = document.getElementById("settings-button");
settingsButton.addEventListener("click",settingsButtonPressed);

function settingsButtonPressed(){
    switchTab("settings");
}

const aboutButton = document.getElementById("about-button");
aboutButton.addEventListener("click",aboutButtonPressed);

function aboutButtonPressed(){
    switchTab("about");
}

// Get the elements for each tab, and store with key labels
const homeTab = document.getElementById("home-page");
const settingsTab = document.getElementById("settings-page");
const aboutTab = document.getElementById("about-page");
const tabs = {"home":{"button": homeButton, "tab":homeTab},
              "settings":{"button": settingsButton, "tab":settingsTab},
              "about":{"button": aboutButton, "tab":aboutTab}};

// Generic function to switch to a specific tab given the key
function switchTab(tabName){
    for(const tab in tabs){
        if(tab == tabName){
            tabs[tab]["button"].classList.add("selected-tab");
            tabs[tab]["tab"].style.display = "block";
        } else {
            tabs[tab]["button"].classList.remove("selected-tab");
            tabs[tab]["tab"].style.display = "none";
        }
    }
}
//

/* Home Page Setup */

// setup the default base link for the crosswords
const miniBaseLink = "https://www.nytimes.com/crosswords/game/mini/";
const midiBaseLink = "https://www.nytimes.com/crosswords/game/midi/";

// Get and setup the date picker
const datePicker = document.getElementById("date-picker");
datePicker.valueAsDate = new Date();

// Get the links
const miniGameLink = document.getElementById("mini-link");
const midiGameLink = document.getElementById("midi-link");

datePicker.addEventListener("change", updateGameLinks);

// Set the "Go!" button links to today's date
function updateGameLinks(){
    const selectedDate = datePicker.value;

    // reformat the date to match NYT link format
    const formattedDate = selectedDate.replaceAll("-","/");

    // update the links
    miniGameLink.href = `${miniBaseLink}${formattedDate}`;
    midiGameLink.href = `${midiBaseLink}${formattedDate}`;
}
//

/* Settings Page Setup */

// Implement the user size preferences to update sync storage
const sizeInput = document.getElementById("size-input");
sizeInput.addEventListener("change",updateSize);

async function updateSize(){
    const newSize = sizeInput.value;

    // Store in chrome sync
    await chrome.storage.sync.set({"userPreferredHintSize":newSize});
}

// Load the current user preferred size and set as the default value to the size input
const userPreferredSizePromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
const userPreferredSize = userPreferredSizePromise.userPreferredHintSize;
sizeInput.value = userPreferredSize;

// Implement the user hint side preference
// Values: 1 = right, -1 = left
const sideInput = document.getElementById("sp-side-section");
sideInput.addEventListener("change",updateSide);

async function updateSide(event){
    const sideSelected = (event?.target?.defaultValue);
    
    const newSide = (sideSelected == "Right") ? 1 : -1;

    await chrome.storage.sync.set({"userPreferredHintSide":newSide});
}

// Load the current user preferred side and set as the default value to the side radio buttons
const userPreferredSidePromise = await chrome.storage.sync.get(["userPreferredHintSide"]);
const userPreferredSide = userPreferredSidePromise.userPreferredHintSide;

// Get the two radio buttons
const rightSideInput = document.getElementById("right-side-input");
const leftSideInput = document.getElementById("left-side-input");

// 1 = right, -1 = left, update the correct button to be default checked
if(userPreferredSide > 0){
    rightSideInput.checked = true;
} else {
    leftSideInput.checked = true;
}

// Implement the user dark mode preferences
const darkModeCheckboxLabel = document.getElementById("dark-mode-label");
const darkModeInput = document.getElementById("dark-mode-input");
darkModeInput.addEventListener("change", updateDarkMode);

// Function to toggle dark mode on and off and update the text on the label
async function updateDarkMode(){
    const darkModeActive = darkModeInput.checked;

    if(darkModeActive){
        darkModeCheckboxLabel.innerText = "On";
        document.body.classList.add("dark-mode");
    } else {
        darkModeCheckboxLabel.innerText = "Off";
        document.body.classList.remove("dark-mode");
    }

    // Store in chrome sync
    await chrome.storage.sync.set({"userDarkMode":darkModeActive});
}

// Load the current user preference and set the checkbox
const userPreferredDarkModePromise = await chrome.storage.sync.get(["userDarkMode"]);
const userDarkMode = userPreferredDarkModePromise.userDarkMode;

if(userDarkMode){
    darkModeCheckboxLabel.innerText = "On";
    darkModeInput.checked = true;
    document.body.classList.add("dark-mode");
} else {
    darkModeCheckboxLabel.innerText = "Off";
    darkModeInput.checked = false;
    document.body.classList.remove("dark-mode");
}
//

/* About Tab Setup */

// Update the extension version information for the about tab
const infoSection = document.getElementById("extension-info");

const manifest = chrome.runtime.getManifest();
const extensionName = "MiniMax";
const extensionVersion = manifest.version;

infoSection.innerHTML = `<div id="extension-info">
                            <div id="ei-name">
                                <p class="info-title">Name: </p>
                                <p class="info-data">${extensionName}</p>
                            </div>
                            <div id="ei-version">
                                <p class="info-title">Version: </p>
                                <p class="info-data">${extensionVersion}</p>
                            </div>
                        </div>`
//
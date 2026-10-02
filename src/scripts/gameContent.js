/* Helper variables and functions */

//number of miliseconds in a day
const dayMS = 86400000;
// function to wait for some time (in ms)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/* Build out the previous and next game buttons, and attach function for building new toolbar tabs */

//function to check for the toolbar to be loaded
function addToolbar(){
    // Identify which game (mini or midi)
    const title = document.querySelector("h1.xwd__details--title");

    // add previous and next buttons to the title and date bar
    // Title header classes:
    // xwd__header--row xwd__header--fullwidth
    const headerContainer = document.querySelector("div.xwd__header--row.xwd__header--fullwidth");

    // add event to "play" button that adds font size controls
    // play button classes:
    //_momentButton_e4jbe_2
    // "view solved puzzle" button _momentButton_e4jbe_2 _primary_e4jbe_37 _extraExtraWide_e4jbe_30
    // _momentButton_e4jbe_2 _primary_e4jbe_37 _extraExtraWide_e4jbe_30
    const playButton = document.querySelector("button._momentButton_e4jbe_2");

    // check that the header and title exist, and the play button 
    // prev and next buttons
    if(title && headerContainer && playButton){  
        
        // Isolate "Mini" or "Midi"
        const currentGameName = title.innerHTML.slice(-4).toLowerCase();
        
        // Get the date from the current game's description text
        currentGameDate = new Date(Date.parse(document.querySelector("div.xwd__details--date").textContent));
        const currentYear = currentGameDate.getFullYear();
        // Convert from 0 - 11 to 1 - 12
        const currentMonth = currentGameDate.getMonth() + 1;
        // Calculate the date for "tomorrow" and "yesterday"
        yesterdayDate = new Date(currentGameDate.getTime()-dayMS);
        tomorrowDate = new Date(currentGameDate.getTime()+dayMS);

        // Create a div to contain the div with the prev and next game buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.id = "button-container";
        buttonContainer.classList = "xwd__header--puzzle-details-container";
        buttonContainer.style = "display: grid; justify-content: center;";

        const centeredDiv = document.createElement("div");
        centeredDiv.id = "centered-div";

        // create yesterday button
        const yesterdayGameLinkButton = makeHeaderLinkButton(
            `https://www.nytimes.com/crosswords/game/${currentGameName}/${yesterdayDate.toISOString().split("T")[0].replaceAll("-","/")}`,
            "Yesterday's Puzzle"
        );

        // create tomorrow button
        const tomorrowGameLinkButton = makeHeaderLinkButton(
            `https://www.nytimes.com/crosswords/game/${currentGameName}/${tomorrowDate.toISOString().split("T")[0].replaceAll("-","/")}`,
            "Tomorrow's Puzzle"
        );

        // Go to mini archive from actual crossword
        //<a href="/crosswords/archive/mini" class="css-zovycv"><div role="img" aria-label="The Mini Archive" class="css-zqj0bx"></div><p>The Mini Archive</p><span class="css-sv65wy"></span></a>
        // create archive button
        const archiveLinkButton = makeHeaderLinkButton(
            `https://www.nytimes.com/crosswords/archive/${currentGameName}/${currentYear}/${currentMonth}`,
            "Archive"
        );

        // Add them to the parent div
        centeredDiv.appendChild(yesterdayGameLinkButton);
        centeredDiv.appendChild(tomorrowGameLinkButton);
        centeredDiv.appendChild(archiveLinkButton);

        // Then add to a parent div to collect
        buttonContainer.appendChild(centeredDiv);

        // Then add the parent div to the header to keep all the buttons in line and centered
        headerContainer.appendChild(buttonContainer);

        // Insert the text size controls when the user starts playing the game
        playButton.addEventListener("click", insertTextSizeControls);
        //console.log("added listener");

        //console.log("Added all features!");

        stopInterval();
    } else {
        //console.log(`trying to add features again... {title:${title}, headerContainer:${headerContainer}, playButton:${playButton}}`);
    }
}

// Function to make the buttons in the header (previous, next, archive)
function makeHeaderLinkButton(link, title){
    const linkButton = document.createElement("a");
    linkButton.href = link;

    const button = document.createElement("button");
    button.textContent = title;
    button.classList.add("mm-header-link-button");

    linkButton.appendChild(button);

    return linkButton;
}

// Set the default initial font size for hints
const initialFontSize = 20;
let hasRunBefore = false;

async function insertTextSizeControls(){
    //console.log("inserting text controls");
    if(!hasRunBefore){
        hasRunBefore = true;

        await delay(250);

        // add font size control buttons to the control bar
        // control bar classes: 
        // xwd__toolbar--expandedMenu
        const toolbar = document.querySelector("div.xwd__toolbar--expandedMenu");

        //if it exists, build the additional features
        if (toolbar) {
            //console.log("found toolbar");

            //create a new list element for changing font size
            const hintSizeToolbarElement = document.createElement("li");
            hintSizeToolbarElement.classList.add(...["xwd__tool--button", "xwd__tool--texty"]);
            hintSizeToolbarElement.id = "mm-hint-size-tab";

            //create the button for the tab
            const tabButton = document.createElement("button");
            tabButton.type = "button";
            tabButton.ariaLabel = "Hint Size";
            tabButton.textContent = "Hint Size";
            tabButton.addEventListener("click", displaySizeTab);

            //create the list for the objects in the tab
            const optionList = document.createElement("ul");
            optionList.className = "xwd__menu--container";

            const titleListElement = document.createElement("li");
            titleListElement.classList.add(...["xwd__menu--item", "xwd__menu--item-display"]);

            const fontSizeListElement = document.createElement("button");
            fontSizeListElement.classList.add("xwd__menu--btnlink");
            fontSizeListElement.id = "mm-hint-size-button";

            const hintSizeInput = document.createElement("input");
            hintSizeInput.type = "number";
            hintSizeInput.step = "2";
            hintSizeInput.addEventListener("change",updateFontSize);
            hintSizeInput.id = "mm-hint-size-input";
            hintSizeInput.value = `${initialFontSize}`;

            const hintSizeLabel = document.createElement("label");
            hintSizeLabel.innerText = "px.";
            hintSizeLabel.htmlFor = "mm-hint-size-input";

            fontSizeListElement.appendChild(hintSizeInput);
            fontSizeListElement.appendChild(hintSizeLabel);

            optionList.appendChild(fontSizeListElement);

            hintSizeToolbarElement.appendChild(tabButton);
            hintSizeToolbarElement.appendChild(optionList);

            toolbar.appendChild(hintSizeToolbarElement);

            // create a new list element for swapping the hint and crossword
            const swapToolbarElement = document.createElement("li");
            swapToolbarElement.classList.add(...["xwd__tool--button", "xwd__tool--texty"]);
            swapToolbarElement.id = "swapHintSide";

            //create the button for the tab
            const swapTabButton = document.createElement("button");
            swapTabButton.type = "button";
            swapTabButton.ariaLabel = "Swap Hint Side";
            swapTabButton.innerHTML = "&#10563;";
            swapTabButton.style.fontSize = "32px";
            swapTabButton.id = "swap-tab-label";
            swapTabButton.addEventListener("click", swapHintSide);

            swapToolbarElement.appendChild(swapTabButton);

            toolbar.appendChild(swapToolbarElement);
            
            updateGameSettings();
        } else {
            const secondToolbar = document.querySelector("ul.xwd__toolbar--tools");

            const additionalButtonsDiv = document.createElement("div");
            additionalButtonsDiv.className = "xwd__toolbar--expandedMenu";

            //create a new list element for changing font size
            const hintSizeToolbarElement = document.createElement("li");
            hintSizeToolbarElement.classList.add(...["xwd__tool--button", "xwd__tool--texty"]);
            hintSizeToolbarElement.id = "mm-hint-size-tab";

            //create the button for the tab
            const tabButton = document.createElement("button");
            tabButton.type = "button";
            tabButton.ariaLabel = "Hint Size";
            tabButton.textContent = "Hint Size";
            tabButton.addEventListener("click", displaySizeTab);

            //create the list for the objects in the tab
            const optionList = document.createElement("ul");
            optionList.className = "xwd__menu--container";

            const titleListElement = document.createElement("li");
            titleListElement.classList.add(...["xwd__menu--item", "xwd__menu--item-display"]);

            const fontSizeListElement = document.createElement("button");
            fontSizeListElement.classList.add("xwd__menu--btnlink");
            fontSizeListElement.id = "mm-hint-size-button";

            const hintSizeInput = document.createElement("input");
            hintSizeInput.type = "number";
            hintSizeInput.step = "2";
            hintSizeInput.addEventListener("change",updateFontSize);
            hintSizeInput.id = "mm-hint-size-input";
            hintSizeInput.value = `${initialFontSize}`;

            const hintSizeLabel = document.createElement("label");
            hintSizeLabel.innerText = "px.";
            hintSizeLabel.htmlFor = "mm-hint-size-input";

            fontSizeListElement.appendChild(hintSizeInput);
            fontSizeListElement.appendChild(hintSizeLabel);

            optionList.appendChild(fontSizeListElement);

            hintSizeToolbarElement.appendChild(tabButton);
            hintSizeToolbarElement.appendChild(optionList);

            additionalButtonsDiv.appendChild(hintSizeToolbarElement);

            // create a new list element for swapping the hint and crossword
            const swapToolbarElement = document.createElement("li");
            swapToolbarElement.classList.add(...["xwd__tool--button", "xwd__tool--texty"]);
            swapToolbarElement.id = "swapHintSide";

            //create the button for the tab
            const swapTabButton = document.createElement("button");
            swapTabButton.type = "button";
            swapTabButton.ariaLabel = "Swap Hint Side";
            swapTabButton.innerHTML = "&#10563;";
            swapTabButton.style.fontSize = "32px";
            swapTabButton.id = "swap-tab-label";
            swapTabButton.addEventListener("click", swapHintSide);

            swapToolbarElement.appendChild(swapTabButton);

            additionalButtonsDiv.appendChild(swapToolbarElement);
            // insert to index 4

            secondToolbar.insertBefore(additionalButtonsDiv, secondToolbar.children[4]);
        }

        updateFontSize();
    }
}

//function to update the hint font size
function updateFontSize(){
    //select the hint list element and the input for the font size
    const hintList = document.querySelector("section.xwd__layout--cluelists");
    const sizeInput = document.getElementById("mm-hint-size-input");

    //update the font size
    hintList.style.fontSize = `${sizeInput.value}px`;
}

async function userSettingsUpdated(changes){
    for(const key in changes){
        switch(key){
            case "userPreferredHintSize":
                // Get user's size preference
                const userPreferredSizePromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
                const userPreferredSize = userPreferredSizePromise.userPreferredHintSize;

                //select the hint list element and the input for the font size
                const hintList = document.querySelector("section.xwd__layout--cluelists");
                const sizeInput = document.getElementById("mm-hint-size-input");

                //update the font size
                hintList.style.fontSize = `${userPreferredSize}px`;
                sizeInput.value = userPreferredSize;

                break;

            case "userPreferredHintSide":
                // Get user's side preference
                const userPreferredSidePromise = await chrome.storage.sync.get(["userPreferredHintSide"]);
                const userPreferredSide = userPreferredSidePromise.userPreferredHintSide;

                // swap the hint side if it needs to be updated
                if(currentHintSide != userPreferredSide){
                    swapHintSide();
                }

                break;
        }
    }
}

async function updateGameSettings(){
    // Get user's preferences for size
    const userPreferredSizePromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
    const userPreferredSize = userPreferredSizePromise.userPreferredHintSize;

    // If not set, use default initial size
    if(!userPreferredSize){
        userPreferredSize = initialFontSize;
    }

    //select the hint list element and the input for the font size
    const hintList = document.querySelector("section.xwd__layout--cluelists");
    const sizeInput = document.getElementById("mm-hint-size-input");

    //update the font size
    hintList.style.fontSize = `${userPreferredSize}px`;
    sizeInput.value = userPreferredSize;

    // Get user's preferences for hint side
    const userPreferredSidePromise = await chrome.storage.sync.get(["userPreferredHintSide"]);
    const userPreferredSide = userPreferredSidePromise.userPreferredHintSide;

    // if not set, use the current side [default (1 {right})]
    if(!userPreferredSide){
        userPreferredSide = currentHintSide;
    }

    // swap the side if it needs to be swapped
    if(currentHintSide != userPreferredSide){
        swapHintSide();
    }
}

//function to display the tab when the button is clicked on
function displaySizeTab(){
    const tab = document.getElementById("mm-hint-size-tab");

    if(tab.classList.contains("xwd__tool--open")){
        tab.classList.remove("xwd__tool--open");
    } else {
        tab.classList.add("xwd__tool--open");
    }   
}

// remove top ad (and any others that get caught)
function removeAds(){
    // pz-section pz-section-filled pz-ad-box
    const ads = document.querySelectorAll("div.pz-section.pz-section-filled.pz-ad-box");

    for(const ad of ads){
        ad.remove();
    }
}

// 1 = right, -1 = left
let currentHintSide = 1;

// function to swap hint and game sections
function swapHintSide(){
    // puzzle
    const fullGameSection = document.getElementById("puzzle");

    // xwd__layout_clueBarAndBoard
    const gameBoard = document.querySelector("section.xwd__layout_clueBarAndBoard");

    // xwd__layout--cluelists
    const hintList = document.querySelector("section.xwd__layout--cluelists");

    // html swapping arrow code "&#8646;"
    // Left arrow &#10563;
    // Right arrow &#10562;
    const swapTabLabel = document.getElementById("swap-tab-label");

    // swap the value
    currentHintSide *= -1;

    // either re-add the game board or hint list to swap positions
    // additionally, update the symbol of the button
    if(currentHintSide > 0){
        fullGameSection.appendChild(hintList);
        swapTabLabel.innerHTML = "&#10563;";
    } else {
        fullGameSection.appendChild(gameBoard);
        swapTabLabel.innerHTML = "&#10562;";
    }
    //console.log(`Swapped, new side ${currentHintSide}`);
}

//look for the toolbar every 100 miliseconds
const searchInterval = setInterval(addToolbar, 100);

//function to stop the interval function
function stopInterval(){
    clearInterval(searchInterval);
    removeAds();
}

//stop searching after a few seconds
setTimeout(stopInterval, 10000);

// Find and update user saved size settings on change
chrome.storage.sync.onChanged.addListener(userSettingsUpdated);

let insertedBestTime = false;

chrome.runtime.onMessage.addListener((message) => {
    //console.log("Message received in content script:", message);
  
    if (message["statePostDetected"] == true) {
        // Insert best puzzle solve to congrats-modal
        const congratsModalMessage = document.querySelector("div.mini__congrats-modal--message");

        // Also insert average time
        if(congratsModalMessage && !insertedBestTime){

            insertedBestTime = true;

            const bestTimeDiv = document.createElement("div");
            const averageTimeDiv = document.createElement("div");

            const bestTime = message["bestTime"];
            
            const averageTime = message["averageTime"];

            const bestTimeText = (bestTime >= 60) ? `${Math.trunc(bestTime / 60)}:${String(bestTime % 60).padStart(2,"0")}` : `${bestTime} seconds`; 

            const averageTimeText = (averageTime > 60) ? `${Math.trunc(averageTime / 60)}:${String(averageTime % 60).padStart(2,"0")}` : `${averageTime} seconds`; 

            //console.log(`BTT:${bestTimeText}, ATT:${averageTimeText}`);

            const newBestTime = message["isNewBestTime"];
            //console.log(newBestTime);

            // If bestTime == 0, meaning we haven't started yet but the modal exists, don't insert it since this means we are replaying
            if(bestTime != 0){
                //console.log("Inserting");
                if(!newBestTime){
                    //console.log("inserting not best");
                    bestTimeDiv.innerHTML = `<br>Best time: <span class="xwd__bold">${bestTimeText}.</span>`;
                    
                    // Until NYT fixes their average calculations, this won't be added since it basically just returns the last first-attempt puzzle completion time
                    //averageTimeDiv.innerHTML = `Average time: <span class="xwd__bold">${averageTimeText}.</span>`;
                } else {
                    //console.log("inserting  best");
                    const congratsTextDiv = document.querySelector("h1.pz-moment__title.large.karnak");
    
                    const newBestTimeDiv = document.createElement("div");
                    newBestTimeDiv.innerHTML = `New best time!`;
    
                    congratsTextDiv.appendChild(newBestTimeDiv);
    
                    bestTimeDiv.innerHTML = `<br>Previous best time: <span class="xwd__bold">${bestTimeText}.</span>`;
                    
                    // Until NYT fixes their average calculations, this won't be added since it basically just returns the last first-attempt puzzle completion time
                    //averageTimeDiv.innerHTML = `Average time: <span class="xwd__bold">${averageTimeText}.</span>`;
                }
            }

            congratsModalMessage.appendChild(bestTimeDiv);
            congratsModalMessage.appendChild(averageTimeDiv);
        }
    }
  });

// Add "Best time: " message to completion screen
/*
<div class="xwd__center mini__congrats-modal--message">You solved <span class="xwd__bold">The Mini</span><br> <span>in <span class="xwd__bold">2:25</span>.</span></div>
*/

/* <div class="pz-game-screen" id="js-hook-pz-moment__game"><div class="pz-game-toolbar xwd__hide-when-no-data"><div class="pz-row"><div class="pz-module pz-flex-row pz-game-toolbar-content" id="portal-game-toolbar"></div></div></div><div id="portal-game-modals"></div><div class="pz-game-field" id="pz-game-root"><div class="_container_mlx7l_1 xwd-moment-container"><div class="_moment_mlx7l_10" style="background: var(--bg-moment); transition-duration: 400ms;"><div class="pz-moment xwd__congrats-moment CongratsMoment-module_wrapper__GMYHg" data-testid="moment-wrapper" style="background-color: rgb(255, 255, 255);"><div role="dialog" aria-modal="true" class="modal-system-container xwd__congrats-container" data-testid="modal-wrapper" aria-label="modal"><div class="xwd__modal--wrapper"><div id="modalWrapper-overlay" class="xwd__modal--overlay"></div><div class="xwd__modal--body xwd__congrats-modal" tabindex="0" data-testid="modal-body" style="--modal-animation-duration: 200ms;"><button type="button" aria-label="Back to puzzle" class="xwd__modal--close" data-testid="modal-close">Back to puzzle<i class="pz-icon pz-icon-close"></i></button><article class="xwd__modal--content"><div class="mini__congrats-modal--content"><div data-star="false" data-testid="puzzle-icon" class="mini__puzzle-icon xwd__mini-progress--blue-star"></div><h1 class="pz-moment__title large karnak">Congratulations!</h1><div class="xwd__center mini__congrats-modal--message">You solved <span class="xwd__bold">The Mini</span><br> <span>in <span class="xwd__bold">2:25</span>.</span></div><div class="xwd__modal--button-container mini__congrats-modal--buttons-wrapper"><button type="button" aria-disabled="false" class="pz-moment__button primary default">Share your results</button></div></div>
*/
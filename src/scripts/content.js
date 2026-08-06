// initial hint font size
const initialFontSize = 20;

//number of miliseconds in a day
const dayMS = 86400000;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function insertTextSizeControls(){
    await delay(350);

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
        hintSizeToolbarElement.id = "changeSizeTab";

        //create the button for the tab
        const tabButton = document.createElement("button");
        tabButton.type = "button";
        tabButton.ariaLabel = "Hint Size";
        tabButton.textContent = "Hint Size";
        tabButton.addEventListener("click", displaySizeTab);

        //create the list for the objects in the tab
        const optionList = document.createElement("ul");
        optionList.className = "xwd__menu--container";
        optionList.style.width = "120px";
        optionList.style.fontSize = "20px";

        const titleListElement = document.createElement("li");
        titleListElement.classList.add(...["xwd__menu--item", "xwd__menu--item-display"]);

        const titleListText = document.createElement("p");
        titleListText.textContent = "Current Size";

        const inputListElement = document.createElement("li");
        titleListElement.classList.add(...["xwd__menu--item", "xwd__menu--item-display"]);

        const inputListInput = document.createElement("input");
        inputListInput.type = "number";
        inputListInput.step = "2";
        inputListInput.addEventListener("change",updateFontSize);
        inputListInput.id = "sizeInput";
        inputListInput.value = `${initialFontSize}`;
        inputListInput.className = "xwd__menu--btnlink";
        inputListInput.style.width = "4em";

        inputListElement.appendChild(inputListInput);
        titleListElement.appendChild(titleListText);

        optionList.appendChild(titleListElement);
        optionList.appendChild(inputListInput);

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
        //console.log("failed to add size button to toolbar");
    }
}

//function to check for the toolbar to be loaded
function addToolbar(){
    // Identify which game (mini or midi)
    const title = document.querySelector("div.xwd__details--title");

    // add previous and next buttons to the title and date bar
    // Title header classes:
    // xwd__header--row xwd__header--fullwidth
    const headerContainer = document.querySelector("div.xwd__header--row.xwd__header--fullwidth");

    // add event to "play" button that adds font size controls
    // play button classes:
    //_momentButton_e4jbe_2
    const playButton = document.querySelector("button._momentButton_e4jbe_2");

    // prev and next buttons
    if(title && headerContainer && playButton){    
        // Isolate "Mini" or "Midi"
        const currentGameName = title.innerHTML.slice(-4).toLowerCase();
        
        // Get the date from the current game's description text
        currentGameDate = new Date(Date.parse(document.querySelector("div.xwd__details--date").textContent));
        // Calculate the date for "tomorrow" and "yesterday"
        tomorrowDate = new Date(currentGameDate.getTime()+dayMS);
        yesterdayDate = new Date(currentGameDate.getTime()-dayMS);

        // Create a div to contain the div with the prev and next game buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.classList = "xwd__header--puzzle-details-container";
        buttonContainer.style = "display: grid; justify-content: center;";

        const centeredDiv = document.createElement("div");

        // create tomorrow button
        const tomorrowGameButtonLink = document.createElement("a");
        tomorrowGameButtonLink.href = `https://www.nytimes.com/crosswords/game/${currentGameName}/${tomorrowDate.toISOString().split("T")[0].replaceAll("-","/")}`;
        const tomorrowGameButton = document.createElement("button");
        tomorrowGameButton.textContent = "Tomorrow's Puzzle";
        tomorrowGameButton.style.padding = "4px";
        tomorrowGameButton.style.margin = "10px";
        tomorrowGameButtonLink.appendChild(tomorrowGameButton);

        // create yesterday button
        const yesterdayGameButtonLink = document.createElement("a");
        yesterdayGameButtonLink.href = `https://www.nytimes.com/crosswords/game/${currentGameName}/${yesterdayDate.toISOString().split("T")[0].replaceAll("-","/")}`;
        const yesterdayGameButton = document.createElement("button");
        yesterdayGameButton.textContent = "Yesterday's Puzzle";
        yesterdayGameButton.style.padding = "4px";
        yesterdayGameButton.style.margin = "10px";
        yesterdayGameButtonLink.appendChild(yesterdayGameButton);

        // create archive button
        const archiveButtonLink = document.createElement("a");
        archiveButtonLink.href = `https://www.nytimes.com/crosswords/archive/${currentGameName}`;
        const archiveButton = document.createElement("button");
        archiveButton.textContent = "Archive";
        archiveButton.style.padding = "4px";
        archiveButton.style.margin = "10px";
        archiveButtonLink.appendChild(archiveButton);

        centeredDiv.appendChild(yesterdayGameButtonLink);
        centeredDiv.appendChild(tomorrowGameButtonLink);
        centeredDiv.appendChild(archiveButtonLink);

        buttonContainer.appendChild(centeredDiv);

        headerContainer.appendChild(buttonContainer);

        // Insert the text size controls when the user starts playing the game
        playButton.addEventListener("click", insertTextSizeControls);

        //console.log("Added all features!");

        stopInterval();
    } else {
        //console.log("trying to add features again...");
    }
}

//function to update the hint font size
function updateFontSize(){
    //select the hint list element and the input for the font size
    const hintList = document.querySelector("section.xwd__layout--cluelists");
    const sizeInput = document.getElementById("sizeInput");

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
                const sizeInput = document.getElementById("sizeInput");

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
    const sizeInput = document.getElementById("sizeInput");

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
    const tab = document.getElementById("changeSizeTab");

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
}

//look for the toolbar every 100 miliseconds
const searchInterval = setInterval(addToolbar, 100);

//function to stop the interval function
function stopInterval(){
    clearInterval(searchInterval);
    removeAds();
}

//stop searching after a few seconds
setTimeout(stopInterval, 3000);

// Find and update user saved size settings on change
chrome.storage.sync.onChanged.addListener(userSettingsUpdated);
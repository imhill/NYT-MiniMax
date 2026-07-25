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
        console.log("found toolbar");
        //create a new list element
        
        const newToolbarElement = document.createElement("li");
        newToolbarElement.classList.add(...["xwd__tool--button", "xwd__tool--texty"]);
        newToolbarElement.id = "changeSizeTab";

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

        newToolbarElement.appendChild(tabButton);
        newToolbarElement.appendChild(optionList);

        toolbar.appendChild(newToolbarElement);
        
        updateFontToSize();
    } else {
        console.log("failed to add size button to toolbar");
    }
}

//function to check for the toolbar to be loaded
function addToolbar(){
    // add previous and next buttons to the title and date bar
    // Title header classes:
    // xwd__header--row xwd__header--fullwidth
    const headerContainer = document.querySelector("div.xwd__header--row.xwd__header--fullwidth");

    // add event to "play" button that adds font size controls
    // play button classes:
    //_momentButton_e4jbe_2
    const playButton = document.querySelector("button._momentButton_e4jbe_2");

    // prev and next buttons
    if(headerContainer && playButton){        
        currentGameDate = new Date(Date.parse(document.querySelector("div.xwd__details--date").textContent));
        tomorrowDate = new Date(currentGameDate.getTime()+dayMS);
        yesterdayDate = new Date(currentGameDate.getTime()-dayMS);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.width = "600px";

        const tomorrowGameButtonLink = document.createElement("a");
        tomorrowGameButtonLink.href = `https://www.nytimes.com/crosswords/game/mini/${tomorrowDate.toISOString().split("T")[0].replaceAll("-","/")}`;
        const tomorrowGameButton = document.createElement("button");
        tomorrowGameButton.textContent = "Tomorrow's Puzzle";
        tomorrowGameButton.style.padding = "4px";
        tomorrowGameButton.style.margin = "10px";
        tomorrowGameButtonLink.appendChild(tomorrowGameButton);

        const yesterdayGameButtonLink = document.createElement("a");
        yesterdayGameButtonLink.href = `https://www.nytimes.com/crosswords/game/mini/${yesterdayDate.toISOString().split("T")[0].replaceAll("-","/")}`;
        const yesterdayGameButton = document.createElement("button");
        yesterdayGameButton.textContent = "Yesterday's Puzzle";
        yesterdayGameButton.style.padding = "4px";
        yesterdayGameButton.style.margin = "10px";
        yesterdayGameButtonLink.appendChild(yesterdayGameButton);

        buttonContainer.appendChild(yesterdayGameButtonLink);
        buttonContainer.appendChild(tomorrowGameButtonLink);

        headerContainer.appendChild(buttonContainer);

        playButton.addEventListener("click", insertTextSizeControls);

        console.log("Added all features!");

        stopInterval();
    } else {
        console.log("trying to add features again...");
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

async function updateFontToSize(){
    // Get user's preferences
    const uPSPromise = await chrome.storage.sync.get(["userPreferredHintSize"]);
    const userPreferredSize = uPSPromise.userPreferredHintSize;
    if(!userPreferredSize){
        userPreferredSize = initialFontSize;
    }

    //select the hint list element and the input for the font size
    const hintList = document.querySelector("section.xwd__layout--cluelists");
    const sizeInput = document.getElementById("sizeInput");

    //update the font size
    hintList.style.fontSize = `${userPreferredSize}px`;
    sizeInput.value = userPreferredSize;
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

//look for the toolbar every 100 miliseconds
const searchInterval = setInterval(addToolbar, 100);

//function to stop the interval function
function stopInterval(){
    clearInterval(searchInterval);
}

//stop searching after a few seconds
setTimeout(stopInterval, 3000);

// Find and update user saved size settings on change
chrome.storage.sync.onChanged.addListener(updateFontToSize);
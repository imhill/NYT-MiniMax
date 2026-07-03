//number of miliseconds in a day
const dayMS = 86400000;

//function to check for the toolbar to be loaded
function checkForToolbar(){
    //try to select the toolbar
    const toolbar = document.querySelector("div.xwd__toolbar--expandedMenu");

    //if it exists, build the additional features
    if (toolbar) {
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
        optionList.style.width = "100px";

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
        inputListInput.value = "14";
        inputListInput.className = "xwd__menu--btnlink";
        inputListInput.style.width = "4em";

        inputListElement.appendChild(inputListInput);
        titleListElement.appendChild(titleListText);

        optionList.appendChild(titleListElement);
        optionList.appendChild(inputListInput);

        newToolbarElement.appendChild(tabButton);
        newToolbarElement.appendChild(optionList);

        toolbar.appendChild(newToolbarElement);

        //********* 
        //now add the previous and next puzzle buttons

        currentGameDate = new Date(Date.parse(document.querySelector("div.xwd__details--date").textContent));
        tomorrowDate = new Date(currentGameDate.getTime()+dayMS);
        yesterdayDate = new Date(currentGameDate.getTime()-dayMS);

        const tomorrowGameButtonLink = document.createElement("a");
        tomorrowGameButtonLink.href = `https://www.nytimes.com/crosswords/game/mini/${tomorrowDate.toISOString().split("T")[0].replaceAll("-","/")}`;
        const tomorrowGameButton = document.createElement("button");
        tomorrowGameButton.textContent = "Tomorrow's Puzzle";
        tomorrowGameButtonLink.appendChild(tomorrowGameButton);

        const yesterdayGameButtonLink = document.createElement("a");
        yesterdayGameButtonLink.href = `https://www.nytimes.com/crosswords/game/mini/${yesterdayDate.toISOString().split("T")[0].replaceAll("-","/")}`;
        const yesterdayGameButton = document.createElement("button");
        yesterdayGameButton.textContent = "Yesterday's Puzzle";
        yesterdayGameButtonLink.appendChild(yesterdayGameButton);

        const puzzleTitle = document.querySelector("div.xwd__details--container");

        const otherGameSelectorDiv = document.createElement("div");
        otherGameSelectorDiv.appendChild(yesterdayGameButtonLink);
        otherGameSelectorDiv.appendChild(tomorrowGameButtonLink);
        otherGameSelectorDiv.style.marginTop = "-20px";
        otherGameSelectorDiv.style.marginLeft = "345px";

        puzzleTitle.appendChild(otherGameSelectorDiv);

        //stop searching now that we are done
        stopInterval();

    } else {
        //console.log("OH No");
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

//function to display the tab when the button is clicked on
function displaySizeTab(){
    const tab = document.getElementById("changeSizeTab");

    if(tab.classList.contains("xwd__tool--open")){
        tab.classList.remove("xwd__tool--open");
    } else {
        tab.classList.add("xwd__tool--open");
    }   
}

//look for the toolbar every 25 miliseconds
const searchInterval = setInterval(checkForToolbar, 25);

//function to stop the interval function
function stopInterval(){
    clearInterval(searchInterval);
}

//stop searching after a second
setTimeout(stopInterval, 1000);
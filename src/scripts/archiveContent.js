MAXDEPTH = 15;

// function to wait for some time (in ms)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Remove top ad (and any others that get caught)
function removeAds(){
    // pz-section pz-section-filled pz-ad-box
    const ads = document.querySelectorAll("div.pz-section.pz-section-filled.pz-ad-box");

    for(const ad of ads){
        ad.remove();
    }
}

// Get current month/year
async function getCurrentMonthAndYear(depth){
    const archiveDropdowns = document.getElementsByClassName("archive_dropdown");

    if(archiveDropdowns.length > 0){
        const monthValue = String(Number(archiveDropdowns[0].value) + 1).padStart(2,"0");
        const yearValue = archiveDropdowns[1].value;

        return [monthValue, yearValue];
    } else {
        console.log("Failed to get current year/month");
        if(depth < MAXDEPTH){
            await delay(100);
            return getCurrentMonthAndYear(depth + 1);
        } else {
            return [0,0];
        }
    }
}

// Get this month's times
async function getTimes(month, year, game){
    const baseLink = `https://www.nytimes.com/svc/games/v1/archive/crossword_${game}`;

    const paddedMonth = String(month).padStart(2,"0");
    const daysInMonth = new Date(year, month, 0).getDate();

    const gameIDResponse = await fetch(`${baseLink}/${year}-${paddedMonth}-01/${year}-${paddedMonth}-${daysInMonth}`);
    const gameIDData = await gameIDResponse.json();

    //console.log(gameIDData);

    // Get dates and ids
    const datesToIDs = Object.fromEntries(gameIDData.map(element => [element.print_date, element.id]));

    //console.log(datesToIDs);

    let idList = [];
    for(const date in datesToIDs){
        idList.push(datesToIDs[date]);
    }

    const latestsLink = `https://www.nytimes.com/svc/games/state/crossword_${game}/latests?puzzle_ids=`;

    const latestsResponse = await fetch(`${latestsLink}${idList.join(",")}`);
    const latestsData = await latestsResponse.json();

    //console.log(latestsData);

    const statesArray = latestsData["states"];

    // Calclate average
    let totalTime = 0;
    let averageTime;
    if(statesArray.length != 0){
        totalTime = 0;
        numberOfGames = statesArray.length;

        for(const state of statesArray){
            let firstSolveTime = state.game_data?.firstSolve ?? -1;
            //console.log(state);
            //console.log(state.game_data);
            //console.log(`Time: ${firstSolveTime}`);

            if(firstSolveTime == -1){
                numberOfGames -= 1;
            } else {
                totalTime += firstSolveTime;
            }
        }

        if(numberOfGames != 0){
            averageTime = totalTime / numberOfGames;
        } else {
            averageTime = -1;
        }
    } else {
        averageTime = -1;
    }

    //console.log(`Average Time: ${averageTime}`);

    // Display stats
    if(averageTime > 0){
        averageTimeDiv.innerHTML = `Average Time: ${formatTime(averageTime)} <hr>`;
    } else {
        averageTimeDiv.innerText = "";
    }
}

function formatTime(rawTime){
    const time = Math.ceil(rawTime);

    const formattedTime = (time >= 60) ? `${Math.trunc(time / 60)}:${String(time % 60).padStart(2,"0")}` : `${time} seconds`;

    return formattedTime;
}

const averageTimeDiv = document.createElement("div");
async function insertAverageTime(depth){
    // Get parent for average time header
    const archiveViewer = document.getElementsByClassName("archive_viewer-content")[0];

    if(archiveViewer){
        averageTimeDiv.style.padding = "8px";
        averageTimeDiv.style.fontWeight = "bold";
        averageTimeDiv.style.fontSize = "24px";
        averageTimeDiv.style.textAlign = "center";

        averageTimeDiv.appendChild(document.createElement("hr"
        ));

        archiveViewer.before(averageTimeDiv);
    } else {
        console.log("Error inserting average time");
        if(depth < MAXDEPTH){
            await delay(100);
            insertAverageTime(depth + 1);
        }
    }
}

function setGameToMini(){
    setGame("mini");
    //console.log("mini pressed");
}

function setGameToMidi(){
    setGame("midi");
}

function setGameToDaily(){
    setGame("daily");
}

function setGameToBonus(){
    setGame("bonus");
}

function setGame(gameName){
    currentGame = gameName;
}

function updateGameName(name){
    switch(name){
        case "Mini":
            setGameToMini();
            break;
        case "Midi":
            setGameToMidi();
            break;
        case "Daily":
            setGameToDaily();
            break;
        case "Bonus":
            setGameToBonus();
            break;
    }
}

let currentGame = "mini";
function getCurrentGame(){
    return currentGame;
}


async function doItAll(){
    getTimes(...await getCurrentMonthAndYear(0), getCurrentGame());
}

async function doItAllDelayed(){
    await delay(150);
    doItAll();
}

async function addEventListeners(){
    await delay(800);
    
    // Game buttons class: tab__tab
    const gameButtons = document.getElementsByClassName("tab__tab");

    //archive_prev
    const prevButton = document.getElementsByClassName("archive_prev");

    //archive_today
    const todayButton = document.getElementsByClassName("archive_today");

    //archive_next
    const nextButton = document.getElementsByClassName("archive_next");

    // month/year dropdowns
    const archiveDropdowns = document.getElementsByClassName("archive_dropdown");

    //console.log(prevButton);
    //console.log(todayButton);
    //console.log(nextButton);
    //console.log(archiveDropdowns);

    const archiveNavButtons = [...prevButton, ...todayButton, ...nextButton, ...archiveDropdowns, ...gameButtons];

    // Add event listeners to switching the month/year
    for(const button of archiveNavButtons){
        //console.log(button.tagName);
        
        switch(button.tagName){
            case "A":
                // Allow for specific control if needed
                const shortenedName = button.innerText.split("\n")[0];
                if(button.innerText.length > 5){
                    updateGameName(shortenedName);
                }

                switch(shortenedName){
                    case "Mini":
                        button.addEventListener("click",setGameToMini);
                        break;
                    case "Midi":
                        button.addEventListener("click",setGameToMidi);
                        break;
                    case "Daily":
                        button.addEventListener("click",setGameToDaily);
                        break;
                    case "Bonus":
                        button.addEventListener("click",setGameToBonus);
                        break;
                }

                button.addEventListener("click", doItAllDelayed);
                break;
            case "BUTTON":
                button.addEventListener("click", doItAllDelayed);
                break;
            case "SELECT":
                button.addEventListener("change", doItAll);
                break;
        }
    }
}


removeAds();

addEventListeners();

insertAverageTime(0);

doItAll();
//console.log("SW Started!");

// First, get the current puzzle's id, then wait for the game to post, and check if puzzle is completed, then insert best time text into modal

const decoder = new TextDecoder("utf-8");

const playTime = {};

chrome.webRequest.onBeforeRequest.addListener(
    async (details) => {
        const url = details.url;
        const initiator = details.initiator;
        const method = details.method;

        if (url.includes("/svc/games/state") && initiator == "https://www.nytimes.com" && method == "POST") {
            //console.log("prefired");

            let rawStringData;
            let jsonData;
            
            try {
                rawStringData = details.requestBody.raw.map(element => decoder.decode(element.bytes)).join("");
                jsonData = JSON.parse(rawStringData);
            } catch (e) {
                //console.log(`Error: ${e}`);
            }

            playTime[details.requestId] = jsonData["game_data"]["playTimeSeconds"];

        }
    },
    { urls: ["*://*.nytimes.com/*"] },
    ["requestBody"]
);

chrome.webRequest.onCompleted.addListener(
    async (details) => {
        const url = details.url;
        const initiator = details.initiator;
        const method = details.method;

        if (url.includes("/svc/games/state") && initiator == "https://www.nytimes.com" && method == "POST") {
            //console.log("HOORAY!!!!!");
            //console.log(details);

            await updateFastestTime();

            try {
                const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

                const isNewBestTime = (playTime[details.requestId] <= userFastestTime);

                console.log(`${playTime[details.requestId]}, ${userFastestTime}, ${isNewBestTime}`);

                delete playTime[details.requestId];

                if (tab.id) {
                    chrome.tabs.sendMessage(tab.id, {"statePostDetected": true,
                                                     "bestTime": userFastestTime, 
                                                     "isNewBestTime": isNewBestTime,
                                                     "averageTime": userAverageTime});
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    { urls: ["*://*.nytimes.com/*"] },
    []
);

let userFastestTime = 0;
let userAverageTime = 0;
async function updateFastestTime(){
    const gameIdResponse = await fetch("https://www.nytimes.com/svc/games/state/crossword_mini/latests");
    const gameIdData = await gameIdResponse.json();
    userFastestTime = gameIdData.player.stats.crossword_mini.bestTimeSeconds;
    userAverageTime = gameIdData.player.stats.crossword_mini.avgTimeSeconds;
}

updateFastestTime();
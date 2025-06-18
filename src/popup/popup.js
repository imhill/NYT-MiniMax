const sizeInput = document.getElementById("sizeInput");
sizeInput.addEventListener("change",updateSize);

/*function updateSize(){
    chrome.runtime.sendMessage({data: (sizeInput.value)}, function(response){
        console.log(response);
    });
}*/
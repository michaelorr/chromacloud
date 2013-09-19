chrome.browserAction.onClicked.addListener( function() {attemptRequest();});

function attemptRequest() {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://my.cl.ly/items", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    var body = {
        "item":{
            "name":"Testing",
            "redirect_url":"http://google.com"
        }
    };
    body = JSON.stringify(body);

    xhr.send(body);
}   

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Origin') {
                details.requestHeaders.splice(i, 1);
                break;
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onAuthRequired.addListener(
    function(details, fnCallback) {
        fnCallback({authCredentials: {username: "cloud@michaelorr.net", password: "dummy_password"}});
    },
    {urls: ["<all_urls>"]},
    ['asyncBlocking']
);

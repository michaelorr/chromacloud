chrome.browserAction.onClicked.addListener(function(tab) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://my.cl.ly/items", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
            copy(JSON.parse(xhr.response).url);
            chrome.browserAction.setIcon({path: {'19': 'images/iconBlueLine19.png', '38': 'images/iconBlueLine38.png'}});
        }
    };
    var body = {
        "item":{
            "name": tab.title,
            "redirect_url": tab.url
        }
    };
    xhr.send(JSON.stringify(body));
    chrome.browserAction.setIcon({path: {'19': 'images/iconBlueFill19.png', '38': 'images/iconBlueFill38.png'}});
});   

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
    {urls: ["http://my.cl.ly/*"]},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onAuthRequired.addListener(
    function(details, fnCallback) {
        uname = localStorage['cloudapp_username'];
        passwd = localStorage['cloudapp_password'];
        fnCallback({authCredentials:{
            username: uname,
            password: passwd
        }});
    },
    {urls: ["http://my.cl.ly/*"]},
    ['asyncBlocking']
);

var copy = function(text) {
    var cb = document.createElement('textarea');
    document.body.appendChild(cb);
    cb.style.display = "block";
    cb.value = text;
    cb.select();
    document.execCommand("Copy");
    cb.parentNode.removeChild(cb);
};

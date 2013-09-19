chrome.browserAction.onClicked.addListener(function(tab) {
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://my.cl.ly/items", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
            var cb = document.createElement('textarea');
            document.body.appendChild(cb);
            cb.style.display = "block";
            cb.value = JSON.parse(xhr.response).url;
            cb.select();
            document.execCommand("Copy");
            cb.parentNode.removeChild(cb);
        }
    };
    var body = {
        "item":{
            "name": tab.title,
            "redirect_url": tab.url
        }
    };
    xhr.send(JSON.stringify(body));
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
        fnCallback({authCredentials:{
            username: "arthur@dent.com",
            password: "towel"
        }});
    },
    {urls: ["http://my.cl.ly/*"]},
    ['asyncBlocking']
);

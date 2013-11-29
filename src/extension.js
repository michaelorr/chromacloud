var requestIds = new Array();

chrome.browserAction.onClicked.addListener(function(tab) {
    var item_title = tab.title
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://my.cl.ly/items", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
            item_url = JSON.parse(xhr.response).url;
            var notification_success = {
                type: "basic",
                title: '"' + item_title + '" sent to CloudApp',
                iconUrl: 'images/iconBlueUp128_2.png',
                message: item_url
            }

            copy(item_url);
            chrome.browserAction.setIcon({path: {'19': 'images/iconBlueLine19.png', '38': 'images/iconBlueLine38.png'}});
            chrome.notifications.create('', notification_success, function(notificationId){
                setTimeout(function(){
                    chrome.notifications.clear(notificationId, function(){})
                }, 5000)
            });
        }
        if (xhr.readyState == 4 && xhr.status!=200) {
            var notification_failure = {
                type: "basic",
                title: "There was a problem",
                message: "The item was not uploaded to CloudApp.",
                contextMessage: "Check your network connection.",
                iconUrl: 'images/iconBlueUp128_2.png'
            }
            chrome.notifications.create('', notification_failure, function(notificationId){
                setTimeout(function(){
                    chrome.notifications.clear(notificationId, function(){})
                }, 5000)
            });
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

        if (requestIds.indexOf(details.requestId) != -1) {
            var notification_failure = {
                type: "basic",
                title: "There was a problem",
                message: "The item was not uploaded to CloudApp.",
                contextMessage: "Check your credentials.",
                iconUrl: 'images/iconBlueUp128_2.png'
            }
            chrome.notifications.create('', notification_failure, function(notificationId){
                setTimeout(function(){
                    chrome.notifications.clear(notificationId, function(){})
                }, 5000)
            });
            return;
        }
        requestIds.push(details.requestId);

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

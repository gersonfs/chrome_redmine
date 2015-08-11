 chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.create({ url: 'home.html' });
});

setInterval(function (){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    if(servers.length === 0) {
        return;
    }
    
    var currentInstance = new RedmineInstance(servers[0]);
    currentInstance.isPontoAberto(function (isAberto){
        if(isAberto) {
            cr.setPontoAberto();
        }else{
            cr.setPontoFechado();
        }
    });
    
}, 15 * 60 * 1000);
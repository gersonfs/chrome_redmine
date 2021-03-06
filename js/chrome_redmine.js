var ChromeRedmine = function (){
    
    this.loadRedmineServers = function (){
        var arrayServers = JSON.parse(localStorage['RedmineServers'] || "[]");
        var servers = [];
        for(i in arrayServers){
            var tmp = arrayServers[i];
            var server = new RedmineServer(tmp.id, tmp.name, tmp.url, tmp.userKey);
            servers.push(server);
        }
        return servers;
    };
    
    this.getRedmineServers = function (){
        return this.loadRedmineServers();
    };
    
    this.getRedmineServer = function (id){
        var servers = this.getRedmineServers();
        for(var i in servers){
            if(servers[i].getId() == id){
                return servers[i];
            }
        }
        return null;
    };

    this.addRedmineServer = function (name, url, userKey){
        
        var server = new RedmineServer(
            (new Date()).getTime(), 
            name, 
            url, 
            userKey
        );

        var servers = this.loadRedmineServers();
        servers.push(server);
        this.saveServers(servers);
    };

    this.saveServers = function (servers){
        var serversArray = [];
        for(var i in servers){
            serversArray.push(servers[i].toJSON());
        }
        localStorage['RedmineServers'] = JSON.stringify(serversArray);
    };

    this.deleteServer = function (index){
        var servers = this.loadRedmineServers();
        servers.splice(index, 1);
        this.saveServers(servers);
    };
    
    this.setPontoAberto = function () {
        chrome.browserAction.setTitle({title: 'OneWeb - Ponto Aberto'});
        chrome.browserAction.setIcon({path: '/img/icon_green.png?t=' + (new Date().getTime())});
    };
    
    this.setPontoFechado = function () {
        chrome.browserAction.setTitle({title: 'OneWeb - Ponto Fechado'});
        chrome.browserAction.setIcon({path: '/img/icon.png?t=' + (new Date().getTime())});
    };
    
};
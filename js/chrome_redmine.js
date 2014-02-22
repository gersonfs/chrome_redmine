var ChromeRedmine = function (){
    
    this.loadRedmineServers = function (){
        return JSON.parse(localStorage['RedmineServers'] || "[]");
    };
    
    this.getRedmineServers = function (){
        return this.loadRedmineServers();
    };

    this.addRedmineServer = function (name, url, userKey){
        var servers = this.loadRedmineServers();
        servers.push({'id': (new Date()).getTime(), 'name': name, 'url': url, 'userKey': userKey});
        this.saveServers(servers);
    };

    this.saveServers = function (servers){
        localStorage['RedmineServers'] = JSON.stringify(servers);
    };

    this.deleteServer = function (index){
        var servers = this.loadRedmineServers();
        var servers2 = [];
        for(i in servers){
            if(i == index){
                continue;
            }
            servers2.push(servers[i]);
        }
        this.saveServers(servers2);
    };
};
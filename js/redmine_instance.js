var RedmineInstance = function (redmineServer){
    this.redmineServer = redmineServer;
    var tmp;
    
    this.getProjectsFromServer = function (onReadyCallback){
        var self = this;
        this.listFromServer(function (projects){
            localStorage['Projects_' + self.getServerId()] = JSON.stringify(projects);
            onReadyCallback(projects);
        }, 'projects');
    };
    
    this.getProjects = function (onReadyCallback){
        
        if(localStorage['Projects_' + this.getServerId()]){
            //onReadyCallback(JSON.parse(localStorage['Projects_' + this.getServerId()] || "null"));
            //return;
        }
        
        this.getProjectsFromServer(onReadyCallback);
    };
    
    this.listFromServer = function (onReadyCallback, resource){
        var fullList = [];
        
        var options = {
            context: this,
            url: this.getServerUrl() + resource + '.json',
            crossDomain: true,
            dataType: 'json',
            data: {
                'limit' : 100,
                'offset': 0
            },
            headers: {
                'X-Redmine-API-Key': this.getUserApiKey()
            },
            success: function (data){
                for(i in data[resource]){
                    fullList.push(data[resource][i]);
                }
                
                if(data.total_count > fullList.length){
                    this.tmp.data.offset = fullList.length; //next page
                    $.ajax(this.tmp);
                    return;
                }
                
                onReadyCallback(fullList);
            }
        };
        
        this.tmp = options;
        $.ajax(options);
    };
    
    this.getServerId = function (){
        return this.redmineServer.id;
    };
    
    this.getServerUrl = function (){
        return this.redmineServer.url;
    };
    
    this.getUserApiKey = function (){
        return this.redmineServer.userKey;
    };
    
};
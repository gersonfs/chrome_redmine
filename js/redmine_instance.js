var RedmineInstance = function (redmineServer){
    this.redmineServer = redmineServer;
    var tmp;
    
    this.getAllProjects = function (onReadyCallback, parameters){
        this.listAll(onReadyCallback, 'projects', parameters);
    };
    
    this.getProjects = function (onReadyCallback, parameters){
        this.list(onReadyCallback, 'projects', parameters);
    };
    
    this.list = function (onReadyCallback, resource, parameters){
        var defaultParameters = {
            limit: 100,
            offset: 0
        };
        
        if(typeof(parameters) !== 'undefined'){
            defaultParameters = $.extend(defaultParameters, parameters);
        }
        
        var options = {
            url: this.getServerUrl() + resource + '.json',
            data: defaultParameters,
            success: function (data){
                onReadyCallback.bind(this)(data);
            }
        };
        
        this.request(options);
    };
    
    this.listAll = function (onReadyCallback, resource, parameters){
        var fullList = [];
        var defaultParameters = $.extend({offest: 0}, parameters);
        
        var success = function (data){
            for(i in data[resource]){
                fullList.push(data[resource][i]);
            }
            
            if(data.total_count > fullList.length){
                defaultParameters.offset = fullList.length; //next page
                this.list(success, resource, defaultParameters);
                return;
            }
            
            onReadyCallback.bind(this)(fullList);
        };
        
        this.list(success, resource, parameters);
    };
    
    this.request = function (options){
        var defaultOptions = {
            context: this,
            crossDomain: true,
            dataType: 'json',
            headers: {
                'X-Redmine-API-Key': this.getUserApiKey()
            }
        };
        
        $.ajax($.extend(defaultOptions, options));
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
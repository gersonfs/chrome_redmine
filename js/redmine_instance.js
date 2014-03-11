var RedmineInstance = function (redmineServer){
    this.redmineServer = redmineServer;
    
    this.getAllProjects = function (onReadyCallback, parameters){
        this.listAll(onReadyCallback, 'projects', parameters);
    };
    
    this.getProjects = function (onReadyCallback, parameters){
        this.list(onReadyCallback, 'projects', parameters);
    };
    
    this.getOpenIssuesAssignedToMe = function (onReadyCallback){
        this.list(onReadyCallback, 'issues', {assigned_to_id: 'me', status_id: 'open'});
    };
    
    this.getAllOpenIssuesAssignedToMe = function (onReadyCallback){
        this.listAll(onReadyCallback, 'issues', {assigned_to_id: 'me', status_id: 'open'});
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
    
    this.getProjectMemberships = function (project_id, onReadyCallback){
        var resource = 'projects/'+ project_id +'/memberships';
        this.list(onReadyCallback, resource);
    };
    
    this.getTrackers = function (onReadyCallback){
        this.list(onReadyCallback, 'trackers');
    };
    
    this.getIssueStatuses = function (onReadyCallback){
        this.list(onReadyCallback, 'issue_statuses');
    };
    
    this.getIssuePriorities = function (onReadyCallback){
        this.list(onReadyCallback, 'enumerations/issue_priorities');
    };
    
    this.getProjectIssueCategories = function (project_id, onReadyCallback){
        this.list(onReadyCallback, 'projects/'+ project_id +'/issue_categories');
    };
    
    this.getIssue = function (issue_id, onReadyCallback){
        this.request({
            url: this.getServerUrl() + 'issues/' + issue_id + '.json',
            success: function (data){
                onReadyCallback.bind(this)(data);
            }
        });
    };
    
    this.updateIssue = function (issue_id, data, onReadyCallback){
        this.request({
            url: this.getServerUrl() + 'issues/' + issue_id + '.json',
            type: 'PUT',
            data: data,
            dataType: 'html',
            success: function (){
                onReadyCallback.bind(this)();
            },
            error: function (a, b, c){
                alert("Erro ao salvar o ticket");
            }
        });
    };
    
    this.getRedmineServer = function (){
        return this.redmineServer;
    };
    
    this.getServerId = function (){
        return this.redmineServer.getId();
    };
    
    this.getServerUrl = function (){
        return this.redmineServer.getUrl();
    };
    
    this.getUserApiKey = function (){
        return this.redmineServer.getUserKey();
    };
    
};
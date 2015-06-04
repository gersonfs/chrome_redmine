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
        this.listAll(onReadyCallback, 'issues', {assigned_to_id: 'me', status_id: 'open', sort: 'priority:desc'});
    };
    
    this.getAllOpenIssues = function (onReadyCallback){
        this.listAll(onReadyCallback, 'issues', {status_id: 'open', sort: 'priority:desc'});
    };
    
    this.getAllUsers = function (onReadyCallback){
        this.listAll(onReadyCallback, 'users');
    };
    
    this.getCurrentUser = function (onReadyCallback){
        var options = {
            url: this.getServerUrl() + 'users/current.json',
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
    
    this.getTimeEntryActivities = function (onReadyCallback){
        this.list(onReadyCallback, 'enumerations/time_entry_activities');
    };
    
    this.getIssuePriorities = function (onReadyCallback){
        this.list(onReadyCallback, 'enumerations/issue_priorities');
    };
    
    this.getProjectIssueCategories = function (project_id, onReadyCallback){
        this.list(onReadyCallback, 'projects/'+ project_id +'/issue_categories');
    };
    
    this.getIssue = function (issue_id, onReadyCallback, include){
        var url = this.getServerUrl() + 'issues/' + issue_id + '.json';
        if(typeof(include) !== 'undefined'){
            url += '?include=' + include;
        }
        
        this.request({
            url: url,
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
    
    this.createIssue = function (data, onReadyCallback){
        this.request({
            url: this.getServerUrl() + 'issues.json',
            type: 'POST',
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
    
    this.createTimeEntry = function (data, onReadyCallback){
        this.request({
            url: this.getServerUrl() + 'time_entries.json',
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function (){
                onReadyCallback.bind(this)();
            },
            error: function (a, b, c){
                alert("Erro ao criar uma entrada de tempo");
            }
        });
    };
    
    this.abrirPonto = function (callback){
        this.request({
            url: this.getServerUrl() + 'ow_pontos/abrir.json',
            type: 'POST',
            dataType: 'json',
            success: function (retorno){
                callback.bind(this)(retorno);
            },
            error: function (a, b, c){
                alert("Erro ao abrir o ponto");
            }
        });
    };
    
    this.fecharPonto = function (callback){
        this.request({
            url: this.getServerUrl() + 'ow_pontos/fechar.json',
            type: 'POST',
            dataType: 'json',
            success: function (retorno){
                callback.bind(this)(retorno);
            },
            error: function (a, b, c){
                alert("Erro ao abrir o ponto");
            }
        });
    };
    
    this.getPontos = function (callback){
        this.request({
            url: this.getServerUrl() + 'ow_pontos.json',
            type: 'GET',
            dataType: 'json',
            success: function (retorno){
                callback.bind(this)(retorno);
            },
            error: function (a, b, c){
                alert("Erro ao buscar pontos");
            }
        });
    };
    
    this.getRelatorioTempoTrabalho = function(callback, user_id){
        var url = this.getServerUrl() + 'ow_util/tempo_trabalho.json';
        if(typeof(user_id) !== 'undefined'){
            url += '?user_id=' + user_id;
        }
        
        var options = {
            url: url,
            type: 'GET',
            success: function (data){
                callback.bind(this)(data);
            }
        };
        
        this.request(options);
    };
    
    this.uploadFile = function (file, callback){
        var options = {
            url: this.getServerUrl() + 'uploads.json?filename=' + file.name,
            type: 'POST',
            contentType: 'application/octet-stream',
            data: file,
            processData: false,
            context: this,
            success: function (data){
                callback.bind(this)(data);
            }
        };
        this.request(options);
    };
    
    this.removeAttachment = function (id, callbackSuccess){
        var options = {
            url: this.getServerUrl() + 'attachments/'+ id +'.js?attachment_id=' + id,
            type: 'DELETE',
            dataType : 'html',
            success: function (){
                callbackSuccess();
            }
        };
        this.request(options);
    };
    
    this.addWatcher = function (issueId, userId, callbackSuccess){
        var options = {
            url: this.getServerUrl() + 'issues/'+ issueId +'/watchers.json',
            data: 'user_id=' + userId,
            type: 'POST',
            dataType : 'html',
            success: function (){
                if(typeof(callbackSuccess) != "undefined"){
                    callbackSuccess();
                }
            }
        };
        this.request(options);
    };
    
    this.removeWatcher = function (issueId, userId, callbackSuccess){
        var options = {
            url: this.getServerUrl() + 'issues/'+ issueId +'/watchers/' + userId + '.json',
            type: 'DELETE',
            dataType : 'html',
            success: function (){
                if(typeof(callbackSuccess) != "undefined"){
                    callbackSuccess();
                }
            }
        };
        this.request(options);
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
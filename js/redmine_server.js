var RedmineServer = function (id, name, url, userKey){
    this.id = id;
    this.name = name;
    this.url = url;
    this.userKey = userKey;
    
    this.getId = function (){
        return this.id;
    };
    
    this.getName = function (){
        return this.name;
    };
    
    this.getUrl = function (){
        return this.url;
    };
    
    this.getUserKey = function (){
        return this.userKey;
    };
    
    this.toJSON = function (){
        return {'id': this.id, 'name': this.name, 'url': this.url, 'userKey': this.userKey};
    };
    
};
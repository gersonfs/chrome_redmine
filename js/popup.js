$(function (){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getAllProjects(function (projects){
            for(i in projects){
                i = i * 1;
                var project = projects[i];
                $('body').append((i+1) + ' - ' + project.name + '<br />');
            }
        });
    }
    
    if(servers.length === 0){
        $('body').append('<div class="alert error">Não há servidores redmine configurados</div>');
    }
});

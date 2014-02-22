$(function (){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    console.log(servers);
    
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getProjects(function (projects){
            for(i in projects){
                i = i * 1;
                var project = projects[i];
                $('body').append((i+1) + ' - ' + project.name + '<br />');
            }
        });
    }
});

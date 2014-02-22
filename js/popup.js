$(function (){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getAllOpenIssuesAssignedToMe(function (issues){
            for(i in issues){
                i = i * 1;
                var issue = issues[i];
                $('body').append((i+1) + ' - ' + issue.subject + '<br />');
            }
        });
    }
    
    if(servers.length === 0){
        $('body').append('<div class="alert error">Não há servidores redmine configurados</div>');
    }
});

$(function (){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getAllOpenIssuesAssignedToMe(function (issues){
            $('#Issues').append('<h1>'+ this.redmineServer.name +'</h1>');
            for(i in issues){
                i = i * 1;
                var issue = issues[i];
                $('#Issues').append((i+1) + ' - <a href="edit_issue.html?issue_id='+ issue.id +'&project_id=' + issue.project.id + '">' + issue.subject + '</a><br />');
            }
        });
    }
    
    if(servers.length === 0){
        $('body').append('<div class="alert error">Não há servidores redmine configurados</div>');
    }
});

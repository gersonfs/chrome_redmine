$(function (){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    var totalIssues = 0;
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getAllOpenIssuesAssignedToMe(function (issues){
            $('#Issues').append('<h1>'+ this.redmineServer.name +'</h1>');
            for(i in issues){
                i = i * 1;
                var issue = issues[i];
                var description = '(' + issue.priority.name + ') ' + moment(issue.start_date).format('DD/MM/YY') + ' - ' + issue.subject;
                var link = 'edit_issue.html?issue_id='+ issue.id +'&project_id=' + issue.project.id + '&server_id=' + this.redmineServer.getId();
                $('#Issues').append((i+1) + ' - <a href="'+ link +'">' + description + '</a><br />');
            }
            
            totalIssues += issues.length;
            
            chrome.browserAction.setBadgeText({text: totalIssues + ''});
        });
    }
    
    if(servers.length === 0){
        $('body').append('<div class="alert error">Não há servidores redmine configurados</div>');
    }
});

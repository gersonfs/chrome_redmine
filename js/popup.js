var issues = [];
var instances = [];
var currentIssue;
var currentInstance;

$(function (){
    loadIssues();
    
    $('#BackIssue').click(function (){
        $('#Issue').hide();
        $('#Issues').show();
    });
    
    $('#SaveIssue').click(function (){
        currentInstance.updateIssue(currentIssue.id, $('#Issue').serialize(), function (){
            loadIssues();
            $('#Issue').hide();
            $('#Issues').show();
        });
    });
});

function loadIssues(){
    var cr = new ChromeRedmine();
    var servers = cr.getRedmineServers();
    var totalIssues = 0;
    $('#Issues').html('');
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getAllOpenIssuesAssignedToMe(function (serverIssues){
            issues[this.redmineServer.getId()] = serverIssues;
            $('#Issues').append('<h1>'+ this.redmineServer.name +'</h1>');
            for(i in serverIssues){
                i = i * 1;
                var issue = serverIssues[i];
                var description = '(' + issue.priority.name + ') ' + moment(issue.start_date).format('DD/MM/YY') + ' - ' + issue.subject;
                $('#Issues').append((i+1) + ' - <a data-server-id="'+ this.redmineServer.getId() +'" data-issue-id="'+ issue.id +'" href="#">' + description + '</a><br />');
            }
            
            $('#Issues a').click(issueClicked);
            
            totalIssues += serverIssues.length;
            
            chrome.browserAction.setBadgeText({text: totalIssues + ''});
        });
    }
    
    if(servers.length === 0){
        $('body').append('<div class="alert error">Não há servidores redmine configurados</div>');
    }
}

function issueClicked(){
    var serverId = $(this).data('server-id') * 1;
    var issueId = $(this).data('issue-id') * 1;
    
    var cr = new ChromeRedmine();
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    currentIssue = getIssue(serverId, issueId);
    
    $('#IssueProjectId').val(currentIssue.project.id);
    $('#IssueSubject').val(currentIssue.subject);
    $('#IssueDescription').val(currentIssue.description);
    $('#IssueStartDate').val(currentIssue.start_date);
    $('#IssueEstimatedHours').val(currentIssue.estimated_hours);
    $('#Issue').show();
    $('#Issues').hide();
    
    currentInstance.getProjectMemberships(currentIssue.project.id, function (data){
        var html = '<option value=""></option>';
        for(var i in data.memberships){
            var member = data.memberships[i];
            
            if(typeof(member.user) != 'undefined'){
                html += '<option value="'+ member.user.id +'">'+ member.user.name +'</option>';
            }
            
            if(typeof(member.group) != 'undefined'){
                html += '<option value="'+ member.group.id +'">'+ member.group.name +'</option>';
            }
        }
        $('#IssueAssignedToId').html(html);
        $('#IssueAssignedToId').val(currentIssue.assigned_to.id);
    });
    
    currentInstance.getTrackers(function (data){
        var html = '';
        for(var i in data.trackers){
            var tracker = data.trackers[i];
            html += '<option value="'+ tracker.id +'">'+ tracker.name +'</option>';
        }
        $('#IssueTrackerId').html(html);
        $('#IssueTrackerId').val(currentIssue.tracker.id);
    });
    
    currentInstance.getIssueStatuses(function (data){
        var html = '';
        for(var i in data.issue_statuses){
            var status = data.issue_statuses[i];
            html += '<option value="'+ status.id +'">'+ status.name +'</option>';
        }
        $('#IssueStatusId').html(html);
        $('#IssueStatusId').val(currentIssue.status.id);
    });
    
    currentInstance.getIssuePriorities(function (data){
        var html = '';
        for(var i in data.issue_priorities){
            var priority = data.issue_priorities[i];
            html += '<option value="'+ priority.id +'">'+ priority.name +'</option>';
        }
        $('#IssuePriorityId').html(html);
        $('#IssuePriorityId').val(currentIssue.priority.id);
    });
}

function getIssue(serverId, issueId){
    var serverIssues = issues[serverId];
    for(var i in serverIssues){
        if(serverIssues[i].id == issueId){
            return serverIssues[i];
        }
    }
    return null;
}

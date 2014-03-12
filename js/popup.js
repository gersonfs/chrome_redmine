var issues = [];
var instances = [];
var currentIssue;
var currentInstance;

$(function (){
    loadIssues();
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
            $('#Issues').append('<h1>'+ this.redmineServer.name +' <a data-server-id="'+ this.redmineServer.getId() +'" href="new_issue.html" class="new_issue">New Issue</a></h1>');
            var html = '<div class="project_issues">';
            for(i in serverIssues){
                i = i * 1;
                var issue = serverIssues[i];
                var description = '(' + issue.priority.name + ') ' + moment(issue.start_date).format('DD/MM/YY') + ' - ' + issue.subject;
                html += (i+1) + ' - <a data-server-id="'+ this.redmineServer.getId() +'" data-issue-id="'+ issue.id +'" href="edit_issue.html">' + description + '</a><br />';
            }
            html += '</div>';
            $('#Issues').append(html);
            
            $('#Issues div.project_issues a').click(issueClicked);
            $('#Issues h1 a').click(newIssue);
            
            totalIssues += serverIssues.length;
            
            chrome.browserAction.setBadgeText({text: totalIssues + ''});
        });
    }
    
    if(servers.length === 0){
        $('body').append('<div class="alert error">Não há servidores redmine configurados</div>');
    }
}

function newIssue(){
    var serverId = $(this).data('server-id') * 1;
    var cr = new ChromeRedmine();
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    $.get(this.href, function (data){
        $('#Issue').html(data);
        
        $('#BackIssue').click(function (){
            $('#Issue').html('');
            $('#Issue').hide('');
            $('#Issues').show();
        });
        
        $('#SaveIssue').click(function (){
            currentInstance.createIssue($('#Issue').serialize(), function (){
                loadIssues();
                $('#Issue').html('');
                $('#Issue').hide('');
                $('#Issues').show();
            });
        });
        
        setLoading();
        
        loadTrackers();
        loadIssueStatuses();
        loadIssuePriorities();
        
        $('#Issue').show();
        $('#Issues').hide();
    });
    
    return false;
}

function issueClicked(){
    var serverId = $(this).data('server-id') * 1;
    var issueId = $(this).data('issue-id') * 1;
    
    var cr = new ChromeRedmine();
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    currentIssue = getIssue(serverId, issueId);
    
    $.get(this.href, function (data){
        $('#Issue').html(data);
        
        $('#BackIssue').click(function (){
            $('#Issue').html('');
            $('#Issue').hide('');
            $('#Issues').show();
        });

        $('#SaveIssue').click(function (){
            currentInstance.updateIssue(currentIssue.id, $('#Issue').serialize(), function (){
                loadIssues();
                $('#Issue').html('');
                $('#Issue').hide('');
                $('#Issues').show();
            });
        });
        
        setDefaultValues();
        setLoading();
        
        $('#Issue').show();
        $('#Issues').hide();
        
        loadProjectMemberships(currentIssue.project.id, currentIssue.assigned_to.id);
        loadTrackers(currentIssue.tracker.id);
        loadIssueStatuses(currentIssue.status.id);
        loadIssuePriorities(currentIssue.priority.id);
    });
    
    return false;
}

function setDefaultValues(){
    $('#IssueProjectId').val(currentIssue.project.id);
    $('#IssueSubject').val(currentIssue.subject);
    $('#IssueDescription').val(currentIssue.description);
    $('#IssueStartDate').val(currentIssue.start_date);
    $('#IssueEstimatedHours').val(currentIssue.estimated_hours);
    $('#IssueAssignedToId').html('<option value="'+ currentIssue.assigned_to.id +'">'+ currentIssue.assigned_to.name +'</option>');
    $('#IssueTrackerId').html('<option value="'+ currentIssue.tracker.id +'">'+ currentIssue.tracker.name +'</option>');
    $('#IssueStatusId').html('<option value="'+ currentIssue.status.id +'">'+ currentIssue.status.name +'</option>');
    $('#IssuePriorityId').html('<option value="'+ currentIssue.priority.id +'">'+ currentIssue.priority.name +'</option>');
}

function setLoading(){
    $('label[for="IssueAssignedToId"]').addClass('loading');
    $('label[for="IssueTrackerId"]').addClass('loading');
    $('label[for="IssueStatusId"]').addClass('loading');
    $('label[for="IssuePriorityId"]').addClass('loading');
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

function loadProjectMemberships(projectId, defaultValue){
    currentInstance.getProjectMemberships(projectId, function (data){
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
        $('label[for="IssueAssignedToId"]').removeClass('loading');
        
        if(typeof(defaultValue) !== 'undefined'){
            $('#IssueAssignedToId').val(defaultValue);
        }
    });
}

function loadTrackers(defaultValue){
    currentInstance.getTrackers(function (data){
        var html = '';
        for(var i in data.trackers){
            var tracker = data.trackers[i];
            html += '<option value="'+ tracker.id +'">'+ tracker.name +'</option>';
        }
        $('#IssueTrackerId').html(html);
        $('label[for="IssueTrackerId"]').removeClass('loading');
        
        if(typeof(defaultValue) !== 'undefined'){
            $('#IssueTrackerId').val(defaultValue);
        }
    });
}

function loadIssueStatuses(defaultValue){
    currentInstance.getIssueStatuses(function (data){
        var html = '';
        for(var i in data.issue_statuses){
            var status = data.issue_statuses[i];
            html += '<option value="'+ status.id +'">'+ status.name +'</option>';
        }
        $('#IssueStatusId').html(html);
        $('label[for="IssueStatusId"]').removeClass('loading');
        
        if(typeof(defaultValue) !== 'undefined'){
            $('#IssueStatusId').val(defaultValue);
        }
    });
}

function loadIssuePriorities(defaultValue){
    currentInstance.getIssuePriorities(function (data){
        var html = '';
        for(var i in data.issue_priorities){
            var priority = data.issue_priorities[i];
            html += '<option value="'+ priority.id +'">'+ priority.name +'</option>';
        }
        $('#IssuePriorityId').html(html);
        $('label[for="IssuePriorityId"]').removeClass('loading');
        
        if(typeof(defaultValue) !== 'undefined'){
            $('#IssuePriorityId').val(defaultValue);
        }
    });
}
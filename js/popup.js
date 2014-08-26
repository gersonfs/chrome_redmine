var globalIssues = [];
var instances = [];
var currentIssue;
var currentInstance;
var cr;

$(function (){
    cr = new ChromeRedmine();
    loadIssuesAssignedToMe();
});

function loadIssuesAssignedToMe(){
    var servers = cr.getRedmineServers();
    //var totalIssues = 0;
    $('#main').html('<div class="loading"></div>');
    for(i in servers){
        var ri = new RedmineInstance(servers[i]);
        ri.getAllOpenIssuesAssignedToMe(function (serverIssues){
            
            globalIssues[this.redmineServer.getId()] = serverIssues;
            var html = '<h1>'+ this.redmineServer.name +'<br >';
            html += '<a href="new_issue.html?server_id='+ this.redmineServer.getId() +'" class="new_issue">Nova Tarefa</a> - ';
            html += '<a data-server-id="'+ this.redmineServer.getId() + '" href="" class="list">Listar Tarefas</a>';
            html += ' - <a href="time_entry.html?server_id='+ this.redmineServer.getId() +'" class="list">Tempo Trab.</a>';
            html += ' - <a href="ponto.html?server_id='+ this.redmineServer.getId() +'" class="list">Ponto</a>';
            html += ' - <a href="relatorio_tempo_trabalho.html?server_id='+ this.redmineServer.getId() +'" class="list">Rel t.Trab.</a>';
            html += '</h1>';
            html += '<div class="project_issues">';
            for(i in serverIssues){
                i = i * 1;
                var issue = serverIssues[i];
                var description = '(' + issue.priority.name + ') ' + moment(issue.start_date).format('DD/MM/YY') + ' - ' + issue.subject;
                html += (i+1) + ' - <a data-server-id="'+ this.redmineServer.getId() +'" data-issue-id="'+ issue.id +'" href="edit_issue.html">' + description + '</a><br />';
            }
            html += '</div>';
            $('#main').html(html);
            
            $('#main div.project_issues a').click(editIssue);
            $('#main h1 a.new_issue').click(newIssue);
            $('#main h1 a.list').click(listIssuesPerUser);
            
            //totalIssues += serverIssues.length;
            //chrome.browserAction.setBadgeText({text: totalIssues + ''});
        });
    }
    
    if(servers.length === 0){
        $('#main').html('<div class="alert error">Não há servidores redmine configurados</div>');
    }
}

function listIssuesPerUser(){
    globalIssues = [];
    var serverId = $(this).data('server-id') * 1;
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    $('#main').html('<div class="loading"></div>');
    
    currentInstance.getAllUsers(function (users){
        currentInstance.getAllOpenIssues(function (issues){
            globalIssues[currentInstance.redmineServer.getId()] = issues;
            var html = '';
            for(i in users){
                var user = users[i];
                userIssues = getUserIssues(user, issues);
                html += '<strong>' + user.firstname + ' ' + user.lastname + '</strong><br />';
                html += '<div class="user_issues">';
                for(i in userIssues){
                    i = i * 1;
                    var issue = userIssues[i];
                    var description = '(' + issue.priority.name + ') ' + moment(issue.start_date).format('DD/MM/YY') + ' - ' + issue.subject;
                    html += (i+1) + ' - <a data-server-id="'+ this.redmineServer.getId() +'" data-issue-id="'+ issue.id +'" href="edit_issue.html">' + description + '</a><br />';
                }
                html += '</div><br />';
            }
            
            var unassignedIssues = getUnassignedIssues(issues);
            html += '<strong>Unassigned</strong><br />';
            html += '<div class="user_issues">';
            for(i in unassignedIssues){
                i = i * 1;
                var issue = unassignedIssues[i];
                var description = '(' + issue.priority.name + ') ' + moment(issue.start_date).format('DD/MM/YY') + ' - ' + issue.subject;
                html += (i+1) + ' - <a data-server-id="'+ this.redmineServer.getId() +'" data-issue-id="'+ issue.id +'" href="edit_issue.html">' + description + '</a><br />';
            }
            html += '</div><br />';

            $('#main').html(html);
            $('#main a').click(editIssue);
        });
    });
    
    return false;
}

function getUserIssues(user, issues){
    var issueList = [];
    for(var i in issues){
        if(typeof(issues[i].assigned_to) === 'undefined'){
            continue;
        }
        
        if(issues[i].assigned_to.id == user.id){
            issueList.push(issues[i]);
        }
    }
    
    return issueList;
}

function getUnassignedIssues(issues){
    var issueList = [];
    for(var i in issues){
        if(typeof(issues[i].assigned_to) === 'undefined'){
            issueList.push(issues[i]);
        }
    }
    
    return issueList;
}

function newIssue(){
    chrome.tabs.create({url: this.href});
    return false;
}

function editIssue(){
    var serverId = $(this).data('server-id') * 1;
    var issueId = $(this).data('issue-id') * 1;
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    currentIssue = getIssue(serverId, issueId);
    var issueForm = new RedmineIssueForm(currentInstance);
    issueForm.edit(currentIssue, loadIssuesAssignedToMe);
    return false;
}

function getIssue(serverId, issueId){
    var serverIssues = globalIssues[serverId];
    for(var i in serverIssues){
        if(serverIssues[i].id == issueId){
            return serverIssues[i];
        }
    }
    return null;
}
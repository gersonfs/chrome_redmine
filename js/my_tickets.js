var globalIssues = [];
var instances = [];
var currentIssue;
var currentInstance;
var cr;


$(function () {
    cr = new ChromeRedmine();
    loadIssuesAssignedToMe();
});

function loadIssuesAssignedToMe() {
    var servers = cr.getRedmineServers();
    //var totalIssues = 0;
    $('#main').html('<div class="loading"></div>');
    if (servers.length === 0) {
        $('#main').html('<div class="alert error">Não há servidores redmine configurados</div>');
        return;
    }
    //vou tratar so 1 por enquanto
    var server = servers[0];

    var ri = new RedmineInstance(server);

    var ajax1 = ri.getIssueStatuses(function (dados) {
        this.issueStatuses = dados.issue_statuses;
    });

    $.when(ajax1).done((function (instanciaRedmine) {
        return function (dados1) {
            setarEventoCliqueDireito(instanciaRedmine);
        };
    })(ri));

    ri.getAllOpenIssuesAssignedToMe(function (serverIssues) {

        globalIssues[this.redmineServer.getId()] = serverIssues;

        var menu = '<h1>' + this.redmineServer.name + '</h1>';
        menu += '<a href="new_issue.html?server_id=' + this.redmineServer.getId() + '" class="new_issue">Nova Tarefa</a> - ';
        menu += '<a href="home.html">Minhas Tarefas</a> - ';
        menu += '<a data-server-id="' + this.redmineServer.getId() + '" href="" class="list">Listar Tarefas</a>';
        menu += ' - <a href="time_entry.html?server_id=' + this.redmineServer.getId() + '" class="list">Tempo Trab.</a>';
        menu += ' - <a href="ponto.html?server_id=' + this.redmineServer.getId() + '" class="list">Ponto</a>';
        menu += ' - <a href="relatorio_tempo_trabalho.html?server_id=' + this.redmineServer.getId() + '" class="list">Rel t.Trab.</a>';

        $('#menu').html(menu);
        $('#menu a.new_issue').click(newIssue);
        $('#menu a.list').click(listIssuesPerUser);

        html = getTabelaTarefas(this.redmineServer.getId(), serverIssues);
        $('#main').html(html);
        setarEventoCliqueTicket();
        //totalIssues += serverIssues.length;
        //chrome.browserAction.setBadgeText({text: totalIssues + ''});
    });



}

function setarEventoCliqueTicket() {
    $('#main table tbody tr td.edit').bind('click', editIssue);
}

function setarEventoCliqueDireito(instanciaRedmine) {
    var statuses = {};
    for (var i in instanciaRedmine.issueStatuses) {
        var status = instanciaRedmine.issueStatuses[i];
        statuses['status-' + status.id] = {"name": status.name};
    }
    
    var callback = (function (instancia){
        return function (key, options){
            //console.log(key);
            //console.log(options.$trigger);
            var issue_id = $(options.$trigger).data('issue-id');
            
            if(key.match(/^status\-/)) {
                var status_id = key.replace('status-', '');
                var dados = {issue: {status_id: status_id}};
                instancia.updateIssue(issue_id, dados, function (){
                    loadIssuesAssignedToMe();
                });
            }
            
            if(key.match(/^concluido\-/)) {
                var done_ratio = key.replace('concluido-', '');
                var dados = {issue: {done_ratio: done_ratio}};
                instancia.updateIssue(issue_id, dados, function (){
                    loadIssuesAssignedToMe();
                });
            }
            
            if(key == 'quit') {
                $(options.$trigger).contextMenu("hide");
            }
        };
    })(instanciaRedmine);
    
    $.contextMenu({
        selector: 'table.tarefas tbody tr',
        callback: callback,
        items: {
            "status": {
                "name": "Status",
                "items": statuses
            },
            "concluido": {
                "name": "% done",
                "items": {
                    "concluido-10": {"name": "10%"},
                    "concluido-20": {"name": "20%"},
                    "concluido-30": {"name": "30%"},
                    "concluido-40": {"name": "40%"},
                    "concluido-50": {"name": "50%"},
                    "concluido-60": {"name": "60%"},
                    "concluido-70": {"name": "70%"},
                    "concluido-80": {"name": "80%"},
                    "concluido-90": {"name": "90%"},
                    "concluido-100": {"name": "100%"}
                }
            },
            "quit": {name: "Quit", icon: "quit"}
        }
    });

    $('table.tarefas tbody tr').on('click', function (e) {
        console.log('clicked', this);
    });
}

function getTabelaTarefas(serverId, issues, caption) {
    var html = '';
    html += '<table class="formatada tarefas">';
    if (caption) {
        html += '<caption>' + caption + '</caption>';
    }
    html += '<thead>';
    html += '<tr class="colunas">';
    html += '<td style="width: 4%;">ID</td>';
    html += '<td style="width: 14%;">Projeto</td>';
    html += '<td style="width: 7%;">Prioridade</td>';
    html += '<td style="width: 11%;">Status</td>';
    html += '<td style="width: 6%;">Data início</td>';
    html += '<td style="width: 6%;">Data fim</td>';
    html += '<td style="width: 41%;">Titulo</td>';
    html += '<td style="width: 7%;">T. Prev.</td>';
    html += '<td style="width: 4%;"></td>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (i in issues) {
        i = i * 1;
        var issue = issues[i];
        html += '<tr data-server-id="' + serverId + '" data-issue-id="' + issue.id + '" data-href="edit_issue.html">';
        html += '<td class="edit">#' + issue.id + '</td>';
        html += '<td class="edit">' + issue.project.name + '</td>';
        html += '<td class="edit">' + issue.priority.name + '</td>';
        html += '<td class="edit">' + issue.status.name + ' ('+ issue.done_ratio +'%)' + '</td>'
        html += '<td class="edit">' + (issue.start_date ? moment(issue.start_date).format('DD/MM/YY') : '') + '</td>';
        html += '<td class="edit">' + (issue.due_date ? moment(issue.due_date).format('DD/MM/YY') : '') + '</td>';
        html += '<td class="edit">' + issue.subject + '</td>';
        html += '<td class="edit">' + (issue.estimated_hours ? issue.estimated_hours : '') + '</td>';
        html += '<td><a href="time_entry.html?server_id=' + serverId + '&project_id=' + issue.project.id + '&issue_id=' + issue.id + '">T.T.</a></td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';

    return html;
}

function listIssuesPerUser() {
    globalIssues = [];
    var serverId = $(this).data('server-id') * 1;
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));

    $('#main').html('<div class="loading"></div>');

    currentInstance.getAllUsers(function (users) {
        currentInstance.getAllOpenIssues(function (issues) {
            globalIssues[currentInstance.redmineServer.getId()] = issues;
            var html = '';
            for (i in users) {
                var user = users[i];
                userIssues = getUserIssues(user, issues);
                html += getTabelaTarefas(this.redmineServer.getId(), userIssues, user.firstname + ' ' + user.lastname);
                html += '<br /><br />';
            }

            var unassignedIssues = getUnassignedIssues(issues);
            html += getTabelaTarefas(this.redmineServer.getId(), unassignedIssues, 'Sem usuário');
            $('#main').html(html);
            setarEventoCliqueTicket();
            setarEventoCliqueDireito();
        });
    });

    return false;
}

function getUserIssues(user, issues) {
    var issueList = [];
    for (var i in issues) {
        if (typeof (issues[i].assigned_to) === 'undefined') {
            continue;
        }

        if (issues[i].assigned_to.id == user.id) {
            issueList.push(issues[i]);
        }
    }

    return issueList;
}

function getUnassignedIssues(issues) {
    var issueList = [];
    for (var i in issues) {
        if (typeof (issues[i].assigned_to) === 'undefined') {
            issueList.push(issues[i]);
        }
    }

    return issueList;
}

function newIssue() {
    chrome.tabs.create({url: this.href});
    return false;
}

function editIssue() {
    var serverId = $(this).parent().attr('data-server-id') * 1;
    var issueId = $(this).parent().attr('data-issue-id') * 1;
    var url = $(this).parent().attr('data-href') + '?serverId=' + serverId + '&issueId=' + issueId;
    //window.href = url;
    chrome.tabs.create({url: url});
    return false;
}

function getIssue(serverId, issueId) {
    var serverIssues = globalIssues[serverId];
    for (var i in serverIssues) {
        if (serverIssues[i].id == issueId) {
            return serverIssues[i];
        }
    }
    return null;
}
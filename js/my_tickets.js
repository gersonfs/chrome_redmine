var globalIssues = [];
var instances = [];
var currentIssue;
var currentInstance;
var cr;


$(function () {
    cr = new ChromeRedmine();
    currentInstance = new RedmineInstance();
    if(window.location.href.match(/listar_tarefas\.html$/)){
        listIssuesPerUser();
    }else{
        loadIssuesAssignedToMe()
    }
    
});

function loadIssuesAssignedToMe() {
    var servers = cr.getRedmineServers();
    //var totalIssues = 0;
    $('#main').html('<div class="loading"></div>');
    if (servers.length === 0) {
        $('#main').html('<div class="alert error">Não há servidores redmine configurados</div>');
        return;
    }

    var ri = new RedmineInstance();

    ri.getIssueStatuses(function (dados) {
        this.issueStatuses = dados.issue_statuses;
    });

    ri.getAllOpenIssuesAssignedToMe(function (serverIssues) {

        globalIssues = serverIssues;

        html = getTabelaTarefas(serverIssues);
        $('#main').html(html);
        setarEventoCliqueTicket();
        setarEventoCliqueDireito(ri);
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

    var callback = (function (instancia) {
        return function (key, options) {
            //console.log(key);
            //console.log(options.$trigger);
            var issue_id = $(options.$trigger).data('issue-id');

            if (key.match(/^status\-/)) {
                var status_id = key.replace('status-', '');
                var dados = {issue: {status_id: status_id}};
                instancia.updateIssue(issue_id, dados, function () {
                    loadIssuesAssignedToMe();
                });
            }

            if (key.match(/^concluido\-/)) {
                var done_ratio = key.replace('concluido-', '');
                var dados = {issue: {done_ratio: done_ratio}};
                instancia.updateIssue(issue_id, dados, function () {
                    loadIssuesAssignedToMe();
                });
            }

            if (key == 'quit') {
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

function getTabelaTarefas(issues, caption) {
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
        var done_html = '';
        if (issue.done_ratio > 0) {
            done_html = ' (' + issue.done_ratio + '%)';
        }

        html += '<tr data-issue-id="' + issue.id + '" data-href="edit_issue.html">';
        html += '<td class="edit">#' + issue.id + '</td>';
        html += '<td class="edit">' + issue.project.name + '</td>';
        html += '<td class="edit">' + issue.priority.name + '</td>';
        html += '<td class="edit">' + issue.status.name + done_html + '</td>'
        html += '<td class="edit">' + (issue.start_date ? moment(issue.start_date).format('DD/MM/YY') : '') + '</td>';
        html += '<td class="edit">' + (issue.due_date ? moment(issue.due_date).format('DD/MM/YY') : '') + '</td>';
        html += '<td class="edit">' + issue.subject + '</td>';
        html += '<td class="edit">' + (issue.estimated_hours ? issue.estimated_hours : '') + '</td>';
        html += '<td><a href="time_entry.html?project_id=' + issue.project.id + '&issue_id=' + issue.id + '">T.T.</a></td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';

    return html;
}

function listIssuesPerUser() {
    globalIssues = [];

    $('#main').html('<div class="loading"></div>');

    currentInstance.getIssueStatuses(function (dados) {
        this.issueStatuses = dados.issue_statuses;
    });

    currentInstance.getAllUsers(function (users) {
        currentInstance.getAllOpenIssues(function (issues) {
            globalIssues = issues;
            var html = '';
            usuariosSemTarefa = [];
            for (i in users) {
                var user = users[i];
                //Id do usuário Vitor, nao precisa aparecer aqui
                if(user.id === 19) {
                    continue;
                }
                userIssues = getUserIssues(user, issues);
                if( userIssues.length === 0 ) {
                    usuariosSemTarefa.push(user);
                    continue;
                }
                html += getTabelaTarefas(userIssues, user.firstname + ' ' + user.lastname);
                html += '<br /><br />';
            }

            var unassignedIssues = getUnassignedIssues(issues);
            html += getTabelaTarefas(unassignedIssues, 'Sem usuário');
            
            nomes = usuariosSemTarefa.map((user) => {
                return user.firstname + ' ' + user.lastname;
            });
            
            if(nomes.length > 0) {
                html += '<p><strong>Usuários sem tarefa:</strong> ' + nomes.join(', ') + '</p>';
            }
            
            $('#main').html(html);
            setarEventoCliqueTicket();
            setarEventoCliqueDireito(currentInstance);
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

function editIssue() {
    var issueId = $(this).parent().attr('data-issue-id') * 1;
    var url = $(this).parent().attr('data-href') + '?issueId=' + issueId;
    //window.href = url;
    chrome.tabs.create({url: url});
    return false;
}

function getIssue(issueId) {
    for (var i in globalIssues) {
        if (globalIssues[i].id == issueId) {
            return globalIssues[i];
        }
    }
    return null;
}
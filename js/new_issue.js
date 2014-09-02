var cr = serverId = currentInstance = issueForm = null;

$(function (){
    cr = new ChromeRedmine();
    serverId = getURLVar('server_id');
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    issueForm = new RedmineIssueForm(currentInstance);
    issueForm.adicionarEventoArquivos();
    
    $('#SaveIssue').click(function (){
        $(this).addClass('loading');
        currentInstance.createIssue($('#Issue').serialize(), function (){
            chrome.tabs.getCurrent(function(tab) {
                //chrome.tabs.remove(tab.id, function() { });
            });

        });
    });

    issueForm.loadProjects();
    issueForm.loadTrackers();
    issueForm.loadIssueStatuses();
    issueForm.loadIssuePriorities();

    $('#IssueProjectId').bind('change',function (e){
        if($(this).val().length === 0){
            $('#NewIssueFields').hide();
            return;
        }

        $('#NewIssueFields').show();
        issueForm.loadProjectMemberships($(this).val());
    });
    
});

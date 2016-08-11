var currentInstance = issueForm = null;

$(function (){
    currentInstance = new RedmineInstance();
    
    issueForm = new RedmineIssueForm(currentInstance);
    issueForm.adicionarEventoArquivos();
    
    $('#SaveIssue').click(function (){
        $(this).addClass('loading');
        currentInstance.createIssue($('#Issue').serialize(), function (){
            window.location.href = 'home.html';
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

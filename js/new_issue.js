var currentInstance = issueForm = null;

$(function (){
    currentInstance = new RedmineInstance();
    
    issueForm = new RedmineIssueForm(currentInstance);
    issueForm.adicionarEventoArquivos();

    $('#IssueStartDate').val(getDataAtualISO());
    
    $('#SaveIssue').click(function (){
        $(this).addClass('loading');
        currentInstance.createIssue($('#Issue').serialize(), function (){
            window.location.href = 'home.html';
        });
    });
    
    $('#ProjectsList').bind('input', function (){
        var found = $('#projetos option[value="'+ $(this).val() +'"]');
        if(found.length === 0) {
            return true;
        }
        
        
        $('#IssueProjectId').val(found.attr('data-id'));
        $('#IssueProjectId').change();
    });

    var doneCallback = function (){
        $('#IssueProjectId').bind('change', function (){
            $('#IssueSubject').focus();
        });
        
        $('#IssueProjectId option').each(function (i, v){
            var nome = $(v).text();
            var id = $(v).attr('value');
            $('#projetos').append('<option value="'+ nome +'" data-id="'+ id +'">');
        });
    };
    issueForm.loadProjects(null, doneCallback);
    issueForm.loadTrackers(5);
    issueForm.loadIssueStatuses();
    issueForm.loadIssuePriorities();

    $('#IssueProjectId').bind('change',function (e){
        if($(this).val().length === 0){
            $('#NewIssueFields').hide();
            return;
        }

        $('#NewIssueFields').show();
        issueForm.loadProjectMemberships($(this).val());
        issueForm.loadHorasManutencao($(this).val());
    });
    
});

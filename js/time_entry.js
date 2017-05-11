$(function (){
    var issueId = getURLVar('issue_id');
    var projectId = getURLVar('project_id');
    var currentInstance = new RedmineInstance();
    var globalUser;
    
    currentInstance.getCurrentUser(function (user){
        globalUser = user;
    });
    
    $('#TimeEntryIssueId').val(issueId);
    
    $('#ProjectsList').bind('input', function (){
        var found = $('#projetos option[value="'+ $(this).val() +'"]');
        if(found.length === 0) {
            return true;
        }
        
        $('#TimeEntryProjectId').val(found.attr('data-id'));
        $('#TimeEntryProjectId').change();
    });
    
    $('#TimeEntryProjectId').on('change', function (){
        $('#TimeEntryActivityId').val(12);
        $('#TimeEntryHours').focus();
    });
    
    $('#SaveIssue').click(function (){
        if($('#TimeEntryIssueId').val().length === 0 && globalUser.user.login != 'gerson') {
            alert('Informe o Id do ticket!');
            $('#TimeEntryIssueId').focus();
            return false;
        }
        
        $(this).addClass('loading');
        currentInstance.createTimeEntry($('#TimeEntry form').serialize(), function(){
            alert('Entrada adicionada com sucesso!');
            history.go(-1);
        });
    });
    
    $('label[for="TimeEntryProjectId"]').addClass('loading');
    currentInstance.getAllProjects(function(projects) {
        var html = '<option value="">Select a project</option>';
        for (var i in projects) {
            var nome = projects[i].name;
            var id = projects[i].id;
            html += '<option value="' + id + '">' + nome + '</option>';
            $('#projetos').append('<option value="'+ nome +'" data-id="'+ id +'">');
        }
        $('#TimeEntryProjectId').html(html);
        $('#TimeEntryProjectId').val(projectId);
        $('label[for="TimeEntryProjectId"]').removeClass('loading');
    });
    
    $('label[for="TimeEntryActivityId"]').addClass('loading');
    currentInstance.getTimeEntryActivities(function(data) {
        var html = '<option value=""></option>';
        var defaultValue = null;
        for (var i in data.time_entry_activities) {
            var time_entry = data.time_entry_activities[i];
            html += '<option value="' + time_entry.id + '">' + time_entry.name + '</option>';
            if(typeof (time_entry.is_default) !== 'undefined') {
                defaultValue = time_entry.id;
            }
        }
        $('#TimeEntryActivityId').html(html);
        $('label[for="TimeEntryActivityId"]').removeClass('loading');

        if (defaultValue !== null) {
            $('#TimeEntryActivityId').val(defaultValue);
        }
    });
    
    setCurrentDate();
});

function setCurrentDate(){
    var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();
    if(month < 10) 
        month = "0" + month;
    if(day < 10) 
        day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    $('#TimeEntrySpentOn').val(today);
}
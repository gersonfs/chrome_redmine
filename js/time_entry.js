$(function (){
    var cr = new ChromeRedmine();
    var serverId = getURLVar('server_id');
    var currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    $('#SaveIssue').click(function (){
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
            html += '<option value="' + projects[i].id + '">' + projects[i].name + '</option>';
        }
        $('#TimeEntryProjectId').html(html);
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
});
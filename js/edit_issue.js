$(function (){
    var project_id = getURLVar('project_id');
    var issue_id = getURLVar('issue_id');
    var server_id = getURLVar('server_id');
    var cr = new ChromeRedmine();
    var instance = new RedmineInstance(cr.getRedmineServer(server_id));
    
    instance.getIssue(issue_id, function (data){
        $('#IssueSubject').val(data.issue.subject);
        $('#IssueDescription').val(data.issue.description);
        $('#IssueStartDate').val(data.issue.start_date);
        $('#IssueEstimatedHours').val(data.issue.estimated_hours);
    });
    
    instance.getProjectMemberships(project_id, function (data){
        var html = '';
        for(var i in data.memberships){
            var member = data.memberships[i];
            
            if(typeof(member.user) != 'undefined'){
                html += '<option value="'+ member.id +'">'+ member.user.name +'</option>';
            }
            
            if(typeof(member.group) != 'undefined'){
                html += '<option value="'+ member.id +'">'+ member.group.name +'</option>';
            }
            
            $('#IssueAssignedToId').html(html);
        }
    });
});
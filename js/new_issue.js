var cr = serverId = currentInstance = issueForm = null;

$(function (){
    cr = new ChromeRedmine();
    serverId = getURLVar('server_id');
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    issueForm = new RedmineIssueForm(currentInstance);
    
    
    
    $('#IssueFiles').on('change', function (e){
        $('#ListaArquivos').html('<div class="loading"></div>')
        var files = e.target.files;
        for (var i = 0, f; f = files[i]; i++) {
            var callback = (function (theFile){
                return function (e){
                    e.upload.filename = theFile.name;
                    e.upload.content_type = theFile.type;
                    e.upload.size = theFile.size;
                    issueForm.addFile(e);
                };
            })(f);
            currentInstance.uploadFile(f, callback);
        }
    });
    
    $('#SaveIssue').click(function (){
        $(this).addClass('loading');
        currentInstance.createIssue($('#Issue').serialize(), function (){
            chrome.tabs.getCurrent(function(tab) {
                chrome.tabs.remove(tab.id, function() { });
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

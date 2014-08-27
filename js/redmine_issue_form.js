var RedmineIssueForm = function(redmineInstance) {
    this.redmineInstance = redmineInstance;
    this.files = [];
    
    this.loadProjectMemberships = function(projectId, defaultValue) {
        $('label[for="IssueAssignedToId"]').addClass('loading');
        this.redmineInstance.getProjectMemberships(projectId, function(data) {
            var html = '<option value=""></option>';
            for (var i in data.memberships) {
                var member = data.memberships[i];

                if (typeof (member.user) != 'undefined') {
                    html += '<option value="' + member.user.id + '">' + member.user.name + '</option>';
                }

                if (typeof (member.group) != 'undefined') {
                    html += '<option value="' + member.group.id + '">' + member.group.name + '</option>';
                }
            }
            $('#IssueAssignedToId').html(html);
            $('label[for="IssueAssignedToId"]').removeClass('loading');

            if (typeof (defaultValue) !== 'undefined') {
                $('#IssueAssignedToId').val(defaultValue);
            }
        });
    };

    this.loadTrackers = function(defaultValue) {
        $('label[for="IssueTrackerId"]').addClass('loading');
        this.redmineInstance.getTrackers(function(data) {
            var html = '';
            for (var i in data.trackers) {
                var tracker = data.trackers[i];
                html += '<option value="' + tracker.id + '">' + tracker.name + '</option>';
            }
            $('#IssueTrackerId').html(html);
            $('label[for="IssueTrackerId"]').removeClass('loading');

            if (typeof (defaultValue) !== 'undefined') {
                $('#IssueTrackerId').val(defaultValue);
            }
        });
    };

    this.loadIssueStatuses = function(defaultValue) {
        $('label[for="IssueStatusId"]').addClass('loading');
        this.redmineInstance.getIssueStatuses(function(data) {
            var html = '';
            for (var i in data.issue_statuses) {
                var status = data.issue_statuses[i];
                html += '<option value="' + status.id + '">' + status.name + '</option>';
            }
            $('#IssueStatusId').html(html);
            $('label[for="IssueStatusId"]').removeClass('loading');

            if (typeof (defaultValue) !== 'undefined') {
                $('#IssueStatusId').val(defaultValue);
            }
        });
    };
    
    this.loadTimeEntryActivities = function() {
        $('label[for="TimeEntryActivityId"]').addClass('loading');
        this.redmineInstance.getTimeEntryActivities(function(data) {
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
    };

    this.loadIssuePriorities = function(defaultValue) {
        $('label[for="IssuePriorityId"]').addClass('loading');
        this.redmineInstance.getIssuePriorities(function(data) {
            var html = '';
            for (var i in data.issue_priorities) {
                var priority = data.issue_priorities[i];
                html += '<option value="' + priority.id + '">' + priority.name + '</option>';
                if (typeof (defaultValue) === 'undefined' && typeof (priority.is_default) !== 'undefined') {
                    defaultValue = priority.id;
                }
            }
            $('#IssuePriorityId').html(html);
            $('label[for="IssuePriorityId"]').removeClass('loading');

            if (typeof (defaultValue) !== 'undefined') {
                $('#IssuePriorityId').val(defaultValue);
            }
        });
    };

    this.loadProjects = function(defaultValue) {
        $('label[for="IssueProjectId"]').addClass('loading');
        this.redmineInstance.getAllProjects(function(projects) {
            var html = '<option value="">Select a project</option>';
            for (var i in projects) {
                html += '<option value="' + projects[i].id + '">' + projects[i].name + '</option>';
            }
            $('#IssueProjectId').html(html);
            $('label[for="IssueProjectId"]').removeClass('loading');

            if (typeof (defaultValue) !== 'undefined') {
                $('#IssueProjectId').val(defaultValue);
            }
        });
    };
    
    this.setDefaultValues = function(issue){
        $('#Issue h1').html(issue.project.name);
        $('#IssueProjectId').val(issue.project.id);
        $('#IssueSubject').val(issue.subject);
        $('#IssueDescription').val(issue.description);
        $('#IssueStartDate').val(issue.start_date);
        $('#IssueEstimatedHours').val(issue.estimated_hours);
        if(typeof(issue.assigned_to) !== 'undefined'){
            $('#IssueAssignedToId').html('<option value="'+ issue.assigned_to.id +'">'+ issue.assigned_to.name +'</option>');
        }
        $('#IssueTrackerId').html('<option value="'+ issue.tracker.id +'">'+ issue.tracker.name +'</option>');
        $('#IssueStatusId').html('<option value="'+ issue.status.id +'">'+ issue.status.name +'</option>');
        $('#IssuePriorityId').html('<option value="'+ issue.priority.id +'">'+ issue.priority.name +'</option>');
        $('#TimeEntryIssueId').val(issue.id);
    };
    
    this.edit = function (issue, afterSaveCallback, backCallback){
        if(typeof(backCallback) === 'undefined'){
            backCallback = afterSaveCallback;
        }
        
        $('#main').html('<div class="loading"></div>');
        
        var self = this;
        $.get('/edit_issue.html', function (data){
            
            $('#main').html(data);
            $('#BackIssue').click(backCallback);
            $('#SaveIssue').click(function (){
                $(this).addClass('loading');
                
                if($('#TimeEntryHours').val().length === 0){
                    $('#TimeEntry').remove();
                }
                
                self.redmineInstance.updateIssue(issue.id, $('#Issue').serialize(), function (){
                    afterSaveCallback();
                });
            });
            self.setDefaultValues(issue);
            if(typeof(issue.assigned_to) !== 'undefined'){
                self.loadProjectMemberships(issue.project.id, issue.assigned_to.id);
            }else{
                self.loadProjectMemberships(issue.project.id);
            }
            self.loadTrackers(issue.tracker.id);
            self.loadIssueStatuses(issue.status.id);
            self.loadIssuePriorities(issue.priority.id);
            self.loadTimeEntryActivities();
            
            self.redmineInstance.getIssue(issue.id, function (data){
                if(typeof(data.issue.journals) !== 'undefined'){
                    for(var i in data.issue.journals){
                        var journal = data.issue.journals[i];
                        if(typeof(journal.notes) !== 'undefined' && journal.notes.length > 0){
                            $('#Journals').append('<p><strong>'+ journal.user.name +':</strong> '+ journal.notes +'</p>')
                        }
                    }
                }
                
                if(typeof(data.issue.attachments) !== 'undefined'){
                    for(var i in data.issue.attachments){
                        var attachment = data.issue.attachments[i];
                        $('#Attachmets').append('<p><a href="'+ attachment.content_url +'" target="_blank">'+ attachment.filename +'</a></p>')
                    }
                }
            }, 'attachments,journals');
        });
    };
    
    this.addFile = function (file){
        this.files.push(file);
        this.renderFiles();
    };
    
    this.renderFiles = function (){
        var html = '';
        for(var i in this.files){
            var file = this.files[i];
            html += '<div id="file-'+ i +'">';
            html +=     file.upload.filename + ' ';
            html +=     '<input type="text" name="arquivos[]" />';
            html +=     '<a title="Remover" data-file="'+ i +'" class="remover"></a>';
            html += '</div>';
        }
        
        $('#ListaArquivos').html(html);
        
        $('#ListaArquivos a.remover').bind('click', {self: this}, function (e){
            e.data.self.removeAttachment($(this).attr('data-file'));
        });
        
    };
    
    this.removeAttachment = function (index){
        var id = this.getAttachmentId(this.files[index].upload.token);
        this.redmineInstance.removeAttachment(id, (function (self, theIndex){
            return function (){
                self.files.splice(theIndex, 1);
                self.renderFiles();
            };
        })(this, index));
    };
    
    this.getAttachmentId = function (token){
        var parts = token.split('.');
        return parts[0];
    };
};
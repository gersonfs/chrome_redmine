var RedmineIssueForm = function(redmineInstance) {
    this.redmineInstance = redmineInstance;
    this.files = [];
    this.issue = null;
    this.isEditing = false;
    this.projects = [];
    
    this.loadProjectMemberships = function(projectId, defaultValue, wattchers) {
        if(typeof(wattchers) == "undefined"){
            wattchers = [];
        }
        $('label[for="IssueAssignedToId"]').addClass('loading');
        
        var callback = (function (instance, defaultMembership, currentWattchers){
            return function (data){ 
                instance.setAssignedToAndWattchers(data.memberships, defaultMembership, currentWattchers);
            };
        })(this, defaultValue, wattchers);
        
        this.redmineInstance.getProjectMemberships(projectId, callback);
    };
    
    this.setAssignedToAndWattchers = function (memberships, defaultValue, currentWatchers){
        var html = '<option value=""></option>';
        var wattchers = '';
        for (var i in memberships) {
            var member = memberships[i];

            if (typeof (member.user) != 'undefined') {
                html += '<option value="' + member.user.id + '">' + member.user.name + '</option>';
            }

            if (typeof (member.group) != 'undefined') {
                html += '<option value="' + member.group.id + '">' + member.group.name + '</option>';
            }

            wattchers += '<span>';
            wattchers +=    '<input type="checkbox" name="issue[watcher_user_ids][]" id="WatcherUser'+ member.user.id +'" value="'+ member.user.id +'" />';
            wattchers +=    '<label for="WatcherUser'+ member.user.id +'">'+ member.user.name +'</label>';
            wattchers += '</span>';
        }
        $('#IssueAssignedToId').html(html);
        $('label[for="IssueAssignedToId"]').removeClass('loading');
        $('#WatcherUserIds').html(wattchers);

        for(var i in currentWatchers){
            $('#WatcherUser' + currentWatchers[i].id).attr('checked', true);
        }

        if (typeof (defaultValue) !== 'undefined' && defaultValue !== null) {
            $('#IssueAssignedToId').val(defaultValue);
        }
        
        if(this.isEditing){
            $('#WatcherUserIds input').bind('change', {self: this}, function (e){
                var issueId = e.data.self.issue.id;
                var userId = $(this).val();
                if($(this).is(':checked')){
                    e.data.self.redmineInstance.addWatcher(issueId, userId);
                }else{
                    e.data.self.redmineInstance.removeWatcher(issueId, userId);
                }
            });
        }
    },

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
        var self = this;
        this.redmineInstance.getAllProjects(function(projects) {
            self.projects = projects;
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
        $('#IssueDoneRatio').val(issue.done_ratio);
        $('#IssueEstimatedHours').val(issue.estimated_hours);
        if(typeof(issue.assigned_to) !== 'undefined'){
            $('#IssueAssignedToId').html('<option value="'+ issue.assigned_to.id +'">'+ issue.assigned_to.name +'</option>');
        }
        $('#IssueTrackerId').html('<option value="'+ issue.tracker.id +'">'+ issue.tracker.name +'</option>');
        $('#IssueStatusId').html('<option value="'+ issue.status.id +'">'+ issue.status.name +'</option>');
        $('#IssuePriorityId').html('<option value="'+ issue.priority.id +'">'+ issue.priority.name +'</option>');
        $('#TimeEntryIssueId').val(issue.id);
    };
    
    this.edit = function (issueId){
        this.isEditing = true;
        
        this.adicionarEventoArquivos();
        $('#SaveIssue').bind('click', {self: this}, function (e){
            var self = e.data.self;
            
            $(this).addClass('loading');

            if($('#TimeEntryHours').val().length === 0){
                $('#TimeEntry').remove();
            }

            self.redmineInstance.updateIssue(e.data.self.issue.id, $('#Issue').serialize(), function (){
                chrome.tabs.getCurrent(function(tab) {
                    chrome.tabs.remove(tab.id, function() { });
                });
            });
        });
        
        
        this.loadTimeEntryActivities();
        var self = this;
        
        this.redmineInstance.getIssue(issueId, function (data){
            issue = self.issue = data.issue;
            
            self.setDefaultValues(issue);
            if(typeof(issue.assigned_to) !== 'undefined'){
                self.loadProjectMemberships(issue.project.id, issue.assigned_to.id, issue.watchers);
            }else{
                self.loadProjectMemberships(issue.project.id, null, issue.watchers);
            }
            self.loadTrackers(issue.tracker.id);
            self.loadIssueStatuses(issue.status.id);
            self.loadIssuePriorities(issue.priority.id);
        
            if(typeof(issue.journals) !== 'undefined'){
                for(var i in issue.journals){
                    var journal = issue.journals[i];
                    if(typeof(journal.notes) !== 'undefined' && journal.notes.length > 0){
                        $('#Journals').append('<p><strong>'+ journal.user.name +':</strong> '+ nl2br(journal.notes) +'</p>')
                    }
                }
            }

            if(typeof(issue.attachments) !== 'undefined'){
                for(var i in issue.attachments){
                    var attachment = issue.attachments[i];
                    $('#Attachmets').append('<p><a href="'+ attachment.content_url +'" target="_blank">'+ attachment.filename +'</a></p>')
                }
            }
        }, 'attachments,journals,watchers');
    };
    
    this.addFile = function (file){
        this.files.push(file);
        this.renderFiles();
    };
    
    this.renderFiles = function (){
        var html = '';
        for(var i in this.files){
            var file = this.files[i].upload;
            html += '<div id="file-'+ i +'">';
            html +=     file.filename + ' ';
            html +=     '<input type="text" name="issue[uploads]['+ i +'][description]" />';
            html +=     '<input type="hidden" name="issue[uploads]['+ i +'][token]" value="'+ file.token +'" />';
            html +=     '<input type="hidden" name="issue[uploads]['+ i +'][filename]" value="'+ file.filename +'" />';
            html +=     '<input type="hidden" name="issue[uploads]['+ i +'][content_type]" value="'+ file.content_type +'" />';
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
    
    this.adicionarEventoArquivos = function(){
        $('#IssueFiles').on('change', {self: this}, function (e){
            $('#ListaArquivos').html('<div class="loading"></div>')
            var files = e.target.files;
            for (var i = 0, f; f = files[i]; i++) {
                var callback = (function (theFile, issueForm){
                    return function (e){
                        e.upload.filename = theFile.name;
                        e.upload.content_type = theFile.type;
                        e.upload.size = theFile.size;
                        issueForm.addFile(e);
                    };
                })(f, e.data.self);
                e.data.self.redmineInstance.uploadFile(f, callback);
            }
        });
    };
};
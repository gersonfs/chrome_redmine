var RedmineIssueForm = function(redmineInstance) {
    this.redmineInstance = redmineInstance;
    
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
        });
    };
    
    this.add = function (afterSaveCallback, backCallback){
        if(typeof(backCallback) === 'undefined'){
            backCallback = afterSaveCallback;
        }
        var self = this;
        $.get('/new_issue.html', function (data){
            $('#main').html(data);
            $('#BackIssue').click(loadIssuesAssignedToMe);
            $('#SaveIssue').click(function (){
                $(this).addClass('loading');
                self.redmineInstance.createIssue($('#Issue').serialize(), function (){
                    afterSaveCallback();
                });
            });
            
            self.loadProjects();
            self.loadTrackers();
            self.loadIssueStatuses();
            self.loadIssuePriorities();

            $('#IssueProjectId').bind('change',{self: self}, function (e){
                var self = e.data.self;

                if($(this).val().length === 0){
                    $('#NewIssueFields').hide();
                    return;
                }

                $('#NewIssueFields').show();
                self.loadProjectMemberships($(this).val());
            });
        });
    };
};
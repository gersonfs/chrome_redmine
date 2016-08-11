var cr = issueId = issueForm = null;
  
$(function (){
    cr = new ChromeRedmine();
    var issueId = getURLVar('issueId');
    currentInstance = new RedmineInstance();
    var issueForm = new RedmineIssueForm(currentInstance);
    issueForm.edit(issueId);
    
});
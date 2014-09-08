var cr = serverId = issueId = currentInstance = issueForm = null;
  
$(function (){
    
    cr = new ChromeRedmine();
    
    var serverId = getURLVar('serverId');
    var issueId = getURLVar('issueId');
    
    currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    var issueForm = new RedmineIssueForm(currentInstance);
    issueForm.edit(issueId);
    
});
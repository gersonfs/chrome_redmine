$(function () {
    cr = new ChromeRedmine();
    currentInstance = new RedmineInstance();
    
    currentInstance.getTimeEntries(function (timeEntries){
        renderTimeEntries(timeEntries);
    }, {user_id: 'me'});
    
});

function renderTimeEntries(timeEntries) {
    var html = '<table style="width: 100%;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>Projeto</th>';
    html += '<th>Ticket</th>';
    html += '<th>Data</th>';
    html += '<th>Descrição</th>';
    html += '<th>Horas</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    for(var i in timeEntries.time_entries) {
        var t = timeEntries.time_entries[i];
        html += '<tr>';
        html += '<td>'+ t.project.name +'</td>';
        html += '<td>'+ (t.issue ? '<a href="edit_issue.html?issueId='+ t.issue.id +'">#' + t.issue.id + '</a>' : '') +'</td>';
        html += '<td>'+ moment(t.spent_on).format('DD/MM/YY') +'</td>';
        html += '<td>'+ t.comments +'</td>';
        html += '<td>'+ t.hours +'</td>';
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    $('#main').html(html);
}
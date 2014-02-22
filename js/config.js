var cr = new ChromeRedmine();

$(function (){
    $('#AddServer').click(function (e){
        try{
            var name = $('#ServerName').val();
            var url = $('#ServerUrl').val();
            var userKey = $('#ServerUserKey').val();
            cr.addRedmineServer(name, url, userKey);
            renderServers();
        }catch(e){
            alert(e);
        }
    });
    
    renderServers();
});



function renderServers(){
    var servers = cr.loadRedmineServers();
    $('#ListServers tbody').html('');
    for(i in servers){
        var server = servers[i];
        var html = '<tr>';
            html += '<td>'+ server.id +'</td>';
            html += '<td>'+ server.name +'</td>';
            html += '<td>'+ server.url +'</td>';
            html += '<td>'+ server.userKey +'</td>';
            html += '<td><a href="#" data-index="'+ i +'">Delete</a></td>';
        html += '</tr>';
        $('#ListServers tbody').append(html);
    }
    
    $('#ListServers tbody a').click(function (e){
        cr.deleteServer($(this).data('index'));
        renderServers();
        e.preventDefault();
    });
    
    if(servers.length === 0){
        $('#ListServers tbody').html('<tr><td colspan="4">No servers found</td></tr>');
    }
}
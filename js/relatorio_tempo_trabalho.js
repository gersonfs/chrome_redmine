$(function (){
    var cr = new ChromeRedmine();
    var serverId = getURLVar('server_id');
    var currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    currentInstance.getRelatorioTempoTrabalho(function (relatorio){
        formatarRelatorioTempo('#EssaSemana', relatorio.essa_semana);
        formatarRelatorioTempo('#SemanaPassada', relatorio.semana_passada);
        
        var esseMes = relatorio.esse_mes.length > 0 ? relatorio.esse_mes[0]['time_entry']['hours'] : 0;
        $('#EsseMes').html(esseMes);
        
        var mesPassado = relatorio.mes_passado.length > 0 ? relatorio.mes_passado[0]['time_entry']['hours'] : 0;
        $('#MesPassado').html(mesPassado);
    });
});

function formatarRelatorioTempo(id, relatorio){
    var html = '';
    var totalHoras = 0;
    for(var i in relatorio){
        t = relatorio[i].time_entry;
        data = getStrDataFromDate(new Date(t.spent_on));
        html += '<tr>';
        html += '<td>'+ data +'</td>';
        html += '<td>'+ t.hours.toFixed(1) +'</td>';
        html += '</tr>';
        totalHoras += t.hours * 1;
    }
    
    $(id + ' tbody').html(html);
    $(id + ' tfoot').html('<tr><td>Total</td><td>'+ totalHoras.toFixed(1) +'</td></tr>');
}

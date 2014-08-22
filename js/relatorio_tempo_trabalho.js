$(function (){
    var cr = new ChromeRedmine();
    var serverId = getURLVar('server_id');
    var currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    currentInstance.getRelatorioTempoTrabalho(function (relatorio){
        
        var dadosEssaSemana = formatarRetornoRelatorio(relatorio.essa_semana, relatorio.essa_semana_ponto);
        var dadosSemanaPassada = formatarRetornoRelatorio(relatorio.semana_passada, relatorio.semana_passada_ponto);
        
        formatarRelatorioTempo('#EssaSemana', dadosEssaSemana);
        formatarRelatorioTempo('#SemanaPassada', dadosSemanaPassada);
        
        var esseMes = relatorio.esse_mes.length > 0 ? relatorio.esse_mes[0]['time_entry']['hours'] : 0;
        var esseMesPonto = relatorio.esse_mes_ponto.length > 0 ? relatorio.esse_mes_ponto[0]['ow_ponto']['hours'] : 0;
        if(esseMesPonto === null){
            esseMesPonto = 0;
        }
        $('#EsseMes').html(esseMes);
        $('#EsseMesPonto').html(esseMesPonto);
        
        var mesPassado = relatorio.mes_passado.length > 0 ? relatorio.mes_passado[0]['time_entry']['hours'] : 0;
        var mesPassadoPonto = relatorio.mes_passado_ponto.length > 0 ? relatorio.mes_passado_ponto[0]['ow_ponto']['hours'] : 0;
        if(mesPassadoPonto === null){
            mesPassadoPonto = 0;
        }
        $('#MesPassado').html(mesPassado);
        $('#MesPassadoPonto').html(mesPassadoPonto);
    });
});

function formatarRetornoRelatorio(tempo_trabalho, ponto){
    var datas = [];
    
    for(var i in ponto){
        var t1 = ponto[i].ow_ponto;
        datas.push(t1.date);
    }
    
    for(var i in tempo_trabalho){
        var t = tempo_trabalho[i].time_entry;
        if(datas.lastIndexOf(t.spent_on) === -1){
            datas.push(t.spent_on);
        }
    }
    
    var obj = {};
    for(var i in datas){
        obj[datas[i]] = {};
    }
    
    for(var i in ponto){
        var t1 = ponto[i].ow_ponto;
        obj[t1.date]['ponto'] = t1.hours;
    }
    
    for(var i in tempo_trabalho){
        var t2 = tempo_trabalho[i].time_entry;
        obj[t2.spent_on]['tempo_trabalho'] = t2.hours;
    }
    
    return obj;
}

function formatarRelatorioTempo(id, relatorio){
    var html = '';
    var totalHoras = totalHorasPonto = 0;
    for(var i in relatorio){
        t1 = typeof(relatorio[i]['tempo_trabalho']) === 'undefined' ? 0 : relatorio[i]['tempo_trabalho'];
        t2 = typeof(relatorio[i]['ponto']) === 'undefined' ? 0 : relatorio[i]['ponto'];
        t2 *= 1.0;
        data = getStrDataFromDate(i);
        html += '<tr>';
        html += '<td>'+ data +'</td>';
        html += '<td>'+ t1 +'</td>';
        html += '<td>'+ t2.toFixed(1) +'</td>';
        html += '</tr>';
        totalHoras += t1 * 1;
        totalHorasPonto += t2 * 1;
    }
    
    $(id + ' tbody').html(html);
    $(id + ' tfoot').html('<tr><td>Total</td><td>'+ totalHoras.toFixed(1) +'</td><td>'+ totalHorasPonto.toFixed(1) +'</td></tr>');
}

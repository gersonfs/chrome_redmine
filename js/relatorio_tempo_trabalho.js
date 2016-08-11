var currentInstance = new RedmineInstance();
    
$(function (){
    $('#Users').change(function (){
        if($('#Users').val().length > 0){
            buscarDadosRelatorio($('#Users').val());
            return;
        }
        
        buscarDadosRelatorio();
    });
    
    buscarDadosRelatorio();
});

function buscarDadosRelatorio(user_id){
    
    currentInstance.getRelatorioTempoTrabalho(function (relatorio){
        
        var dadosEssaSemana = formatarRetornoRelatorio(relatorio.essa_semana, relatorio.essa_semana_ponto);
        var dadosSemanaPassada = formatarRetornoRelatorio(relatorio.semana_passada, relatorio.semana_passada_ponto);
        
        formatarRelatorioTempo('#EssaSemana', dadosEssaSemana);
        formatarRelatorioTempo('#SemanaPassada', dadosSemanaPassada);
        
        var esseMes = relatorio.esse_mes.length > 0 ? relatorio.esse_mes[0]['hours'] : 0;
        var esseMesPonto = relatorio.esse_mes_ponto.length > 0 ? relatorio.esse_mes_ponto[0]['hours'] : 0;
        $('#EsseMes').html(esseMes);
        $('#EsseMesPonto').html(esseMesPonto);
        
        var mesPassado = relatorio.mes_passado.length > 0 ? relatorio.mes_passado[0]['hours'] : 0;
        var mesPassadoPonto = relatorio.mes_passado_ponto.length > 0 ? relatorio.mes_passado_ponto[0]['hours'] : 0;
        $('#MesPassado').html(mesPassado);
        $('#MesPassadoPonto').html(mesPassadoPonto);
        
        formatarSelectUsuarios(relatorio.users);
        
    }, user_id);
}

function formatarSelectUsuarios(usuarios){
    if(usuarios.length === 0){
        return;
    }
    
    var html = '<option value=""></option>';
    for(var i in usuarios){
        var usuario = usuarios[i];
        html += '<option value="'+ usuario.id +'">'+ usuario.firstname + ' ' + usuario.lastname +'</option>';
    }
    
    $('#Users').html(html);
    $('#Users').show();
}

function formatarRetornoRelatorio(tempo_trabalho, ponto){
    var datas = [];
    
    for(var i in ponto){
        var t1 = ponto[i];
        datas.push(t1.date);
    }
    
    for(var i in tempo_trabalho){
        var t = tempo_trabalho[i];
        if(datas.lastIndexOf(t.spent_on) === -1){
            datas.push(t.spent_on);
        }
    }
    
    var obj = {};
    for(var i in datas){
        obj[datas[i]] = {};
    }
    
    for(var i in ponto){
        var t1 = ponto[i];
        obj[t1.date]['ponto'] = t1.hours;
    }
    
    for(var i in tempo_trabalho){
        var t2 = tempo_trabalho[i];
        obj[t2.spent_on]['tempo_trabalho'] = t2.hours;
    }
    
    return obj;
}

function formatarRelatorioTempo(id, relatorio){
    var html = '';
    var totalHoras = totalHorasPonto = 0;
    for(var i in relatorio){
        t1 = typeof(relatorio[i]['tempo_trabalho']) === 'undefined' ? 0.0 : relatorio[i]['tempo_trabalho'] * 1.0;
        t2 = typeof(relatorio[i]['ponto']) === 'undefined' ? 0.0 : relatorio[i]['ponto'] * 1.0;
        data = getStrDataFromDate(i);
        html += '<tr class="'+ getColorRelatorio(t1, t2) +'">';
        html += '<td>'+ data +'</td>';
        html += '<td>'+ t1.toFixed(1) +'</td>';
        html += '<td>'+ t2.toFixed(1) +'</td>';
        html += '</tr>';
        totalHoras += t1 * 1;
        totalHorasPonto += t2 * 1;
    }
    
    $(id + ' tbody').html(html);
    $(id + ' tfoot').html('<tr><td>Total</td><td>'+ totalHoras.toFixed(1) +'</td><td>'+ totalHorasPonto.toFixed(1) +'</td></tr>');
}

function getColorRelatorio(tempoTrabalho, tempoPonto){
    tempoTrabalho = (tempoTrabalho.toFixed(1)) * 1.0;
    tempoPonto = (tempoPonto.toFixed(1)) * 1.0;
    
    if(tempoTrabalho == 0 || tempoPonto == 0){
        return 'red';
    }
    
    if(tempoPonto > tempoTrabalho){
        return 'red';
    }
    
    return 'green';
}
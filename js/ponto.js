$(function (){
    var cr = new ChromeRedmine();
    var serverId = getURLVar('server_id');
    var currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    currentInstance.getPontos(function (pontos){
        var html = '';
        for(var i in pontos.pontos){
            var ponto = pontos.pontos[i]
            var d1 = new Date(ponto.dt_abertura)
            var d2 = new Date(ponto.dt_fechamento)
            html += '<tr>';
            html += '<td>'+ getDiaDaSemanaPonto(d1) +'</td>';
            html += '<td>'+ getStrPeriodoPonto(d1) +'</td>';
            html += '<td>'+ (ponto.status === 'F' ? getStrPeriodoPonto(d2) : '') +'</td>';
            html += '<td>'+ ponto.status +'</td>';
            html += '<td>'+ (ponto.status === 'F' ? calcularHorasPonto(d1, d2) : '') +'</td>';
            html += '</tr>';
        }
        $('#Pontos table tbody').html(html);
        
        $('#AbrirPonto').hide();
        $('#FecharPonto').hide();
        if(pontos.tem_ponto_aberto){
            $('#FecharPonto').show();
        }else{
            $('#AbrirPonto').show();
        }
    });
    
    $('#AbrirPonto').click(function (){
        $(this).addClass('loading');
        currentInstance.abrirPonto(function(retorno){
            if(retorno){
                alert('OK!');
            }else{
                alert('Não foi possível abrir o ponto!');
            }
            history.go(-1);
        });
    });
    
    $('#FecharPonto').click(function (){
        $(this).addClass('loading');
        currentInstance.fecharPonto(function(retorno){
            if(retorno){
                alert('OK!');
            }else{
                alert('Não foi possível fechar o ponto!');
            }
            history.go(-1);
        });
    });
    
});

function getStrPeriodoPonto(date){
    var hora = date.getHours() + '';
    var min = date.getMinutes() + '';

    if(hora.length === 1){
        hora = '0' + hora;
    }
    
    if(min.length === 1){
        min = '0' + min;
    }
    
    return hora + ':' + min;
};

function getDiaDaSemanaPonto(date){
    var diaSemana = getDiaDaSemana(date);
    var mes = (date.getMonth() + 1) + '';
    var dia = date.getDate() + '';
    
    if(mes.length === 1){
        mes = '0' + mes;

    }
    if(dia.length === 1){
        dia = '0' + dia;
    }
    
    return dia + '/' + mes + ' ' + diaSemana;
}

function calcularHorasPonto(d1, d2){
    var t = d2.getTime() - d1.getTime();
    var segundos = Math.floor(t / 1000);
    
    var horas = Math.floor(segundos / (60 * 60));
    var resto = segundos - (horas * 60 * 60);
    var minutos = Math.floor(resto / 60);
    var segundos = resto - minutos * 60;
    
    horas = horas + '';
    if(horas.length === 1){
        horas = '0' + horas;
    }
    
    minutos = minutos + '';
    if(minutos.length === 1){
        minutos = '0' + minutos;
    }
    
    segundos = segundos + '';
    if(segundos.length === 1){
        segundos = '0' + segundos;
    }
    
    return horas + ':' + minutos + ':' + segundos;
}
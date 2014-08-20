function getURLVar(key){
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
    return result && unescape(result[1]) || ""; 
}

function getStrDataHoraFromDate(date){
    var ano = date.getFullYear() + '';
    var mes = (date.getMonth() + 1) + '';
    var dia = date.getDate() + '';
    var hora = date.getHours() + '';
    var min = date.getMinutes() + '';
    var seg = date.getSeconds() + '';

    if(mes.length === 1){
        mes = '0' + mes;

    }
    if(dia.length === 1){
        dia = '0' + dia;
    }
    
    if(hora.length === 1){
        hora = '0' + hora;
    }
    
    if(min.length === 1){
        min = '0' + min;
    }
    
    if(seg.length === 1){
        seg = '0' + seg;
    }
    return dia + '/' + mes + '/' + ano + ' ' + hora + ':' + min + ':' + seg;
};


function getStrDataFromDate(date){
    var ano = date.getFullYear() + '';
    var mes = (date.getMonth() + 1) + '';
    var dia = date.getDate() + '';

    if(mes.length === 1){
        mes = '0' + mes;

    }
    if(dia.length === 1){
        dia = '0' + dia;
    }
    
    return dia + '/' + mes + '/' + ano;
};

function getDiaDaSemana(date){
    var days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    return days[date.getDay()];
}
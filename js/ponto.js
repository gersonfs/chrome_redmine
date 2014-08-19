$(function (){
    var cr = new ChromeRedmine();
    var serverId = getURLVar('server_id');
    var currentInstance = new RedmineInstance(cr.getRedmineServer(serverId));
    
    currentInstance.getPontos(function (pontos){
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
$(function (){
    var menu = '<div id="menu"><h1>OneWeb</h1>';
    menu += '<a href="new_issue.html">Nova Tarefa</a> - ';
    menu += '<a href="home.html">Minhas Tarefas</a> - ';
    menu += '<a href="listar_tarefas.html" class="list">Listar Tarefas</a> - ';
    menu += '<a href="time_entry.html">Tempo Trab.</a> - ';
    menu += '<a href="ponto.html">Ponto</a> - ';
    menu += '<a href="listar_tempo_trabalho.html">Relação T.T.</a> - ';
    menu += '<a href="relatorio_tempo_trabalho.html">Rel t.Trab.</a></div>';

    
    $('body').prepend(menu);
    
});
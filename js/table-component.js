(function(){
    'use strict';

    $(document).ready(function(){
        $('[data-table-filter]').each(criarFiltros);
        criarIndice();
        criarTotal();
    });

    function criarFiltros(){
        const tabela = $(this),
        rowFiltros = tabela.find('.filter-row th').children(':not(.filtered)');
    
        rowFiltros.each(function(){
            const filtro = $(this);
    
            if (filtro.prop('type') == 'text'){
                filtro.on('keyup', verificarFiltros);
            } else{

                let textosColuna = localizarCol(filtro).map(function(){
                    return $(this).text();
                }).get();

                if (filtro.prop('type') == 'select-one'){
                    
                    filtro.on('change', verificarFiltros);
                    filtro.empty().append("<option value='Todos'>Todos</option>");
                    
                    $.unique(textosColuna).map(function(el){
                        filtro.append("<option value='" + el + "'>" + el + "</option>");
                    });

                } else {
                    if (filtro.hasClass('checkbox-group')){                                
                       
                            const checkboxList = filtro.children('.checkbox-list');
                            
                            filtro.on('click', function(){
                                if (checkboxList.is(':hidden')) {
                                    checkboxList.css('display','grid');  
                                } else {
                                    checkboxList.hide();
                                }
                            });

                            checkboxList.empty();

                            $.unique(localizarCol(filtro)).map(function(){
                                checkboxList.append('<input id="id'+ $(this).text() +'" type="checkbox"><label for="id'+ $(this).text() + '">' + $(this).text() + '</label>');
                            });
                            checkboxList.on('change', verificarFiltros);
                    };
                }
            }          
        });
    };   

    function verificarFiltros(){
        const filtro = $(this),
        tabela = filtro.closest('table');

        tabela.children('tbody').children('tr').show();

        if ((filtro.prop('type') == 'select-one' && filtro.children('option:selected').index() != 0)
        || (filtro.hasClass('checkbox-list') && filtro.find('input[type="checkbox"]:checked').length > 0)
        || (filtro.prop('type') == 'text' && filtro.val() !== '')) {
            filtro.addClass('filtered');
        } else {
            filtro.removeClass('filtered');
        }
     
        filtrar(tabela);     
    }

    function filtrar(tabela){

        $('.filtered').each(function(){
            const filtro = $(this);
            let filtros = '';
            if (filtro.hasClass('checkbox-list')){
                filtro.find('input[type="checkbox"]:checked').each(function(){
                    filtros +=  ':not(:contains("' + this.nextSibling.innerText + '"))';
                });
            } else {
                filtros =  ':not(:contains(' + filtro.val() + '))';  
            }
            localizarCol(filtro).filter(filtros).parent('tr').hide();
        });

        tabela.each(criarFiltros);
        criarIndice();
        criarTotal();
    }

    function criarIndice(){
        const   colIndex = $('[data-table-col="index"]');
        let     i = 1;
        
        if (colIndex.length > 0){
            localizarCol(colIndex).each(function(){
                $(this).text(i++);
            });
        };
    }

    function criarTotal(){
        const   colTotal = $('[data-table-col="total"]');

        if (colTotal.length > 0){
            let total = 0;
            colTotal.each(function(){ 
                localizarCol($(this)).each(function(){
                    total = total + parseFloat($(this).text().replace(",", "."));
                });
                $(this).closest('table').find('tfoot td:nth-child('+ (this.cellIndex + 1) +')').text(total.toFixed(2).replace(".", ","));
            });
        };
    }

    function localizarCol(el){
        if (el.not('th')){
            el = el.closest('th');
        }
        return (el.closest('table').find('tbody td:nth-child('+ (el[0].cellIndex + 1) +')').filter(':visible'));
    }

})();


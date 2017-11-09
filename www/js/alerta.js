function alerta(alertas){
    if(alertas.btnConfirma=="Si"){
        $.confirm({
            title: 'Mensaje:',
            content: alertas.contenido,
            icon: 'fa fa-question-circle',
            animation: 'scale',
            closeAnimation: 'scale',
            opacity: 0.5,
            useBootstrap: false,
            boxWidth: alertas.columnClass || '30%',
            buttons:{
                confirm:{
                    text: "Aceptar",
                    btnClass: 'btn-warning',
                    action: function(){
                        alertas.funcionConfirma;
                    }
                },
                cancel: function(){
                    alertas.funcionCancela;
                }
            }
        });
    }else if(alertas.btnConfirma=="No"){
        $.confirm({
            title: 'Mensaje:',
            content: alertas.contenido,
            icon: alertas.icon,
            animation: 'scale',
            closeAnimation: 'scale',
            opacity: 0.9,
            type: alertas.color,
            typeAnimated: true,
            useBootstrap: false,
            boxWidth: alertas.columnClass || '30%',
            buttons: {
		        /*confirm: function () {
		            $.alert('Confirmed!');
		        },
		        cancel: function () {
		            $.alert('Canceled!');
		        },*/
		        somethingElse: {
		            text: 'Aceptar',
		            btnClass: alertas.btnColor,
		            keys: ['enter', 'shift'],
		            action: function(){
		                //$.alert('Something else?');
		            }
		        }
		    }
        });
    }
}
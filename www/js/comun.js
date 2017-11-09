var socket;
var messages = [];
var roster = [];
var name = '';
var email = '';
var usuario ={};
var text = '';
var alertas = {};
var permisos;
var resp_sistole = 0;
var resp_sistole_text="";
var resp_diastole = 0;
var resp_diastole_text="";
var inicio = "";
    usuario.prefix  = "inadi";	
$(document).ready(function(){
  socket.on("delServidor",function(datos){
    if(data.success===false){
			alertas.contenido=data.mensaje;
      alertas.btnConfirma="No";
      alertas.funcionConfirma="";
      alertas.funcionCancela="";
      alertas.color="red";
    	alertas.btnColor="red";
      alerta(alertas);
		}else{
			alertas.contenido=data.mensaje;
      alertas.btnConfirma="No";
      alertas.funcionConfirma="";
      alertas.funcionCancela="";
      alertas.color="blue";
    	alertas.btnColor="blue";
      alerta(alertas);
		}
  });
  socket.on('disconnect', function() {
    $(".fa-address-book-o").css("color","red");
    alertas.contenido="El servidor se ha desconectado...";
    alertas.btnConfirma="No";
    alertas.funcionConfirma="";
    alertas.funcionCancela="";
    alertas.color="red";
    alertas.btnColor="red";
    alertas.icon="";
    //alerta(alertas);
  });
  socket.on("paises",function(data){
  $("#pais").empty();
      for(var i=0; i<data.paises.length;i++){
  		var pais = '<option value="'+data.paises[i].codigo+'">'+data.paises[i].pais+'</option>';	
          $("#pais").append(pais) ;		
  	}
  	$("#pais").val("HN");
  });
  socket.on("departamentos",function(data){
      $("#departamentos").empty();
      var total = data.departamentos.length;
      for(var i=0; i<=data.departamentos.length;i++){
          if(i<total){
              var departamento = '<option ng-pais="'+data.departamentos[i].pais+'" value="'+data.departamentos[i].codigo+'">'+data.departamentos[i].nombre+'</option>';	
              $("#departamentos").append(departamento);	
          }else{
              var departamento = '<option ng-pais="NINGUNO" id="NO" value="NOO">NO APLICA</option>';	
              $("#departamentos").append(departamento);	
          }
      }
      filterSelect();
  });
  socket.on("municipalidades",function(data){
      $("#municipalidad").empty();
      var total = data.municipalidades.length;
      for(var i=0; i<=data.municipalidades.length;i++){
          if(i<total){
              var municipalidades = '<option ng-dep="'+data.municipalidades[i].cod_dep+'" value="'+data.municipalidades[i].cod_mun+'">'+data.municipalidades[i].nombre+'</option>';	
              $("#municipalidad").append(municipalidades);	
          }else{
              var municipalidades = '<option ng-dep="NINGUNO" id="NO" value="NOO">NO APLICA</option>';	
              $("#municipalidad").append(municipalidades);	
          }
      }
      filterSelectMuni();
  });
  socket.on("actualizarFoto",function(foto){
  	var url = "https://medic2-imixhn.c9users.io/"+foto;
  	$("#photo").attr("src",url);
  	$(".app").css("display","none");
  });
  
  socket.on("permisosCargados",function (datos){
    $.each(datos.data,function(index,data){
      if(data.valor=='true'){
        $("#"+data.permisos_cod).prop('checked',true);
      }else  if(data.valor=='false') {
        $("#"+data.permisos_cod).prop('checked',false);
      }
    });
  });
    socket.on("saludo",function(datos){
      //$(".fa-address-book-o").css("color","#1792DE");
      alertas.contenido=datos.mensaje;
      alertas.btnConfirma="No";
      alertas.funcionConfirma="";
      alertas.funcionCancela="";
      alertas.color="blue";
      alertas.btnColor="blue";
      alertas.icon="";
      //alerta(alertas);
    });
});
function trim(string) {
	var str =  string.replace(/^\s*|\s*$/g, '');
	return str.replace(/\s/g, "X");
}
function filterSelect() {
    var keyword =$("#pais").val();
    var select = $("#departamentos > option");
    var i=0;
    $.each(select,function(index,value){
        var txt = $(this).attr('ng-pais');
        if (txt.substring(0, keyword.length).toLowerCase() !== keyword.toLowerCase() && keyword.trim() !== "") {
          if($(this).attr('id')!=="NO"){
            $(this).attr('disabled', 'disabled').hide();
          }
        } else {
          $(this).removeAttr('disabled').show();
          if(i==0){
            $("#departamentos").val($(this).val());
          }
          i++;
        }
    });
    if(i==0){
      $("#departamentos").val('NOO');
      $("#municipalidad").val('NOO');
    }else if(i>0){
      filterSelectMuni();
    }
}

function filterSelectMuni() {
    var keyword =$("#departamentos").val();
    var select = $("#municipalidad > option");
    var i=0;
    if(keyword!=""){
      $.each(select,function(index,value){
          var txt = $(this).attr('ng-dep');
          /*********Filtro********/
          if(txt!=undefined){
              if (txt.substring(0, keyword.length).toLowerCase() !== keyword.toLowerCase() && keyword.trim() !== "") {
                if($(this).attr('id')!=="NO"){
                  $(this).attr('disabled', 'disabled').hide();
                }
              } else {
                $(this).removeAttr('disabled').show();
                if(i==0){
                  $("#municipalidad").val($(this).val());
                }
                i++;
              }
          }
      });
    }
    if(i==0){
      $("#municipalidad").val('NOO');
    }
}

$("#pais").change(function(e){
    	filterSelect();
});
$("#departamentos").change(function(e){
    	filterSelectMuni();
});
$("#paisLocal").click(function(e){
    	$("#pais").val("HN");
    	filterSelect();
    	filterSelectMuni();
});
/* validar si la pagina existe **/
function existeUrl(url) {
   var http = new XMLHttpRequest();
   http.open('HEAD', url, false);
   http.send();
   return http.status!=404;
}

function toPies() {
    var toPies1 = 0;
        toPies1 = $("#alturaMts").val() * 3.2808;
    $("#alturaPies").val(toPies1.toFixed(2));
    imc();
}
function toMetros() {
    var toPies1 = $("#alturaPies").val() / 3.2808;
    $("#alturaMts").val(toPies1.toFixed(2));
    imc();
}
function toLibras() {
    var toLibra1 = $("#pesoKg").val() * 2.2046;
    $("#pesoLb").val(toLibra1.toFixed(2));
    imc();
}
function toKilo() {
    var toKilo1 = $("#pesoLb").val() / 2.2046;
    $("#pesoKg").val(toKilo1.toFixed(2));
    imc();
}
function imc(){    
  $("#indicadorFisico").empty();
  if($("#alturaMts").val()!==0 && $("#pesoKg").val()!==0){ 
      var metros = $("#alturaMts").val();
      var metrosc= metros*metros;
      var peso_kilo=$("#pesoKg").val();
      var imc1=(peso_kilo/metrosc);
          imcf=imc1.toFixed(2);
      
      if(imcf>18 && imcf<24.9){
          vresp_imc = "<p class='text-success'>Indice de masa corporal es: "+imcf+" ¡felicidades!, usted esta en peso ideal.</p>";
         // $("#indicadorFisico").removeClass().addClass("form-control border border-primary text-success");
      }else if(imcf>=25 && imcf<26.9){
          vresp_imc = "<p class='text-warning'>Indice de masa corporal es: "+imcf+" Lo siento, usted esta en sobre peso.</p>";
          //$("#indicadorFisico").removeClass().addClass("form-control border border-primary text-primary");
      }else if(imcf>=27 && imcf<=29.9){
          vresp_imc = "<p class='text-warning'>Indice de masa corporal es: "+imcf+" ¡Fatal!, usted esta en estado de obesidad grado I. Riesgo relativo alto para desarrollar enfermedades cardiovasculares.</p>";
          //$("#indicadorFisico").removeClass().addClass("form-control border border-primary text-warning");
      }else if(imcf>=30 && imcf<=39.9){
          vresp_imc = "<p class='text-danger'>Indice de masa corporal es: "+imcf+" ¡Fatal!, usted esta en estado de obesidad grado II. Riesgo relativo muy alto para el desarrollo de enfermedades cardiovasculares.</p>";
          //$("#indicadorFisico").removeClass().addClass("form-control border border-primary text-danger");
      }else if(imcf>=40){
          vresp_imc = "<p class='text-danger'>Indice de masa corporal es: "+imcf+"¡Fatal!, usted esta en estado de obesidad grado III Extrema o Mórbida. Riesgo relativo extremadamente alto para el desarrollo de enfermedades cardiovasculares.</p>";
          //$("#indicadorFisico").removeClass().addClass("form-control border border-primary text-danger");
      }
      //$("#indicadorFisico").text(vresp_imc);
  }
}
/*********** perimetro de la cintura - riesgo cardiovascular segun la Asociacion Americana de Diabetes **/

$("#medidaCintura").blur(function(){
  /** MASCULINO **/
  var text_ica="";
  if($("#medidaCintura").val()>0){
    if($("#masculinof").prop('checked')==true){
      if($("#medidaCintura").val()<95){
        vresp_cint= "<p class='text-success'>Medida de cintura "+$("#medidaCintura").val()+" dentro de lo normal.</p>";
      }else if($("#medidaCintura").val()>=95 && $("#medidaCintura").val()<=102){
        vresp_cint= "<p class='text-warning'>Medida de cintura "+$("#medidaCintura").val()+" demuestra un riesgo de padecer problemas cardiovasculares.</p>";
      }else if($("#medidaCintura").val()>102 ){
        vresp_cint= "<p class='text-danger'>Medida de cintura "+$("#medidaCintura").val()+" demuestra un riesgo muy elevado de padecer problemas cardiovasculares.</p>";
      }
      
     /***ICA indice de cintura altura **/
     /** MASCULINO **/
     vresp_ica=($("#medidaCintura").val()/($("#alturaMts").val()*100)).toFixed(2);
     if(vresp_ica<=0.34){
       var text_ica = "<p class='text-danger'>Segun su indice de cintura altura "+vresp_ica+" usted es extremadamente delgado.</p>";
     }else if(vresp_ica>0.34 <=0.42){
       var text_ica = "<p class='text-success'>Segun su indice de cintura altura "+vresp_ica+" usted esta delgado y sano.</p>";
     }else if(vresp_ica>0.42 <=0.52){
       var text_ica = "<p class='text-success'>Segun su indice de cintura altura "+vresp_ica+" usted esta sano.</p>";
     }else if(vresp_ica>0.52 <=0.57){
       var text_ica = "<p class='text-warning'>Segun su indice de cintura altura "+vresp_ica+" usted esta en sobrepeso.</p>";
     }else if(vresp_ica>0.57 <=0.62){
       var text_ica = "<p class='text-danger'>Segun su indice de cintura altura "+vresp_ica+" usted esta en sobrepeso elevado.</p>";
     }else if(vresp_ica>0.62){
       var text_ica = "<p class='text-danger'>Segun su indice de cintura altura "+vresp_ica+" usted esta en obesidad m&oacute;rbida.</p>";
     }
     //%GC (% Grasa corporal) = 1,2 x (IMC) + 0,23 x (Nuestra edad) – 10,8 x (sexo M=1, F=0) – 5,4
     if($("#edadf").val()!=0){
      vresp_igc = ((1.2*imcf)+(0.23*$("#edadf").val())-(10.8*1)-5.4).toFixed(2);
      if(vresp_igc>=12 && vresp_igc<=20){
        var text_igc = "<p class='text-success'>Segun su indice de grasa corporal "+vresp_igc+"% usted esta en rango normal.</p>";
      }else if(vresp_igc>20 && vresp_igc<=25){
        var text_igc = "<p class='text-warning'>Segun su indice de grasa corporal "+vresp_igc+"% usted esta en limite normal.</p>";
      }else if(vresp_igc>25){
        var text_igc = "<p class='text-danger'>Segun su indice de grasa corporal "+vresp_igc+"% usted esta en obesidad.</p>";
      }
     }
    }//$("#indicadorFisico").text(vresp_cint);
  }
  /** FEMENINO **/
  if($("#medidaCintura").val()>0){
    if($("#femeninof").prop('checked')==true){
      if($("#medidaCintura").val()<82){
        vresp_cint= "<p class='text-success'>Medida de cintura "+$("#medidaCintura").val()+" dentro de lo normal.</p>";
      }else if($("#medidaCintura").val()>=82 && $("#medidaCintura").val()<=88){
        vresp_cint= "<p class='text-warning'>Medida de cintura "+$("#medidaCintura").val()+" demuestra un riesgo de padecer problemas cardiovasculares.</p>";
      }else if($("#medidaCintura").val()>88 ){
        vresp_cint= "<p class='text-danger'>Medida de cintura "+$("#medidaCintura").val()+" demuestra un riesgo muy elevado de padecer problemas cardiovasculares.</p>";
      }
      if(vresp_ica<=0.34){
       var text_ica = "<p class='text-danger'>Segun su indice de cintura altura "+vresp_ica+" usted es extremadamente delgado.</p>";
     }else if(vresp_ica>0.34 <=0.41){
       var text_ica = "<p class='text-success'>Segun su indice de cintura altura "+vresp_ica+" usted esta delgado y sano.</p>";
     }else if(vresp_ica>0.41 <=0.48){
       var text_ica = "<p class='text-success'>Segun su indice de cintura altura "+vresp_ica+" usted esta sano.</p>";
     }else if(vresp_ica>0.48 <=0.53){
       var text_ica = "<p class='text-warning'>Segun su indice de cintura altura "+vresp_ica+" usted esta en sobrepeso.</p>";
     }else if(vresp_ica>0.53 <=0.57){
       var text_ica = "<p class='text-danger'>Segun su indice de cintura altura "+vresp_ica+" usted esta en sobrepeso elevado.</p>";
     }else if(vresp_ica>0.58){
       var text_ica = "<p class='text-danger'>Segun su indice de cintura altura "+vresp_ica+" usted esta en obesidad m&oacute;rbida.</p>";
     }
     //%GC = (1,2 x 20,95) + (0,23 x 35) - 5,4 (no hemos tenido en cuenta la constante de 10,8 
     if($("#edadf").val()!=0){
       vresp_igc = ((1.2*imcf)+(0.23*$("#edadf").val())-5.4).toFixed(2);
       if(vresp_igc>=24 && vresp_igc<=30){
         var text_igc = "<p class='text-success'>Segun su indice de grasa corporal "+vresp_igc+"% usted esta en rango normal.</p>";
        }else if(vresp_igc>30 && vresp_igc<=33){
          var text_igc = "<p class='text-warning'>Segun su indice de grasa corporal "+vresp_igc+"% usted esta en limite normal.</p>";
        }else if(vresp_igc>33){
          var text_igc = "<p class='text-danger'>Segun su indice de grasa corporal "+vresp_igc+"% usted esta en obesidad.</p>";
        }
     }
    }
  }
  document.getElementById("indicadorFisico").innerHTML=vresp_imc.trim()+""+vresp_cint.trim()+""+text_ica.trim()+""+text_igc.trim();
});
$("#presionArterial").blur(function(){
	var resp = (document.getElementById("indicadorFisico").innerHTML).trim();
	var hta = $("#presionArterial").val();
	var hta_div = hta.split("/");
	var sistole = parseInt(hta_div[0]);
	var diastole = parseInt(hta_div[1]);
	
	if($("#edadf").val()>=20 && $("#edadf").val()<=25){
	  if(sistole >= 120 && sistole <= 121){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 121 && sistole<=137){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal </span>";
  	}else if(sistole >=100 &&sistole < 120){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<120){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>137){
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	
  	if(diastole >= 79 && diastole <= 80){
	    resp_diastole = 1;
	     resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 80){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 79){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>25 && $("#edadf").val()<=30){
	  if(sistole >= 121 && sistole <= 122){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal<span>";
  	}else if(sistole > 122 && sistole <= 138){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole >= 102 && sistole < 121){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<121){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>138){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 80 && diastole <= 81){
	    resp_diastole = 1;
	    inicio = "Su presi&oacute;n arterial es: ";
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 81){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 80){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>30 && $("#edadf").val()<=35){
	  if(sistole > 122 && sistole <= 123){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 123 && sistole <= 140){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole >= 103 && sistole < 122){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<103){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>140){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 81 && diastole <= 82){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 82){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 81){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>35 && $("#edadf").val()<=40){
	  if(sistole > 123 && sistole <= 125){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 125 && sistole <= 142){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole >=104 && sistole < 123){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<104){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>142){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 82 && diastole <= 83){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 83){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 82){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>40 && $("#edadf").val()<=45){
	  if(sistole > 125 && sistole <= 127){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 127 && sistole <= 144){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole >=106 && sistole < 125){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<106){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>144){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 83 && diastole <= 84){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 84){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 83){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>45 && $("#edadf").val()<=50){
	  if(sistole > 127 && sistole <= 129){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 129 && sistole <= 146){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole >= 108 && sistole < 127){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<108){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>146){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 83 && diastole <= 84){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 85){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 84){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>50 && $("#edadf").val()<=55){
	  if(sistole > 129 && sistole <= 131){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 131 && sistole<=140){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole>=110 && sistole < 129){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<110){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>140){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 85 && diastole <= 86){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 86){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 85){
  	  resp_diastole = 3;
  	  resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>55 && $("#edadf").val()<=60){
	  if(sistole > 131 && sistole <= 134){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 134 && sistole<=151){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole>=112 && sistole < 131){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<112){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>131){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 86 && diastole <= 87){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 87){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 86){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	if($("#edadf").val()>60){
	  if(sistole > 134 && sistole <= 135){
	    resp_sistole = 1;
	    inicio = "<span class='text-success'>Su presi&oacute;n arterial es: </span>";
	    resp_sistole_text = "<span class='text-success'>Sistole dentro de la media normal</span>";
  	}else if(sistole > 135 && sistole<=154){
  	  resp_sistole = 2;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite superior de la media normal</span>";
  	}else if(sistole>=115 && sistole < 131){
  	  resp_sistole = 3;
  	  inicio = "<span class='text-warning'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-warning'>Sistole dentro del limite bajo la media normal</span>";
  	}else if(sistole<115){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente bajo</span>";
  	}else if(sistole>154){
  	  inicio = "<span class='text-danger'>Su presi&oacute;n arterial es: </span>";
  	  resp_sistole_text = "<span class='text-danger'>Sistole peligrosamente alto</span>";
  	}
  	if(diastole > 88 && diastole <= 89){
	    resp_diastole = 1;
	    resp_diastole_text = "<span class='text-success'>Diastole dentro de la media normal</span>";
  	}else if(diastole > 89){
  	  resp_diastole = 2;
  	  resp_diastole_text = "<span class='text-warning'>Diastole sobre la media normal</span>";
  	}else if(diastole < 88){
  	  resp_diastole = 3;
  	   resp_diastole_text = "<span class='text-warning'>Diastole bajo la media normal</span>";
  	}
	}
	 var respu = inicio+sistole+"/"+diastole+" "+resp_sistole_text+", "+resp_diastole_text;

	document.getElementById("indicadorFisico").innerHTML=resp+respu;
});

$("#antes").click(function(){
  $("#medidaCintura").blur();
  $("#presionArterial").blur();
  var resp = (document.getElementById("indicadorFisico").innerHTML).trim();
  var resp_glicemia = "";
  var glicemia = parseInt($("#glucometria").val());
  console.log(glicemia," - ",$("#antes").prop("checked"));
  if(glicemia>=70 && glicemia<=100 && $("#antes").prop("checked") == true){
    resp_glicemia = "<p class='text-success'>Valor de glisemia normal</p>";
  }else if(glicemia>=100 && glicemia<=125 && $("#antes").prop("checked") == true){
    resp_glicemia = "<p class='text-warning'>Valor de glisemia alto se considera prediabetes</p>";
  }else if(glicemia>126 && $("#antes").prop("checked") == true){
    resp_glicemia = "<p class='text-danger'>Valor de glisemia alto se considera diabetes</p>";
  }
  document.getElementById("indicadorFisico").innerHTML=resp+"</br>"+resp_glicemia;
});
$("#despues").click(function(){
  $("#medidaCintura").blur();
  $("#presionArterial").blur();
  var resp = (document.getElementById("indicadorFisico").innerHTML).trim();
  var resp_glicemia = "";
  var glicemia = parseInt($("#glucometria").val());
  if(glicemia <=140 && $("#despues").prop("checked") == true){
    resp_glicemia = "<p class='text-success'>Valor de glisemia normal</p>";
  }else if(glicemia>=140 && glicemia<=199 && $("#despues").prop("checked") == true){
    resp_glicemia = "<p class='text-warning'>Valor de glisemia alto se considera prediabetes</p>";
  }else if(glicemia >200 && $("#despues").prop("checked") == true){
    resp_glicemia = "<p class='text-danger'>Valor de glisemia alto se considera diabetes</p>";
  }
  document.getElementById("indicadorFisico").innerHTML=resp+"</br>"+resp_glicemia;
});
/********************************************************************************************************/
$("#alturaMts").blur(function(){
  toPies();
});
$("#alturaPies").blur(function(){
  toMetros();
});
$("#pesoKg").blur(function(){
  toLibras();
});
$("#pesoLb").blur(function(){
  toKilo();
});

function calcular_edad(fecha){
  var nace = fecha.split("/");
  
  var dia = parseInt(nace[0]);
  var mes = parseInt(nace[1]);
  var ano = parseInt(nace[2]);
  console.log("Nacimiento: ",dia," / ",mes," / ",ano);
  var fecha_hoy = new Date();
  var ahora_ano = fecha_hoy.getYear();
  var ahora_mes = fecha_hoy.getMonth();
  var ahora_dia = fecha_hoy.getDate();
  var edad = (ahora_ano + 1900) - ano;
    
    if ( ahora_mes < (mes - 1)){
      edad--;
    }
    if (((mes - 1) == ahora_mes) && (ahora_dia < dia)){ 
      edad--;
    }
    if (edad > 1900){
        edad -= 1900;
    }
    return edad;
    //alert("¡Tienes " + edad + " años!");
}

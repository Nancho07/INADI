var socket;
var usuario={};
var alertas;
var usuario={};
usuario.prefix  = "inadi";
        
function onAppReady() { 
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
}
document.addEventListener("app.Ready", onAppReady, false) ;
$(document).ready(function() {
    socket = io.connect("https://medic2-imixhn.c9users.io:8080/");
    socket.on('connect', function () {
        console.log("CONECTADO");
        //socket.emit("saludo"); 
        //$(".fa-address-book-o").css("color","");
        //setName();
    });

    $("#btn_acceso").on("click",function(){        
        document.location.href = "#acceso";
    });
    $(".btn_login").on("click",function(){
        usuario.clave = MD5($("#clave").val());
        usuario.usuario = $("#usuario").val();
        usuario.pagina  ="loggin";
        socket.emit('loggin',usuario);
        
    });
    $(".btn_menu").on("click",function(){ 
        document.location.href = "#menu";
        stopVideo();
    });    
    socket.on("loggin",function(datos){
        //crearCookie("usuario_medicall",datos.name,0.020833333333,'/',"");
        document.location.href="#menu";
    });
});
function setName() {
    //var datos ={};
    //usuario.usuario = getCookie('usuario_medicall');
    usuario.pagina = "menu";
    usuario.prefix = "inadi";
    if(usuario.usuario && usuario.usuario!=undefined){
      socket.emit('identificacion', usuario);
    }else{
      //document.location.href="index.html";
    } 
  }
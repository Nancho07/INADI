socket = io.connect("https://medic2-imixhn.c9users.io:8080");        
function onAppReady() { 
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    socket.on('connect', function(){
        console.log("CONECTADO"); 
        socket.emit("saludo"); 
    });
    $("#btn_acceso").on("click",function(){        
        document.location.href = "#acceso";
    });
    $(".btn_login").on("click",function(){
        usuario.pass = MD5($("#clave").val());
        usuario.usuario = $("#usuario").val();
        usuario.pagina  = "loggin"; 
        console.log(usuario);
        socket.emit("loggin",usuario);         
    });
    $("#usuario").keypress(function(){
        var usuario = $("#usuario").val();
        socket.emit('identify', usuario);
    });
    $("#usuario").blur(function(){
        var usuario = $("#usuario").val();
        socket.emit('identify', usuario);
    });
    $(".btn_menu").on("click",function(){ 
        document.location.href = "#menu";
        stopVideo();
    });    
    socket.on("loggin",function(datos){
        //crearCookie("usuario_medicall",datos.name,0.020833333333,'/',"");
        document.location.href="#menu";
    });
}
document.addEventListener("app.Ready", onAppReady, false) ;
//$(document).ready(function() {});
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
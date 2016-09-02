angular.module('starter')
.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])
.controller('caminhadaCtrl',function($scope, $timeout, $ionicLoading){
  $scope.Math = Math;
  $scope.maximo = 5;
  $scope.atual = 0;
  $scope.distancia = 0;//em metros
  $scope.timer = 0;//em segs
  $scope.passos = 0;
  $scope.velocidadeInstantanea = 0;//em km/h
  $scope.latitudeInicial = 0;
  $scope.longitudeInicial = 0;
  $scope.latitudeAtual = 0;
  $scope.longitudeAtual = 0;
  $scope.latitudeFinal = 0;
  $scope.longitudeFinal = 0;
  $scope.distanciaAtual = 0;
  // localizacao
  navigator.geolocation.getCurrentPosition(function(pos) {
    console.log(pos.coords.latitude+"\n"+pos.coords.longitude);
    $scope.latitudeInicial = pos.coords.latitude;
    $scope.longitudeInicial = pos.coords.longitude;
  });
  $scope.iniciaCaminhada = function() {
    $scope.onTimeout = function() {
      $scope.timer++;
      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.latitudeAtual = pos.coords.latitude;
        $scope.longitudeAtual = pos.coords.longitude;
        console.log(pos.coords.latitude+"\n"+pos.coords.longitude);
      })
      $scope.distanciaAtual = 6371*Math.acos(Math.cos(Math.PI*(90-$scope.latitudeAtual)/180)*Math.cos((90-$scope.latitudeInicial)*Math.PI/180)
      +Math.sin((90-$scope.latitudeAtual)*Math.PI/180)*Math.sin((90-$scope.latitudeInicial)*Math.PI/180)*Math.cos(($scope.longitudeInicial-$scope.longitudeAtual)*Math.PI/180));
      $scope.distancia += $scope.distanciaAtual;
      $scope.velocidadeInstantanea = ($scope.distanciaAtual/1)*3.6;
      $scope.passos += $scope.distancia/0.8;
      mytimeout= $timeout($scope.onTimeout, 1000);
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);
    $scope.pararTimer = function(){
      $timeout.cancel(mytimeout);
    }
  };
  $scope.adicionaUm = function(){
    $scope.atual += 1;
  };
  $scope.subtraiUm = function(){
    $scope.atual -= 1;
  };
  $scope.verificaMax = function(){
    if($scope.atual > $scope.maximo){
      $scope.atual = 0;
      alert('Você completou '+ $scope.maximo+ ' voltas!');
    }
  };
  $scope.terminarCaminhada = function(voltaTotal, timerTotal, distanciaTotal){
    $scope.pararTimer();
    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.latitudeFinal = pos.coords.latitude;
      $scope.longitudeFinal = pos.coords.longitude;
    });
    $scope.distanciaTotal = 6371*Math.acos(Math.cos(Math.PI*(90-$scope.latitudeFinal)/180)*Math.cos((90-$scope.latitudeInicial)*Math.PI/180)
    +Math.sin((90-$scope.latitudeFinal)*Math.PI/180)*Math.sin((90-$scope.latitudeInicial)*Math.PI/180)*Math.cos(($scope.longitudeInicial-$scope.longitudeFinal)*Math.PI/180));
    $scope.dadosCaminhada = {
        numeroVoltas: voltaTotal ,
        numeroCalorias: (400*timerTotal)/60,//numeroDeCaloriasPorMinuto
        numeroPassos: distanciaTotal/0.8, //tamanhoDeUmaPassadaEmMetrosMédia
        distancia: distanciaTotal/1000,//em km
        tempo: timerTotal/60 ,//em minutos
        velocidadeMedia: (distanciaTotal/timerTotal)*3.6 ,//em km/h
      };
    alert('Você deu um total de '+$scope.dadosCaminhada.numeroVoltas+' voltas\nPercorrendo uma distancia de '+$scope.dadosCaminhada.distancia+' km\nEm '+$scope.dadosCaminhada.tempo+' minutos\nGastando assim '+$scope.dadosCaminhada.numeroCalorias+' cal\nDando um total de '+$scope.dadosCaminhada.numeroPassos+' passos\nObtendo uma Velocidade Media de '+$scope.dadosCaminhada.velocidadeMedia+' km/h');
  };
});

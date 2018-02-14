angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$ionicLoading) {
    $scope.loginData = {};

    $scope.closeLoading = function() {
        $ionicLoading.hide();
    };

    $scope.loading = function(){
        var load = $ionicLoading.show({
            template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner>',
        });
    };

    $ionicModal.fromTemplateUrl('templates/index.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.verifierSession();
    });

    $scope.verifierSession = function(){
        var session = localStorage.getItem("id");
        if (session != null) {
            var txt2 = '<button  onclick="deconnect()" class="button button-icon button-clear">Déconnexion</button>';
            $("u").append(txt2);
        }
    };

})

.controller('allFilm', function($scope,$http,$stateParams,$location){
    $scope.loading();
    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/Romance').then(function(response) {
        $scope.establish = response.data;
        $scope.closeLoading();
    })

    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/Horreur').then(function(response) {
        $scope.horreur = response.data;
        $scope.closeLoading();
    })

    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/Action').then(function(response) {
        $scope.action = response.data;
        $scope.closeLoading();
    })
    
})


.controller('getFiche', function($scope,$http,$stateParams,$location,$ionicPopup) {
    $scope.commenter = {};
    $scope.loading();
    
    $http.get('https://cinetout.herokuapp.com/cine/getFiche/'+$stateParams.id).then(function(response) {
        $scope.closeLoading();
        $scope.establish = response.data;
        
    })
    
    $http.get('https://cinetout.herokuapp.com/comment/getAllFilm/'+$stateParams.id).then(function(response) {
        $scope.closeLoading();
        $scope.liste = response.data;

        var getIsLiked = function(i){
            console.log(" indice = "+i);
            $scope.fiche = i;

            $http.get('https://cinetout.herokuapp.com/membre/getDetail/'+$scope.liste[i].idClient).success(function(data) {
                $scope.fiche = data;
            }).error(function(data){
                console.log("The request isn't working");
            }); 
        }
        
        for (var i = 0; i < $scope.liste.length; i++) {
            getIsLiked(i);
        }
        
    })

    $scope.commenter = function() {
        //$scope.loading();
        var annee = new Date().getYear() + 1900;
        var mois = new Date().getMonth() + 1;
        var jours = new Date().getDate();
        var anne = new Date();
        var date = annee+"/"+mois+"/"+jours;
        var nom = $scope.commenter.nom;
        var email = $scope.commenter.mail;
        var message = $scope.commenter.message;
        console.log(anne);
        if(localStorage.getItem("id") != null){
            var id = localStorage.getItem("id");
            var idFilm = $stateParams.id;
            var myObj = {"idClient":id,"idFilm":idFilm,"date":date,"commentaire":message};
            var myJSON = JSON.stringify(myObj);
            var link = 'https://cinetout.herokuapp.com/comment/insert/';
            $http.post(link,myJSON).then(function(response) {
                $scope.establish = response.data;
                window.location.reload();
                $scope.closeLoading();
            })
        }else{
          $location.path('/app/connexion');
        }
    };
})

.controller('LoginCtrl', function ($scope,$ionicPopup,$location,$http,$state) {
    $scope.connect = {};
    $scope.data = {};
    $scope.connect = function () {
        $scope.loading();
        var email = $scope.connect.mail;
        var pass = $scope.connect.pass;
        $http.get('https://cinetout.herokuapp.com/membre/login/'+email+'/'+pass).then(function(response) {
            $scope.establish = response.data;
            if ($scope.establish.id == "1") {
                $scope.closeLoading();
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Mots de pass incorrect!'
                });
            }else if($scope.establish.id == "0"){
                $scope.closeLoading();
                var alertPopup = $ionicPopup.alert({
                    title: '<h1>Login failed!</h1>',
                    template: 'Compte invalide'
                });
            }else{
              $scope.closeLoading();
              localStorage.setItem("id", $scope.establish.id);
              localStorage.setItem("pseudo", $scope.establish.pseudonyme);
              localStorage.setItem("avatar", $scope.establish.avatar);
              localStorage.setItem("email", $scope.establish.email);
              $location.path('/app/index');
              window.location.reload();
            }
        })
    }
})


.controller('byCategorie', function($scope, $http, $stateParams,$timeout) {
    $scope.data = {};
    $scope.data.mots = $stateParams.categorie;
    $scope.loading();
    $http.get('https://cinetout.herokuapp.com/cine/getAllCategorie/'+$stateParams.categorie).then(function(response) {
        $scope.establish = response.data;
        $scope.closeLoading();
    })

    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/Comédie').then(function(response) {
        $scope.liste = response.data;
        $scope.closeLoading();
    })

})

.controller('byGenre', function($scope, $http, $stateParams,$timeout) {
    $scope.genre = {};
    $scope.loading();
    $scope.genre = $stateParams.genre;
    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/'+$stateParams.genre).then(function(response) {
        $scope.establish = response.data;
        $scope.closeLoading();
    })

    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/Comédie').then(function(response) {
        $scope.liste = response.data;
        $scope.closeLoading();
    })

})

.controller('inscription', function($scope, $http, $stateParams,$timeout,$ionicPopup,$location) {
    $scope.data = {};
    $scope.inscription = {};
    $scope.data.image = 'img/user.jpg';
    $scope.uploadProfilePic = function(){
        var $input = angular.element(document.getElementById('upload'));
        $input[0].click();
        $input.on('change', function (e) {
            var reader = new FileReader();
            // Listening when loading ends ...
            reader.onloadend = function (_e) {
                // Result in base64
                var base64img = _e.target.result;
                $scope.data.image = base64img;

            };
            
            file = e.target.files[0];
            if(file){
                // we read the data from our selected image to get the Base64
                reader.readAsDataURL(file);
            }
        });
    } 
    
    $scope.inscription = function(){
        $scope.loading();
        //$scope.data.image = 'img/user.jpg';
        var annee = new Date().getYear() + 1900;
        var mois = new Date().getMonth() + 1;
        var jours = new Date().getDate();
        var date = annee+"/"+mois+"/"+jours;
        var pseudo = $scope.inscription.pseudonyme;
        var age = $scope.inscription.age;
        var email = $scope.inscription.email;
        var pass = $scope.inscription.pass;
        var confirm = $scope.inscription.confirm;
        var avatar = $scope.data.image;
        var sexe = $scope.inscription.sexe;
        
        if (pass === confirm) {
            $scope.closeLoading();
            var myObj = {"avatar":avatar,"pseudonyme":pseudo,"pass":pass,"age":age,"sexe":sexe,"dateInscription":date,"email":email};
            var myJSON = JSON.stringify(myObj);
            var id = null;
            //console.log(myJSON);

            var link = 'https://cinetout.herokuapp.com/membre/insert/';
            $http.post(link,myJSON).then(function(response) {
                $scope.closeLoading();
                $http.get('https://cinetout.herokuapp.com/membre/login/'+email+'/'+pass).then(function(response) {
                    $scope.data = response.data;
                    id = $scope.data.id;
                    localStorage.setItem("id", id);
                    localStorage.setItem("pseudo", pseudo);
                    localStorage.setItem("avatar", avatar);
                    localStorage.setItem("email", email);
                    window.location.reload();
                    $location.path('/app/index');
                })
                
            })
            
        }
        else{
            $scope.closeLoading();
            var alertPopup = $ionicPopup.alert({
                    title: '<h1 style="color:#369;">Insertion erreur!</h1>',
                    template: 'Confirmation mots de passe erreur'
                });
        }
        

    }
})

.controller('profilCtrl', function ($scope,$http, $stateParams,$location){
    $scope.data = {};
    $scope.data.avatar = localStorage.getItem("avatar");
    $scope.data.pseudonyme = localStorage.getItem("pseudo");
    $scope.data.email = localStorage.getItem("email");
})

.controller('profileCtrl', function($scope, $q, $http) {
    $scope.data = {};
    $scope.imagesrc = {};

    $scope.uploadProfilePic = function(){
        var $input = angular.element(document.getElementById('upload'));
        $input[0].click();

        $input.on('change', function (e) {
            var reader = new FileReader();

            // Listening when loading ends ...
            reader.onloadend = function (_e) {

                // Result in base64
                var base64img = _e.target.result;
                // Test
                var test = 'img/logo.png';
                $scope.data.image = base64img;

                //console.log("Image uploaded! = "+base64img);

                /*// Upload to backend
                uploadImg(base64img).then(function(result){
                    console.log("Image uploaded!", result);

                    // We apply it to our view image
                    $scope.imagesrc.image = result.img_url;
                    $scope.$apply();

                },function(error) {
                    alert("Could'nt upload image!", error);
                });*/
              
                // Debug purposes (if you want to see the image right away, before it's uploaded)
                // $scope.imagesrc = base64img;
                // $scope.$apply();
            };

            file = e.target.files[0];

            if(file){
                // we read the data from our selected image to get the Base64
                reader.readAsDataURL(file);
            }
        });

    }

    function uploadImg(file) {
       var defer = $q.defer();
       $scope.data.image = defer;
       return defer.promise;
    }
    

    /*function uploadImg (file) {
      var defer = $q.defer();
      
      var request = {
        method: 'POST',
        ... // Upload parameters for your backend service.
      };

      $http(request)
      .then(function(response) {
        defer.resolve(response);
      }, function(error) {
        defer.reject(error);
      });
      
      return defer.promise;
    }*/

});

/*islogged:function(){
        var cUid=sessionService.get('uid');
        alert("in loginServce, cuid is "+cUid);
        var $checkSessionServer=$http.post('data/check_session.php?cUid='+cUid);
        $checkSessionServer.then(function(){
            alert("session check returned!");
            console.log("checkSessionServer is "+$checkSessionServer);
        });
        return $checkSessionServer; // <-- return your promise to the calling function
    }*/



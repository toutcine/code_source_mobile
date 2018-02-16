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
            var txt2 = '<h5 onclick="deconnect()">Déconnexion</h5>';
            //<button  onclick="deconnect()" class="button button-icon button-clear"></button>
            $("u").append(txt2);
        }
    };

    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

})

.controller('allFilm', function($scope,$http,$stateParams,$location,$ionicPopup){
    $scope.loading();

    $scope.doRefresh = function(refresher) {
        
    };
    $http.get('https://cinetout.herokuapp.com/cine/getAllGenre/Romance').then(function(response) {
        $scope.establish = response.data;
    },function (error){
        $scope.closeLoading();
        var alertPopup = $ionicPopup.alert({
                    title: 'Erreur!',
                    template: 'Connexion échoue!!'
                });
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
    $scope.data = {};

    $scope.loading();
    var tableau = [];
    var spliter = [];
    var month = ['Janvier','Fevier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre'];

    $http.get('https://cinetout.herokuapp.com/cine/getFiche/'+$stateParams.id).then(function(response) {
        $scope.closeLoading();
        $scope.establish = response.data;
        
    })
    
    $http.get('https://cinetout.herokuapp.com/comment/getAllFilm/'+$stateParams.id).then(function(response) {
        $scope.closeLoading();
        tableau = response.data;
        var getIsLiked = function(tab)
        { 
            var dateCommentaire = tab.date;
            spliter = dateCommentaire.split("/");
            var taona = spliter[0];
            var volana = spliter[1];
            var andro = spliter[2];
            function full_date(taona,volana,andro){
                var date = new Date(taona,volana,andro);
                var message = date.getDate() + " ";   // numero du jour
                message += month[date.getMonth()] + " ";   // mois
                message += date.getFullYear();
                return message;
            }
            $scope.data.dateComment = full_date(taona,volana,andro);
            //console.log("La date est "+$scope.data.dateComment);
            $http.get('https://cinetout.herokuapp.com/membre/getDetail/'+tab.idClient).success(function(data) {
                tab.info = data;
            }).error(function(data){
                $scope.closeLoading();
                var alertPopup = $ionicPopup.alert({
                    title: 'Erreur!',
                    template: 'Connexion échoue!!'
                });
           
            }); 
        }
        var taille = tableau.length;
        for (var i = 0; i < taille; i++) {
            getIsLiked(tableau[i]);
        }

        $scope.fiches = tableau;
        
    })

    $scope.commenter = function() {
        $scope.loading();
        var annee = new Date().getYear() + 1900;
        var mois = new Date().getMonth();
        var jours = new Date().getDate();
        var date = annee+"/"+mois+"/"+jours;
        var nom = $scope.commenter.nom;
        var email = $scope.commenter.mail;
        var message = $scope.commenter.message;

        if(localStorage.getItem("id") != null){
            var id = localStorage.getItem("id");
            var idFilm = $stateParams.id;
            var myObj = {"idClient":id,"idFilm":idFilm,"date":date,"commentaire":message};
            var myJSON = JSON.stringify(myObj);
            $scope.establish = myJSON;
            var link = 'https://cinetout.herokuapp.com/comment/insert/';
            $http.post(link,myJSON).then(function(response) {
                window.location.reload();
            })

        }else{
            $scope.closeLoading();
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
              localStorage.setItem("age", $scope.establish.age);
              localStorage.setItem("pass", $scope.establish.pass);
              localStorage.setItem("date", $scope.establish.dateInscription);
              localStorage.setItem("sexe", $scope.establish.sexe);
              $location.path('/app/profile');
              //window.location.reload();
            }
        })
    }
})


.controller('byCategorie', function($scope, $http, $stateParams,$timeout,$ionicPopup) {
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

    $scope.tableau = ['Janvier','Fevier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre'];

    $scope.getMois = function(index){
        for (var i =  $scope.tableau.length - 1; i >= 0; i--) {
            $scope.tableau[i];
            if (index === i) {
                return $scope.tableau[i];
            }
        }
    };

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
        var annee = new Date().getYear() + 1900;
        var mois = new Date().getMonth();
        var jours = new Date().getDate();
        var moisLettre = $scope.getMois(mois);
        var date = moisLettre+", "+jours+" "+annee;
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
                    localStorage.setItem("age", age);
                    localStorage.setItem("pass", pass);
                    localStorage.setItem("sexe", sexe);
                    localStorage.setItem("date", date);
                    //window.location.reload();
                    $location.path('/app/profile');
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

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope,$stateParams,$timeout,$http,$location,ionicMaterialMotion,ionicMaterialInk) {
    $scope.data = {};
    $scope.modifier = {};

    var avatar = localStorage.getItem("avatar");
    var sexe = localStorage.getItem("sexe");
    var date = localStorage.getItem("date");
    var age = localStorage.getItem("age");
    var pass = localStorage.getItem("pass");
    var pseudo = localStorage.getItem("pseudo");
    var email = localStorage.getItem("email");

    //console.log("Votre nom est "+pseudo);
    $scope.data.avatar = localStorage.getItem("avatar");
    $scope.data.pseudonyme = localStorage.getItem("pseudo");
    $scope.data.email = localStorage.getItem("email");
    $scope.data.age = localStorage.getItem("age");
    $scope.data.date = localStorage.getItem("date");
    $scope.data.id = localStorage.getItem("id");
    $scope.data.pass = localStorage.getItem("pass");

    $scope.uploadProfilePic = function(){
        var $input = angular.element(document.getElementById('upload'));
        $input[0].click();
        $input.on('change', function (e) {
            var reader = new FileReader();
            // Listening when loading ends ...
            reader.onloadend = function (_e) {
                // Result in base64
                var base64img = _e.target.result;
                $scope.data.avatar = base64img;
                avatar = base64img;
            };
            
            file = e.target.files[0];
            if(file){
                // we read the data from our selected image to get the Base64
                reader.readAsDataURL(file);
            }
        });
    } 

    $scope.modifier = function(){
        $scope.loading();
        pseudo = $scope.data.pseudonyme;
        age = $scope.data.age;
        email = $scope.data.email;
        pass = $scope.data.pass;
        var confirm = $scope.modifier.confirm;
        var id = $scope.data.id;
        var myObj = {"id":id,"avatar":avatar,"pseudonyme":pseudo,"pass":pass,"age":age,"sexe":sexe,"dateInscription":date,"email":email};
        var myJSON = JSON.stringify(myObj);
        var link = 'https://cinetout.herokuapp.com/membre/update/';
        $http.post(link,myJSON).then(function(response) {
            $scope.closeLoading();
            localStorage.setItem("id", id);
            localStorage.setItem("pseudo", pseudo);
            localStorage.setItem("avatar", avatar);
            localStorage.setItem("email", email);
            localStorage.setItem("age", age);
            localStorage.setItem("pass", pass);
            localStorage.setItem("sexe", sexe);
            localStorage.setItem("date", date);
        })
    };

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    //console.log("Votre nom est "+pseudo);
    $scope.data.avatar = localStorage.getItem("avatar");
    $scope.data.pseudonyme = localStorage.getItem("pseudo");
    $scope.data.email = localStorage.getItem("email");
    $scope.data.age = localStorage.getItem("age");
    $scope.data.date = localStorage.getItem("date");
    $scope.data.id = localStorage.getItem("id");
    $scope.data.pass = localStorage.getItem("pass");

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
        selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams,$http,$timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.data = {};
    var tableau = [];
    var id = localStorage.getItem("id");
    //console.log(id);
    /*$http.get('https://cinetout.herokuapp.com/favoris/favorisClient/'+id).then(function(response) {
        $scope.establish = response.data;
    },function (error){
        $scope.closeLoading();
        var alertPopup = $ionicPopup.alert({
            title: 'Erreur!',
            template: 'Connexion échoue!!'
        });
    })*/
    $http.get('https://cinetout.herokuapp.com/favoris/favorisClient/'+id).then(function(response) {
        $scope.closeLoading();
        tableau = response.data;

        var getIsLiked = function(tab)
        {
            $http.get('https://cinetout.herokuapp.com/cine/getFiche/'+tab.idFilm).success(function(data) {
                tab.info = data;
            }).error(function(data){
                $scope.closeLoading();
                var alertPopup = $ionicPopup.alert({
                    title:'Erreur!',
                    template:'Connexion échoue!!'
                });
           
            }); 
        }
        var taille = tableau.length;
        for (var i = 0; i < taille; i++) {
            getIsLiked(tableau[i]);
        }

        $scope.fiches = tableau;
        
    })

    $scope.data.avatar = localStorage.getItem("avatar");
    $scope.data.pseudonyme = localStorage.getItem("pseudo");
    $scope.data.email = localStorage.getItem("email");
    $scope.data.age = localStorage.getItem("age");
    $scope.data.date = localStorage.getItem("date");
    $scope.data.id = localStorage.getItem("id");
    $scope.data.pass = localStorage.getItem("pass");
    
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);


    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
        selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
        startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})




/* ---------------

Fonctions jQuery persos

--------------- */

(function ($) {
	
	// Ajoute du contenu à une modal
		// title (string) : titre de la modal (default : false)
		// body (string) : contenu (default : false)
		// validation (function) : affiche un bouton associé à la fonction "validation" dans le footer (default : false)
	$.fn.modalFill = function (options) {
		var settings = $.extend({
			title : false,
			body : false,
			validation : false
		}, options);
		
		if (settings.title) { this.find(".modal-title").html(settings.title); }
		if (settings.body) { this.find(".modal-body").html(settings.body); }
		if (settings.validation) {
			this.find(".modal-footer").prepend($("<button/>").attr("type", "submit").addClass("btn btn-success").html("Valider"));
			this.find(":submit").click(function (event) { event.preventDefault(); settings.validation(); });
		}
		
		this.find(".modal-body div").animate({ scrollTop:0 });
		
		return this;
	}
	
	// Ajoute du contenu à une navbar
		// target (string) : la destination du contenu (header, left, middle, right, default : left)
		// inner (string) : contenu (obligatoire)
		// href (string) :adresse du lien (default : "#")
		// validation (function) : affiche un bouton associé à la fonction "validation" dans le footer (default : false)
	$.fn.navbarFill = function (options) {
		var settings = $.extend({
			target : "left",
			inner : false,
			href : "#",
			funct : false
		}, options);
		
		if (settings.inner) {
			switch (settings.target) {
				case "header" :
					this.find(".navbar-brand").attr("href", settings.href).html(settings.inner);
					this.find(".navbar-brand").click(function (event) { if (settings.funct) { event.preventDefault();settings.funct(event) }});
					break;
				case "left" :
					this.find(".navbar-nav").first()
						.append($("<li/>")
							.append($("<a/>").attr("href", settings.href).html(settings.inner).click(function (event) { event.preventDefault();if (settings.funct) { settings.funct() }})));		
					break;
				default :
					this.find(".navbar-" + settings.target)
						.append($("<li/>")
							.append($("<a/>").attr("href", settings.href).html(settings.inner).click(function (event) { event.preventDefault();if (settings.funct) { settings.funct() }})));		
					break;
			}
		}
		
		return this;
	}
	
	// Vide le contenu d'une partie de la navbar
		// target (string) : la destination du contenu (header, left, middle, right, default : tout)
	$.fn.navbarEmpty = function (options) {
		var settings = $.extend({
			target : false
		}, options);
		
		if (settings.target) {
			this.find(".navbar-" + ((settings.target == "left") ? "nav" : settings.target) + " li").remove();
		}
		else {
			this.find("li").remove();	
		}
		
		return this;
	}
	
	// Affichage des decks
	$.fn.addDecks = function (selectable) {
		var target = this;
		
		requestPHP({ sqlQuery : "decks", userId : getCookie("userId") }, function(decks) {
			for (i = 0;i < decks.length;i++) {
				target.append($("<div/>").addClass("decksRow").attr("data-selected", "0").attr("data-id", decks[i].id)
						.append("id : " + decks[i].id + ", " + "nom : " + decks[i].nom + ", nbr de cartes : " + decks[i].nbrCartes))
			}
			
			if (selectable) {
				target.find(".decksRow").addClass("pointerCursor").click(function () { toggleSelect($(this)); });
			}
			else {
				target.find(".decksRow")
					.append($("<button>").addClass("decksModify").text("Modifier"))
					.append($("<button>").addClass("decksDelete").text("Supprimer"));
				target.find(".decksModify").click(function (event) { decksAddModify($(event.target).parents(".decksRow").attr("data-id")); });
				target.find(".decksDelete").click(function (event) { decksDelete($(event.target).parents(".decksRow").attr("data-id")); });
			}
		});
		
		return this;
	}
	
	// Affichage des cartes
	$.fn.addCards = function (deckid) {
		var target = this;
		
		var cat = "";
		requestPHP({ sqlQuery : "cards", userId : getCookie("userId"), deck : ((deckid) ? deckid : 0) }, function(cards) {
			for (i = 0;i < cards.length;i++) {
				if (cards[i].nom != cat) {
					cat = cards[i].nom;
					target.append($("<div/>").addClass("cardsRow ").append($("<h4/>").text(cat)));
				}
				target.find(".cardsRow").last()
					.append($("<img>").attr("src", "img/cards/" + cards[i].id + ".png").addClass("cardsBlock pointerCursor").attr("data-selected", "0").attr("data-id", cards[i].id));
			}
			target.find(".cardsBlock").click(function () { toggleSelect($(this)); });		
			
			
		});
		
		
		return this;
	}
	
	
}(jQuery));


/* ---------------

Création de contenu/éléments DOM/bootstrap

--------------- */

// Créer une modal bootstrap. Options :
	// id (string) : identifiant de la modal (default : modal)
	// size (string) : taille (sm, md, lg, default : md)
	// header (booléen) : header affiché ou non (default : true)
	// footer (booléen) : footer affiché ou non (default : true)
function newModal(options) {
	var settings = $.extend({
		id : "modal",
		size : "md",
		header : true,
		footer : true
	}, options);
	
	var modal = $("<div/>").addClass("modal fade").attr("role", "dialog").attr("id", settings.id)
					.append($("<div/>").addClass("modal-dialog modal-" + settings.size)
						.append($("<div/>").addClass("modal-content")));
	
	if (settings.header) {
		modal.find(".modal-content")
			.append($("<div/>").addClass("modal-header")
				.append($("<button/>").attr("type", "button").attr("data-dismiss", "modal").addClass("close").html("&times;"))
				.append($("<h4/>").addClass("modal-title")));
	}
	
	modal.find(".modal-content")
		.append($("<div/>").addClass("modal-body"));
	
	if (settings.footer) {
		modal.find(".modal-content")
			.append($("<div/>").addClass("modal-footer")
				.append($("<button/>").attr("type", "button").attr("data-dismiss", "modal").addClass("btn btn-default").html("Fermer")));
	}
	
	modal.on("show.bs.modal", function () { $("html").css("overflow", "hidden");});
	modal.on("hidden.bs.modal", function () { $("#" + settings.id).remove(); $("body").css("width", "100%");$("html").css("overflow", "auto");});
	
	$("body").append(modal);
	
	return modal;
	
};

// Créer une navbar bootstrap. Options :
	// id (string) : identifiant de la navbar (default : navbar)
	// size (string) : taille (sm, md, lg, default : md)
	// header (booléen) : header affiché ou non (default : true)
	// footer (booléen) : footer affiché ou non (default : true)
function newNavbar(options) {
	var settings = $.extend({
		navbar : "navbar",
		type : "",
		collapse : $("<span/>").addClass("glyphicon glyphicon-user"),
		footer : true
	}, options);
	
	var navbar = $("<nav/>").addClass("navbar navbar-default").attr("id", settings.id)
					.append($("<div/>").addClass("container-fluid")
						.append($("<div/>").addClass("navbar-header")
							.append($("<button/>").addClass("navbar-toggle").attr("data-toggle", "collapse").attr("data-target", "#" + settings.id + "Collapse").html(settings.collapse))
							.append($("<a/>").addClass("navbar-brand")))							
						.append($("<div/>").addClass("collapse navbar-collapse").attr("id", settings.id + "Collapse")
							.append($("<ul/>").addClass("nav navbar-nav"))
							.append($("<ul/>").addClass("nav navbar-nav navbar-middle"))
							.append($("<ul/>").addClass("nav navbar-nav navbar-right"))));
	
	return navbar;
	
};


/* ---------------

Page principale

--------------- */

// Chargement des éléments de la page
function initPage() {

	$("body").html("");

	// Création de la bannière
	$("body").append($("<div/>").attr("id", "ban").css("background-image", "url('img/bgheader.png')").text("Bannière"));
	
	// Création et remplissage de la navbar
	navbarCam();
	
	// Création du conteneur principal
	$("body").append($("<content/>"));	
}


/* ---------------

Navbar

--------------- */

// Création de la navbar
function navbarCam() {
	
	var navbar = [];
	navbar.push({ target : "header", inner : "C.A.M", href : "#" });
	navbar.push({ target : "left", inner : "The Team", href : "#" });
	navbar.push({ target : "left", inner : "Contactez-nous", href : "#" });
	
	$("body")
		.append(newNavbar({ id : "navbarCam" }));
		
	navbar.forEach(function (element) {
		$("#navbarCam").navbarFill({target : element.target, inner : element.inner });
	});
	
	navbarUpdate();
}

// Mise à jour de la navbar en fonction du status de connexion
function navbarUpdate() {
		
	$("#navbarCam").navbarEmpty({ target : "right" });
	
	if (getCookie("userId") != "") {
		$("#navbarCam").navbarFill({target : "right", inner : "Jouer !", funct : gameForm });
		$("#navbarCam").navbarFill({target : "right", inner : "Profil", funct : profilCam });
		$("#navbarCam").navbarFill({target : "right", inner : "Déconnexion", funct : logoutModal });
	}
	else {
	$("#navbarCam").navbarFill({target : "right", inner : "<span class='glyphicon glyphicon-user'></span>Connexion", funct : loginModal });
		$("#navbarCam").navbarFill({target : "right", inner : "<span class='glyphicon glyphicon-user'></span>Inscription", funct : registerModal });
	}
}


/* ---------------

Login

--------------- */

// Contenu du formulaire de login
function loginModal() {
	newModal({id : "loginModal", header : true, footer : true })
		.modalFill({ title : "Connexion", body : loginForm(), validation : function () { formPHP($("#loginModal #loginForm"));}})
		.modal("show");
}

// Affichage de la modal de login
function loginForm() {
	
	return form = $("<form/>").attr("id", "loginForm")
					.append($("<div/>").addClass("form-group")
						.append($("<label/>").attr("for", "pseudo").text("Pseudo :"))
						.append($("<input class='form-control' type='text' name='pseudo' data-verify-input='alphanum'>")))
					.append($("<div/>").addClass("form-group")
						.append($("<label/>").attr("for", "mdp").text("Mot de passe :"))
						.append($("<input class='form-control' type='password' name='mdp' data-verify-input='required'>")));
}


/* ---------------

Inscription

--------------- */

// Contenu du formulaire de login
function registerModal() {
	newModal({id : "registerModal", header : true, footer : true })
		.modalFill({ title : "Inscription", body : registerForm(), validation : function () { formPHP($("#registerModal #registerForm"));}})
		.modal("show");
}

// Affichage de la modal de login
function registerForm() {
	
	var registerForm =  $("<form/>").attr("id", "registerForm")
							.append($("<div/>").addClass("form-group")
								.append($("<label/>").attr("for", "pseudo").text("Pseudo :"))
								.append($("<input class='form-control' type='text' name='pseudo' data-verify-input='alphanum'>")))
							.append($("<div/>").addClass("form-group")
								.append($("<label/>").attr("for", "mdp").text("Mot de passe :"))
								.append($("<input class='form-control' type='password' name='mdp' data-verify-input='required'>")))
							.append($("<div/>")
								.append($("<label/>").addClass("btn btn-block btn-primary").text("Sélectionner une image")
									.append($("<input type='file'>").hide())));
						
	registerForm.find(":file").change(function (event) {
		$("#registerModal .croppie").remove();
		
		$(event.target).parent()
			.after($("<div/>").addClass("croppie"));
		
		$("#registerModal .croppie").croppie("destroy");
		$("#registerModal .croppie").croppie({viewport: {width:300, height:300}});
		$("#registerModal .croppie").croppie("bind", {url: URL.createObjectURL(event.target.files[0])});
	});	
	
	return registerForm;
						
}


/* ---------------

Déconnexion

--------------- */

// Contenu du formulaire de login
function logoutModal() {
	newModal({id : "logoutModal", header : true, footer : true })
		.modalFill({ title : "Déconnexion", body : "Voulez-vous vous déconnecter ?", validation : function () { logout();}})
		.modal("show");
}

// Affichage de la modal de login
function logout() {
	$("#logoutModal").modal("hide");
	newModal({id : "logoutMessage", header : true, footer : true })
			.modalFill({ title : "Déconnexion", body : "A bientôt " + getCookie("userPseudo") + "."})
			.modal("show");
	delCookie("userId");
	delCookie("userPseudo");
	navbarUpdate();
	$("content").html(contentHome());
}


/* ---------------

Profil

--------------- */

// Création de la page profil
function profilCam() {
	
	var profil = $("<div/>").attr("id", "profil")
	
	// Données du profil
	profil
		.append($("<div/>").attr("id", "profilData")
			.append($("<h4/>").text("Profil")));
	
	requestPHP({ sqlQuery : "profil", id : getCookie("userId") }, function(user) {
		profil.find("#profilData")
			.append($("<img>").attr("src", "img/users/" + user[0].id + ".png"))
			.append("<br>id : " + user[0].id + "<br />")
			.append("pseudo : " + user[0].pseudo + "<br />")
			.append("mdp : " + user[0].mdp + "<br />");
	});
	
	profil
		.append($("<h4/>").text("Liste des decks"))
		.append($("<button/>").addClass("btn btn-success").text("Créer un deck").click(function () { decksAddModify(); }))
		.append($("<div/>").addClass("decksList").addDecks());
	
	profil
		.append($("<h4/>").text("Liste des cartes"))
		.append($("<button/>").addClass("btn btn-success").text("Ajouter une carte").click(function () { cardsAdd(); }))
		.append($("<div/>").addClass("cardsList").addCards());
	
	$("content").html("");	
	$("content").append(profil);
	
}


/* ---------------

Cartes et decks

--------------- */

// Fonction de selection/deselection des cartes/decks
function toggleSelect(obj) {
	obj.attr("data-selected", (obj.attr("data-selected") == 0 ? 1 : 0));
}

// Formulaire ajout de deck
function decksAddModify(deckid) {
	var decksForm;
	decksForm = $("<form/>").attr("id", "decksForm")
					.append($("<h5/>").text("Entrer un nom, cliquer sur les images pour les sélectionner/déselectionner, puis valider."))
					.append($("<div/>").addClass("form-group")
						.append($("<label/>").attr("for", "nom").text("Nom du deck :"))
						.append($("<input class='form-control' type='text' name='nom' data-verify-input='alphanum'>")));;
	if (deckid) {
		decksForm.attr("data-iddeck", deckid)
			.append($("<div/>").addClass("cardsList").addCards(deckid));		

		requestPHP({ sqlQuery : "deckCards", deckid : deckid }, function(deckCards) {
			decksForm.find("[name='nom']").val(deckCards[0].nom);
			
			for (i = 0;i < deckCards.length;i++) {
				toggleSelect(decksForm.find("[data-id='" + deckCards[i].idcard + "']"));
			}
		});
		
	}
	else {
		decksForm.append($("<div/>").addClass("cardsList").addCards(deckid));
	}
	
	newModal({id : "decksModal", header : true, footer : true })
		.modalFill({ title : ((deckid) ? "Modifier un deck" : "Créer un deck"), body : decksForm, validation : function () { formPHP($("#decksModal #decksForm")); }})
		.modal("show");
		
}

// Formulaire suppression de deck
function decksDelete(deckid) {
	
	newModal({id : "decksDelete", header : true, footer : true })
		.modalFill({ title : "Suppression", body : "Supprimer le deck ?", validation : function () { 
			var formData = new FormData();
			formData.append("mode", "delete");
			formData.append("iddeck", deckid);
			
			$.ajax({
				type:"post",
				url:"php/decks.php",
				contentType: false, 
				processData:false,
				data:formData,
				success:function(data) {
					
					$("#decksDelete").modal("hide");
					newModal({id : "decksMessage", header : true, footer : true })
							.modalFill({ title : "Confirmation", body : "Le deck '" + data + "' a été supprimé avec succès."})
							.modal("show");
							
					$("#profil .decksList").html("");
					$("#profil .decksList").addDecks();
				}
			}); 
		}})
		.modal("show");
		
}

// Formulaire ajout de carte
function cardsAdd() {
	var cardsForm;
	
	cardsForm = $("<form/>").attr("id", "cardsForm")
					.append($("<h5/>").text("Importer une image"))
					.append($("<div/>")
						.append($("<label/>").addClass("btn btn-block btn-primary").text("Sélectionner une image")
							.append($("<input type='file'>").hide())))
					.append($("<h5/>").text("Sélectionner une catégorie ou en créer une."))
					.append($("<div/>").addClass("dropdown")
						.append($("<input type='text' name='categorie' class='form-control dropdown-toggle' data-toggle='dropdown'  autocomplete='off'>"))
						.append($("<ul/>").addClass("dropdown-menu")));
	
	cardsForm.find("[name='categorie']").on("keyup focus", function() {
		var objInput = $(this);
		requestPHP({ sqlQuery : "categorie", like : objInput.val() }, function(jsonData) {
			
			objInput.parent().find(".dropdown-menu").html("");
			
			if (jsonData.length > 0) {
				for (i = 0;i < jsonData.length;i++) {
					objInput.parent().find(".dropdown-menu").append("<li><a href='#'>" + jsonData[i].nom + "</a></li>");
				}
				objInput.dropdown();
				objInput.parent().find("a").click(function () {
					objInput.val($(this).html());
				});
			}
		});
	});
	
	cardsForm.find(":file").change(function (event) {
		$("#cardsModal .croppie").remove();
		
		$(event.target).parent()
			.after($("<div/>").addClass("croppie"));
		
		$("#cardsModal .croppie").croppie("destroy");
		$("#cardsModal .croppie").croppie({viewport: {width:150, height:225}});
		$("#cardsModal .croppie").croppie("bind", {url: URL.createObjectURL(event.target.files[0])});
	});	
	
	newModal({id : "cardsModal", header : true, footer : true })
		.modalFill({ title : "Ajouter une carte", body : cardsForm, validation : function () { formPHP($("#cardsModal #cardsForm")); } })
		.modal("show");
		
}


/* ---------------

Jeu

--------------- */

// Formulaire création de partie
function gameForm() {
	var gameForm;
		
	gameForm = $("<form/>").attr("id", "gameForm")
					.append($("<h5/>").text("Entrer un nom, cliquer sur les images pour les sélectionner/déselectionner, puis valider."))
					.append($("<div/>").addClass("form-group")
						.append($("<label/>").attr("for", "difficulty").text("Difficulté :"))
						.append($("<select/>").addClass("form-control").attr("name", "difficulty")
							.append($("<option/>").attr("value", "5").text("5 cartes"))
							.append($("<option/>").attr("value", "10").text("10 cartes"))
							.append($("<option/>").attr("value", "15").text("15 cartes"))
							.append($("<option/>").attr("value", "20").text("20 cartes"))))
					.append($("<div/>").addClass("decksList").addDecks(true));

	
	newModal({id : "gameModal", header : true, footer : true })
		.modalFill({ title : "Démarrer une partie", body : gameForm, validation : function () { formPHP($("#gameModal #gameForm")); }})
		.modal("show");
		
}

// Démarrer une partie
function gameStart(jsonParsed) {
	var boardGame = $("<div/>").attr("id", "boardGame")
						.append($("<div/>").attr("id", "boardHeader")
							.append($("<h3/>")))
						.append($("<div/>").attr("id", "board"))
						.append($("<div/>").attr("id", "boardFooter"));
	
	$("body").html("");
	
	for (i = 0;i < jsonParsed.length;i++) {
		var cardId = jsonParsed[i].substr(0, jsonParsed[i].length-1);
		boardGame.find("#board")
			.append($("<div/>").addClass("card").attr("data-card-status", "0").attr("data-card-id", jsonParsed[i])
				.append($("<div/>").addClass("front").html(cardId))
				.append($("<div/>").addClass("back")
					.append($("<img>").attr("src", "img/cards/" + cardId + ".png"))));
	}
	$("body").append(boardGame);
	
	var startGame = new Date;
	var timer = setInterval(function() {
			var timer = (new Date - startGame) / 1000;
			var timerText = "";
			timerText += Math.floor(timer/600);
			timer = timer % 600;
			timerText += Math.floor(timer/60);
			timer = timer % 60;
			timerText += ":";
			timerText += Math.floor(timer/10);
			timer = timer % 10;
			timerText += Math.floor(timer);
			boardGame.find("#boardHeader h3").text(timerText);
		}, 1000);
	
	var currentCard = -1;
	var i, j
	var k = 0;
	var trueNumber = 0;
	var falseNumber = 0;

	// Activation de la méthode flip sur toutes les cartes
	boardGame.find(".card").flip({
		axis: 'y',
		trigger: 'manual'
	});
	
	// Action lorsque l'on clic sur une carte
	boardGame.find(".card").click(function(event){
		// data-card-status = 0 : cachée
		// data-card-status = 1 : visible
		// data-card-status = 2 : gagnée
		
		// Id des cartes jumelées : id + "a" et id + "b"
		// Pour comparer les cartes retournées, on utilise substr pour enlever "a" et "b" et comparer juste les id
		
		// Id et objet de la carte cliquée
		var card = $(this);
		var cardId = card.data("card-id");
		
		// Si une carte est déjà retournée on enregistre l'objet et son ID
		if ($(".card[data-card-status='1']").length == 1) {
			var flipped = $(".card[data-card-status='1']");
			var flippedId = flipped.data("card-id");
		}
		// Sinon on passe la variable flipped à -1
		else {
			var flipped = null;
			var flippedId = -1;
		}
		
		
		// Si la carte n'est pas déjà gagnée
		if (cardId != 2) {
			
			// Si aucune carte n'a été retournée on retourne la carte et change son card-status
			if (flippedId == -1) {
				card.attr("data-card-status", 1);				
				card.flip(true);
			}
			// Si on click sur la carte déjà retournée on ne fait rien
			else if (cardId == flippedId) {
					
			}
			// Si la carte cliquée correspond à celle retournée précedemment 
			else if (cardId.substr(0, cardId.length - 1) == flippedId.substr(0, flippedId.length - 1)) {
				
				// Changement des data-card-status des cartes (2 : gagné)
				card.attr("data-card-status", 2);
				flipped.attr("data-card-status", 2);
				
				// Animation cartes gagnées
				animCardWon(flipped, card);
				
				// Incrémentation du compteur de coups
				trueNumber++;
				
			}
			// Sinon on retourne la carte clickée et la carte précedente
			else {
				
				// Changement des data-card-status des cartes (0 : perdu)
				card.attr("data-card-status", 0);
				flipped.attr("data-card-status", 0);
				
				// Incrémentation du compteur de coups
				falseNumber++;
				
				// Animation cartes perdues
				animCardLose(flipped, card);
				
			}
			
			// Mise à jour des compteurs de coups
			$("#boardFooter").html("<h4>Coups perdants : " + falseNumber + "<br>Coups gagnants : " + trueNumber + "</h4>");
			
			// Si toutes les cartes sont retournées
			if ($("#boardGame #board").find("[data-card-status='0']").length == 0) {
				clearInterval(timer);
				animGameWon();
				gameScore($("#boardHeader h3").text(), trueNumber, falseNumber);
			}
		}
	});
}

// Animation cartes gagnées
function animCardWon(firstCard, secondCard) {
	// On affiche la seconde carte
	secondCard.flip(true);
	
	// Quand la carte est bien affichée
	secondCard.on('flip:done',function(){
		// On fait un fondu des cartes
		firstCard.children(".back").animate({ opacity:"0" },800);
		secondCard.children(".back").animate({ opacity:"0" },800, function() {
			// Quand l'animation de fondu est terminée, on cache les cartes et leur applique une classe CSS
			firstCard.children("div").hide();
			secondCard.children("div").hide();
			firstCard.addClass("cardWon");
			secondCard.addClass("cardWon");
		});
	});
}

// Animation cartes perdues
function animCardLose(firstCard, secondCard) {
	// On affiche la seconde carte
	secondCard.flip(true);
					
	// Retourne les deux cartes après un délai d'une seconde
	setTimeout(function(){
		firstCard.flip(false);
		firstCard.on('flip:done',function(){
			secondCard.flip(false);
		});
	}, 1000);
	
}

// Si la partie est gagnée
function animGameWon() {
	
}

// Envoi des score
function gameScore(timerText, trueNumber, falseNumber) {
	var timerSeconds = parseInt(timerText.substring(0, 2)) * 60 + parseInt(timerText.substring(3));
	alert(timerSeconds + ", " + trueNumber + " coups gagnants, " + falseNumber + " coups perdants"); 
}


/* ---------------

Contenu

--------------- */

// Page d'accueil
function contentHome() {
	return "";
}

/* ---------------

Fonction de communication avec PHP

--------------- */

// Fonction récupérant le résultat d'une requête et effectuant la function funct avec le résultat en JSON décodé
function requestPHP(data, funct) {

	$.ajax({
		method:"get",
		url:"php/request.php",
		data:data,
		success:function(data){
			// alert(data);
			if (funct) {
				funct(JSON.parse(data));
			}
		}
	});
	
}


/* ---------------

Fonction de formulaires

--------------- */

// Récuperer le traitement d'un fichier PHP
function formPHP(formObj) {
	
	// Création d'un booléen de vérification du formulaire
	var formVerif = true;
		
	// Création d'une instance de FormData avec les données du formulaire
	var formData = new FormData();
	formData.append("userId", getCookie("userId"));
	formObj.find("input").each(function() {
		
		// Si le formulaire est validé
		if (verifyInput($(this))) {
			// On ajoute aux données du formulaire
			formData.append($(this).attr("name"), $(this).val());	
		}
		// Sinon on change formVerif à false
		else {
			formVerif = false;
		}
	});
	
	// Si le formulaire n'est pas correctement renseigné on sort de la fonction
	if (!formVerif) {
		return false;
	}
	// Ajout des données spécifiques aux formulaires
	switch (formObj.attr("id")) {
		
		// Formulaire d'ajout de carte
		case "cardsForm":
			$("#cardsModal .croppie").croppie("result", "blob").then(function(blob) {
				
				formData.append("blob", blob);
				postForm("php/cards.php", formData, function(data) {
					
					if (data != -1) {
						newModal({id : "cardsMessage", header : true, footer : true })
								.modalFill({ title : "Confirmation", body : "Carte n°" + data + " ajoutée avec succès."})
								.modal("show");
								
						$("#profil .cardsList").html("");
						$("#profil .cardsList").addCards();
					}
				});
			});

			break;
		
		// Formulaire d'ajout de deck
		case "decksForm":
			// Ajout de la liste des cartes sélectionnées aux données du formulaire (json string)
			formData.append("cards", JSON.stringify(findSelected(formObj)));
			
			// Ajout de l'id du deck aux données du formulaire (le cas échéant)
			if (formObj.attr("data-iddeck")) {
				formData.append("iddeck", formObj.attr("data-iddeck"));
				formData.append("mode", "modify");
			}
			else {
				formData.append("mode", "create");
			}

			postForm("php/decks.php", formData, function(data) {
				
				if (data != -1) {
					$("#decksModal").modal("hide");
					newModal({id : "decksMessage", header : true, footer : true })
							.modalFill({ title : "Confirmation", body : "Le deck '" + data + "' a été " + ((formObj.attr("data-iddeck")) ? "modifié" : "ajouté") + " avec succès."})
							.modal("show");
							
					$("#profil .decksList").html("");
					$("#profil .decksList").addDecks();
				}
			});
			break;
		
		// Formulaire de création de jeu
		case "gameForm" :
			// Ajout de la liste des decks sélectionnés aux données du formulaire (json string)
			formData.append("decks", JSON.stringify(findSelected(formObj)));
			
			// Ajout de la difficulté aux données du formulaire (select)
			formData.append("difficulty", formObj.find("select").val());
			postForm("php/game.php", formData, function(data) {
				
				if (data != -1) {
					
					gameStart(JSON.parse(data));
					newModal({id : "gameMessage", header : true, footer : true })
							.modalFill({ title : "Partie démarrée", body : "C'est parti !!"})
							.modal("show");
				}
				else {
					newModal({id : "gameMessage", header : true, footer : true })
							.modalFill({ title : "Erreur", body : "Nombre de cartes insuffisant pour ce niveau de difficulté."})
							.modal("show");
				}		
			});
	
			break;
			
		// Formulaire de connexion
		case "loginForm" :
			objInput = formObj.find("input[name='pseudo']");
			requestPHP({ sqlQuery : "pseudoLike", like : objInput.val() }, function(jsonData) {
				if (jsonData.length == 0) {
					toggleSuccessError(objInput, "Le pseudo renseigné n'existe pas.");
				}
				else {
					postForm("php/login.php", formData, function(data) {
						// Si erreur on affiche la modale d'erreur
						if (data == -1) {
							newModal({id : "loginMessage", header : true, footer : true })
									.modalFill({ title : "Connexion", body : "Le nom d'utilisateur ou le mot de passe est incorrect."})
									.modal("show");
							eraseForm(formObj);
						}
						// Sinon on affiche la modale de confirmation, le pseudonyme dans la barre de navigation et on retourne à la page d'accueil
						else {
							var jsonParsed = JSON.parse(data);
							setCookie("userId", jsonParsed["id"]);
							setCookie("userPseudo", jsonParsed["pseudo"]);
							$("#loginModal").modal("hide");
							newModal({id : "loginMessage", header : true, footer : true })
									.modalFill({ title : "Connexion", body : "Connexion réussie.<br />Bonjour " + getCookie("userPseudo") + "."})
									.modal("show");
							navbarUpdate();
						}					
					
					});
				}
			});
			break;
			
		// Formulaire d'inscription
		case "registerForm" :
			objInput = formObj.find("input[name='pseudo']");
			// On vérifie si le pseudo existe déjà
			requestPHP({ sqlQuery : "pseudoEq", pseudo : objInput.val() }, function(jsonData) {
				if (jsonData.length > 0) {
					toggleSuccessError(objInput, "Le pseudo renseigné existe déjà.");
				}
				else {
					
					$("#registerModal .croppie").croppie("result", "blob").then(function(blob) {
						
						formData.append("blob", blob);
						postForm("php/register.php", formData, function(data) {
							// Si erreur on affiche la modale d'erreur
							if (data == -1) {
								newModal({id : "registerMessage", header : true, footer : true })
										.modalFill({ title : "Inscription", body : "Erreur lors de l'inscription."})
										.modal("show");
								eraseForm(formObj);
							}
							// Sinon on affiche la modale de confirmation, le pseudonyme dans la barre de navigation et on retourne à la page d'accueil
							else {
								var jsonParsed = JSON.parse(data);
								setCookie("userId", jsonParsed["id"]);
								setCookie("userPseudo", jsonParsed["pseudo"]);
								$("#registerModal").modal("hide");
								newModal({id : "registerMessage", header : true, footer : true })
										.modalFill({ title : "Inscription", body : "Inscription réussie.<br />Bonjour " + getCookie("userPseudo") + "."})
										.modal("show");
								navbarUpdate();
							}					
						
						});
					});
					
				}
			});
			break;
			
		default :
	}
	
}

// Post ajax vers un fichier PHP
	// action (string) : pages PHP
	// formData (FormData) : données à transmettre
	// funct (fonction) : fonction callback
function postForm(action, formData, funct) {
	
	// Get/post le formulaire en fonction des paramètres
	$.ajax({
		type:	"post",
		url:	action,
		data:	formData,
		contentType: false, 
		processData:false,
		data:formData,
		success:function(data) {
			
			if (funct) {
				funct(data);
			}
		}
	});
}

// Remise à zéro d'un formulaire
function eraseForm(objForm) {
	objForm.find("input").each(function() {
		if ($(this).parent().hasClass("form-group")) {
			$(this).val("");
			$(this).parent().removeClass("has-error has-success");	
			$(this).tooltip("destroy");
		}
	});
}

// Changement de class error/success pour les formulaire
function toggleSuccessError(objInput, verif) {
	// Si l'input est bien dans un form-group
	if (objInput.parent().hasClass("form-group")) {
		// Si une erreur est détectée, on change la class de l'input et affiche le message d'erreur
		if (verif != "") {
			objInput.parent().removeClass("has-error has-success");
			objInput.parent().addClass("has-error");	
			objInput.tooltip({title: verif, trigger: "manual"}); 
			objInput.tooltip("show");
		}
		// Sinon on change la class de l'input pour success
		else {
			objInput.parent().removeClass("has-error has-success");	
			objInput.parent().addClass("has-success");	
			objInput.tooltip("destroy");
		}
	}
}

// Récupération des élements en fonction de data-selected
function findSelected(listObj) {
	// Création d'un tableau avec les élements sélectionnés
	list = new Array();
	listObj.find("[data-selected=1]").each(function(){
		list.push($(this).data("id"));
	});
	
	return list;
}


/* ---------------

Fonctions de validation

--------------- */

// Vérifier une valeur en fonction du type d'entrée désirée. Renvoie 1 en cas de succès, un message d'erreur sinon
function verifyInput(objInput) {
	
	var verif = "";
	
	// On récupère la valeur et le type de contrôle
	var val = objInput.val();
	var type = objInput.attr("data-verify-input");
	
	// Selon le type de donnée
	switch (type) {
	
		// Type alphanumérique
		case "alphanum":
			verif = ((val != "" && (/^[a-zA-Z0-9]+$/.test(val))) ? "" : "Le champ ne doit contenir que des lettres et des chiffres");
			break;
			
		// Type alphanumérique
		case "password":
			verif = ((val != "" && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(val))) ? "" : "Le mot de passe doit contenir au moins 8 lettres majuscules, minuscules et au moins un chiffre");
			break;
			
		// Non nul
		case "required":
			verif = ((val != "") ? "" : "Veuillez renseigner le champ.");
			break;
	}
	
	// Changement de la class success/error selon le résultat verif
	toggleSuccessError(objInput, verif);
	
	return ((verif == "") ? true : false);
}

function checkAlphaNum(expression) {
	return (/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(expression))
}

// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"


/* ---------------

Fonctions de gestion de cookie

--------------- */

// Création d'un cookie
function setCookie(name, value, duration) {
    var durationDate = new Date();
    durationDate.setTime(durationDate.getTime() + (duration * 24 * 60 * 60 * 1000));
    var expires = "expires=" + durationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Récupération des données des cookies
function getCookie(name) {
    var splitCookie = document.cookie.split(';');
    for(i = 0;i < splitCookie.length;i++) {
        var charCookie = splitCookie[i];
        while (charCookie.charAt(0) == " ") {
            charCookie = charCookie.substring(1);
        }
        if (charCookie.indexOf(name + "=") == 0) {
            return charCookie.substring((name + "=").length, charCookie.length);
        }
    }
    return "";
}

// Suppression de cookie
function delCookie(name) {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
}


/* ---------------

Fonctions lancées au chargement de la page

--------------- */

$(document).ready(function(){
	
	// En mode petit écran, cacher la bar de navigation lorsque l'on clic en dehors de celle-ci
	$(document).mouseup(function(event) {
		if ((!$(".navbar").is(event.target) && $(".navbar").has(event.target).length === 0)  || $(".navbar a").is(event.target)) {
			$(".navbar .collapse").collapse("hide");
		}
	});
	
	// Initialiser la page
	initPage();
	
});
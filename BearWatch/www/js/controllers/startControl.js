angular.module('app.controllers')

.controller('homeCtrl', function($scope, $ionicPopup) {	
	//Warn user if database cannot be created
    if(db_error == true){
      var alertPopup = $ionicPopup.alert({
        title: 'Data Warning',
        template: 'File save was not initialized - data may not be stored properly. Make sure you have enough free memory and try restarting the application.'
      });

      alertPopup.then(function(res) {
        console.log('DB warning issued');
      });
    }

   	//continue session TODO:
	//if session is not complete (no observation mode), remove from DB 
	//disable contiue button if no valid sessions available
})

.controller('peterTest', function($scope, $cordovaGeolocation) {
	
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {		
        console.log("navigator.geolocation is Ready");	
	}	
	$scope.getUTM = function() {
		
		$scope.message = "message";
		//$scope.longitude = 5+5;
		//$scope.latitude = "latitude";
		//$scope.easting = "easting";
		//$scope.northing = "northing";
		//$scope.utmBlock = "utmblock";
		
		function onSuccess(position) {
			$scope.latitude = position.coords.latitude;
			$scope.longitude = position.coords.longitude;
				
			//var coords = utmconv.latLngToUtm(position.coords.latitude, position.coords.longitude);

            //setStandardUtm(coords.global.easting, coords.global.northing, coords.global.zone, coords.global.southern);

			//$scope.easting = coords.global.easting;
			//$scope.northing = coords.global.northing;
			//$scope.utmBlock = coords.global.zone;
		}

		// onError Callback receives a PositionError object
		//
		function onError(error) {
			alert('code: '    + error.code    + '\n' +
				  'message: ' + error.message + '\n');
		}

		// Options: throw an error if no update is received every 30 seconds.
		//
		navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 5000, maximumAge: 0});
		//$scope.message = watchID;
		//navigator.geolocation.clearWatch(watchID);
	}
})

//TODO: Remove test code before deployment
//application test code and example functions
.controller( 'dbTest', function ($scope, $cordovaSQLite, Session, Enviro){
	$scope.Session = Session;
	$scope.Enviro = Enviro;
    $scope.result = "TEST INITIALIZED";
	$scope.status = "$scope.Session.nameResult: " + $scope.Session.nameResult;
	
	$scope.testing = function (){
		$scope.test = "--$scope.Session-- ";
		for(item in $scope.Session){
			$scope.test += item + " : ";
			if(item == 'nameResult'){
				for(name in $scope.Session[item]){
					$scope.test += $scope.Session[item][name] + ", ";	
				}
			}else{
				$scope.test += $scope.Session[item] + ", ";
			}	
		}	 
	}

	
	$scope.enviroTesting = function (){
		$scope.enviroTest = "--$scope.Enviro-- ";
		for(item in $scope.Enviro){
			$scope.enviroTest += item + " : " + $scope.Enviro[item] + ", ";	
		}
		 
	}


	$scope.insert = function() {			
		$cordovaSQLite.execute(db, 'INSERT INTO sessions (observers) VALUES (?)', [$scope.data])
        .then(function(result) {
            $scope.result = "Observer name saved successful, cheers!";
			$scope.status = "Insert result: " + result;
        }, function(error) {
            $scope.result = "Error on saving: " + error.message;
        })
	}
	
	//select example
    $scope.select = function() {
		// Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, 'SELECT * FROM sessions WHERE session_id = (?)' [Sessions.id])
            .then(
                function(result) {
                    if (result.rows.length > 0) {
                        $scope.status = result.rows.item(0).session_id;
                        $scope.result = "Observer name loaded successful, cheers!";
                    }
                },
                function(error) {
                    $scope.result = "Error on loading: " + error.message;
                }
            );
    }


    var internet = "not set";
	if(window.Connection){
		internet = navigator.connection.type;
	}else {
		internet = "It doesn't work";
	}

	$scope.internet = internet;

})

.controller('startNewSessionCtrl', function($scope, Session, DB) {
	//global debug var
	$scope.debug = debug;
	
	//global factory session object
	$scope.Session = Session;

	//function for adding observers
	$scope.addObserver = function(observer){
		//check for empty string
		if(observer != '' && observer != null){
			$scope.Session.nameResult.push(observer);
			//clear textfield
			$scope.Session.observer = '';
		}
	}

	//function to clear observer name from list
	$scope.clearObserver = function (observer){
		var index = $scope.Session.nameResult.indexOf(observer);
  		$scope.Session.nameResult.splice(index, 1); 
	}
    
	var parkNames = [" Adams Lake Marine Park  ",
		 " Adams Lake Park -- Bush Creek Site ",
		 " Akamina-Kishinena Park ",
		 " Alexandra Bridge Park ",
		 " Aleza Lake Ecological Reserve ",
		 " Alice Lake Park ",
		 " Allison Harbour Marine Park ",
		 " Allison Lake Park ",
		 " Alty Conservancy ",
		 " Ambrose Lake Ecological Reserve ",
		 " Anarchist Protected Area ",
		 " Anderson Bay Park ",
		 " Anderson Flats Park ",
		 " Anhluut'ukwsim Laxmihl Angwinga'Asanskwhl Nisga'a (a.k.a. Nisga'a Memorial Lava Bed Park)  ",
		 " Anne Vallee (Triangle Island) Ecological Reserve ",
		 " Anstey Hunakwa Park ",
		 " Antler Lake (PACQ) ",
		 " Apodaca Park ",
		 " Arbutus Grove Park ",
		 " Arctic Pacific Lakes Park ",
		 " Arrow Lake Reservoir Lands - BC Hydro ",
		 " Arrow Lakes Park ",
		 " Arrowstone Park ",
		 " Artlish Caves Park ",
		 " ATLIN/A T?IX'GI AAN TLEIN PARK ",
		 " Atna River Park ",
		 " Babine Lake Marine Park ",
		 " Babine Mountains Park ",
		 " Babine Mountains Trail Sec 6 Park Act ",
		 " Babine River Corridor Park ",
		 " Baeria Rocks Ecological Reserve ",
		 " Ballingall Islets Ecological Reserve ",
		 " Bamberton Park ",
		 " Banana Island Park ",
		 " Banks Nii Luutiksm Conservancy ",
		 " Baynes Island Ecological Reserve ",
		 " Bear Creek Park ",
		 " Bear Glacier Park ",
		 " Bear Island Conservancy ",
		 " Bearhole Lake Park ",
		 " Bearhole Lake Protected Area ",
		 " Beatton (PACQ) -- Darnall ",
		 " Beatton Park ",
		 " Beatton River Park ",
		 " Beaumont Park ",
		 " Beaver Creek Park ",
		 " Beaver Point Park ",
		 " Beaver Valley Park ",
		 " Becher's Prairie Park ",
		 " Bedard Aspen Park ",
		 " Bednesti Lake Ecological Reserve ",
		 " Bella Coola Estuary Conservancy ",
		 " Bellhouse Park ",
		 " Beresford Island Ecological Reserve ",
		 " Big Bar Lake Park ",
		 " Big Basin Park ",
		 " Big Bunsby Marine Park ",
		 " Big Creek Ecological Reserve ",
		 " Big Creek Park ",
		 " Big White Mountain Ecological Reserve ",
		 " Bijoux Falls Park ",
		 " Birkenhead Lake Park ",
		 " Bishop Bay-Monkey Beach Conservancy ",
		 " Bishop Bay-Monkey Beach Corridor Conservancy ",
		 " Bishop River Park ",
		 " Blackcomb Glacier Park ",
		 " Blackwater Creek Ecological Reserve ",
		 " Blanket Creek Park ",
		 " Bligh Island Marine Park ",
		 " Blue Earth Lake Park ",
		 " Blue River Black Spruce Park ",
		 " Blue River Pine Park ",
		 " Blue/Dease Rivers Ecological Reserve ",
		 " Bobtail Mountain Park ",
		 " Bocock Peak Park ",
		 " Bodega Ridge (PACQ) J12 Freecorp (2014) ",
		 " Bodega Ridge (PACQ) Winmark ",
		 " Bodega Ridge Park ",
		 " Bonaparte Park ",
		 " Boothman's Oxbow Park ",
		 " Border Lake Park ",
		 " Boulder Creek Park ",
		 " Boundary Creek Park ",
		 " Bowen Island Ecological Reserve ",
		 " Bowron Lake Park ",
		 " Bowser Ecological Reserve ",
		 " Boya Lake Park ",
		 " Boyle Point Park ",
		 " Boyle Point Protected Area ",
		 " Brackendale Eagles Park ",
		 " Brandywine Falls Park ",
		 " Brent Mountain Protected Area ",
		 " Bridal Veil Falls Park ",
		 " Bridge Lake Park ",
		 " Bridge River Delta Park ",
		 " Brim River Hot Springs Protected Area ",
		 " Bromley Rock Park ",
		 " Brooks Peninsula Park [a.k.a. Muqqiwn Park] ",
		 " Broughton Archipelago Conservancy ",
		 " Broughton Archipelago Park ",
		 " Browne Lake Ecological Reserve ",
		 " Browne Lake Park ",
		 " Buccaneer Bay Park ",
		 " Buck Hills Road Ecological Reserve ",
		 " Buckinghorse River Wayside Park ",
		 " Bugaboo Park ",
		 " Bulkley Junction Park ",
		 " Bull Canyon Park ",
		 " Burdwood Group Conservancy ",
		 " Burges James Gadsden Park ",
		 " Burgoyne Bay Park ",
		 " Burnie River Protected Area ",
		 " Burns Bog (Management Agreement with GVRD) ",
		 " Burns Bog (PACQ) ",
		 " Burns Lake Park ",
		 " Burnt Bridge Creek Conservancy ",
		 " Burnt Cabin Bog Ecological Reserve ",
		 " Buse Lake Protected Area ",
		 " Butler Ridge Park ",
		 " Byers/Conroy/Harvey/Sinnett Islands Ecological Reserve ",
		 " Caligata Lake Park ",
		 " Call Lake Park ",
		 " Callaghan Conservancy ",
		 " Callaghan Lake Park ",
		 " Calvert Island Conservancy ",
		 " Campbell Brown (Kalamalka Lake) Ecological Reserve ",
		 " Canim Beach Park ",
		 " Canoe Islets Ecological Reserve ",
		 " Cape Scott (PACQ) Anglican Diocese (2014) ",
		 " Cape Scott (stat RW agreement) WFP (2008) ",
		 " Cape Scott Park ",
		 " Cardiff Mountain Ecological Reserve ",
		 " Cariboo Mountains Park ",
		 " Cariboo Nature Park ",
		 " Cariboo River Park ",
		 " Carmanah Walbran Park ",
		 " Carp Lake Park ",
		 " Carter Bay Conservancy ",
		 " Cascade-Sutslem Conservancy ",
		 " Castle Rock Hoodoos Park ",
		 " Catala Island Marine Park ",
		 " Cathedral Park ",
		 " Cathedral Protected Area ",
		 " Catherine Creek Ecological Reserve ",
		 " Catto Creek Conservancy ",
		 " Cecil Lake Ecological Reserve ",
		 " Cedar Point Park ",
		 " Cetan/Thurston Bay Conservancy ",
		 " Champion Lakes Park ",
		 " Charlie Cole Creek Ecological Reserve ",
		 " Charlie Lake Park ",
		 " Chase Park ",
		 " Chasm Ecological Reserve ",
		 " Chasm Park ",
		 " Checleset Bay Ecological Reserve ",
		 " Chemainus River Park ",
		 " Chickens Neck Mountain Ecological Reserve ",
		 " Chilako River Ecological Reserve ",
		 " Chilliwack Lake Park ",
		 " Chilliwack River Ecological Reserve ",
		 " Chilliwack River Park ",
		 " Choquette Hot Springs Park ",
		 " Christina Lake Park ",
		 " Chu Chua Cottonwood Park ",
		 " Chukachida Protected Area ",
		 " Chunamon Creek Ecological Reserve ",
		 " Churn Creek Protected Area ",
		 " Cinema Bog Ecological Reserve ",
		 " Cinnemousun Narrows Park ",
		 " Clanninick Creek Ecological Reserve ",
		 " Claud Elliott Creek Ecological Reserve ",
		 " Claud Elliott Lake Park ",
		 " Clayhurst Ecological Reserve ",
		 " Clayoquot Arm Park ",
		 " Clayoquot Plateau Park ",
		 " Clayton Falls Conservancy ",
		 " Cleland Island Ecological Reserve ",
		 " Clendinning Park ",
		 " Close-To-The-Edge Park ",
		 " Close-To-The-Edge Protected Area ",
		 " Clyak Estuary Conservancy ",
		 " Codd Island (PACQ) ",
		 " Codd Island (PMNG) ",
		 " Codville Lagoon Conservancy ",
		 " Codville Lagoon Marine Park ",
		 " Cody Caves Park ",
		 " Coldwater River Park ",
		 " Collinson Point Park ",
		 " Columbia Lake Ecological Reserve ",
		 " Columbia Lake Park ",
		 " Comox Lake Bluffs Ecological Reserve ",
		 " Conkle Lake Park ",
		 " Copeland Islands Marine Park ",
		 " Copper Johnny Park ",
		 " Coquihalla Canyon Park ",
		 " Coquihalla River Park ",
		 " Coquihalla Summit Recreation Area ",
		 " Cormorant Channel Marine Park ",
		 " Cornwall Hills Park ",
		 " Coste Rocks Park ",
		 " Cottonwood River Park ",
		 " Cougar Canyon Ecological Reserve ",
		 " Cowichan River Park ",
		 " Crab Lake Conservancy  ",
		 " Craig Headwaters Protected Area ",
		 " Cranstown Point Conservancy ",
		 " Crater Lake Park ",
		 " Crooked River Park ",
		 " Crowsnest Park ",
		 " Cultus Lake Park ",
		 " Cummins Lakes Park ",
		 " Cummins River Protected Area ",
		 " Cypress Park ",
		 " Daawuuxusda Conservancy ",
		 " Dahl Lake Park ",
		 " Dala-Kildala Rivers Estuaries Park ",
		 " Dall River Old Growth Park ",
		 " Damaxyaa Conservancy ",
		 " Damdochax Protected Area ",
		 " Daniels-Statutory RW EPP16442 (Anstey Hunakwa access road) ",
		 " Dante's Inferno Park ",
		 " Darke Lake Park ",
		 " Davis Lake Park ",
		 " Dawley Passage Park ",
		 " Dead Man's Island Park ",
		 " Dean River Conservancy ",
		 " Dean River Corridor Conservancy ",
		 " Denetiah Corridor Protected Area ",
		 " Denetiah Park ",
		 " Denison-Bonneau Park ",
		 " Denman (Forest Lookout Site) ",
		 " Denman Island  --  Bluff (Eagle Islet) ",
		 " Denman Island  --  McFarlane Road ",
		 " Denman Island Park ",
		 " Denman Island Protected Area ",
		 " Desolation Sound Marine Park ",
		 " Det San Ecological Reserve ",
		 " Det San Right of Way Agreement (trail) ",
		 " Dewdney and Glide Islands Ecological Reserve ",
		 " Diana Lake Park ",
		 " Dionisio Point (PACQ) -- Eller ",
		 " Dionisio Point Park ",
		 " Discovery Island Marine Park ",
		 " Dixie Cove Marine Park ",
		 " Doc English Bluff Ecological Reserve ",
		 " Donnely Lake Park ",
		 " Downing Park ",
		 " Dragon Mountain Park ",
		 " Drewry Point Park ",
		 " Driftwood Canyon Park ",
		 " Drizzle Lake Ecological Reserve ",
		 " Drumbeg Park ",
		 " Dry Gulch Park ",
		 " Drywilliam Lake Ecological Reserve ",
		 " Duck Lake Protected Area ",
		 " Duffey Lake Park  ",
		 " Duke of Edinburgh (Pine/Storm/Tree Islands) Ecological Reserve ",
		 " Dune Za Keyih Park [a.k.a. Frog-Gataga Park] ",
		 " Dune Za Keyih Protected Area (a.k.a. Frog-Gataga Protected Area) ",
		 " Dunn Peak Park Protected Area ",
		 " Duu Guusd Conservancy ",
		 " Dzawadi/Klinaklini Estuary Conservancy ",
		 " Dzawadi/Upper Klinaklini River Conservancy ",
		 " E.C. Manning Park ",
		 " Eagle Bay Park ",
		 " Eagle River Park ",
		 " Eakin Creek Canyon Park ",
		 " Eakin Creek Floodplain Park ",
		 " East Pine Park ",
		 " East Redonda Island Ecological Reserve ",
		 " Echo Bay Marine Park ",
		 " Echo Lake Park ",
		 " Ecstall Headwaters Conservancy ",
		 " Ecstall-Sparkling Conservancy ",
		 " Ecstall-Spoksuut Conservancy ",
		 " Ed Bird-Estella Lakes Park ",
		 " Edge Hills Park ",
		 " Ekwan Lake Protected Area ",
		 " Elephant Hill Park ",
		 " Eleven Sisters Park ",
		 " Elk Falls Park ",
		 " Elk Falls Protected Area ",
		 " Elk Lakes Park ",
		 " Elk Valley Park ",
		 " Elko Park ",
		 " Ellerslie-Roscoe Conservancy ",
		 " Ellis Island Ecological Reserve ",
		 " Ellison Park ",
		 " Emar Lakes Park ",
		 " Emily Lake Conservancy ",
		 " Emory Creek Park ",
		 " Enderby Cliffs Park ",
		 " Eneas Lakes Park ",
		 " English Lake Park ",
		 " Englishman River Falls Park ",
		 " Entiako Park ",
		 " Epper Passage Park ",
		 " Epsom Park ",
		 " Erg Mountain Park ",
		 " Erie Creek Park ",
		 " Eskers Park ",
		 " Este-Tiwilh/Sigurd Creek Conservancy ",
		 " Ethel F. Wilson Memorial Park ",
		 " Ethelda Bay-Tennant Island Conservancy ",
		 " Europa Lake Conservancy ",
		 " Evanoff Park ",
		 " Evans Lake Ecological Reserve ",
		 " Eves Park ",
		 " Exchamsiks River Park ",
		 " Exchamsiks River Protected Area ",
		 " F.H. Barber Park ",
		 " Ferry Island Park ",
		 " Field's Lease Ecological Reserve ",
		 " Fillongley Park ",
		 " Finger-Tatuk Park ",
		 " Finlay-Russel Park ",
		 " Finlay-Russel Protected Area ",
		 " Finn Creek Park ",
		 " Fintry Park ",
		 " Fintry Protected Area ",
		 " Fiordland Conservancy ",
		 " Flat Lake Park ",
		 " Flores Island Park ",
		 " Foch-Gilttoyees Park ",
		 " Foch-Gilttoyees Protected Area ",
		 " Fort George Canyon Park ",
		 " Fort Nelson River Ecological Reserve ",
		 " Forward Harbour/Yexeweyem Conservancy ",
		 " Fossli Park ",
		 " Foster Arm Protected Area ",
		 " Francis Point Ecolgical Reserve ",
		 " Francis Point Park ",
		 " Francois Lake Park ",
		 " Francois Lake Protected Area ",
		 " Fraser River Breaks Park ",
		 " Fraser River Ecological Reserve ",
		 " Fraser River Park ",
		 " Fred Antoine Park ",
		 " French Bar Creek Park ",
		 " French Beach Park ",
		 " Gabriola Sands Park ",
		 " Galiano Island Ecological Reserve ",
		 " Gamble Creek Ecological Reserve ",
		 " Garden Bay Marine Park ",
		 " Garibaldi Park ",
		 " Gerald Island Park ",
		 " Gibson Marine Park ",
		 " Gilnockie Creek Ecological Reserve ",
		 " Gilnockie Park ",
		 " Gilpin Grasslands Park ",
		 " Gingietl Creek Ecological Reserve ",
		 " Giscome Portage Trail Protected Area ",
		 " Gitnadoiks River Park ",
		 " Gitnadoiks River Protected Area ",
		 " Gitxaala Nii Luutiksm/Kitkatla Conservancy ",
		 " Gladstone Park ",
		 " Gladys Lake Ecological Reserve ",
		 " Goat Cove Conservancy ",
		 " Goat Range Park ",
		 " God's Pocket Marine Park ",
		 " Goguka Creek Protected Area ",
		 " Gold Muchalat Park ",
		 " Golden Ears Park ",
		 " Golden Gate/Xaat Yadi Aani Conservancy ",
		 " Goldpan Park ",
		 " Goldstream Park ",
		 " Goose Bay Conservancy ",
		 " Goosegrass Creek Ecological Reserve ",
		 " Gordon Bay Park ",
		 " Gowlland Tod Park ",
		 " Graham-Laurier Park ",
		 " Granby Park ",
		 " Grayling River Hot Springs Ecological Reserve ",
		 " Graystokes Park ",
		 " Great Glacier Park ",
		 " Green Inlet Marine Park ",
		 " Green Lake Park ",
		 " Greenbush Lake Protected Area ",
		 " Greenstone Mountain Park ",
		 " Grohman Narrows Park ",
		 " Gunboat Harbour Conservancy ",
		 " Gwillim Lake Park ",
		 " Gwyneth Lake Park ",
		 " H?THAYIM MARINE PARK [a.k.a. Von Donop Marine Park] ",
		 " Hai Lake - Mount Herman Park ",
		 " Hakai Conservation Study Area ",
		 " Hakai Luxvbalis Conservancy ",
		 " Haley Lake Ecological Reserve ",
		 " Halkett Bay Park ",
		 " Hamber Park ",
		 " Hanna-Tintina Conservancy ",
		 " Harbour-Dudgeon Lakes Park ",
		 " HARDY ISLAND MARINE PARK ",
		 " Harmony Islands Marine Park ",
		 " Harry Lake Aspen Park ",
		 " Hay River Protected Area ",
		 " Hayne's Lease Ecological Reserve ",
		 " Heather Lake Ecological Reserve ",
		 " Heather-Dina Lakes Park ",
		 " Height of the Rockies Park ",
		 " Helliwell Park ",
		 " Hemer Park ",
		 " Henyemdzi Mekola/Yorke Island Conservancy ",
		 " Herald Park ",
		 " Hesquiat Lake Park ",
		 " Hesquiat Peninsula Park ",
		 " High Lakes Basin Park ",
		 " Hitchie Creek Park ",
		 " Hole-in-the-Wall Park ",
		 " Holliday Creek Arch Protected Area ",
		 " Homathko Estuary Park ",
		 " Homathko River-Tatlayoko Protected Area ",
		 " Honeymoon Bay Ecological Reserve ",
		 " Horne Lake Caves Park ",
		 " Horneline Creek Park ",
		 " Horsefly Lake Park ",
		 " Hotsprings-No Name Creek Conservancy ",
		 " Huchsduwachsdu Nuyem Jees/Kitlope Heritage Conservancy ",
		 " Hudson Rocks Ecological Reserve ",
		 " Hunwadi/Ahnuhati-Bald Conservancy  ",
		 " Hyland River Park ",
		 " I7loqaw7/100 Lakes Plateau Conservancy  ",
		 " Ilgachuz Range Ecological Reserve ",
		 " Indian Lake-Hitchcock Creek/At Ch Ini Sha Conservancy ",
		 " Inkaneep Park ",
		 " Inland Lake Park ",
		 " Inonoaklin Park ",
		 " Iskut River Hot Springs Park ",
		 " Itcha Ilgachuz Park ",
		 " J?JI7EM and KW'ULH MARINE PARK [a.k.a. Sandy Island Marine Park] ",
		 " Jackman Flats Park ",
		 " Jackpine Remnant Protected Area ",
		 " Jackson Narrows Marine Park ",
		 " James Chabot Park ",
		 " Jedediah Island Marine Park ",
		 " Jesse Falls Protected Area ",
		 " Jewel Lake Park ",
		 " Jimsmith Lake Park ",
		 " Joffre Lakes Park ",
		 " John Dean Park ",
		 " Johnstone Creek Park ",
		 " Juan De Fuca Park ",
		 " Jump Across Conservancy ",
		 " Junction Sheep Range Park ",
		 " Juniper Beach Park ",
		 " Kakwa Park ",
		 " Kakwa Protected Area ",
		 " Kalamalka Lake Park ",
		 " Kamdis Conservancy ",
		 " Katherine Tye (Vedder Crossing) Ecological Reserve ",
		 " K'distsausk/Turtle Point Conservancy ",
		 " Kekuli Bay Park ",
		 " Kennedy Island Conservancy ",
		 " Kennedy Lake Park ",
		 " Kennedy River Bog Park ",
		 " Kentucky-Alleyne Park ",
		 " Keremeos Columns Park ",
		 " Kettle River Recreation Area ",
		 " Khtada Lake Conservancy ",
		 " Khutzeymateen Inlet Conservancy ",
		 " Khutzeymateen Inlet West Conservancy ",
		 " Khutzeymateen Park (a.k.a. Khutzeymateen/K'tzim-a-deen Grizzly Sanctuary) ",
		 " Khyex Conservancy ",
		 " Kianuko Park ",
		 " Kickininee Park ",
		 " Kikomun Creek Park ",
		 " Kilbella Estuary Conservancy ",
		 " Kilby Park ",
		 " Kimsquit Estuary Conservancy ",
		 " Kin Beach Park ",
		 " Kinaskan Lake Park ",
		 " King George VI Park ",
		 " Kingcome River/Atlatzi River Ecological Reserve ",
		 " Kingfisher Creek Ecological Reserve ",
		 " Kingfisher Creek Park ",
		 " Kiskatinaw Park ",
		 " Kiskatinaw River Park ",
		 " Kitasoo Spirit Bear Conservancy ",
		 " Kitimat River Park ",
		 " Kitson Island Marine Park ",
		 " Kitsumkalum Lake North Protected Area ",
		 " Kitsumkalum Park ",
		 " Kitty Coleman Beach Park ",
		 " Kitwanga Mountain Park ",
		 " Klanawa River Ecological Reserve ",
		 " Klaskish River Ecological Reserve ",
		 " Kleanza Creek Park ",
		 " Klewnuggit Conservancy ",
		 " Klewnuggit Inlet Marine Park ",
		 " K'lgaan/Klekane Conservancy ",
		 " Klin-se-za Park ",
		 " Klua Lakes Protected Area ",
		 " Kluskoil Lake Park ",
		 " K'mooda/Lowe-Gamble Conservancy ",
		 " K'Nabiyaaxl/Ashdown Conservancy ",
		 " Koeye Conservancy ",
		 " Kokanee Creek Park ",
		 " Kokanee Glacier Park ",
		 " Koksilah River Park ",
		 " Kootenay Lake Park ",
		 " Kootenay Loop Reginal Trail (Mgt Agreeement Reg Govt) ",
		 " Kootenay Loop Regional Trail (PACQ) ",
		 " K'ootz/Khutze Conservancy ",
		 " Kotcho Lake Ecological Reserve ",
		 " Kotcho Lake Village Site Park ",
		 " Ksgaxl/Stephens Island Conservancy ",
		 " Ksi X?anmaas Conservancy ",
		 " Ksi Xts'at'kw/Stagoo Conservancy ",
		 " Kt'ii/Racey Conservancy ",
		 " Ktisgaidz/Macdonald Bay Conservancy ",
		 " Kts'Mkta'ani/Union Lake Conservancy ",
		 " Kunxalas Conservancy ",
		 " K'uuna Gwaay Conservancy ",
		 " K'waal Conservancy ",
		 " Kwadacha Wilderness Park ",
		 " Kwatna Estuary Conservancy ",
		 " K'zuz?lt/Twin Two Conservancy ",
		 " Lac du Bois Grasslands Protected Area ",
		 " Lac La Hache Park ",
		 " Lac Le Jeune Park ",
		 " Lady Douglas-Don Peninsula Conservancy ",
		 " Lakelse Lake Park ",
		 " Lakelse Lake Wetlands Park ",
		 " Lanz and Cox Islands Park ",
		 " Larcom Lagoon Conservancy ",
		 " Lasqueti Island Ecological Reserve ",
		 " Lava Forks Park ",
		 " Lawn Point Park ",
		 " Lax Ka'gaas/Campania Conservancy ",
		 " Lax Kul Nii Luutiksm/Bonilla Conservancy ",
		 " Lax Kwaxl/Dundas and Melville Islands Conservancy ",
		 " Lax Kwil Dziidz/Fin Conservancy ",
		 " Lepas Bay Ecological Reserve ",
		 " Lew Creek Ecological Reserve ",
		 " Liard River Corridor Park ",
		 " Liard River Corridor Protected Area ",
		 " Liard River Hot Springs Park ",
		 " Liard River West Corridor Park ",
		 " Lily Pad Lake Ecological Reserve ",
		 " Little Andrews Bay Marine Park ",
		 " Little Qualicum Falls Park ",
		 " Liumchen Ecological Reserve ",
		 " Lockhart Beach Park ",
		 " Lockhart Creek Park ",
		 " Lockhart-Gordon Conservancy ",
		 " Long Creek Park ",
		 " Long Island Conservancy ",
		 " Loon Lake Park ",
		 " Loveland Bay Park ",
		 " Lowe Inlet Marine Park ",
		 " Lower Nimpkish Park ",
		 " Lower Raush Protected Area ",
		 " Lower Skeena River Park ",
		 " Lower Tsitika River Park ",
		 " Lucy Islands Conservancy ",
		 " Lundmark Bog Protected Area ",
		 " Mabel Lake Park ",
		 " Machmell Conservancy ",
		 " Mackinnon Esker Ecological Reserve ",
		 " Macmillan Park ",
		 " Mahoney Lake Ecological Reserve ",
		 " Mahpahkum-Ahkwuna/Deserters-Walker Conservancy ",
		 " Main Lake Park ",
		 " Malaspina Park ",
		 " Mansons Landing Park ",
		 " Manzanita Cove Conservancy ",
		 " Maquinna Marine Park ",
		 " Maquinna Protected Area ",
		 " Mara Meadows Ecological Reserve ",
		 " Mara Meadows Park ",
		 " Mara Park ",
		 " Marble Canyon Park ",
		 " Marble Range Park ",
		 " Marble River Park ",
		 " Marl Creek Park ",
		 " Martha Creek Park ",
		 " Maxhamish Lake Park ",
		 " Maxhamish Lake Protected Area ",
		 " Maxtaktsm'aa/Union Passage Conservancy ",
		 " McConnell Lake Park ",
		 " McDonald Creek Park ",
		 " McQueen Creek Ecological Reserve ",
		 " Megin River Ecological Reserve ",
		 " Mehatl Creek Park ",
		 " Memory Island Park ",
		 " Meridian Road (Vanderhoof) Ecological Reserve ",
		 " Meziadin Lake Park ",
		 " Milligan Hills Park ",
		 " Miracle Beach Park ",
		 " Misty Lake Ecological Reserve ",
		 " Mitlenatch Island Nature Park ",
		 " Mkwal'ts Conservancy ",
		 " Moberly Lake Park ",
		 " Moksgm'ol/Chapple-Cornwall Conservancy ",
		 " Momich Lakes Park ",
		 " Monarch Mountain/A Xeegi Deiyi Conservancy ",
		 " Monashee Park ",
		 " Monashee trail right of way corridor - Spectrum Creek ",
		 " Monck Park ",
		 " Monckton Nii Luutiksm Conservancy  ",
		 " Monkman Park ",
		 " Montague Harbour Marine Park ",
		 " Monte Creek Park ",
		 " Monte Lake Park ",
		 " Moore/McKenney/Whitmore Islands Ecological Reserve ",
		 " Moose Valley Park ",
		 " Morden Colliery Historic Park ",
		 " Morice Lake Park ",
		 " Morice River Ecological Reserve ",
		 " Morrissey Park ",
		 " Morton Lake Park ",
		 " Mount Assiniboine Park ",
		 " Mount Blanchet Park ",
		 " Mount Derby Ecological Reserve ",
		 " Mount Edziza Park ",
		 " Mount Elliott Ecological Reserve ",
		 " Mount Elphinstone Park ",
		 " Mount Erskine Park ",
		 " Mount Fernie Park ",
		 " Mount Geoffrey Escarpment Park ",
		 " Mount Griffin Ecological Reserve ",
		 " Mount Griffin Park ",
		 " Mount Maxwell Ecological Reserve ",
		 " Mount Maxwell Park ",
		 " Mount Minto/K?iy?n Conservancy ",
		 " Mount Pope (PACQ)-Pinchi Lake - trail ",
		 " Mount Pope Park ",
		 " Mount Richardson Park ",
		 " Mount Robson Corridor Protected Area ",
		 " Mount Robson Park ",
		 " Mount Robson Protected Area ",
		 " Mount Sabine Ecological Reserve ",
		 " Mount Savona Park ",
		 " Mount Seymour Park ",
		 " Mount Terry Fox Park ",
		 " Mount Tinsdale Ecological Reserve ",
		 " Mount Tuam Ecological Reserve ",
		 " Mount Tzuhalem Ecological Reserve ",
		 " Moyie Lake Park ",
		 " Mud Lake Delta Park ",
		 " Mudzenchoot Park ",
		 " Muncho Lake Park ",
		 " Murrin Park ",
		 " Muscovite Lakes Park ",
		 " Myra-Bellevue Park ",
		 " Myra-Bellevue Protected Area ",
		 " Nadina Mountain Park ",
		 " Nahatlatch Park ",
		 " Nahatlatch Protected Area ",
		 " Naikoon Park ",
		 " Nairn Falls Park ",
		 " Nakina-Inklin Rivers (Kuthai Area)/Yawu Yaa Conservancy ",
		 " Nakina-Inklin Rivers/Yawu Yaa Conservancy ",
		 " Nalbeelah Creek Wetlands Park ",
		 " Namu Conservancy ",
		 " Namu Corridor Conservancy ",
		 " Nancy Greene Park ",
		 " Nang Xaldangaas Conservancy ",
		 " Narcosli Lake Ecological Reserve ",
		 " Nation Lakes Park ",
		 " Nazko Lake Park ",
		 " Ne'ah' Conservancy ",
		 " Nechako Canyon Protected Area ",
		 " Nechako River Ecological Reserve ",
		 " Negiy/Nekite Estuary Conservancy ",
		 " Neneikekh/Nanika-Kidprice Park ",
		 " Netalzul Meadows Park ",
		 " Newcastle Island Marine Park ",
		 " Nickel Plate Park ",
		 " Nicolum River Park ",
		 " Nilkitkwa Lake Park ",
		 " Nimpkish Lake Park ",
		 " Nimpkish River Ecological Reserve ",
		 " Ningunsaw Park ",
		 " Ningunsaw River Ecological Reserve ",
		 " Nisga'a Memorial Lava Bed Corridor Protected Area ",
		 " Nisga'a Memorial Lava Bed Corridor Protected Area (No. 2)  ",
		 " Nisga'a Memorial Lava Bed Protected Area ",
		 " Niskonlith Lake Park ",
		 " Nitinat Lake Ecological Reserve ",
		 " Nitinat River Park ",
		 " Nlhaxten/Cerise Creek Conservancy ",
		 " Nooseseck Conservancy ",
		 " Norbury Lake Park ",
		 " North Spit Conservancy ",
		 " North Thompson Islands Park ",
		 " North Thompson Oxbows East Park ",
		 " North Thompson Oxbows Jensen Islands Park ",
		 " North Thompson Oxbows Manteau Park ",
		 " North Thompson River Park ",
		 " Northern Rocky Mountains Park ",
		 " Northern Rocky Mountains Protected Area ",
		 " Nuchatlitz Park ",
		 " Nuntsi Park ",
		 " Oak Bay Islands Ecological Reserve ",
		 " Octopus Islands Marine Park ",
		 " Okanagan Falls (PACQ) RDOS (2014) ",
		 " Okanagan Lake Park ",
		 " Okanagan Mountain Park ",
		 " Okeover Arm Park ",
		 " Old Man Lake Park ",
		 " Oliver Cove Marine Park ",
		 " Omineca Park ",
		 " Omineca Protected Area ",
		 " One Island Lake Park ",
		 " Oregana Creek Park ",
		 " Oregon Jack Park ",
		 " Ospika Cones Ecological Reserve ",
		 " Otter Lake Park ",
		 " Otter Lake Protected Area ",
		 " Outer Central Coast Islands Conservancy ",
		 " Owikeno Conservancy ",
		 " Owyacumish River Park ",
		 " Pa_aat Conservancy ",
		 " Paarens Beach Park ",
		 " Painted Bluffs Park ",
		 " Palemin/Estero Basin Conservancy ",
		 " Parker Lake Ecological Reserve ",
		 " Patsuk Creek Ecological Reserve ",
		 " Patterson Lake Park ",
		 " Paul Lake Park ",
		 " Peace Arch Park ",
		 " Peace River Corridor Park ",
		 " Pennask Creek Park ",
		 " Pennask Lake Park ",
		 " Penrose Island Marine Park ",
		 " Penrose-Ripon Conservancy ",
		 " Petroglyph Park ",
		 " Phillips Estuary/?Nacinuxw Conservancy ",
		 " Pillar Park ",
		 " Pilot Bay Park ",
		 " Pine Le Moray Park ",
		 " Pine River Breaks Park ",
		 " Pinecone Burke Park ",
		 " Pink Mountain Park ",
		 " Pinnacles Park ",
		 " Pirates Cove Marine Park ",
		 " Pitman River Protected Area ",
		 " Pitt Polder Ecological Reserve ",
		 " Plumper Cove Marine Park ",
		 " Polkinghorne Islands Conservancy ",
		 " Pooley Conservancy ",
		 " Porcupine Meadows Park ",
		 " Porpoise Bay Park ",
		 " Port Arthur Conservancy ",
		 " Portage Brule Rapids Ecological Reserve ",
		 " Portage Brule Rapids Protected Area ",
		 " Porteau Cove Park ",
		 " Power River Watershed Protected Area ",
		 " Premier Lake Park ",
		 " Princess Louisa Marine Park ",
		 " Pritchard Park ",
		 " Prophet River Hot Springs Park ",
		 " Prophet River Wayside Park ",
		 " Prudhomme Lake Park ",
		 " Ptarmigan Creek Park ",
		 " Ptarmigan Protected Area ",
		 " Pukeashun Park ",
		 " Puntchesakut Lake Park ",
		 " Punti Island Park ",
		 " Purcell Wilderness Conservancy Corridor Protected Area ",
		 " Purcell Wilderness Conservancy Park ",
		 " Purden Lake Park ",
		 " Pure Lake Park ",
		 " Pyramid Creek Falls Park ",
		 " Q'altanaas/Aaltanhash Conservancy ",
		 " Quatsino Park ",
		 " Qudes/Gillard-Jimmy Judd Island Conservancy ",
		 " Quesnel Lake Park ",
		 " Qwalimak/Upper Birkenhead Conservancy ",
		 " Qwiquallaaq/Boat Bay Conservancy ",
		 " Race Rocks Ecological Reserve ",
		 " Raft Cove Park ",
		 " Rainbow Alley Park ",
		 " Rainbow/Q'iwentem Park ",
		 " Ram Creek Ecological Reserve ",
		 " Raspberry Harbour Ecological Reserve ",
		 " Rathtrevor Beach Park ",
		 " Read Island Park ",
		 " Rearguard Falls Park ",
		 " Rebecca Spit Marine Park ",
		 " Red Bluff Park ",
		 " Redbrush Park ",
		 " Redfern-Keily Park ",
		 " Rendezvous Island South Park ",
		 " Rescue Bay Conservancy ",
		 " Restoration Bay Conservancy ",
		 " Roberts Creek Park ",
		 " Roberts Memorial Park ",
		 " Robson Bight (Michael Bigg) Ecological Reserve ",
		 " Roche Lake Park ",
		 " Rock Bay Marine Park ",
		 " Rock Creek Park ",
		 " Roderick Haig-Brown Park ",
		 " Roderick Haig-Brown Section 6 Park Act LTO L A PL 20091 ",
		 " Rolla Canyon Ecological Reserve ",
		 " Rolley Lake Park ",
		 " Roscoe Bay Park ",
		 " Rose Islets Ecological Reserve ",
		 " Rose Spit Ecological Reserve ",
		 " Rosebery Park ",
		 " Rosewall Creek Park ",
		 " Ross Lake Ecological Reserve ",
		 " Ross Lake Park ",
		 " Rubyrock Lake Park ",
		 " Ruckle Park ",
		 " Rugged Point Marine Park ",
		 " Ruth Lake Park ",
		 " Ryan Park ",
		 " S&#7809;i&#7809;s Park [a.k.a. Haynes Point Park] ",
		 " Sabine Channel Marine Park ",
		 " Saltery Bay Park ",
		 " San Juan Ridge Ecological Reserve ",
		 " San Juan River Estuary Ecological Reserve ",
		 " Sanctuary Bay Conservancy ",
		 " Sand Point Conservancy ",
		 " Sandwell Park ",
		 " Santa Gertrudis-Boca Del Infierno Park ",
		 " Sargeant Bay Park ",
		 " Sartine Island Ecological Reserve ",
		 " Sasquatch Park ",
		 " Satellite Channel Ecological Reserve ",
		 " Say Nuth Khaw Yum Park [a.k.a. Indian Arm Park] ",
		 " Scatter River Old Growth Park ",
		 " Schoen Lake Park ",
		 " Schoolhouse Lake Park ",
		 " Sechelt Inlets Marine Park ",
		 " Seeley Lake Park ",
		 " Seton Portage Historic Park ",
		 " Seven Sisters Park ",
		 " Seven Sisters Protected Area ",
		 " SGaay Taw Siiwaay K?adjuu Conservancy  ",
		 " Shannon Falls Park ",
		 " Shearwater Hot Springs Conservancy ",
		 " Sheemahant Conservancy ",
		 " Shuswap Lake Marine Park ",
		 " Shuswap Lake Park ",
		 " Shuswap River Islands Park ",
		 " Sikanni Chief Canyon Park ",
		 " Sikanni Chief Falls Protected Area ",
		 " Sikanni Chief River Ecological Reserve ",
		 " Sikanni Old Growth Park ",
		 " Silver Beach Park ",
		 " Silver Lake Park ",
		 " Silver Star Park ",
		 " Simpson Lake East Conservancy ",
		 " Simson Park ",
		 " Sir Alexander Mackenzie Park ",
		 " Six Mile Hill Protected Area ",
		 " Skagit River Cottonwoods Ecological Reserve ",
		 " Skagit River Forest Ecological Reserve ",
		 " Skagit River Rhododendron Ecological Reserve ",
		 " Skagit Valley Park ",
		 " Skaha Bluffs Park ",
		 " Skeena Bank Conservancy ",
		 " Skeena River Ecological Reserve ",
		 " Skihist Ecological Reserve ",
		 " Skihist Park ",
		 " Skookumchuck Narrows Park ",
		 " Skookumchuck Rapids Park ",
		 " Skwaha Lake Ecological Reserve ",
		 " Sleeping Beauty Mountain Park ",
		 " Slim Creek Park ",
		 " Small Inlet Marine Park ",
		 " Small Inlet Waiatt Bay (PACQ) M&R ",
		 " Small River Caves Park ",
		 " Smelt Bay Park ",
		 " Smith River Ecological Reserve ",
		 " Smith River Falls-Fort Halkett Park ",
		 " Smithers Island Conservancy ",
		 " Smuggler Cove Marine Park ",
		 " Snowy Protected Area ",
		 " Soap Lake Ecological Reserve ",
		 " Solander Island Ecological Reserve ",
		 " Sooke Mountain Park ",
		 " Sooke Potholes Park ",
		 " South Chilcotin Mountains Park ",
		 " South Okanagan Grasslands Protected Area ",
		 " South Texada Island Park ",
		 " Sowchea Bay Park ",
		 " Spatsizi Headwaters Park ",
		 " Spatsizi Plateau Wilderness Park ",
		 " Spectacle Lake Park ",
		 " Spider Lake Park ",
		 " Spipiyus Park ",
		 " Sproat Lake Park ",
		 " Squitty Bay Park ",
		 " St. Mary's Alpine Park ",
		 " Stagleap Park ",
		 " Stair Creek Conservancy ",
		 " Stamp River Park ",
		 " Stawamus Chief Park ",
		 " Stawamus Chief Protected Area ",
		 " Steelhead Park ",
		 " Stein Valley Nlaka'pamux Heritage Park ",
		 " Stemwinder Park ",
		 " Stikine River Park ",
		 " Stone Mountain Park ",
		 " Stoyoma Creek Ecological Reserve ",
		 " Strathcona - Westmin Park ",
		 " Strathcona Park ",
		 " Stuart Lake Marine Park ",
		 " Stuart Lake Park ",
		 " Stuart River Park ",
		 " Sue Channel Park ",
		 " Sugarbowl-Grizzly Den Park ",
		 " Sugarbowl-Grizzly Den Protected Area ",
		 " Sukunka Falls Park ",
		 " Sulphur Passage Park ",
		 " Summit Lake Park ",
		 " Sunbeam Creek Ecological Reserve ",
		 " Sun-Oka Beach Park ",
		 " Surge Narrows Park ",
		 " Sustut Park ",
		 " Sustut Protected Area ",
		 " Sutherland River Park ",
		 " Sutherland River Protected Area ",
		 " Sutton Pass Ecological Reserve ",
		 " Swan Creek Protected Area ",
		 " Swan Lake Kispiox River Park ",
		 " Swan Lake Park ",
		 " sxwexwnitkw Park (aka Okanagan Falls Park) ",
		 " Sydney Inlet Park ",
		 " Syringa (AQ) Arrow Yaht Club ",
		 " Syringa (COV) Arrow Yaht Club ",
		 " Syringa Park ",
		 " Tacheeda Lakes Ecological Reserve ",
		 " Tahsish River Ecological Reserve ",
		 " Tahsish-Kwois Park ",
		 " Takla Lake Ecological Reserve ",
		 " Takla Lake Marine Park ",
		 " Taku River/T'aku Teix' Conservancy ",
		 " Tantalus Park ",
		 " Tarahne Park ",
		 " Tatlatui Park ",
		 " Tatshenshini-Alsek Park ",
		 " Taweel Park ",
		 " Taylor Arm Park ",
		 " Taylor Landing Park ",
		 " Tazdli Wyiez Bin/Burnie-Shea Park ",
		 " Teakerne Arm Park ",
		 " Ten Mile Lake Park ",
		 " Ten Mile Point Ecological Reserve ",
		 " Tetrahedron Park ",
		 " Thinahtea North Protected Area ",
		 " Thinahtea South Protected Area ",
		 " Thorsen Creek Conservancy ",
		 " Three Sisters Lakes Park ",
		 " Thulme Falls Conservancy ",
		 " Thunder Hill Park ",
		 " Thunderbird's Nest (T'iitsk'in Paawats) Protected Area ",
		 " Thurston Bay Marine Park ",
		 " Titetown Park ",
		 " Tlall Conservancy ",
		 " Toad River Hot Springs Park ",
		 " Todagin South Slope Park ",
		 " Top of the World Park ",
		 " Topley Landing Park ",
		 " Torkelsen Lake Ecological Reserve ",
		 " Tow Hill Ecological Reserve ",
		 " Tranquil Creek Park ",
		 " Tranquille Ecological Reserve ",
		 " Trembleur Lake Park ",
		 " Trepanier Park ",
		 " Trial Islands Ecological Reserve ",
		 " Tribune Bay Park ",
		 " Troup Passage Conservancy ",
		 " Trout Creek Ecological Reserve ",
		 " T'sa-Lat'l/Smokehouse Conservancy ",
		 " Tsikita River Ecological Reserve ",
		 " Ts'il?os Park (a.k.a. Ts'yl-Os Park) ",
		 " Tsintsunko Lakes Park ",
		 " Tsitika Mountain Ecological Reserve ",
		 " Tudyah Lake Park ",
		 " Tunkwa Park ",
		 " Tutshi Lake/T'ooch' Aayi Conservancy ",
		 " Tuya Mountains Park ",
		 " Tweedsmuir Corridor Protected Area ",
		 " Tweedsmuir Park ",
		 " Tyhee Lake Park ",
		 " Ugwiwa'/Cape Caution Conservancy ",
		 " Ugwiwa'/Cape Caution-Blunden Bay Conservancy ",
		 " Uncha Mountain Red Hills Park ",
		 " Union Passage Marine Park ",
		 " Upper Adams River Park ",
		 " Upper Elaho Valley Conservancy ",
		 " Upper Gladys River/Wats?x Deiyi Conservancy ",
		 " Upper Kimsquit River Conservancy ",
		 " Upper Klinaklini Protected Area ",
		 " Upper Lillooet Park ",
		 " Upper Raush Protected Area ",
		 " Upper Rogers Kolii7 Conservancy  ",
		 " Upper Seymour River Park ",
		 " Upper Shuswap River Ecological Reserve ",
		 " Upper Soo Conservancy ",
		 " Upper Violet Creek Park ",
		 " Valhalla Park ",
		 " Vance Creek Ecological Reserve ",
		 " Vargas Island Park ",
		 " Vaseux Lake Park ",
		 " Vaseux Protected Area ",
		 " Victor Lake Park ",
		 " Vladimir J. Krajina (Port Chanal)  Ecological Reserve ",
		 " Wahkash Point Conservancy ",
		 " Wakeman Estuary Conservancy  ",
		 " Wakes Cove Park ",
		 " Wales Harbour Conservancy ",
		 " Walhachin Oxbows Park ",
		 " Wallace Island Marine Park ",
		 " Walloper Lake Park ",
		 " Walsh Cove Park ",
		 " Wap Creek Park ",
		 " Wapiti Lake Park ",
		 " Wardner Park ",
		 " Wasa Lake Park ",
		 " Wawley/Seymour Estuary Conservancy ",
		 " Weewanie Hot Springs Park ",
		 " Wells Gray Park ",
		 " Wendle Park ",
		 " West Arm Park ",
		 " West Arm Park (PACQ) -- Darkwoods ",
		 " West Lake Park ",
		 " West Shawnigan Lake Park ",
		 " West Twin Park ",
		 " West Twin Protected Area ",
		 " Westwick Lakes Ecological Reserve ",
		 " Weymer Creek Park ",
		 " Whaleboat Island Marine Park ",
		 " Whipsaw Creek Ecological Reserve ",
		 " Whiskers Point Park ",
		 " White Lake Grasslands Protected Area ",
		 " White Lake Park ",
		 " White Pelican Park ",
		 " White Ridge Park ",
		 " White River Park ",
		 " Whiteswan Lake Park ",
		 " Wilkinson-Wright Bay Conservancy ",
		 " Williams Creek Ecological Reserve ",
		 " Willison Creek-Nelson Lake/Sit' Heeni Conservancy ",
		 " Windermere Lake Park ",
		 " Winter Inlet Conservancy ",
		 " Wire Cache Park ",
		 " Wistaria Park ",
		 " Wood Mountain Ski Park ",
		 " Woodley Range Ecological Reserve ",
		 " Woodworth Lake Conservancy ",
		 " Woss Lake Park ",
		 " Wrinkly Face Park ",
		 " Xwakwe?Naxde?Ma/Stafford Estuary Conservancy ",
		 " Yaaguun Gandlaay Conservancy ",
		 " Yaaguun Suu Conservancy ",
		 " Yahk Park ",
		 " Yalakom Park ",
		 " Yale Garry Oak Ecological Reserve ",
		 " Yard Creek Park ",
		 " Yellow Point Bog Ecological Reserve ",
		 " Zumtela Bay Conservancy "
		 ];

		 $scope.parkNames = parkNames;
		 var showList = true;
		 $scope.showList =showList;

		 $scope.parkSelected = function(){
		 	$scope.showList = false;
		 }
		 $scope.changePark = function(){
		 	$scope.showList = true;
		 }



    //function to change zoning schema picture
    $scope.showZoneSchema = function(zoningSchemaSelect){
        if(zoningSchemaSelect == "River"){
            $scope.zoningSchemaPic = '<br/> <h3>River Zone Map</h3> <br/> <img src="img/river.png"> <br/><br/>';
        } else if(zoningSchemaSelect == "Estuary"){
            $scope.zoningSchemaPic = '<br/> <h3>Esturary Zone Map</h3> <br/> <img src="img/estuary.png"> <br/><br/>';
        } else if(zoningSchemaSelect == "Terrestrial"){
            $scope.zoningSchemaPic = '<br/> <h3>Terrestrial Zone Map</h3> <br/> <img src="img/terrestrial.png"> <br/><br/>';
        } else {
            $scope.zoningSchemaPic = '';
        }
    }
})

.controller('startNewSessionContCtrl', function($scope, Enviro) {
	
	//global factory environment object
	$scope.Enviro = Enviro;
			            
})

.controller('observationModeCtrl', function($scope, $cordovaSQLite, Session, Enviro) {
	//global debug var
	$scope.debug = debug;	
	
	//global factory session/enviro objects
	$scope.Session = Session;
	$scope.Enviro = Enviro;
	
	//TODO: DB entry - CC

	
	var insertResult = "Not initialized";
	var selectResult = "Not initialized";
	$scope.insertResult = insertResult;
	$scope.selectResult = selectResult;

	$scope.testInsert = function(){
		$scope.insertResult = "Saving";
		id = Session.save();
		if(id != '') {
			console.log("Trying envirosave with id " + id);
			//Enviro.save(id);
		}else{
			console.log("no id");
		}
	}

	$scope.testSelect = function(){
		$scope.insertResult = "Initialized: Session_id?:  " + Session.id;
		Enviro.save(Session.id);
		$cordovaSQLite.execute(db, 'SELECT * FROM sessions WHERE session_id = (?)', [Session.id])
            .then(
                function(result) {
                	$scope.selectResult = "Session = ";
                    if (result.rows.length > 0) {
            			for(item in result.rows.item(0)){
            				$scope.selectResult += item + ": " + result.rows.item(0)[item] + ", ";
            			}
                    }
                },
                function(error) {
                    $scope.selectResult = "Error on loading: " + error.message;
                }
            );

        $cordovaSQLite.execute(db, 'SELECT * FROM logs')
        .then(
            function(result) {
            	$scope.selectResult += "Enviro = ";
                if (result.rows.length > 0) {
                	console.log("enviro results returned");
        			for(item in result.rows.item(0)){
        				$scope.selectResult += item + ": " + result.rows.item(0)[item] + ", ";
        			}
                }else{
                	console.log("No enviro results")
                }
            },
            function(error) {
                $scope.selectResult = "Error on loading: " + error.message;
            }
        );
	}

	$scope.saveSession = function(){
		//save session THEN save environment using session id
		Session.save()
		.then(
			function(result){
				Enviro.save(result.insertId);
			}, 
			function(error){
				console.log("saveSession error: " + error.message);
			}
		);
	}

});
angular.module('app.services')


//Bear Object
.factory('Bear', [function(){
    return {
        index: -1,
        id: -1,
        isFocal: '',
        name: '',
        zone: '',
        size: '',
        age: '',
        gender: '',
        species: '',
        markDescription: '',
        furColour: '',
        pawMeasured: false,
        cubs: '',
        cubFurColour: '',
        cubAge: '',
        behaviour: [],
        isFishing: false,
        fishing: [],
        fishingMethod: '',
        fishingSuboption: '',
        tally: 0,
        comment: ''
    };
                     
}])

//boolean to check focal bear present
.factory('FBearSet', [function(){
    return {
        isFocalPresent: '',
    };
                     
}])

//array to add all the bear objects
.factory('BearList', [function(){
    return {
        add: [],
    };
                  
}]);
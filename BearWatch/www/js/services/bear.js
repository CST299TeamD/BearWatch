angular.module('app.services')

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
        pawMeasered: '',
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

.factory('FBearSet', [function(){
    return {
        isFocalPresent: '',
    };
                     
}])

.factory('BearList', [function(){
    return {
        add: [],
    };
                  
}]);
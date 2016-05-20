angular.module('app.services')

.factory('Bear', [function(){
    return {
        index: -1,
        id: -1,
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
        ba: [],
        comment: ''
    };
                     
}])

.factory('BearList', [function(){
    return {
        add: [],
    };
                  
}]);
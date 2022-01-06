const data = require('./data.js');

//helper function, assume to not exist in db
const getIdFunc = (arrayOfObjects, id) => {
    return arrayOfObjects.filter( object => object["id"] == id);
}

exports.default = data;
exports["getId"] = getIdFunc;

/**
 * another method for func declaration in jscript. Can also declare as const (see above) 
function getIdFunc (arrayOfObjects, id) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    
    const result = arrayOfObjects.filter( object => object["id"] == id);
    
    // the above is the same as:"
    //
    // const result = arrayOfObjects.filter( (object) => { 
    //    return object.id == id 
    // });

    // filter method returns an array 
    // but we know ids are unique
    // so the result must have a length of 1. looks like: [ {id: value, key: value, ...} ] 
    //
    // in some cases we might want to return the object directly: return result[0]
    // however, in thise case, it is better to return the array because it will make graphql less complicated
    return result 
}
**/
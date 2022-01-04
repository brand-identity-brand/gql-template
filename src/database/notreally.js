const places = [
    {
        id: 1,
        address: '420 Roehampton Ave',
        tenants: [ 3, 2 ],
    },
    {
        id: 2,
        address: '9033 Leslie St',
        tenants: [ 1 ],
    },
];

const people = [
    {
        id: 1,
        name: 'Sean',
        nationality: 'Taiwan',
    },
    {
        id: 2,
        name: 'John',
        nationality: 'Canada',
    },
    {
        id: 3,
        name: 'Kathy',
        nationality: 'China',
    },
];

exports.default = { places, people };
exports.getId = getId;

function getId(arrayOfObjects, id) {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    const result = arrayOfObjects.filter( object => object.id == id );
    // the above is the same as:
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
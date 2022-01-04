const fetch = require('node-fetch');

const resolvers = {
    Query: {
        peoples: (obj, args, context, info) => {
            const {
                id
            } = args;
            console.log('ran peoples');
            const baseUrl = `${domain}/fakepi/people`;
            const useUrl = id==undefined ? baseUrl : `${baseUrl}/${id}`;
            const result = fetch(useUrl).then(res => res.json());
            return result
        },
        places: (obj, args, context, info) => {
            const {
                id
            } = args;
            const baseUrl = `${domain}/fakepi/places`;
            const useUrl = id==undefined ? baseUrl : `${baseUrl}/${id}`;
            const result = fetch(useUrl).then(res => res.json());
            return result
        },
    },
    People: {
        // this is what the default resolver does
        id: (obj, args, context, info) => { return obj.id },
        // address is the only node in People that needs a custom resolver
        address: async (obj, args, context, info) => { 
            return 'complete the resolver function'
        },
    },
    Place: {
        tenants: (obj, args, context, info) => {
            // tentant will need a custom resolver even the keys from schema and api matches
            // that is because the return data is not the data you intend to show
            //
            // get the array of tenant id
            const { tenants } = obj; // const tenant = obj.tenant; 
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
            const result = tenants.map( async tenant => { //parenthesis can be omitted if there is only 1 arg
                const resultInArray = await fetch(`${domain}/fakepi/people/${tenant}`).then(res => res.json());
                const result = resultInArray[0]
                return result;
            } )
            return result
        },
    },
}

exports.default = resolvers;
var domain = 'http://localhost:4000';
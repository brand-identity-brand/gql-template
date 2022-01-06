//we need this to fetch data from our own API endpoints
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')


const resolvers = {
    Query: {
        persons: async (obj, args, context, info) => {
            const {
                id,
                nationality
            } = args;
            const baseUrl = `${domain}/fakepi/people`;
            if ( nationality ) {
                const everyone = await fetch(baseUrl).then(res => res.json());
                const result = everyone.filter( theOne =>  theOne["nationality"] == nationality );
                return result;
            }
            const useUrl = id==undefined ? baseUrl : `${baseUrl}/${id}`;
            const result = await fetch(useUrl).then(res => res.json());
            return result;
        },
        //implicit async, essentially threads
        //notice {id} versus id. The latter uses destructuring inside of the function versus in the argument. Both are examples of object destructuring
        places: async (obj, {id}, context, info) => {
            const baseUrl = `${domain}/fakepi/places`;
            const useUrl = id==undefined ? baseUrl : `${baseUrl}/${id}`;
            const result = fetch(useUrl).then(res => res.json());
            return result;
        },
    },
    Person: {
        // this is what the default resolver does
        id: (obj, args, context, info) => { return obj.id },
        // address is the only node in People that needs a custom resolver
        address: async (obj, args, context, info) => {
            //may receive a person object from persons or places => Place => tenants or an empty object
            //assumption that the object being passed in is standardized (contains: id, name, nationality) as specified by api
            //may be missing a field that is standardized though (empty id) 
            //get person object id
            //store object id (if found) ==> if not can't find tenant
            //look up places and find the correct id value stored in Person object 
            //return address from Place object
            
            const {id} = obj;
            //could also return '' for consistency with returned value later
            //not necessary required as id is always required
            if(id == null){return null;}
            const baseUrl = `${domain}/fakepi/places`;
            const result = await fetch(baseUrl)
                .then(response => response.json());

            //sean preference for foreach
            for(var i = 0; i < result.length; ++i){
                if(result[i].tenants.includes(id)){
                    return result[i].address;
                }
            }

            return null;
        },
    },
    Place: {
        //actually an array of People
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
    Mutation:{
        createPerson:(obj, args, context, info) => {
            /*
            Since we have content already in the file
            thus we should read and store all contents in a string
            perform some string manipulation to determine where we want to
            put the new content, then append the content
            
            We can't use writestream in this case as that appends to end of file
            */
            //const logStream = fs.createWriteStream(dataFilePath, {flags: 'a'});
            const dataFilePath = path.join(__dirname, '..', 'database', 'data.js');
            try{
                if(fs.existsSync(dataFilePath)){
                    console.log("found file");
                }
            }catch(err){
                console.error(err);
                return;
            }
            fs.readFile(dataFilePath, function read(err, data){
                if(err){
                    console.error(err);
                    return;
                }
                var file_content = data.toString();
                let tokens = file_content.split("\n")
                let start = 0;
                //find start of people block
                for(var i = 0; i < tokens.length; ++i){
                    if(tokens[i].localeCompare("const people = [")==0){
                        start = i;
                        break;
                    }
                }
                //find end of people block, using additional variable for clarity purposes
                let end = 0;
                for(; i < tokens.length; ++i){
                    if(tokens[i].localeCompare("];") == 0){
                        end = i;
                        break;
                    }
                }
                //storing last few tokens in below var
                var lastFewTokens = []
                for(i = end; i < tokens.length; ++i){
                    lastFewTokens.push(tokens[i]);    
                }

                var argsTokens = JSON.stringify(args)
                argsTokens = argsTokens.split("\"");
                for(i = 0; i < argsTokens.length; ++i){
                    if(argsTokens[i].localeCompare("name") == 0){
                        break;
                    }
                }
                if(argsTokens[i+2].localeCompare("}" != 0)){
                    argsTokens[i+2] = "\'" + argsTokens[i+2] + "\'";
                }
                tokens[end] = argsTokens.join("") + ",";
                
                for(i = end +2, j = 0;j < lastFewTokens.length; ++i, ++j){
                    tokens[i] = lastFewTokens[j];
                }
                var combinedString = tokens.join('\n');
                try{
                    fs.writeFileSync(dataFilePath, combinedString)
                }catch(err){
                    console.error(err)
                    return;
                }
                console.log("success");
                
                
            });            

        }
    }
}

exports.default = resolvers;
//gets hoisted
var domain = 'http://localhost:4000';
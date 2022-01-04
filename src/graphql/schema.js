const schema = `

type People {
  id: ID!
  name: String
  nationality: String

  address: String
}

type Place {
  id: ID!
  address: String
  tenants: [People]
}

type Query {
  peoples(id: ID): [People]
  places(id: ID): [Place]
}

type Mutation {
  insertPeople: [People]
}

`;

exports.default = schema;

/**
 * 

 */
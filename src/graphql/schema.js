const schema = `

type Person {
  id: ID!
  name: String
  nationality: String

  address: String
}

type Place {
  id: ID!
  address: String
  tenants: [Person]
}

type Query {
  persons(id: ID, nationality: String): [Person]
  places(id: ID): [Place]
}

type Mutation {
  insertPerson: [Person]
}

`;

exports.default = schema;
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
  createPerson(id: ID!, name: String):[Person]
}

`;

exports.default = schema;
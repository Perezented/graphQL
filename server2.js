const express = require("express");
let { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// GraphQL Schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }
    type Mutation {
      updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course{
      id: Int
      title: String
      author: String
      description: String
      topic: String
      url: String
    }
`);
var coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/"
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/"
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/"
  }
];

const getCourse = function (args) {
  const id = args.id;
  return coursesData.filter((course) => {
    return course.id === id;
  })[0];
};
// GET SINGLE COURSE
// get courseID 1:
// query getCoursesForTopic($courseID: Int!){
//   course(id: $courseID){
//     title
//     author
//     description
//     topic
//     url
//   }
// }

// ------------
// {"courseID":1}

const getCourses = function (args) {
  if (args.topic) {
    const topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};

// DOUBLE QUERY WITH FRAGS

// query getCoursesWithFragments($courseID1: Int!, $courseID2: Int!) {
//   course1: course(id: $courseID1) {
//     ...courseFields
//   }
//   course2: course(id: $courseID2) {
//     ...courseFields
//   }
// }

// fragment courseFields on Course {
//   title
//   author
//   description
//   topic
//   url
// }

// ------------
// {
//   "courseID1": 1,
//   "courseID2": 2
// }

const updateCourseTopic = function ({ id, topic }) {
  coursesData.map((course) => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter((course) => course.id === id)[0];
};

// GRAPHQL REQUESTS TO HAVE MUTATION WORK

// mutation updateCourseTopic($id: Int!, $topic: String!) {
//   updateCourseTopic(id: $id, topic: $topic) {
//     ...courseFields
//   }
// }

// fragment courseFields on Course {
//   title
//   author
//   description
//   topic
//   url
// }
// {
//   "id": 1,
//   "topic": "Node.js, React.js, JavaScript"
// }
// {
//   "id": 1,
//   "topic": "Node.js"
// }

// Root Resolver
const root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic
};

// Create an express server and GraphQL endpoint
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(4000, () =>
  console.log("Express GraphQl server now running on localhost:4000/graphql")
);

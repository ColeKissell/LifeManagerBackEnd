const graphql = require('graphql');
const Todo = require('../models/todo');
const Goal = require('../models/goal')
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;




const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: ( ) => ({
        id: { type: GraphQLID },
        body: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
        goal:{
            type: GoalType,
            resolve(parent, args){
                return Goal.findById(parent.goalId)
            }
        }
    })
});
const GoalType = new GraphQLObjectType({
    name: 'Goal',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        completed: { type: GraphQLBoolean },

        todos: {
            type: new GraphQLList(TodoType),
            resolve(parent, args){
                console.log(parent);
                return Todo.find({goalId: parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        todo: {
            type: TodoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Todo.findById(args.id)
            }
        },
        goal: {
            type: GoalType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Goal.findById(args.id)
            }
        },
        todos:{
            type: new GraphQLList(TodoType),
            resolve(parent, args){
                return Todo.find({})
            }
        },
        goals:{
            type: new GraphQLList(GoalType),
            resolve(parent, args){
                return Goal.find({})
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                body: { type: new GraphQLNonNull(GraphQLString) },
                goalId: {type: GraphQLID},
                completed: { type: GraphQLBoolean },
            },
            resolve(parent, args){
                let mytodo = new Todo({
                    body: args.body,
                    goalId: args.goalId,
                    completed: args.completed
                });
                return mytodo.save();
            }
        },
        addGoal: {
            type: GoalType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                dueDate: { type: GraphQLString },
                completed: { type: GraphQLBoolean },
                // resources:{type: GraphQLList},
                // stepsRequired:{type: GraphQLList},
            },
            resolve(parent, args){
                let goal = new Goal({
                    name: args.name,
                    description: args.description,
                    dueDate: args.dueDate,
                    completed: args.completed,
                    resources: args.resources,
                    stepsRequired: args.stepsRequired,
                });
                return goal.save();
            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
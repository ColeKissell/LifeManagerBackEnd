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
                if(args.completed == null){
                    args.completed = false;
                }
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
        },
        removeTodo:{
            type: TodoType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const removed = Todo.findByIdAndRemove(args.id).exec();
                if (!removed) {
                    throw new Error('Error')
                }
                return removed;
            }
        },
        removeGoal:{
            type: GoalType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const removed = Goal.findByIdAndRemove(args.id).exec();
                if (!removed) {
                    throw new Error('Error')
                }
                return removed;
            }
        },
        updateTodo:{
            type: TodoType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                body: { type: GraphQLString },
                goalId: {type: GraphQLID},
                completed: { type: GraphQLBoolean },
            },
            resolve(parent, args){
                const updated = Todo.findByIdAndUpdate(
                    args.id, args
                ).exec();
                if (!updated) {
                    throw new Error('Error')
                }
                return updated;
            }
        },
        updateGoal:{
            type: GoalType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                dueDate: { type: GraphQLString },
                completed: { type: GraphQLBoolean },
            },
            resolve(parent, args){
                const updated = Goal.findByIdAndUpdate(
                    args.id, args
                ).exec();
                if (!updated) {
                    throw new Error('Error')
                }
                return updated;
            }
        },
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
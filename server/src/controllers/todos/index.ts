import { Request,Response } from "express";

import TodoModel from '../../models/todo'
import {Todo} from '../../types/todo'


export const getTodos = async (req : Request, res: Response) : Promise<void> =>{
    const todos:Todo[] = await TodoModel.find()

    res.status(200).json({
        todos
    })
}

export const getTodo = async (req : Request, res: Response) : Promise<void> =>{
    await TodoModel.findById(req.params.id,(err,result)=>{
        if(err){
            res.status(400).json({
                error : err
            })
        }else{
            res.status(200).json({
                result
            })
        }
    })
}

export const addTodo = async (req : Request, res: Response) : Promise<void> =>{
    const body : Pick<Todo,'title' | 'status'> = req.body

    if(!body.title || !body.status){
        res.status(401).json({
            status:401,
            errorMessage : `Validation Error: Todo Validaion failed : title : ${body.title}, status : ${body.status}`
        })
        return
    }

    const newTodoModel = new TodoModel({
        title : body.title,
        status : body.status
    })

    const newTodo = await newTodoModel.save()
    const updatedAllTodosAfterSave = await TodoModel.find()

    res.status(201).json({
        message : 'Todo successfully added',
        addedTodo : newTodo,
        allTodoAfterAddition : updatedAllTodosAfterSave
    })
}

export const updateTodo = async (req : Request, res: Response) : Promise<void> =>{
    const {
        params : {id},
        body 
    } = req

    if(!body.title || !body.status || !id){
        res.status(401).json({
            status:401,
            errorMessage : `Validation Error: _id or required body properties is not defined.`
        })
        return
    }

    const updatedTodo = await TodoModel.findByIdAndUpdate({_id:id},body)
    const updatedAllTodosAfterUpdate = await TodoModel.find()

    if(!updatedTodo){
        res
            .status(501)
            .json({
                status:501,
                errorMessage:'Edit Todo Failed. Not Implemented'
            })
            return
        }
    
    res.status(200).json({
        message : 'Todo Successfully Edited',
        updatedTodo,
        todos:updatedAllTodosAfterUpdate
    })
}

export const removeTodo = async (req : Request, res: Response) : Promise<void> =>{
    const{
        params: {id}
    }=req

    if(!id){
        res.status(401).json({
            status : 401,
            errorMessage : `Validation Error : Params _id is not defined`
        })
        return
    }

    const removedTodo = await TodoModel.findByIdAndRemove(id)
    const updatedAllTodosAfterRemove = await TodoModel.find()

    if(!removedTodo){
        res
            .status(501)
            .json({
                status:501,
                errorMessage:'Removed Todo Failed. Not Implemented'
            })
            return
        }
    
    res.status(200).json({
        message : 'Todo Successfully Remove',
        removedTodo,
        todos:updatedAllTodosAfterRemove
    })

}
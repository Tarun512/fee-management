import { User } from "../model/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerUser = async(req,res) =>{
    const body = req.body;
    const pos = body.role;
    const email = body.email;
    const domain = email.includes("driems.ac.in");
    let posInEmail;
    const keywords = ['accountant','admin'];
    for(let word in keywords){
        if(email.includes(word)){
            posInEmail = word;
        }
    }
    if(pos == posInEmail && domain){
        const {name,email,password} = req.body;
        const 
    }
}




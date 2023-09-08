import { Router } from "express";
import {usersManager} from '../managers/UsersMongo.js'
import { hashData } from "../utils.js";
const router = Router()

router.get('/signup',(req,res)=>{
    res.render('signup')
  })
router.post('/signup',async(req,res)=>{
const {first_name,last_name,username,password} = req.body
if(!first_name || !last_name || !username || !password){
    return res.status(400).json({message: 'Some data is missing'})
}
const userDB = await usersManager.findUser(username)
if(userDB){
    return res.status(400).json({message:'Username already used'})
}
const hashPassword = await hashData(password)
const newUser = await usersManager.create({...req.body,password:hashPassword})
res.status(200).json({message: 'User created',user:newUser})
})

router.get('/home',async(req,res)=>{
    const {username} = req.session
    const userDB = await usersManager.findUser(username)
    if(userDB.isAdmin){
        res.redirect('/api/views/adminHome')
    } else {
        res.redirect('/api/views/clientHome')
    }
})

router.get('/clientHome',(req,res)=>{
    res.render('clientHome')
  })

export default router
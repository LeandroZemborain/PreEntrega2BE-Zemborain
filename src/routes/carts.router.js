import { Router } from "express";
import { cartsMongo } from "../managers/CartsMongo.js";

const router = Router()

router.get('/',async(req,res)=>{
  try {
      const courses = await cartsMongo.findAll()
      res.status(200).json({ message: 'cart found', courses })
  } catch (error) {
      res.status(500).json({ error })
  }
})

router.get('/:cid',async(req,res)=>{
  const {id} = req.params
  try {
      const cart = await cartsMongo.findById(id)
  if (!cart) {
    res.status(400).json({ message: 'Invalid ID' })
  } else {
    res.status(200).json({ message: 'cart found', cart })
  }
  } catch (error) {
      res.status(500).json({ error })
  }
})

router.post('/',async(req,res)=>{
  const {prod} = req.body
  if(!prod){
      return res.status(400).json({ message: 'Some data is missing' })
  }
  try {
      const newCourse = await cartsMongo.createOne(req.body)
      res.status(200).json({ message: 'cart created', cart: newCourse })
  } catch (error) {
      res.status(500).json({ error })
  }
})

router.post("/:cid/product/:pid", async (req, res) => {
  let cid = req.params.cid
  let pid = req.params.pid
  try{
  if(cid.length!=24){
      res.status(400).json({mesage:"Put a correct Cart Id"})
      return
  }if(pid.length!=24){
      res.status(400).json({mesage:"Put a correct Prod Id"})
      return
  }
  const cartUpdate = await cartsMongo.updateOne(cid,pid)
  if(cartUpdate=="cart update"){res.status(200).json({mesage:cartUpdate})  }
  else{
      res.status(400).json({mesage:cartUpdate})
  }
   }
  catch (error){ res.status(500).json({ error }) }
})

router.delete("/:cid", async (req, res) => {
  let cid = req.params.cid
  if(cid.length!=24){
   res.status(400).json({mesage:"Put a correct Id"})
   return
  }
  try{
   const del = await cartsMongo.deleteOne(cid)
   if(!del || del.name== "CastError"){
       res.status(400).json({mesage:`no exist a cart whith id ${cid}`})
   }else {res.status(200).json({mesage:"cart deleted"})}
  }
  catch (error){ res.status(500).json({ error }) }
})

router.delete('/:cid/product/:pid',async(req,res)=>{
  const {idCart,idProduct} = req.params
  try {
      await cartsMongo.deleteProduct(idCart,idProduct)
      res.status(200).json({ message: 'Success' })
  } catch (error) {
      res.status(500).json({ error })
  }
})
 

export default router
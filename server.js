import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()


const secretKey = process.env.STRIPE_SECRET_KEY
const publicKey = process.env.STRIPE_PUBLIC_KEY

import Stripe from 'stripe'
var stripe = Stripe(secretKey)

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))



app.get('/store', (req, res) => {
  fs.readFile('items.json', (error, data)=> {
    if(error){
        res.status(500).end()
    } else {
        res.render('store.ejs', {
            stripePublicKey: publicKey,
            items: JSON.parse(data)
        })
    }
  })
})

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if(error) {
            res.status(500).end()
        }else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            
            req.body.items.forEach(function(item) {
                const itemJson = itemsArray.find(function(i) {
                  return i.id == item.id
                })
                return total = total + itemJson.price * item.quantity
            })

            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
              }).then(function() {
                console.log('charge successful')
                res.json({ message: 'successfully purchased items'})
            }).catch(function(){
                console.log('charge fail')
                res.status(500).end()
            })
        }
    })
})


app.listen(3000, ()=>console.log('Server running on Port: 3000'.yellow.bold))


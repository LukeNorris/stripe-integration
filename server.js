import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import fs from 'fs'

// const express = require('express')
// const colors = require('colors')
// const dotenv = require('dotenv')
// const fs = require('fs')



dotenv.config()


const secretKey = process.env.STRIPE_SECRET_KEY
const publicKey = process.env.STRIPE_PUBLIC_KEY

// const stripe = require('stripe')(secretKey)
import Stripe from 'stripe'
var stripe = Stripe(secretKey)

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())


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

app.set('view engine', 'ejs')

app.use(express.static('public'))


app.listen(3000, ()=>console.log('Server running on Port: 3000'.yellow.bold))

// const dotenv = require('dotenv')
  
//   const stripeSecretKey = process.env.STRIPE_SECRET_KEY
//   const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
  
//   const express = require('express')
//   const app = express()
//   const fs = require('fs')
//   const colors = require('colors')
//   const stripe = require('stripe')(stripeSecretKey)

//   dotenv.config()

  
//   app.set('view engine', 'ejs')
//   app.use(express.json())
//   app.use(express.static('public'))
  
//   app.get('/store', function(req, res) {
//     fs.readFile('items.json', function(error, data) {
//       if (error) {
//         res.status(500).end()
//       } else {
//         res.render('store.ejs', {
//           stripePublicKey: stripePublicKey,
//           items: JSON.parse(data)
//         })
//       }
//     })
//   })
  
//   app.post('/purchase', function(req, res) {
//     fs.readFile('items.json', function(error, data) {
//       if (error) {
//         res.status(500).end()
//       } else {
//         const itemsJson = JSON.parse(data)
//         const itemsArray = itemsJson.music.concat(itemsJson.merch)
//         let total = 0
//         req.body.items.forEach(function(item) {
//           const itemJson = itemsArray.find(function(i) {
//             return i.id == item.id
//           })
//           total = total + itemJson.price * item.quantity
//         })
  
//         stripe.charges.create({
//           amount: total,
//           source: req.body.stripeTokenId,
//           currency: 'usd'
//         }).then(function() {
//           console.log('Charge Successful')
//           res.json({ message: 'Successfully purchased items' })
//         }).catch(function() {
//           console.log('Charge Fail')
//           res.status(500).end()
//         })
//       }
//     })
//   })
  
//   app.listen(3000, ()=>console.log('Server running on Port: 3000'.yellow.bold))
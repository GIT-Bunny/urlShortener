const express = require('express')
const dbModel = require('../models/model.url')
const validUrl = require('valid-url')

require('dotenv/config')

const routes = express.Router()


// Routes: Default('/') Method: GET

routes.route('/').get((req, res) => {
    dbModel.find((err, docs) => {
        if (err) {
            return res.status(400).send(JSON.stringify(err))
        } else {
            if (docs.length == 0) {
                return res.status(400).send(`Welcome to The Short-Url \n DB is Empty`)
            } else {
                return res.status(400).send(`Welcome to The Short-Url API \n ${docs}`)
            }
        }
    })
})


// Routes: To get the custom short URL('/:shortURL') Method: GET

routes.route('/:urlCode').get(async (req, res) => {
    const urlCode = req.params.urlCode

    const ifUrlCodeExist = await dbModel.findOne({ urlCode: urlCode })
    
    if (ifUrlCodeExist) {
        res.redirect(`//${ifUrlCodeExist.fullUrl}`)
    } else {
        return res.status(404).send(`${urlCode} not exists`)
    }
})


// Routes: To create a custom short URL and add it to DB('/post') Method: POST

routes.route('/post').post(async (req, res) => {
    const originalUrl = req.body.fullUrl
    let url = originalUrl
    if (validUrl.isUri(url)) {

        if (url.includes(('https://'), 0)) {
            url = url.slice(url.length - (url.length - 8), url.length)
        } else if (url.includes(('http://'), 0)) {
            url = url.slice(url.length -  (url.length - 7), url.length)
        }

        // Checking if the Given URL is already exist on the DB
        const ifUrlExist = await dbModel.findOne({fullUrl : url})
        
        // IF Exist
        if (ifUrlExist) {
            return res.status(200).send(`${url} already exist \n custom short-url ${ifUrlExist.shortUrl}`)
        } else { //IF Not Exist
            const newDBModel = new dbModel({
                originalUrl: originalUrl,
                fullUrl: url
            })
            /*
                Taking the MONGODB ObjectID using (instance._id) 
                and 
                trim it to the length of 7bits and store it in the var id
            */
            short = JSON.stringify(newDBModel._id)
            const id = short.slice(short.length - 8, short.length - 1)

            newDBModel.urlCode = id
            newDBModel.shortUrl = process.env.BASE_URL + '/' + id

            await newDBModel.save()
                .then(() => res.status(200).send(`${url} is stored and custom short-url is ${newDBModel.urlCode}`))
                .catch(err => res.status(400).send(JSON.stringify(err)))
        }
    } else {
        return res.status(404).send('Not a valid URL')
    }
})


// Routes: To delete the whole DB('/del') Method: DELETE

routes.route('/del').delete((req, res) => {
    dbModel.deleteMany((err) => {
        if (err) {
            return res.send(JSON.stringify(err))
        } else {
            res.send('deleted')
        }
    })
})



module.exports = routes
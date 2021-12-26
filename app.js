const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 3001
const cors = require('cors')
const cloneDeep = require('lodash.clonedeep')
const Products = require('./Products')
const Categories = require('./Categories')

app.use(morgan('tiny'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, Obalor!')
})

app.get('/products', (req, res) => {
    const { limit, offset, search, categories } = req.query

    let products = cloneDeep(Products)
    let count = 0 

    if (categories && categories.length) {
        products = products.filter(product => categories.some(id => id == product.category))
    }

    if (search) {
        // сёрчаем
        products = products.filter(product => {
            let concatenated_text = product.name + product.teaset + product.description
            concatenated_text = concatenated_text.toLowerCase()
            const regexp = new RegExp(search.toLowerCase().trim())

            return regexp.test(concatenated_text)
        })
    }

    count = products.length

    const current_page = Math.ceil((offset - 1) / limit)

    products = products.slice(Number(current_page * limit), Number(current_page * limit) + Number(limit))

    products.forEach(product => {
        product.category = Categories.find(category => category.id === product.category)
        
        delete product.description
    })

    res.send({ results: products, count })
})

app.get('/products/:id', (req, res) => {
    const { id } = req.params

    const product = Products.find(product => product.id === id)

    res.send(product)
})

app.get('/categories', (req, res) => {
    res.send(Categories)
})

app.listen(port, () => {
  console.log(`Hello, obalor!`)
})
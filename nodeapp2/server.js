
const express = require('express')
const  bodyParser = require('body-parser')
const axios = require('axios')


const port = 3001
const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    console.log("server 1")
    res.render('book')
})

app.get('/which', (req, res) =>{
    res.send("This is serever 1")
})



// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'content-type': 'text/html' })
//     fs.createReadStream('index.html').pipe(res)
// })


app.post('/bookTrip', async (req, res) => {
    console.log(req.body)

    let userid = req.body['userid']
    let route = req.body['route']
    let city = req.body['city']
    let country = req.body['country']

    axios.post('https://vmr566op8k.execute-api.eu-west-1.amazonaws.com/test/trips', {
        'user_id': userid,
        'route_id': route,
        'country': country,
        'city': city
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        return res.data
    })
    .then(data => {
        console.log(data)
        let return_result = {}

        if (data.trip_id){
            return_result['trip_id'] = data.trip_id
            return_result['city'] = data.city
            return_result['country'] = data.country
            res.send(JSON.stringify({return_result,"Status": "Success" }))
        }
    })
    .catch(error => {
        console.error(error)
        res.send(JSON.stringify({ "Status": `Failure: ${error}` }))
    })
  });





app.post('/getBookedTrips', async (req, res)=> {
    // console.log(req.body)
    let userid = req.body['userid']
    
    axios.get('https://vmr566op8k.execute-api.eu-west-1.amazonaws.com/test/trips?user_id=' + userid)
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        return res.data
    })
    .then(data => {
        console.log(data)
        let return_result = {}

        for (var trip of data.trips) {
            return_result[trip.trip_id] = "" + trip.country + "," + trip.city +"," + trip.route_id
        }

        res.send(JSON.stringify({ return_result,"Status": "Success" }))
    })
    .catch(error => {
        console.error(error)
        res.send(JSON.stringify({ "Status": `Failure: ${error}` }))
    })
  
})





app.post('/cancelTrip', async (req, res)=> {
    console.log(req.body)
    let trip_id = req.body['trip_id']

    axios.delete('https://vmr566op8k.execute-api.eu-west-1.amazonaws.com/test/trips', {
        data: {'trip_id': trip_id}
    })
    .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.data)
    })
    .catch(error => {
        console.error(error)
        res.send(JSON.stringify({ "Status": `Failure: ${error}` }))
    })
})


app.post('/getRoutes', async (req, res)=> {

})



app.listen(port)
  
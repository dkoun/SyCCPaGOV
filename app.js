const https = require("https")
const fs = require("fs")
const express = require('express')
const app = express()
const port = 3001
const { spawn } = require('child_process');   

const filePath = 'cardano-backend/code/enable_exit.txt';
fs.writeFileSync(filePath, 'false');
const cardano = spawn('python3', ['-u', 'cardano-backend/code/vote_process.py']);
cardano.stdout.setEncoding('utf8');
cardano.stdout.on('data', function(data) {
    //Here is where the output goes

    console.log('cardano: ' + data);
});
const ethereum = spawn('node', ['ethereum-backend/code/GetEvents.js']);
ethereum.stdout.on('data', function(data) {
    //Here is where the output goes

    console.log('ethereum: ' + data);
});
const polygon = spawn('node', ['polygon-backend/code/GetEvents.js']);
polygon.stdout.on('data', function(data) {
    //Here is where the output goes

    console.log('polygon: ' + data);
});

https
    .createServer(
        // Provide the private and public key to the server by reading each
        // file's content with the readFileSync() method.
        {
            key: fs.readFileSync("key.pem"),
            cert: fs.readFileSync("cert.pem"),
        },
        app
    )
    .listen(4000, () => {
        console.log("serever is runing at port 4000");
    });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/mint', (req, res) => {
    res.sendFile(__dirname + '/mint.html');
})

app.get('/vote', (req, res) => {
    res.sendFile(__dirname + '/vote_v2.html');
})

app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/styles.css');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/backgroundimg.png', (req, res) => {
    res.sendFile(__dirname + '/backgroundimg.png');
})

app.get('/proposal', (req, res) => {
    res.sendFile(__dirname + '/proposal.html');
})

app.get('/results_json', (req, res) => {
    res.sendFile(__dirname + '/results.json');
})

app.get('/results', (req, res) => {
    res.sendFile(__dirname + '/results.html');
})

app.get('/submitProposal', (req, res) => {
    let duration = req.query.duration;
    let name = req.query.name;
    let description = req.query.description;
    let quadratic = 'false';
    let threshold = req.query.threshold;
    let passwd = req.query.passwd;
    if (passwd === "AlmightyAdmin")
    {
        console.log(duration, name, description, quadratic, threshold);
        const brain = spawn('node', ['brain.js', duration, name, quadratic, threshold, description], { stdio: 'inherit' });
        brain.on('data', function(data) {
            //Here is where the output goes
    
            console.log('brain: ' + data);
        });
        res.send("Proposal submitted successfully!")
    }
    else {
        res.send("Wrong admin token!")
    }
})

var results, countdown, initialCountdown;



const timerFunction = setInterval(function () {


        try {
            let inputD = fs.readFileSync('./results.json')
            results = JSON.parse(inputD);
            // console.log(results)
            initialCountdown = results[0].duration;
            countdown = initialCountdown.valueOf();
            // console.log(inputD.toString());
            console.log(countdown);
            countdown = countdown - 1000 > 1000 ? countdown - 1000 : 0;
            results[0].duration = countdown;
            let fInput = results;
            fs.writeFileSync('./results.json', JSON.stringify(fInput))
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    // }
}, 1000); // updates every 1000 milliseconds or 1 second
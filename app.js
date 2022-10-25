const express = require('express');
const fs = require('fs')
const path = require('path');

const { readCSVfile, processCSVFile, writeFirstFile, writeSecondFile } = require('./helper')

const app = express();

app.use(express.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/process', async (req, res) => {

    const { fileName } = req.body;
    const path = `./csv/${fileName}.csv`;

    if (fs.existsSync(path)) {
        const orders = await readCSVfile(path);
        //check constraint
        if (orders.length === 0 || orders.length > 10000) {
            return res.json(0)
        }
        const result = processCSVFile(orders);
        writeFirstFile(fileName, result.first_CSV_Data);
        writeSecondFile(fileName, result.second_CSV_Data);
        return res.json([`0_${fileName}.csv`, `1_${fileName}.csv`]);
    }
    else {
        return res.json(false)
    }
})


const PORT = 5000;
app.listen(PORT, () => console.log('Server is up on http://localhost:5000'))

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//----------------------------------------------------------------------------------------------------
//Read CSV file****************************************************************************************
//----------------------------------------------------------------------------------------------------
function readCSVfile(filePath) {
    let orders = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({}))
            .on('data', (data) => orders.push(data))
            .on('end', () => {
                resolve(orders);
            })
    })
}

//----------------------------------------------------------------------------------------------------
//Process Data****************************************************************************************
//----------------------------------------------------------------------------------------------------
function processCSVFile(orders) {
    const products = [...new Set(orders.map(o => o.name))];

    const first_CSV_Data = products.map(product => ({
        product_Name: product,
        product_AVG: getProductAverage(product, orders)
    }))

    const second_CSV_Data = products.map(product => ({
        product_Name: product,
        popular_Brand: getPopularBrand(product, orders)
    }))

    return { first_CSV_Data, second_CSV_Data }

}

function getProductAverage(productName, orders) {
    const totalOrders = orders.length;
    const productQuantity = orders.filter(f => f.name === productName).reduce((a, b) => a + Number(b.quantity), 0);
    const productAverage = productQuantity / totalOrders;
    return productAverage;
}

function getPopularBrand(productName, orders) {
    const productBrands = orders.filter(f => f.name === productName).map(m => m.brand);
    const popularBrandIndex =
        productBrands.length > 1
            ?
            productBrands.findIndex((v, idx, brands) => brands.indexOf(v) !== idx)
            :
            0
    return productBrands[popularBrandIndex];
}

//----------------------------------------------------------------------------------------------------
//Write CSV file****************************************************************************************
//----------------------------------------------------------------------------------------------------

function writeFirstFile(fileName, first_CSV_Data) {
    const csvWriter = createCsvWriter({
        path: `./downloads/0_${fileName}.csv`,
        header: [
            { id: 'product_Name', title: 'Name' },
            { id: 'product_AVG', title: 'Average' }
        ]
    });

    csvWriter.writeRecords(first_CSV_Data)
        .then(() => {
            return '...First CSV File Created';
        });
}


function writeSecondFile(fileName, second_CSV_Data) {
    const csvWriter = createCsvWriter({
        path: `./downloads/1_${fileName}.csv`,
        header: [
            { id: 'product_Name', title: 'Name' },
            { id: 'popular_Brand', title: 'Brand' }
        ]
    });

    csvWriter.writeRecords(second_CSV_Data)
        .then(() => {
            return '...Second CSV File Created';
        });
}

module.exports = { readCSVfile, processCSVFile, writeFirstFile, writeSecondFile }
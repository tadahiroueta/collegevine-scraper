const crawler = require('./src/crawler');
const fs = require('fs');
const yargs = require('yargs/yargs');

/**
 * Gets data from multiple colleges
 * 
 * @param {string[]} colleges - Array of college names matching the collegevine.com's
 * @returns {Promise<Object[]>} - Array of objects containing college data
 */
const getCollegesData = async (colleges) => {
    const browser = await crawler.getBrowser();
    return await Promise.all(colleges.map(async (college) => crawler.getCollegeData(college, browser)));
}


/**
 * Converts to CSV
 * 
 * @param {Object[]} data - Array of objects containing college data
 * @returns {string} - CSV string
 */
const toCSV = (data) => {
    const keys = Object.keys(data[0]);
    const csv = [keys.join(',')];

    data.forEach((row) => {
        const values = keys.map((key) => `"${row[key]}"`);
        csv.push(values.join(','));
    });

    return csv.join('\n');
}


// CLI commands and options
const argv = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .command('scrape', 'scrape [options]')
    .example('$0 scrape Stanford-University', 'Scrapes data for Stanford University')
    .example('$0 scrape input', 'Scrapes data from input.txt')
    .alias('s', 'scrape')
    .demandOption(['s']);

const option = argv.argv.s;

(async () => {
    let data
    if (option === 'input') {
        const colleges = fs.readFileSync('data/input.txt', 'utf8').split('\r\n')
        data = await getCollegesData(colleges);
    }
    else data = await getCollegesData([ option.replace('-', ' ') ]);
    
    fs.writeFileSync('data/output.csv', toCSV(data));
    process.exit()
})()
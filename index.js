const { getCollegeData } = require('./crawler');
const fs = require('fs');

/**
 * Gets data from multiple colleges
 * 
 * @param {string[]} colleges - Array of college names matching the collegevine.com's
 * @returns {Promise<Object[]>} - Array of objects containing college data
 */
const getCollegesData = async (college) => {
    return await Promise.all(colleges.map(async (college) => getCollegeData(college)));
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
        const values = keys.map((key) => row[key]);
        csv.push(values.join(','));
    });

    return csv.join('\n');
}

(async () => {
    const colleges = fs.readFileSync('input.txt', 'utf8').split('\n')
    const data = await getCollegesData(colleges);
    fs.writeFileSync('output.csv', toCSV(data));
})
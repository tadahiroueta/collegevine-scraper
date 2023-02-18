const { launch } = require('puppeteer');

const cookies = require('../data/cookies.json');


const EXPLORE_URL = "https://www.collegevine.com/schools/hub/all"
const SIGNS = ["$", ",", "%", "\n", "/ year *"]
const WAIT_OPTIONS = { waitUntil: 'networkidle2', timeout: 0 }
const SELECTORS = { 
    SEARCH: "#react-select-2-input", 

    PAGE_SELECTORS: {
        size: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--overview > div > strong:nth-child(3)",
        setting: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-4 > div.card.t--location > div > div.row.align-items-end > div:nth-child(3) > strong",
        region: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-4 > div.card.t--location > div > div.row.align-items-center > div.col-auto > strong",
        yield: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--admission-stats > div.card-body > div > div:nth-child(2) > div.d-flex.align-items-baseline.mb-4 > div.large.font-weight-bold.fw-bold.mr-1",
        collegeVineChances: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--chancing > div > div.row.align-items-center.mb-3 > div:nth-child(1) > div > div.col-6.order-1.order-lg-2.my-auto > h3",
        acceptance: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--chancing > div > div.row.align-items-center.mb-3 > div.col-12.col-lg-6.py-3.my-auto > h3",
        state: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-4 > div.card.t--location > div > div.row.mb-4 > div.col.pl-0 > div:nth-child(2)",
        difficulty: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--chancing > div > h2",
        cost: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--financials-personal-estimate > div > div.large.font-weight-bold.fw-bold"
}}

/**
 * Gets puppeteer browser
 * 
 * @return {Promise<Browser>} puppeteer browser
 */
const getBrowser = async () => await launch()

/**
 * Crawls into collegevine.com account and scrapes data about college
 * 
 * @param {string} name - exact name according to collegevine.com
 * @param {Browser} browser - puppeteer browser
 * @return {Promise<CollegeData>} { name, isInstitute, size, setting, state, region, cost, yield, collegeVineChances, acceptance }
 */
const getCollegeData = async (name, browser) => {
    const page = await browser.newPage()
    await page.setCookie(...cookies)
    await page.goto(EXPLORE_URL)
    await page.waitForSelector(SELECTORS.SEARCH) // the page may be loading, but at least the search bar will load

    await page.click(SELECTORS.SEARCH, WAIT_OPTIONS)
    await page.keyboard.type(name, WAIT_OPTIONS)
    await page.keyboard.press("Enter", WAIT_OPTIONS)
    
    let data
    try {
        data = { 
            name,
            isInstitute: name.includes("Institute"),
            ...await page.evaluate((SELECTORS, SIGNS) => {
                /**
                 * Removes signs from numbers, but leaves text alone. Also turns percentages to decimals.
                 * 
                 * @param {string} string - string to remove signs from
                 * @return {string} string without signs
                 */
                const clean = string => {
                    // remove unwanted characters
                    for (const sign of SIGNS) string = string.replace(sign, "")
                    
                    // for percentages
                    if (!isNaN(string)) {
                        const number = parseInt(string)
                        if (number <= 100) string = (number / 100).toString()
                    }
                    return string.trim()
                }

                const data = { ...SELECTORS.PAGE_SELECTORS }
                for (const key of Object.keys(data)) {
                    try {
                        data[key] = clean(document.querySelector(data[key]).innerText)
                    }
                    catch (error) {
                        delete data[key]
                    }
                }

                data.state = data.state.split(" ").find(word => word.length === 2 && word == word.toUpperCase()).substring(0, 2) // looks for a two letter word that is all caps
                // data.cost = clean(document.querySelector(data.state === "TX" ? SELECTORS.IN_STATE_COST : SELECTORS.OUT_STATE_COST).innerText) // gets cost based on state

                if (data.difficulty) {
                    const split = data.difficulty.split(" ")
                    data.difficulty = split[split.indexOf("a") + 1]
                    if (data.difficulty === "Hard") data.difficulty = "Hard Target"
                }

                return data
            }, SELECTORS, SIGNS)
    }}
    catch (error) {
        throw error
        console.log(`${name} is an invalid uni name.`)
    }
    page.close()
    return data
}

module.exports = { getCollegeData, getBrowser }
const { launch } = require('puppeteer');

const cookies = require('../data/cookies.json');


const EXPLORE_URL = "https://www.collegevine.com/schools/hub/all"
const SIGNS = ["$", ",", "%"]
const WAIT_OPTIONS = { waitUntil: 'networkidle2', timeout: 0 }
const SELECTORS = { 
    SEARCH: "#react-select-2-input", 
    IN_STATE_COST: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--financials-cost-before-aid > div.card-body > div:nth-child(1) > div.col-auto > strong",
    OUT_STATE_COST: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--financials-cost-before-aid > div.card-body > div:nth-child(3) > div.col-auto > strong",

    PAGE_SELECTORS: {
        size: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--overview > div > strong:nth-child(5)",
        setting: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-4 > div.card.t--location > div > div.row.align-items-end > div:nth-child(3) > strong",
        region: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-4 > div.card.t--location > div > div.row.align-items-center > div.col-auto > strong",
        yield: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--admission-stats > div.card-body > div > div:nth-child(2) > div.d-flex.align-items-baseline.mb-4 > div.large.font-weight-bold.fw-bold.mr-1",
        collegeVineChances: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--chancing > div > div.row.align-items-center.mb-3 > div:nth-child(1) > div > div.col-6.order-1.order-lg-2.my-auto > h3",
        acceptance: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-8 > div.card.t--chancing > div > div.row.align-items-center.mb-3 > div.col-12.col-lg-6.py-3.my-auto > h3",
        state: "div > div > div > div:nth-child(1) > div > div > div > div.mx-auto > div.flex-grow-1.min-height-0.overflow-y-auto.overflow-x-hidden.px-3.pt-4.bg-very-light-grey > div > div.col-12.col-md-4 > div.card.t--location > div > div.row.mb-4 > div.col.pl-0 > div:nth-child(2)"
    }
}

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
    await page.goto(EXPLORE_URL, WAIT_OPTIONS)

    await page.click(SELECTORS.SEARCH, WAIT_OPTIONS)
    await page.keyboard.type(name)
    await page.keyboard.press("Enter", WAIT_OPTIONS)

    const data = { 
        name,
        isInstitute: name.includes("Institute"),
        ...await page.evaluate((SELECTORS, SIGNS) => { 
            /**
             * Removes signs from numbers, but leaves text alone
             * 
             * @param {string} string - string to remove signs from
             * @return {string} string without signs
             */
            const clean = string => {
                for (const sign of SIGNS) string = string.replace(sign, "")
                return string
            }

            const data = { ...SELECTORS.PAGE_SELECTORS }
            for (const key of Object.keys(data)) data[key] = clean(document.querySelector(data[key]).innerText)

            data.state = data.state.split(" ").find(word => word.length === 2 && word == word.toUpperCase()).substring(0, 2) // looks for a two letter word that is all caps
            data.cost = clean(document.querySelector(data.state === "TX" ? SELECTORS.IN_STATE_COST : SELECTORS.OUT_STATE_COST).innerText) // gets cost based on state

            return data
        }, SELECTORS, SIGNS)
    }
    page.close()
    return data
}

module.exports = { getCollegeData, getBrowser }
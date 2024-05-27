# CollegeVine Scraper
***Scraper for personalised CollegeVine data and chances on specified universities***

[Built With](#built-with) · [Features](#features) · [Installation](#installation) · [Usage](#usage)

## Built With
<!-- Find more shield at https://github.com/Ileriayo/markdown-badges?tab=readme-ov-file -->
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## Features

### Headless browser

The scraping is done with [Puppeteer](https://pptr.dev/) that opens a headless browser

![headful](https://github.com/tadahiroueta/collegevine-scraper/blob/master/samples/headful.png)
  > This is headful, otherwise it would be invisible

### Progress Bar

Implemented CLI-Progress' single bar to track progress with scraping and estimate how long it will take

<img src="https://github.com/tadahiroueta/collegevine-scraper/blob/master/samples/progress-bar.png" alt="progress-bar" width="50%" />

### Compatible with spreadsheets

The CSV format for the output allows for easy insertion of data into a spreadsheet for visualisation

![headful](https://github.com/tadahiroueta/collegevine-scraper/blob/master/samples/spreadsheet.png)

## Installation
<!-- Find more language syntax identifiers for code blocks here, https://github.com/jincheng9/markdown_supported_languages -->
1. Install [Node.JS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
    > I personally recommend using Node Version Manager (NVM) [(for Windows)](https://github.com/coreybutler/nvm-windows)

2. Clone repository
    ```sh
    git clone https://github.com/tadahiroueta/collegevine-scraper.git
    ```

3. Install dependencies
    ```sh
    npm install
    ```

4. Get your cookies
    - Sign in/up to [CollegeVine](https://www.collegevine.com/)
    - Fill personal information (e.g. GPA, SAT scores, extracurriculars...)
    - Create a ```data/``` folder inside of the cloned repository
    - Download cookies as a JSON file to ```data/``` folder
        >I recommend using [this Chrome extension](https://chrome.google.com/webstore/detail/%E3%82%AF%E3%83%83%E3%82%AD%E3%83%BCjson%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%87%BA%E5%8A%9B-for-puppet/nmckokihipjgplolmcmjakknndddifde?hl=en)
    - Rename the JSON file to ```cookies.json```

## Usage

### Getting information about one university

1. Run
    ```sh
    node index --scrape "<University Name>"
    ```
      > Use the name as in CollegeVine to avoid null results or results about a different university (e.g. "California Polytechnic State University | Cal Poly")
2. After the scraping finished, you will receive the information about the university in your terminal in JSON format
    ```sh
    node index --scrape "Carnegie Mellon University"
    ████████████████████████████████████████ 100% | ETA: 0s | 1/1[
      {
        name: 'Carnegie',
        isInstitute: false,
        setting: 'Urban',
        region: 'Mid-Atlantic',
        yield: '0.43',
        collegeVineChances: '0.21',
        acceptance: '0.14',
        state: 'PA',
        difficulty: 'Reach',
        cost: '59352'
      }
    ]
    ```
    > Example with Carnegie Mellon University
3. An ```output.csv``` file will also be created in the ```data/``` folder

### Getting information about multiple universities

1. Create an empty ```input.txt``` file in the ```data/``` folder
2. Add a university name on each line
    > Leave no empty lines
    >
    > Use the name as in CollegeVine to avoid null results or results about a different university (e.g. "California Polytechnic State University | Cal Poly")
3. Run
    ```sh
    node index --scrape input
    ```
4. An ```output.csv``` file will be created in the ```data/``` folder after the scraping finishes

    ![csv](https://github.com/tadahiroueta/collegevine-scraper/blob/master/samples/csv.png)

5. I recommend importing the ```output.csv``` file to a spreadsheet for better visualisation
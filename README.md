INTRODUCTION
------------
This app scrapes some stats from individual colleges in collegevine.com allowing you to apply your own cookies and get your personallised acceptance chances.


INSTALMENT
----------
* Install packages with ``` npm install ``` command on terminal
* Cookies
    * Sign in to collegevine.com
    * Enter personal information to your profile to get your personal chances of being accepted into certain colleges
    * Create a ``` data ``` folder
    * Download JSON cookies file to ``` data ``` folder (I recommend using [Export cookie JSON file for Puppeteer](https://chrome.google.com/webstore/detail/%E3%82%AF%E3%83%83%E3%82%AD%E3%83%BCjson%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%87%BA%E5%8A%9B-for-puppet/nmckokihipjgplolmcmjakknndddifde?hl=en) Chrome extension)
    * Hold a solid internet connection


USAGE
-----
Make sure to use the exact name of the university according to collegevine.com (e.g. "California Polytechnic State University | Cal Poly")
Single university: 
    At the terminal execute ``` node index --scrape "<uni name>" ```

Multiple universities:
    Add a ``` input.txt ``` file to the ``` data ``` folder with a university name on each line (with no empty lines).
    At the terminal execute ``` node index --scrape input ```
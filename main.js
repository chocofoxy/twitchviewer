const puppeteer = require('puppeteer');
const fs = require('fs');

const worker = async (ip) => {
    const browser = await puppeteer.launch({
        headless: false,
        //defaultViewport: null,
        args: ['--no-sandbox', '--proxy-server=' + ip, '--disable-web-security', '--allow-file-access-from-files', '--allow-file-access']
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    try {
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.8'
        });
        await page.goto('https://www.twitch.tv/marwen_hm?fbclid=IwAR2j-qgnQa4raaFADCdcXdjYqVdC8j4xGkIixaCxHjqSWjfiCe-oQwNCzCs', {
            waitUntil: 'networkidle2',
            timeout: 4000
        });
        await page.waitFor(40000)
        //await page.close();

    } catch (e) {
        console.log(" error at bot ip", ip);
    } finally {
        await page.close();
        await browser.close();

    }

}


(async () => {

    let proxies = JSON.parse(await fs.readFileSync('proxies.json'))

    let botList = []

    i = 0,
        n = proxies.length;

    while (i < n) {
        botList.push(proxies.slice(i, i += 40));
    }

    //console.log(botList);

    let bot = async (proxylist) => {

        for (let proxy of proxylist) {
            await worker(proxy)
        }

    }


    botList.forEach(proxylist => bot(proxylist))


})()
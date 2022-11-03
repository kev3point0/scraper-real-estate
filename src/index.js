const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = "https://www.kijiji.ca";
const categoryURL = `${baseURL}/b-for-sale/new-brunswick/c30353001l9005`;

(async function main() {
    //await startKijijiScraper();
    await startPropertyGuysScraper();
    //TODO mls.ca
    //await startMLSScraper();
})();

async function startMLSScraper(){

}

async function startPropertyGuysScraper() {
    let pageId = 1;

    //http request here
    const listings =  await queryPropertyGuysAPI(pageId);

    //interesting metrics here
    //check this every 24 hours to see listings amount during recession
    const totalListingsInNB = listings.listingSearchResult.total;

    const listingList = listings.listingSearchResult.listingList;
    console.log(listingList);

    //I think I should just send all json to elastic search without parsing it!?!???!!
    for (const listing in listingList){

        //send to elastic search
        console.log(listing);
        console.log(`--------------------------------------------------------------------------`);
    }
};

async function queryPropertyGuysAPI(pageId) {
    const result = await fetch("https://propertyguys.com/api/v1/listings/search", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-user-access-token": "504852:zmHAzSixx6eu8VQmTqXR",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://propertyguys.com/search/ca/nb/",
        "body": "search_filter%5BcountryId%5D=1&search_filter%5BprovinceId%5D=4&page=" + pageId + "&size=11&api_key=37a742b97452d422264cd602f4a442d9023786611fa5",
        "method": "POST",
        "mode": "cors"
    });

    return JSON.parse(await result.text());
}

async function startKijijiScraper() {
    try {

        //do http request
        const html = await axios.get(categoryURL);

        //send data to cheerio parser
        const $ = cheerio.load(html.data);

        //css selector for all regular ads in page
        const ads = $('.regular-ad');
        console.log(`ads length ${ads.length}`);

        //loop through all regular ads
        for (const ad of ads) {

            //just send entire ad to elastic search instead of below parsers
            
            //get info from ads page for each ad
            const ad_url = getAdURL($, ad);
            const title = getAdTitle($, ad);
            const price = getAdPrice($, ad);
            const location = getAdLocation($, ad);
            const description = getAdDescription($, ad);
            console.log(location);
            const rental_info = getAdRentalInformation($, ad);
            const ad_id = getAdID(ad_url);
            const userId = await getUserID(ad_url);

            await new Promise(resolve => setTimeout(resolve, 1000));

            //query kijiji api for user info instead of parsing html
            //save all regular ads. then query all unique owners then crunch those numbers for that day
            let userInfo = await getUserInfoFromKijijiGraphQL(userId);
            userProfileName = userInfo.data.findProfile.profileName;
            //userProfileType = userInfo.data.findProfile.profileType;
            userAmountOfAds = userInfo.data.findProfile.numberOfOrganicAds;
            //userMemberSince = userInfo.data.findProfile.memberSince;
            console.log(userInfo);

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (ex) {
        console.log(ex);
    }
}

function getAdURL($, element) {
    return $(element).find('a').attr('href');
}

async function getUserID(ad_url) {
    const singleAdHtml = await axios.get(`${baseURL}${ad_url}`);
    let sel = cheerio.load(singleAdHtml.data);
    const result = sel('div').find('[class^="root-"]');
    const userProfileUrl = sel(result[2]).find('[class^="link-"]').attr('href');
    const userId = userProfileUrl.split("/")[2];
    return userId;
}

function getAdID(ad_url) {
    return ad_url.split("/")[ad_url.split("/").length - 1];
}

function getAdRentalInformation($, element) {
    return $(element).find('.rental-info').text().replace(/\s\s+/g, '');
}

function getAdDescription($, element) {
    return $(element).find('.description').text().replace(/\s\s+/g, '');
}

function getAdLocation($, element) {
    return $(element).find('.location').text().replace(/\s\s+/g, '');
}

function getAdPrice($, element) {
    return $(element).find('.price').text().replace(/\s\s+/g, '');
}

function getAdTitle($, element) {
    return $(element).find('.title').text().replace(/\s\s+/g, '');
}


//TODO make dynamic referrer
async function getUserInfoFromKijijiGraphQL(userId) {
    const fetchRes = await fetch("https://www.kijiji.ca/anvil/api", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0",
            "Accept": "*/*",
            "Accept-Language": "en",
            "content-type": "application/json",
            "lang": "en",
            "ssr": "false",
            "apollo-require-preflight": "true",
            "x-ecg-platform": "DESKTOP",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "referrer": "https://www.kijiji.ca/v-maison-a-vendre/edmundston/home-for-sale-with-large-land-and-waterfalls/1631627817",
        "body": "[{\"operationName\":\"GetProfile\",\"variables\":{\"userId\":" + userId + "},\"query\":\"query GetProfile($userId: Long) {\\n  findProfile(id: $userId) {\\n    ...CoreProfile\\n    numberOfOrganicAds\\n    responsiveness\\n    replyRate\\n    __typename\\n  }\\n}\\n\\nfragment CoreProfile on Profile {\\n  companyName\\n  displayName\\n  id\\n  isAdmarkt\\n  isReadIndicatorEnabled\\n  isSfidEnabled\\n  memberSince\\n  photoUrl\\n  profileName\\n  profileType\\n  __typename\\n}\\n\"}]", "method": "POST",
        "mode": "cors"
    });
    let result = await fetchRes.text();

    result = result.replace(/[[\]]/g, '');
    result = JSON.parse(result);
    return result;
}

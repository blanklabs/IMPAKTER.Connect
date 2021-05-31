import { Transport, transportCodes, generalCases } from "../../SHARED.CODE/index.mjs";
import { fetchNews } from '../integration/news.js';


async function getNews(req, res) {
    let response = new Transport();

    if (req.params.ID) {
        let news = await fetchNews(req.params.ID);
        if (news.length != 0) {
            response.data = news;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.SUCCESS;
            response.status.message = "News fetched Successfully";
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = generalCases.FAILED;
            response.status.message = "Failed to fetch news";
        }
    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = generalCases.FAILED;
        response.status.message = "Insufficient data";

    }
    res.json(response);

}


export { getNews }
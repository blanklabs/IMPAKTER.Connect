import { Transport, transportCodes, User, loginCases, signupCases, signupModel } from "../../SHARED.CODE/index.mjs";
import { fetchNews } from '../integration/news.js';


async function getNews(req, res) {
    let response = new Transport();

    if (req.params.ID) {
        let news = await fetchNews(req.params.ID);
        if (news != 0) {
            response.data = news;
            response.status.code = transportCodes.SUCCESS;
            response.status.case = signupCases.SUCCESS;
            response.status.message = "News fetched Successfully";
        }
        else {
            response.status.code = transportCodes.SUCCESS;
            response.status.case = signupCases.FAILED;
            response.status.message = "Failed to fetch news";
        }
    }
    else {
        response.status.code = transportCodes.SUCCESS;
        response.status.case = signupCases.FAILED;
        response.status.message = "Insufficient data";

    }
    res.json(response);

}


export { getNews }
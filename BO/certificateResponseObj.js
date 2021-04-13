class CertificateResponse {
    constructor(details,sdgs,sdgTargets,industries,industrySectors,documents){
        this.details = details
        this.sdgs = sdgs
        this.sdgTargets = sdgTargets
        this.industries = industries
        this.industrySectors = industrySectors
        this.documents = documents
    }

}

module.exports = CertificateResponse

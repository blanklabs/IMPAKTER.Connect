var pool = require("../db_connection")


exports.getSdgs = async function(certificateID) {
    var sdgs = []
    sql_resp2 = await pool.query('select sdgID from certificate_sdg where certificateID = ?', certificateID)
    for(i = 0; i < sql_resp2.length; i++) {
        sdgs.push(sql_resp2[i].sdgID)
        console.log('sdgs:', sdgs)
        console.log('sql_response2:', sql_resp2)
    }
    return sdgs
}

exports.getSdgTargets = async function(certificateID){
    var sdgTargets = []
    sql_resp = await pool.query('select sdgTargetID from certificate_sdgTarget where certificateID = ?', certificateID)
    sdgTargets.push(sql_resp3)
    console.log('sql_response3:', sql_resp3)
}


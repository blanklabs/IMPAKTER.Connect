class Transport {

    status = {
        code: codes.DEFAULT, case: "", message: ""
    }
    data = {}

constructor(){

}


}

const codes = {
	SUCCESS: 1,
	FAILURE: 0,
    DEFAULT: null
}

module.exports = {Transport, codes }
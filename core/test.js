
async function elements(req, res) {

    let response = [{ name: "Record2", id: 1 }, { name: "Tracker2", id: 2 }]
    console.log("fetched elemets successfully")
    res.json(response);

}


export { elements }
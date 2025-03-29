
// task 10
module.exports = function jsonHandler(req, res){

    let result = {}
    req.on('data', (chunk) => {
        Object.assign(result, JSON.parse(chunk))
    })
    
    

    req.on('end', () => {
        let resObj = {
            __comment: result.__comment,
            x_plus_y: result.x + result.y,
            concat_s_o: `${result.s} ${result.o.surname} ${result.o.name}`,
            length_m: result.m.length
        }

        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(resObj))
    })
}
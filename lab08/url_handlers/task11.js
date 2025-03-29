const xml2js = require('xml2js');
const xmlbuilder = require('xmlbuilder')


// Функция для парсинга XML
const parseXML = (xml) =>
    new Promise((resolve, reject) => {
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
// task 11
module.exports = function xmlHandler(req, res){
    let body = ""

    req.on('data', (chunk) => {
        body += chunk
    })



    req.on('end', async () => {
        try {
            // Парсинг входного XML
            const parsedRequest = await parseXML(body);
            const request = parsedRequest.request;

            // Извлечение значений из элементов <x> и <m>
            const xValues = request.x ? [].concat(request.x).map((x) => parseInt(x.$.value)) : [];
            const mValues = request.m ? [].concat(request.m).map((m) => m.$.value) : [];

            // Подсчет суммы и конкатенации
            const sum = xValues.reduce((acc, val) => acc + val, 0);
            const concat = mValues.join("");

            // Создание ответа в формате XML
            const responseXML = xmlbuilder
                .create("response")
                .ele("sum", { element: "x", result: sum })
                .up()
                .ele("concat", { element: "m", result: concat })
                .end({ pretty: true });

            // Отправка ответа
            res.writeHead(200, { "Content-Type": "application/xml" });
            res.end(responseXML);
        } catch (error) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Server error");
            console.error("Error processing request:", error);
        }
    })

}
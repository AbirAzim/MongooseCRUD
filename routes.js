const fs = require('fs');

const routes = (req, res) => {


    if (req.url === '/') {
        res.setHeader('content-type', 'text/html');
        res.write('<html>');
        res.write('<title>Server</title>')
        res.write('<body>');
        res.write('<form action="/messaage" method="POST">')
        res.write('<input type="text" name="message2">');
        res.write('<button type="submit">Send</button>')
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    if (req.url === '/messaage' && req.method === 'POST') {

        let body = [];
        let parsedBody;

        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        })

        req.on('end', () => {
            parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            fs.writeFile('data.txt', parsedBody.slice(9), () => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });

        })

        // res.setHeader('content-type', 'text/html');
        // res.write('<html>');
        // res.write('<title>Server</title>')
        // res.write('<body>');
        // res.write(`<h1>badhon</h1>`)
        // res.write('</body>');
        // res.write('</html>');
        // return res.end();
    }

}

module.exports = {
    routes,
    someText: 'i am bk'
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

var fs = require('fs');
const { Parser } = require('json2csv');

export default function handler(req, res) {
  if (req.method === 'POST') {

    // Handle a POST request
    res.status(200).json({ message: 'You have hit the POST route' })
    const data = req.body;
    const { total, name } = data;

    const myData = [
      {
        total,
        name
      }
    ];

    var newLine = '\r\n';
    
    const json2csvParser = new Parser({ fields, header: false, delimiter: "|" });
    const myCsv = json2csvParser.parse(myData) + newLine;

    var fields = ['Total', 'Name'];

    fs.stat('file.csv', function (err, stat) {
      if (err == null) {
        console.log('File exists');

        fs.appendFile('file.csv', myCsv, function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
      } else {
        //write the headers and newline
        console.log('New file, just writing headers');
        fields = fields + newLine;

        fs.writeFile('file.csv', fields, function (err) {
          if (err) throw err;
          console.log('file saved');
        });
      }
    });

  } else if (req.method === 'GET'){
    // Handle a GET request

    const csv = fs.readFileSync("file.csv");

    var lines = csv.toString().split("\r\n");
    // console.log(lines);

    var result = [];
    var headers=lines[0].split("|");

    
    for(var i=1;i<lines.length;i++){
      var obj = {};
      var currentline=lines[i].split("|");
    
      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
    
      result.push(obj);
    }
    
    // console.log(result);
    // var json = JSON.stringify(result); //JSON

    // var preData = json.replace(/\"/g, '');
    // var finalData = preData.replace(/\\/g, '');
    // console.log(finalData);
    res.status(200).json({ result });

  }
}

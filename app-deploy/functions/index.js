"use strict";
var functions = require('firebase-functions');


const gcs = require('@google-cloud/storage')();


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
})


exports.test  = { ipa: functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
})};

exports.env  = functions.https.onRequest((request, response) => {


    var requestParams = ['query','baseUrl','fresh','hostname','ip','cookies',
        'ips','method','body','originalUrl','params','path','protocol','root','secure','subdomains'];

    var req = {};

    requestParams.forEach( par => {
        var val = request[par];
        if (val) req[par] = val;
    });

  response.send({
            env: process.env,
            req: req,
            gcs: gcs
        });
});

exports.listBuckets  = functions.https.onRequest(
    (request, response) => {
        gcs.getBuckets().then(function(res){
        response.send({
            env: process.env,
            //url: url,
            buckets: res
        });
    });
});


exports.listBucketContents  = functions.https.onRequest((request, response) => {

    var gcs2 = require('@google-cloud/storage')();
	//var url = 'gs://askme-9aa36.appspot.com/';

    gcs2.bucket('askme-9aa36.appspot.com')
        .getFiles(function(err,files){
            response.send({err:err,files:files,gcs: gcs2});
        });
});

exports.listFiles  = functions.https.onRequest((request, response) => {

    var bucket = gcs.bucket('askme-9aa36.appspot.com');
    bucket.getFiles(function(err,files){
        var data = [];
        files.forEach(function(item){
            data.push(item.metadata);
        });
        response.send({err:err,files:data});
    });
});


exports.get  = functions.https.onRequest((request, response) => {

    var bucket = gcs.bucket('askme-9aa36.appspot.com');

    var path = request.query.path || request.path;

    if (path && path[0] === '/') path = path.substring(1);

    var file  = bucket.file(path);

    file.getMetadata(function(err,data){

        //response.setHeader('content-type', data.contentType);
        //response.setHeader('Content-Length', data.size);
        //response.setHeader('Content-Disposition', data.contentDisposition);

        file.createReadStream()
            .on('error', function(err) {
                response.send({err: err});
            })
            .on('response',function(responseData){
                console.log(responseData.headers);

                var headers = ['content-type','content-disposition','content-length','last-modified','expires','date'];
                headers.forEach((header) => {
                    var val = responseData.headers[header];
                    if (val) response.setHeader(header, val);
                });

            })
            .pipe(response);
    });
});
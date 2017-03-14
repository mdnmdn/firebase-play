exports.install = function() {
	F.route('/', view_index_firebase);
    F.route('/status*', view_index_status);
    F.route('/get*', view_index_get);
	// or
	// F.route('/');
};

function view_index() {
	var self = this;
	self.view('index');
}


const storage = require('@google-cloud/storage');

const gcs = storage({
    keyFilename: './fb-creds-askme-9aa36-firebase-adminsdk-qn1xy-3345c03b19.json',
    projectId: 'askme-9aa36'
});

const bucket = gcs.bucket('askme-9aa36.appspot.com');



function view_index_firebase() {
    var self = this;

    //bucket.getFiles()
    //    .then(function(f){
    //        console.log(f);
    //    });

    bucket.getFiles(function(err,files){

        files.forEach(function(e) {
            e.bucket   = null;
            e.storage  = null;
            //e.metadata = null;
            e.parent   = null;
            e.methods  = null;
            e.acl      = null;
        });

        const model = {err,files};
        self.view('index', model);

    });
}

function view_index_status(){
    var self = this;
    self.json({
        uri: self.uri,
        url: self.url,
        query: self.query
    });
}

function view_index_get(){
    var self = this;

    //self.json(bucket);

    const file  = bucket.file(self.query.path);

    file.getMetadata(function(err,data){
        //self.json({err:err,data:data});
        self.res.setHeader('content-type', data.contentType);
        self.res.setHeader('Content-Length', data.size);
        self.res.setHeader('Content-Disposition', data.contentDisposition);
        //self.res.pipe(data.createReadStream());

        var count = 0;

        file.createReadStream()
            .on('error', function(err) {
                self.json({err: err});
            })
            .on('response',function(response){
                //console.log(response.headers);
                //self.res.setHeader('content-type', data.contentType);
                //self.res.setHeader('Content-Length', data.size);
                //self.res.setHeader('Content-Disposition', data.contentDisposition);

                var headers = ['content-type','content-disposition','content-length','last-modified','expires','date'];
                headers.forEach(function(header){
                    var val = response.headers[header];
                    if (val) self.res.setHeader(header, val);
                });

            })
            .pipe(self.res);
    });

}

function view_index_get_manual(){
    var self = this;

    //self.json(bucket);

    const file  = bucket.file(self.query.path);

    file.getMetadata(function(err,data){
        //self.json({err:err,data:data});
        //res.setHeader('content-type', data.contentType);
        //res.setHeader('Content-Length', data.size);
        //self.res.pipe(data.createReadStream());

        var count = 0;

        file.createReadStream()
            .on('error', function(err) {
                self.json({err: err});
            })
            .on('response', function(response) {
                console.log('resp',response);
            })
            .on('data', function(chunk) {
                console.log('data',chunk);
                count += chunk.length;
            })
            .on('end', function() {
                console.log('end');
                self.json({
                    mode: 'done',
                    length: count,
                    metadata: data
                });
            });

    });

}
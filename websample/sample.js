
const admin = require("firebase-admin");
const serviceAccount = require("./fb-creds-askme-9aa36-firebase-adminsdk-qn1xy-3345c03b19.json");
const storage = require('@google-cloud/storage');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'askme-9aa36'
});


// https://firebasestorage.googleapis.com/v0/b/askme-9aa36.appspot.com/o/pippo%2Fsheepstyle.jpg?alt=media&token=06eeb8b9-7adf-4e26-809f-15a311065b7c
const gcs = storage({
    keyFilename: './fb-creds-askme-9aa36-firebase-adminsdk-qn1xy-3345c03b19.json',
    projectId: 'askme-9aa36'
});

//const gcs = storage(serviceAccount);
//gs://askme-9aa36.appspot.com/pippo/

const bucket = gcs.bucket('askme-9aa36.appspot.com');


bucket.getFiles()
    .then(function(f){
       console.log(f);
    });

bucket.getFiles(function(err,files){
    if (err) {
        console.log('err',err);
        return;
    }

    console.log('files2',files);

});





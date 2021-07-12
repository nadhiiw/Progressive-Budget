let db;
const request = indexDB.open("budget",1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending",{autoIncreament: true});
};

request.onsuccess = function (event) {
    db = event.target.result;

    //to check if the app is online before reading from db
    if(navigator.onLine){
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log("Woops!" + event.target.errorCode);
};
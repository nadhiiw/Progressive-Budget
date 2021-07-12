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

function saveRecord(record) {
    const transaction = db.transaction(["pending"],"readwrite");
    const store = transaction.objectStore("pending");
   
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwritr");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
            .then(() => {
            // delete records if successful
            const transaction = db.transaction(["pending"], "readwrite");
            const store = transaction.objectStore("pending");
            store.clear();
            });
        }
    };
}

function deletePending() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.clear();
  }
  
  // listen for app coming back online
  window.addEventListener("online", checkDatabase);

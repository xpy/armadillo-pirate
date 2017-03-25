var Db = (function () {

    let dbInstance;

    return function (dbName, tables) {

        let self = this;

        function getStoreObject(tableName) {
            let transaction = dbInstance.transaction(tableName, "readwrite");
            return transaction.objectStore(tableName);
        }

        this.dbName = dbName;
        this.tables = Array.isArray(tables) ? tables : [tables];

        this.init = function () {
            let openRequest = indexedDB.open(this.dbName, 1);

            openRequest.onupgradeneeded = function (e) {
                dbInstance = e.target.result;
                for (let table of this.tables) {
                    this.addTable(table);
                }
            }.bind(this);

            openRequest.onsuccess = function (e) {
                console.log("running onsuccess");
                dbInstance = e.target.result;


            }.bind(this);

            openRequest.onerror = function (e) {
                //Do something for the error
            };


        }.bind(this);

        this.getInstance = function () {
            return dbInstance;
        };

        this.addTable = function (tableName) {
            dbInstance.createObjectStore(tableName, {autoIncrement: true});
        };

        this.add = function (tableName, data) {
            let request = getStoreObject(tableName).add(data);

            request.onerror = function (e) {
                console.log("Error", e.target.error.name);
                //some type of error handler
            };

            request.onsuccess = function (e) {
                console.log("Woot! Did it");
            }
        };

        this.list = function (tableName) {
            let store = getStoreObject(tableName),
                results = [];

            store.openCursor().onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    console.log(cursor.value);
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    console.info('DONE');
                }
            };
            return results;

        }

    }

})();


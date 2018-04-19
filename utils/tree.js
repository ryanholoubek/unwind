var restaurants = require("../json/restaurant_example.json");
var utils = require("./utils");
var fs = require('fs');

//vars
var flatArray = [];
var rebuildTreeArray = [];


exports.breakTreeApart = function() {

    //reset vars
    flatArray = [];

    //resursivent break tree apart
    buildTreeRecursively("", restaurants);

    //loop through the flat array and write file to the filesystem
    for (var key in flatArray) {

        if (key) {
            utils.writeFile(key, flatArray[key]);
        }
    }

    console.log("BREAK JSON AND DEPOSIT TO OUTPUT FOLDER!");

    return true;

};

exports.rebuildTree =  function (nameArray) {

    //reset vars
    rebuildTreeArray = [];

    //iterate over all the files and then recusively build out the tree
    for (var name in nameArray) {

        var content = fs.readFileSync("./output/" + nameArray[name] + '.json')
        content = JSON.parse(content)
        for (var arrayElement in content) {
            rebuildTreeRecursively(nameArray[name], content[arrayElement], content[arrayElement]["_parentId"], rebuildTreeArray);
        }
    }

    console.log("REBUILD JSON FROM OUTPUT FOLDER!");

    return true;
};

function buildTreeRecursively (name, obj, parent_id, type) {

    //declare vars
    var final = {};

    //set vars
    final["_id"] = utils.guid();
    final["_parentId"] = parent_id;

    //loop through items of the array
    for (var key in obj) {
        //if obj has var then iterate through
        if (obj.hasOwnProperty(key)) {

            //if array or object
            if (Array.isArray(obj[key]) || (typeof obj[key] == "object" && obj[key] !== null)) {

                var newName = name;
                //if key is a not a number and name is passed in concat with _ to export to proper file name
                if (isNaN(key)) {
                    if (name)
                        newName = name + "_" + key;
                    else
                        newName = key;
                }

                var newParentId = final["_id"];

                // the recursive loop needs a little refactoring.  This can be more elegant and more robust
                if (Array.isArray(obj[key])) {

                    if (type && type == 'object') {
                        newParentId = final["_parentId"];
                    }

                    for (var arrayObject in obj[key]) {
                        //if array
                        buildTreeRecursively(newName, obj[key][arrayObject], newParentId, 'array');
                    }
                } else {
                    //if object recusively keep building
                    buildTreeRecursively(newName, obj[key], newParentId, 'object');
                }

            } else {
                //set item to object
                final[key] = obj[key];
            }
        }

    }

    //check if final flat array has been instantiated
    if (!flatArray[name]) {
        flatArray[name] = [];
    }


    //only add the final object that have more than the declared _id and _parent
    if (Object.keys(final).length > 2) {
        flatArray[name].push(final);
    }

}


function rebuildTreeRecursively(key, objArray, parentId, currentArray) {

    //declare vars
    var nameArray = key.split("_");
    var name = nameArray[nameArray.length - 1];

    //if the first object in the tree just assign to the empty array
    if (nameArray.length == 1) {
        if (currentArray[name] == undefined) {
            currentArray[name] = [];
        }
        currentArray[name].push(objArray);

    } else if (typeof(objArray) == "object" && objArray !== null) {

        for (var arrayNode in currentArray) {

            //check for the current object is an array and recurse
            if (Array.isArray(currentArray[arrayNode])) {
                rebuildTreeRecursively(key, objArray, parentId, currentArray[arrayNode]);
            } else {

                //if the item is an object check to see if the object has the same parent_id
                if (currentArray[arrayNode]["_id"] == parentId) {

                    //if the object has not be instantiated
                    if (currentArray[arrayNode][name] == undefined) {
                        currentArray[arrayNode][name] = [];
                    }

                    //add object to array
                    currentArray[arrayNode][name].push(objArray);


                } else { //check the rest of the object to see if there is more arrays
                    for (var item in currentArray[arrayNode]) {
                        if (Array.isArray(currentArray[arrayNode][item])) {
                            rebuildTreeRecursively(key, objArray, parentId, currentArray[arrayNode][item]);
                        }
                    }
                }

            }

        }

    }

    for (var name in rebuildTreeArray) {
        console.log("rebuildTreeArray :: " + name + " : " + JSON.stringify(rebuildTreeArray[name]));

        var json = {};
        json[name] = rebuildTreeArray[name]
        utils.writeFile("output", json)
    }

}



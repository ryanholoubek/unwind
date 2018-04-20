

# Unwind challenge

# install dependencies
`npm install`

# Given a deeply nested JSON object, write code to flatten out the JSON and split it up into individual JSON objects with one level of nesting. The child objects generated from the JSON should be such that the original JSON can be reconstructed.
# To run the tests below uncomment this line below in the index.js file
`tree.breakTreeApart();`

# Your code should take in the flattened JSONs that you generated as input and be able to reconstruct the original JSON.
# To run the tests below uncomment this line below in the index.js file
`tree.rebuildTree(["restaurants", "restaurants_address", "restaurants_grades", "restaurants_grades_score"]);`

# to run the two differt parts above ^^
`node index`

# notes:  I need to refactor the recusive loops.  I am not satisfied them.  
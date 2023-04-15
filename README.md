# capstone

GET /restaurant - This route returns an array of restaurant objects that hold the id, name and description of each restaurant. This route does not need any input

GET /restaurant/:restaurantId - This route returns a single restaurant object that includes all the details of a restaurant including the location and type of food. This route takes in the restaurant id as a path parameter.

POST /restaurant - This route adds a new restaurant to the database. It takes in the details of the restaurant as input in the request body. The body of the restaurant includes the name and the description of the restaurant.

PUT /restaurant/:restaurantId - This route updates an existing restaurant. It takes in the id  of the restaurant to update as a path parameter, and the new restaurant name and description in the request body.

DELETE /restaurant/:restaurantId - This route deletes an existing restaurant. It takes in the id of the restaurant to delete as a path parameter.

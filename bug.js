```javascript
// Assuming you have a MongoDB collection named 'users'

db.users.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productIds",
      foreignField: "_id",
      as: "purchasedProducts"
    }
  },
  {
    $unwind: "$purchasedProducts" //This is where the error might occur if productIds is empty 
  },
  {
    $group: {
      _id: "$_id",
      totalSpent: {
        $sum: "$purchasedProducts.price" 
      }
    }
  }
]);
```
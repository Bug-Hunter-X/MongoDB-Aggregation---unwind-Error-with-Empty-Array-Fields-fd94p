```javascript
// Solution using $ifNull
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
    $addFields: {
      purchasedProducts: { $ifNull: [ "$purchasedProducts", [] ] }
    }
  },
  {
    $unwind: "$purchasedProducts"
  },
  {
    $group: {
      _id: "$_id",
      totalSpent: {
        $sum: { $ifNull: [ "$purchasedProducts.price", 0 ] }
      }
    }
  }
]);

//Alternative solution using $cond
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
    $unwind: {
      path: "$purchasedProducts",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
        _id: "$_id",
        totalSpent: { $sum: { $cond: { if: { $isArray: "$purchasedProducts" }, then: { $ifNull: [ "$purchasedProducts.price", 0 ] }, else: 0 } } }
    }
  }
]);
```
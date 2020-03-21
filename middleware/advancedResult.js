const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //copy req.query
    const reqQuery = { ...req.query };
  
    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
  
    //Loop over removeFiels and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
  
    //Create query stirng
    let queryStr = JSON.stringify(reqQuery);
  
    //Create operator
    //queryStr = queryStr.replace(/\(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
    //make get data
    query = model.find(JSON.parse(queryStr));
  
    //Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
  
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
  
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate);
    }
  
    const results = await query;
  
    //Paginatiion result
    const paginatiion = {};
  
    if (endIndex < total) {
      paginatiion.next = {
        page: page + 1,
        limit
      }
    }
    if (startIndex > 0) {
      paginatiion.prev = {
        page: page - 1,
        limit
      }
    }

    res.advancedResults = {
        sucess: true,
        count: results.length,
        paginatiion,
        data: results
    }
    next();
};

module.exports = advancedResults;
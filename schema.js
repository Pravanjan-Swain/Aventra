const Joi = require('joi');

module.exports.listingSchema = Joi.object({   //to Joi an object should come whose name is listing
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image : Joi.string().allow("",null), // Mongoose will add default value to it
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required(), // the losting object is itself required
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
})

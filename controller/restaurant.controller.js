import { Restaurant } from '../model/restaurant.model.js'

const getAllResataurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.find();
        if (!restaurant) {
            return res.status(404).json({ messsage: 'no restaurant found' })
        }
        return res.status(200).json({ message: "restaurant fetched successfully", restaurant: restaurant })
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}

const resaturantById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" });
        }
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        return res.status(200).json({ message: "restarant fetched successfully", restaurant: restaurant })
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}

const addRestaurant = async (req, res) => {
    try {
        const { name, location, description, rating, review, menu, openingHours } = req.body;
        if (!location || !name || !openingHours) {
            return res.status(400).json({ message: "location, name and opening Hours fields are required" });
        }
        const { address, city, state, zipcode, country } = location;
        const existingRestaurant = await Restaurant.findOne({ name: name, "location.address": address, "location.city": city, "location.state": state, "location.zipcode": zipcode, "location.country": country });
        if (existingRestaurant) {
            return res.status(400).json({ message: "restaurant with same details already exists" });
        };
        const newRestaurant = new Restaurant({
            name: name,
            location: {
                address: address,
                city: city,
                state: state,
                zipcode: zipcode,
                country: country
            },
            description: description,
            rating: rating,
            review: [],
            menu: [],
            openingHours: openingHours
        })
        await newRestaurant.save();
        return res.status(200).json({ message: "restaurant added successfully", restaurantDetails: newRestaurant })
    } catch (error) {
        return res.status(500).json({ message: "internal server error ", error: error.message });
    }
}

const updateRestaurant = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" });
        }
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        const { description, openingHours, menu } = req.body;
        if (!description && !openingHours && !menu) {
            return res.status(400).json({ message: "Provide at least one of the following fields: description, openingHours, menu" });
        }
        if (description) {
            restaurant.description = description;
        }
        if (openingHours) {
            restaurant.openingHours = openingHours;
        }
        if (menu) {
            restaurant.menu = menu;
        }

        return res.status(200).json({ message: "details of restaurant updated suceesffully", restaurant: restaurant });
    } catch (error) {
        return res.status(500).json({ message: 'internal server error ', error: error.message })
    }
}

const deleteRestaurant = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" })
        }
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        await Restaurant.findByIdAndDelete(id);

        return res.status(200).json({ message: "restaurant deleted successfully", restaurant: restaurant })
    } catch (error) {
        return res.status(500).json({ message: "internal server error, something went wrong", error: error.message })
    }
}

const resturantMenu = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" })
        }
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        return res.status(200).json({ message: "restaurant menu fetched successfully", Menu: restaurant.menu })
    } catch (error) {
        return res.status(500).json({ message: "internal server error, something went wrong", error: error.message })
    }
}


const addDishTMenu = async (req, res) => {
    try {
        const { dish, type, price, description, avatar } = req.body;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" })
        }
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        restaurant.menu.push({ dish, type, avatar, price, description });
        await restaurant.save();
        const newDish = restaurant.menu[restaurant.menu.length - 1];
        return res.status(200).json({ message: "dish added successfully", dish: newDish })

    } catch (error) {
        return res.status(500).json({
            message: `internal server error, something went wrong`, error: error.message
        })
    }
}

const deleteDish = async (req, res) => {
    try {
        const dishid = req.params.dishid;
        const id = req.params.id;

        if (!id || !dishid) {
            return res.status(400).json({ message: "Both id and dishid are required" });
        }

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: "No restaurant found for the given id" });
        }

        const dishIndex = restaurant.menu.findIndex(dish => dish._id.toString() === dishid);

        if (dishIndex === -1) {
            return res.status(404).json({ message: "No dish found for the given dishid" });
        }

        restaurant.menu.splice(dishIndex, 1); // Remove the dish from the menu array

        await restaurant.save(); // Save the updated restaurant

        res.json({ message: "Dish deleted successfully", dish: dishIndex });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error, something went wrong", error: error.message });
    }

}
const uploadReview = async (req, res) => {
    try {
        const review = req.body;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" })
        };
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        restaurant.reviews.push(review.review);
        await restaurant.save();
        const newReview = restaurant.reviews[restaurant.reviews.length - 1];
        return res.status(200).json({ message: "review added successfully", review: newReview })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `internal server error, something went wrong`, error: error.message })
    }
}
const getAllReviews = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "provide restaurant id, restaurant id is required" })
        };
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "no restaurant find for the given id" })
        }
        const reviews = restaurant.reviews;
        return res.status(200).json({ message: "Restaurant fetched successfully", numberOfReviews: reviews.length, reviews: reviews });
    } catch (error) {
        return res.status(500).json({ message: `internal server error, something went wrong`, error: error.message })
    }
}


export { getAllResataurant, resaturantById, addRestaurant, updateRestaurant, deleteRestaurant, addDishTMenu, resturantMenu, deleteDish, uploadReview, getAllReviews }
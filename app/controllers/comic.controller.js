const ApiError = require("../api-error");
const ComicService = require("../services/comic.service");
const MongoDB = require("../utils/mongodb.util");


// Create and Save a new Comic
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const comicService = new ComicService(MongoDB.client);
        const document = await comicService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the comic")
        );
    }
};

// Retrieve all comics of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const comicService = new ComicService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await comicService.findByName(name);
        } else {
            documents = await comicService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving comics")
        );
    }

    return res.send(documents);
};

// Find a single contact with an id
exports.findOne = async (req, res, next) => {
    try {
        const comicService = new ComicService(MongoDB.client);
        const document = await comicService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Comic not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving comic with id=${req.params.id}`
            )
        );
    }
};

// Update a contact by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const comicService = new ComicService(MongoDB.client);
        const document = await comicService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Comic not found"));
        }
        return res.send({ message: "Comic was updated sucessfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating comic with id=${req.params.id}`)
        );
    }
};

// Delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const comicService = new ComicService(MongoDB.client);
        const document = await comicService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Comic not found"));
        }
        return res.send({ message: "Comic was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete comic with id=${req.params.id}`
            )
        );
    }
};

// Delete all contacts of a user from the database
exports.deleteAll = async (req, res, next) => {
    try {
        const comicService = new ComicService(MongoDB.client);
        const deletedCount = await comicService.deleteAll();
        return res.send({
            message: `${deletedCount} comics were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all comics")
        );
    }
};

// Find all favorite contacts of a user
exports.findAllFavorite = async (_req, res, next) => {
    try {
        const comicService = new ComicService(MongoDB.client);
        const documents = await comicService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite comics"
            )
        );
    }
};
const { ObjectId } = require("mongodb");

class ComicService {
    constructor(client) {
        this.Comic = client.db().collection("comics");
    }
    // Dinh nghia cac phuong thuc truy xuat CSDL su dung mongodb API
    extractComicData(payload) {
        const comic = {
            name: payload.name,
            description: payload.description,
            chapter: payload.chapter,
            author: payload.author,
            status: payload.status,
            imageURL: payload.imageURL,
        };
        // Remove undefined fields
        Object.keys(comic).forEach(
            (key) => comic[key] === undefined && delete comic[key]
        );
        return comic;
    }

    async create(payload) {
        const comic = this.extractComicData(payload);
        const result = await this.Comic.findOneAndUpdate(
            comic,
            { $set: { favorite: comic.favorite === true } },
            { returnDocument: "after", upsert: true}
        );
        return result.value;
    }

    async comic(filter) {
        const cursor = await this.Comic.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Comic.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractComicData(payload);
        const result = await this.Comic.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Comic.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Comic.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = ComicService;
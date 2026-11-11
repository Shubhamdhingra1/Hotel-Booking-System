const buildPriceFilter = (min, max) => {
    const filter = {};
    const lo = Number(min);
    const hi = Number(max);
    if (!Number.isNaN(lo)) filter.$gte = lo;
    if (!Number.isNaN(hi)) filter.$lte = hi;
    return Object.keys(filter).length ? filter : null;
};

const CASE_INSENSITIVE_FIELDS = new Set(["city", "from", "to"]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const applyCaseInsensitiveFilters = (query) => {
    CASE_INSENSITIVE_FIELDS.forEach((field) => {
        if (typeof query[field] === "string" && query[field].trim() !== "") {
            query[field] = {
                $regex: new RegExp(`^${escapeRegex(query[field].trim())}$`, "i"),
            };
        }
    });
};

/** Factory for travel list endpoints (flights, cars) with shared filters. */
export const makeListHandler = (Model, priceField) => async (req, res, next) => {
    try {
        const query = { ...req.query };
        const min = query.min;
        const max = query.max;
        const limit = Number(query.limit) || 50;
        delete query.min;
        delete query.max;
        delete query.limit;

        const priceFilter = buildPriceFilter(min, max);
        if (priceFilter) {
            query[priceField] = priceFilter;
        }

        Object.keys(query).forEach((key) => {
            if (query[key] === "" || query[key] === undefined) delete query[key];
        });

        applyCaseInsensitiveFilters(query);

        const items = await Model.find(query).limit(limit);
        res.json(items);
    } catch (error) {
        next(error);
    }
};

export const makeGetByIdHandler = (Model) => async (req, res, next) => {
    try {
        const item = await Model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(item);
    } catch (error) {
        next(error);
    }
};

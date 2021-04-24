const json = require('./data/movies.json');

const titlesList = [];
Object.keys(json).forEach((alphaSet) => {
    Object.keys(json[alphaSet]).forEach((key) => {
        const {
            title,
            runtime,
            image,
            genres,
            description,
            tagline,
            stars,
            path,
        } = json[alphaSet][key];

        titlesList.push({
            title,
            runtime,
            image,
            genres,
            description,
            tagline,
            stars,
            path,
            alpha: alphaSet
        });
    });
});

const getTitle = (alpha, name) => {
    if(!json[alpha]) return null;

    return json[alpha][name] || null;

};

module.exports = { titlesList, getTitle };

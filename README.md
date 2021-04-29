# Internal Movie API

An internal API/webpage for my home network that shows and allows us to filter the movies that we have for watching.

You can use this as well if you use a json file called `movies.json` in the `/server/data/` directory.  This file needs to have an object with the keys of "Alphabet Sections" like 0-9, A-E, etc. as that's what I've designed it for.  The values for each of these keys is an array of "movie" objects.  They include the following keys(hopefully self-explanatory)

- path - The movie location
- raw_title - The backend title of the movie - not for this backend
- imdb_url - url to the imdb page
- title
- rating - IMDb Rating
- contentRating - G, PG, R, etc.
- rutime - text based runtime
- genres - array of genres
- releaseData - {rawText, day, month, year, extra}
- image - image url
- genres - array of main actors
- taglines

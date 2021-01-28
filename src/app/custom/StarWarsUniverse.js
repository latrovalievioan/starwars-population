import EventEmitter from "eventemitter3";
import Planet from "./Planet";
import config from "../../config";
import Film from "./Film";

export default class StarWarsUniverse extends EventEmitter {
  static get events() {
    return {
      FILM_ADDED: "film_added",
      UNIVERSE_POPULATED: "universe_populated",
    };
  }

  constructor() {
    super();
    this.films = [];
    this.planet = null;
  }

  async init() {
    //get unpopulated planet
    const planetData = await (
      await fetch("https://swapi.booost.bg/api/planets/")
    ).json();
    let planets = [];
    for (let i = 1; i < planetData.count + 1; i++) {
      const planet = await (
        await fetch(`https://swapi.booost.bg/api/planets/${i}/`)
      ).json();
      planets.push(planet);
    }
    const [unpopulatedPlanet] = planets.filter(
      (planet) => planet.population === "0"
    );
    //get first 10 ppl
    const first10Ppl = (
      await (await fetch("https://swapi.dev/api/people")).json()
    ).results;

    //create new instance of planet

    const planet = new Planet(unpopulatedPlanet.name, config, first10Ppl);
    this.planet = planet;
    this.planet.on(Planet.events.PERSON_BORN, (e) =>
      this._onPersonBorn(e.filmUrls)
    );
    this.planet.on(Planet.events.POPULATIONG_COMPLETED, () =>
      this._onPopulationCompleted()
    );

    planet.populate();
  }
  //create event handlers
  _onPersonBorn(films) {
    this.films.forEach((film) => {
      films = films.filter((f) => f !== film.url);
    });
    films.forEach((film) => {
      const filmInst = new Film(film);
      this.films.push(filmInst);
    });
  }

  _onPopulationCompleted() {
    this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED);
  }
}

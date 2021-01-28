import EventEmitter from "eventemitter3";
import config from "../../config";
import Person from "./Person";
import delay from "../utils";

export default class Planet extends EventEmitter {
  static get events() {
    return {
      PERSON_BORN: "person_born",
      POPULATIONG_COMPLETED: "populating_completed",
    };
  }

  constructor(name, config, peopleData) {
    super();
    this.name = name;
    this.config = config;
    this.peopleData = peopleData;
    this.population = [];
  }

  async populate() {
    if (this.peopleData.length === 0) {
      this.emit(Planet.events.POPULATIONG_COMPLETED);
      return;
    }
    const currentPerson = this.peopleData.shift();
    await delay(this.config.populationDelay);
    const person = new Person(
      currentPerson.name,
      currentPerson.height,
      currentPerson.mass
    );
    this.population.push(person);
    this.emit(Planet.events.PERSON_BORN, {
      filmUrls: currentPerson.films,
    });
    this.populate();
  }

  get populationCount() {
    return this.population.length;
  }
}

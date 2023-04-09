import Knex from "knex";
import * as knexfile from "./knexfile";

export const DB = Knex(knexfile);

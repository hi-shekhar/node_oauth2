import { Knex } from "knex";

const defaultBooks = [
  {
    name: "anonymous",
    authid: 1,
  },
];
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert(defaultBooks);
}

import { DB } from "../db/db";

export async function saveUsers(data: any): Promise<any[]> {
  const result = await DB("users").insert(data).returning("*");
  return result;
}

export async function getAllUsers(): Promise<any[]> {
  const result = await DB("users").select();
  return result;
}

export async function getUserByAuthId(authid: string): Promise<any[]> {
  const [result] = await DB("users").select().where({
    authid,
  });
  return result;
}

export async function getUserById(id: number): Promise<any[]> {
  const [result] = await DB("users").select().where({
    id,
  });
  return result;
}

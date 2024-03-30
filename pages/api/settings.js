import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Settings } from "models/Setting";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "PUT") {
    const { name, value } = req.body;
    const settingsDoc = await Settings.findOne({ name });
    if (settingsDoc) {
      settingsDoc.value = value;
      await settingsDoc.save();
      res.json(settingsDoc);
    } else {
      res.json(await Settings.create({ name, value }));
    }
  }

  if (req.method === "GET") {
    const { name } = req.query;
    res.json(await Settings.findOne({ name }));
  }
}

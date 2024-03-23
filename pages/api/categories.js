import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, _id, properties } = req.body;
    const updateData = {
      name,
      properties,
    };
    if (parentCategory === "") {
      updateData.parent = null;
    } else if (parentCategory) {
      updateData.parent = parentCategory;
    }
    const categoryDoc = await Category.updateOne({ _id }, updateData);
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}

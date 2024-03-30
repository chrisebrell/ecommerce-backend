import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";

// const setCORSHeaders = (res) => {
//   res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
// };

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);
  // setCORSHeaders(res);

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory === "" ? undefined : parentCategory,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { _id, name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory === "" ? undefined : parentCategory,
        properties,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}

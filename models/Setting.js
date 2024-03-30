import mongoose, { model, Schema, models } from "mongoose";

const settingsSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Object },
  },
  { timestamps: true }
);

export const Settings = models?.Settings || model("Settings", settingsSchema);

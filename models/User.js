import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    imageUrl: { type: String, required: true },

    cartItems: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { minimize: false }
);

const User =
  mongoose.models.user || mongoose.model("user", userSchema);

export default User;
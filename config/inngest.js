import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Inngest client
export const inngest = new Inngest({ id: "glownest-next" });

const extractUserData = (data) => {
  const { id, first_name, last_name, email_addresses, image_url } = data;
  return {
    id,
    email: email_addresses?.[0]?.email_address ?? "",
    name: `${first_name ?? ""} ${last_name ?? ""}`.trim() || "Unknown",
    imageUrl: image_url ?? "",
  };
};

/* =========================
   CREATE OR UPSERT USER
========================= */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, email, name, imageUrl } = extractUserData(event.data);

    if (!id) throw new Error("Missing user ID in clerk/user.created event");

    try {
      await connectDB();
      const createdUser = await User.findByIdAndUpdate(
        id,
        { _id: id, email, name, imageUrl },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log("User created/updated:", id);
      return { userId: createdUser._id };
    } catch (err) {
      console.error("DB error in syncUserCreation:", err);
      throw err;
    }
  }
);

/* =========================
   UPDATE USER
========================= */
export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, email, name, imageUrl } = extractUserData(event.data);

    if (!id) throw new Error("Missing user ID in clerk/user.updated event");

    try {
      await connectDB();
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { email, name, imageUrl } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      console.log("User updated:", id);
      return { userId: updatedUser._id, status: "updated" };
    } catch (err) {
      console.error("DB error in syncUserUpdate:", err);
      throw err;
    }
  }
);

/* =========================
   DELETE USER
========================= */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    if (!id) throw new Error("Missing user ID in clerk/user.deleted event");

    try {
      await connectDB();
      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        console.warn("Delete skipped — user not found:", id);
        return { userId: id, status: "not_found" };
      }

      console.log("User deleted:", id);
      return { userId: id, status: "deleted" };
    } catch (err) {
      console.error("DB error in syncUserDeletion:", err);
      throw err;
    }
  }
);
/* =========================
   CREATE USER
========================= */
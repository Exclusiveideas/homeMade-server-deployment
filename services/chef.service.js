import Chef from "../models/chef.model.js";
import { uploadImage } from "../lib/cloudinary.js"; 

export const createChefProfileService = async (userId, chefData) => {
  const chef = await Chef.create({ ...chefData, userId });
  return chef;
};

export const updateChefProfileService = async (chefId, updatedData) => {
  const chef = await Chef.findByIdAndUpdate(chefId, updatedData, { new: true });
  return chef;
};

export const getChefProfileService = async (userId) => {
  const chef = await Chef.findOne({ userId });
  return chef;
};

export const deleteChefProfileService = async (chefId) => {
  await Chef.findByIdAndDelete(chefId);
  return { message: "Profile deleted successfully" };
};

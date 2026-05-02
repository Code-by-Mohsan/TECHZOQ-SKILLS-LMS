import mongoose, { Schema } from "mongoose";

const UserRoleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserRoleSchema.index({ user: 1, role: 1 }, { unique: true });
UserRoleSchema.index({ user: 1, assignedAt: -1 });

export default mongoose.models.UserRole || mongoose.model("UserRole", UserRoleSchema);

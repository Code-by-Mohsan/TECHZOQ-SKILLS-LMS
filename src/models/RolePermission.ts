import mongoose, { Schema } from "mongoose";

const RolePermissionSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

RolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

export default
  mongoose.models.RolePermission ||
  mongoose.model("RolePermission", RolePermissionSchema);

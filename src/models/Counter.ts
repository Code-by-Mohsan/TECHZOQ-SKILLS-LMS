import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextChallanId(): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { name: "challan" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  const seq = String(counter.seq).padStart(4, "0");
  return `TZQ-${year}-${seq}`;
}

export default Counter;

import PipelineStage from "@/models/PipelineStage";
import User from "@/models/User";
import {
  DEFAULT_PIPELINE_STAGES,
  DEFAULT_STAGE_BY_LEAD_TYPE,
  LEAD_TYPES,
} from "@/lib/constants/leads";

type LeadType = (typeof LEAD_TYPES)[number];
type StageKeyDoc = { key: string };
type StageOption = {
  _id: unknown;
  key: string;
  name: string;
  color: string;
  order: number;
} | null;
type IdDoc = { _id: unknown } | null;

export function normalizeLeadType(value: string | undefined | null): LeadType {
  if (!value) return "general";
  return LEAD_TYPES.includes(value as LeadType)
    ? (value as LeadType)
    : "general";
}

export async function ensureDefaultPipelineStages(actorUserId?: string | null) {
  const keys = DEFAULT_PIPELINE_STAGES.map((item) => item.key);
  const existing = (await PipelineStage.find({ key: { $in: keys } })
    .select("key")
    .lean()) as unknown as StageKeyDoc[];
  const existingKeys = new Set(existing.map((item) => item.key));

  const missing = DEFAULT_PIPELINE_STAGES.filter((item) => !existingKeys.has(item.key));
  if (missing.length > 0) {
    await PipelineStage.insertMany(
      missing.map((item) => ({
        ...item,
        isFinal: "isFinal" in item ? Boolean(item.isFinal) : false,
        isConversionStage:
          "isConversionStage" in item ? Boolean(item.isConversionStage) : false,
        createdBy: actorUserId || null,
        updatedBy: actorUserId || null,
      })),
      { ordered: false },
    );
  }

  return PipelineStage.find({ isActive: true }).sort({ order: 1 }).lean();
}

export async function getDefaultPipelineStageForLeadType(
  leadTypeInput: string | undefined | null,
  actorUserId?: string | null,
) {
  const leadType = normalizeLeadType(leadTypeInput);
  const key = DEFAULT_STAGE_BY_LEAD_TYPE[leadType];
  await ensureDefaultPipelineStages(actorUserId);
  return (await PipelineStage.findOne({ key, isActive: true })
    .select("_id key name color order")
    .lean()) as unknown as StageOption;
}

export async function getPreferredCounselorAssignee() {
  const counselor = await User.findOne({ role: "counselor" })
    .select("_id")
    .sort({ createdAt: 1 })
    .lean() as unknown as IdDoc;
  if (counselor?._id) return String(counselor._id);

  const fallback = await User.findOne({ role: { $in: ["admin", "super_admin"] } })
    .select("_id")
    .sort({ createdAt: 1 })
    .lean() as unknown as IdDoc;
  return fallback?._id ? String(fallback._id) : null;
}

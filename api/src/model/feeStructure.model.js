import mongoose,{Schema} from "mongoose";

const feeStructureSchema = new Schema(
    {
        feeStructureName: {
            type: String,
            required: true
        },
        school: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        batch: {
            type: Number,
            required: true
        },
        semester: {
            type: String,
            required: true
        },
        totalFees: {
            type: Number,
            required: true
        },
        enrolled: [
            {
                type: Schema.Types.ObjectId,
                ref: "Student"
            }
        ]
    },
    {
        timestamps: true
    }
)
export const FeeStructure = mongoose.model("FeeStructure",feeStructureSchema);
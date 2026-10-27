import mongoose from "mongoose"
import { MEMBER_COLLECTION_NAME } from "./member.model"

const directMessageSchema = new mongoose.Schema(
    {
        fk_id_emisor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: MEMBER_COLLECTION_NAME
        },
        fk_id_receptor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: MEMBER_COLLECTION_NAME
        },
        contenido: {
            type: String,
            required: true
        },
        fecha_envio: {
            type: Date,
            default: Date.now
        }
    }
)

export const DIRECT_MESSAGE_COLLECTION_NAME = "direct_messages"
const DirectMessage = mongoose.model(DIRECT_MESSAGE_COLLECTION_NAME, directMessageSchema)

export default DirectMessage
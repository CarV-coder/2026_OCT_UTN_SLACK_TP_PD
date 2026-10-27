import mongoose from 'mongoose'
import { WORKSPACE_COLLECTION_NAME } from './workspace.model'

const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,  
            required: true,
        },
        description: {
            type: String,
            maxlength: 1000,
            required: false,
        },
        categoria: {
            type: String,
            enum: ['general', 'random', 'anuncios'],
            default: 'general',
            required: false,
        },
        fecha_creacion: {
            type: Date,
            default: Date.now
        },
        fk_id_espacio_trabajo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: WORKSPACE_COLLECTION_NAME
        }
    }
)

export const CHANNEL_COLLECTION_NAME = 'Canal'
const Channel = mongoose.model(CHANNEL_COLLECTION_NAME, channelSchema)

export default Channel
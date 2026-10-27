import express from 'express'
import workspace_repository from '../repositories/workspace.repository.js'
import member_repository from '../repositories/member.repository.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import channel_router from './channel.router.js'
import ServerError from '../utils/error.util.js'
import workspaceMiddleware from '../middlewares/workspace.membership.middleware.js'
import { createWorkspace } from '../controllers/workspace.controller.js'

const workspace_router = express.Router()


/* 
Route /api/workspaces
    POST / => Crear espacio de trabajo y membresia de creador
    GET / => Obtener lista de espacios de trabajo asociados a un usuario (Buscamos las membresias asociadas a un cierto usuario)
    GET /:workspace_id => Obtener los datos de un cierto espacio de trabajo
*/


workspace_router.post(
    '/',
    authMiddleware,
    createWorkspace
)

workspace_router.get(
    '/:workspace_id', 
    authMiddleware,
    workspaceMiddleware([]),
    async (request, response) => {
        
        return response.status(200).send({
            ok: true,
            message: "Workspace obtenido correctamente",
            status: 200,
            data: {
                workspace_selected: request.workspace
            }
        })
    }
)

workspace_router.get(
    '/',
    authMiddleware,
    workspaceMiddleware([]),
    async (request, response) => {
        const user_id = request.user._id
        const workspaces = await workspace_repository.getAllWorkspaceByUserId(user_id)
        return response.status(200).send({
            ok: true,
            message: "Workspaces obtenidos correctamente",
            status: 200,
            data: {
                workspaces: workspaces
            }
        })
    }
)

workspace_router.delete(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['owner']),
    async (request, response) => {
        const { workspace_id } = request.params
        const workspace_deleted = await workspace_repository.deleteById(workspace_id)

        return response.status(200).send({
            ok: true,
            message: "Workspace eliminado correctamente",
            status: 200,
            data: {
                workspace_deleted
            }
        })
    }
)

workspace_router.put(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['owner', 'admin']),
    async (request, response) => {
        const { workspace_id } = request.params
        const { name, description } = request.body

        const workspace_updated = await workspace_repository.updateById(workspace_id, { nombre: name, description })

        return response.status(200).send({
            ok: true,
            message: "Workspace actualizado correctamente",
            status: 200,
            data: {
                workspace_updated
            }
        })
    }
)

workspace_router.get(
    '/:workspace_id/members', 
    authMiddleware,
    workspaceMiddleware([]),
    async (request, response) => {
        const { workspace_id } = request.params
        const members = await member_repository.getAllMembershipsByWorkspaceid(workspace_id)

        return response.status(200).send({
            ok: true,
            message: "Miembros del workspace obtenidos correctamente",
            status: 200,
            data: {
                members
            }
        })
    }
)

workspace_router.delete(
    '/:workspace_id/members/:member_id',
    authMiddleware,
    workspaceMiddleware(['owner', 'admin']),
    async (request, response) => {
        const { workspace_id, member_id } = request.params

        const member_deleted = await member_repository.deleteById(member_id)

        return response.status(200).send({
            ok: true,
            message: "Miembro eliminado correctamente",
            status: 200,
            data: {
                member_deleted
            }
        })
    }
)

/* workspace_router.post(
    '/:workspace_id/members/invite',
    authMiddleware,
    workspaceMiddleware(['owner', 'admin']),
    async (request, response) => {
        const { workspace_id } = request.params
        const { email, role } = request.body

        if (!['admin', 'user'].includes(role)) {
            throw new ServerError("El rol debe ser 'admin' o 'user'", 400)
        }
 */

/* 
Crear los endpoints 

EJERCITACION PARA AHORA
- (owner) DELETE /api/workspaces/:workspace_id => Elimina espacio de trabajo
- (owner, admin) PUT /api/workspaces/:workspace_id => Actualizar nombre/descripcion del espacio de trabajo

Tarea:
- (todos) get /api/workspace/:workspace_id/members
- (owner, admin) DELETE /api/workspace/:workspace_id/members/:member_id
- (owner, admin) POST /api/workspace/:workspace_id/members/invite
    body: email (el email del usuario a invitar)
    - Revisar que el rol con el que se crea sea 'admin' o 'user'
    - Revisar que el usuario a invitar exista
    - Revisar que no este ya agregado al workspace (que tenga una membresia)
    - Crear la membresia con una propiedad 'invitacion_aceptada': false
    - Enviar un mail con un link para "aceptar invitacion" (debe tener una expiracion y debe enviar un token)
        - Ese link hara un GET hacia /api/workspace/:workspace_id/members/accept-invite/:invitation_token

- (todos) Unauthentified /api/workspace/:workspace_id/members/accept-invite/:invitation_token
    - Verifica que el invitation_token sea valido y edita la membersia para marcar que lo acepto
*/



/* workspace_router.use(
    '/:workspace_id/channels', 
    channel_router
) */

export default workspace_router


/* 
/api/workspace/:workspace_id/channels

*/
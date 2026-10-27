import workspace_repository from "../repositories/workspace.repository.js"
import member_repository from "../repositories/member.repository.js"

export async function createWorkspace(request, response) {
    //Quien carancho quiere hacer esta operacion ?????
    console.log('[CREATE WORKSPACE]', request.user)
    const { name, description } = request.body

    const workspace_created = await workspace_repository.createWorkspace(name, description)
    const owner_membership = await member_repository.create(
        request.user.id,
        workspace_created._id,
        'owner'
    )

    return response.status(201).send(
        {
            ok: true,
            status: 201,
            message: "Por ahora todo bien",
            data: {
                workspace_created,
                owner_membership
            }
        }
    )
}

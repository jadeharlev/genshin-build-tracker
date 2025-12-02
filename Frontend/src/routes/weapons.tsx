import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/weapons')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/weapons"!</div>
}

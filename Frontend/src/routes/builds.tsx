import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/builds')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/builds"!</div>
}

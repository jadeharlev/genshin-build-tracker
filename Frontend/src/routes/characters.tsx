import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/characters')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div style={{color: 'white'}}>Hello "/characters"!</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/refund')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/refund"!</div>
}
    
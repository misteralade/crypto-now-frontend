import { createFileRoute } from '@tanstack/react-router'
import {Button} from "../components/ui";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <Button>HELLO WORLD</Button>
    </div>
  )
}
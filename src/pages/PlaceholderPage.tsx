import { Container } from '../components/ui/Container'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="min-h-[40vh] py-12 sm:py-20">
      <Container>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      </Container>
    </main>
  )
}

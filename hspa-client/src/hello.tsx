import { trpc } from "./utils/trpc"

export const Hello = () => {
  const hello = trpc.useQuery(['hello'])
  if (hello.isLoading) return <p>Loading...</p>
  return (
    <div>{hello.data?.greeting}</div>
  )
}
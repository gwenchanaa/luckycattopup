import { StatusResultClient } from "./StatusResultClient";

export default async function StatusResultPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  return <StatusResultClient transactionId={transactionId} />;
}

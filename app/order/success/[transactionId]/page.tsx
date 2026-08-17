import { SuccessClient } from "./SuccessClient";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  return <SuccessClient transactionId={transactionId} />;
}

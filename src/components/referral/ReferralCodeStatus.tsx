import useReferralRewardPreview from "@/hooks/tractor/useReferralRewardPreview";

export default function ReferralCodeStatus({ code }: { code: string }) {
  const preview = useReferralRewardPreview(code);
  if (!code) return null;
  return (
    <div role="status" className={`pinto-sm ${preview.status === "eligible" ? "text-green-600" : "text-pinto-light"}`}>
      {preview.message}
    </div>
  );
}

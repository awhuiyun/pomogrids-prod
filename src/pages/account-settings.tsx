import SettingsStripePortal from "@/components/settings/SettingsStripePortal";

export default function AccountSettingsPage() {
  return (
    <div className="flex-flex-col space-y-8">
      <section>
        <h2 className="font-bold text-2xl">Subscription details</h2>

        <div className="mt-6">
          <SettingsStripePortal />
        </div>
      </section>
    </div>
  );
}

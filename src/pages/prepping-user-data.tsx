import LoadingSpinner from "@/components/LoadingSpinner";

export default function SignInLandingPage() {
  return (
    <div className="mx-auto w-fit justify-center">
      <p>Prepping your data...</p>
      <LoadingSpinner />
    </div>
  );
}

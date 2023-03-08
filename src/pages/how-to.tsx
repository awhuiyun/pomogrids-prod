import BaseAccordian from "@/components/BaseAccordian";

export default function HowTo() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BaseAccordian isOpenOnMount={true} label="How do I use Pomogrids?">
        Its easy, figure it out yourself!
      </BaseAccordian>
      <BaseAccordian isOpenOnMount={false} label="Is Pomogrids free?">
        No duh. No free lunch in the world.
      </BaseAccordian>
    </div>
  );
}

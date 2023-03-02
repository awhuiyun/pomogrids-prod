import BaseAccordian from "@/components/BaseAccordian";

export default function HowTo() {
  return (
    <div className="pt-2 text-slate-900 w-[800px] mx-auto space-y-6">
      <BaseAccordian isOpenOnMount={true} label="How do I use Pomogrids?">
        Its easy, figure it out yourself!
      </BaseAccordian>
      <BaseAccordian isOpenOnMount={false} label="Is Pomogrids free?">
        No duh. No free lunch in the world.
      </BaseAccordian>
    </div>
  );
}

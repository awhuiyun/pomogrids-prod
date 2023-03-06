import Link from "next/link";

export default function Footer() {
  return (
    <div className="text-xs text-slate-400 py-16 flex">
      <p className="w-fit mx-auto">
        Made with &#128149; by{" "}
        <Link
          href="https://www.linkedin.com/in/awhuiyun/"
          target="_blank"
          className="text-blue4 hover:underline underline-offset-2"
        >
          @awhuiyun
        </Link>
        .
      </p>
    </div>
  );
}

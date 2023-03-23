import Image from "next/image";
import BaseAccordian from "@/components/base/BaseAccordian";

export default function HowTo() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-center text-lg lg:text-xl font-semibold mb-10">
        A pomodoro timer that tracks the number of hours worked daily! &#127775;
      </h1>
      <div className="space-y-6">
        <BaseAccordian
          isOpenOnMount={false}
          label="What is the Pomodoro Technique?"
        >
          <p>
            The Pomodoro Technique is a time management method developed by
            Francesco Cirillo. It believes that breaking work into intervals
            (typically of 25 mins), separated by short breaks, boosts focus and
            productivity:
          </p>
          <Image
            src="/assets/pomodoro_cycle.png"
            alt="Pomodoro cycle"
            height="500"
            width="500"
          />
          <p>
            Inspired by the tomato-shaped kitchen timer Cirillo used as a
            student, he referred each interval as pomodoro which stands for
            tomato in Italian.
          </p>
        </BaseAccordian>
        <BaseAccordian isOpenOnMount={true} label="How to use Pomogrids?">
          <p>It's easy, simply:</p>
          <li className="ml-2">
            Create new tasks and estimate the number of sessions required to
            complete them
          </li>
          <li className="ml-2">
            Select a task and get started on a pomodoro session or cycle!
          </li>
          <li className="ml-2">You may update, archive or delete tasks</li>
          <br />
          <p>
            With the completion of each pomodoro session, the session count for
            each task and the number of minutes worked for the day in the
            heatmap updates. Note that the yellow box denotes{" "}
            <span className="font-bold italic">today</span>.
          </p>
          <Image
            src="/assets/grid_example.png"
            alt="Example of heatmap"
            height="500"
            width="500"
          />
          <br />
          <p>
            While the technique recommends one to work in sessions of 25 mins,
            we understand that it may not be for all. Hence, we offer
            customizations to timer settings, alarm ringtones and more! Join us
            as a{" "}
            <span className="text-blue4 hover:underline underline-offset-2 cursor-pointer">
              premium
            </span>{" "}
            user to unlock these offerings!
          </p>
        </BaseAccordian>
        <BaseAccordian
          isOpenOnMount={false}
          label="What is the difference between Archiving and Deleting a task?"
        >
          <span className="font-bold italic">Archiving</span> removes the task
          from your task list. This helps to keep the task list short and neat.
          The number of minutes clocked for the archived tasks remains captured
          in the heatmap.
          <br />
          <br />
          <span className="font-bold italic">Deleting</span> removes all records
          of the task from Pomogrids. The task will be removed from both the
          task list and the heatmap.
          <br />
          <br />
          Please note that both are irreversible so please be careful!
        </BaseAccordian>
      </div>
    </div>
  );
}

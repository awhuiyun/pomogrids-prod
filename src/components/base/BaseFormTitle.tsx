export interface IBaseFormTitle {
  title: string;
}

export default function BaseFormTitle({ title }: IBaseFormTitle) {
  return <h2 className="font-bold text-xl sm:text-2xl text-center">{title}</h2>;
}

export interface IBaseFormTitle {
  title: string;
}

export default function BaseFormTitle({ title }: IBaseFormTitle) {
  return <p className="font-bold text-2xl text-center">{title}</p>;
}

export interface HeaderProps {
  value: string;
}

export default function Header({ value }: HeaderProps) {
  return <h1 style={ { textAlign: 'center' } }>{ value }</h1>;
}

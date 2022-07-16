import { CardProps } from '../types';

const Card: React.FC<CardProps> = ({ ...props }) => {
  return (
    <div key={props.id} className='mt-4 bg-white shadow-md rounded-lg flex content-center h-10 p-2 !pl-6 text-sm text-[#2d2d2d]'>
      <span>{props.heading}</span>
    </div>
  )
}

export default Card;